// Планировки в едином стиле: node scripts/draw-plans.mjs
// Рисует схемы по описаниям из scripts/plans/data.mjs и прописывает их в данные:
// - настоящие (перерисованы с чертежей компании) → public/images/projects/<slug>/plans/0/src.png
//   и content/projects/<slug>.json (plans[0] со списком помещений);
// - примеры для тестового сайта → public/images/demo/plans/*.png
//   и content/demo/projects/<slug>.json (видны только в демо-режиме, lib/demo.ts).
// Повторный запуск перезаписывает картинки и записи в данных — правки делаются в data.mjs.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { banyaVariants, plans } from "./plans/data.mjs";

const root = process.cwd();
const W = 1600; // ширина картинки, px
const C = {
  ink: "#1f1a16",
  muted: "#6f655c",
  wall: "#2a2522",
  fill: "#ffffff",
  open: "#f4efe7",
  hatch: "#ddd3c4",
  brand: "#894720",
  demo: "#b45309",
};
const font = "Manrope, 'Segoe UI', Arial, sans-serif";
const EXT = 0.22; // толщина наружной стены, м
const INT = 0.12; // внутренней

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const num = (v) => String(Number(v.toFixed(2))).replace(".", ",");
const area = (v) => `${v.toFixed(2).replace(".", ",")} м²`;
const pts = (a) => a.reduce((s, v, i) => s + (i % 2 ? `,${v} ` : `${v}`), "");

function bbox(p) {
  const xs = [];
  const ys = [];
  const add = (x, y) => {
    xs.push(x);
    ys.push(y);
  };
  for (const poly of [p.outline, ...p.open])
    for (let i = 0; i < poly.length; i += 2) add(poly[i], poly[i + 1]);
  for (const s of p.stairs ?? []) {
    add(s.x, s.y);
    add(s.x + s.w, s.y + s.h);
  }
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

function draw(p, { label }) {
  const b = bbox(p);
  const left = 150; // место под размеры слева
  const top = 150; // и сверху
  const right = 80;
  // px на метр: по ширине, но чертёж не выше 1500 px — узкие дома иначе вытягиваются в ленту
  const S = Math.min((W - left - right) / (b.x1 - b.x0), 1500 / (b.y1 - b.y0));
  const shift = (W - left - right - (b.x1 - b.x0) * S) / 2; // центрируем узкий чертёж
  const ph = (b.y1 - b.y0) * S;
  const footer = p.example ? 220 : 150;
  const H = Math.round(top + ph + 60 + footer);
  const X = (x) => left + shift + (x - b.x0) * S;
  const Y = (y) => top + (y - b.y0) * S;
  const poly = (a) => pts(a.map((v, i) => (i % 2 ? Y(v) : X(v))));
  const fs = Math.max(24, Math.min(40, S * 0.3)); // кегль подписей: у маленьких планов крупнее, чтобы читалось с телефона
  // Толщина стен в px: по масштабу, но в разумных пределах — у маленьких домов масштаб крупный
  const we = Math.min(18, Math.max(12, EXT * S));
  const wi = Math.min(10, Math.max(7, INT * S));
  const out = [];

  out.push(`<rect width="100%" height="100%" fill="#ffffff"/>`);
  out.push(`<defs><pattern id="h" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="14" height="14" fill="${C.open}"/><line x1="0" y1="0" x2="0" y2="14" stroke="${C.hatch}" stroke-width="3"/></pattern></defs>`);

  // Террасы и крыльца: штриховка, пунктирный край
  for (const o of p.open)
    out.push(
      `<polygon points="${poly(o)}" fill="url(#h)" stroke="${C.muted}" stroke-width="2" stroke-dasharray="10 7"/>`,
    );
  // Отапливаемая часть
  out.push(`<polygon points="${poly(p.outline)}" fill="${C.fill}"/>`);

  // Ступени
  for (const s of p.stairs ?? []) {
    out.push(
      `<rect x="${X(s.x)}" y="${Y(s.y)}" width="${s.w * S}" height="${s.h * S}" fill="#fff" stroke="${C.wall}" stroke-width="2"/>`,
    );
    const n = Math.max(3, Math.round((s.d === "y" ? s.h : s.w) / 0.28));
    for (let i = 1; i < n; i++) {
      if (s.d === "y") {
        const y = Y(s.y + (s.h * i) / n);
        out.push(
          `<line x1="${X(s.x)}" y1="${y}" x2="${X(s.x + s.w)}" y2="${y}" stroke="${C.wall}" stroke-width="1.5"/>`,
        );
      } else {
        const x = X(s.x + (s.w * i) / n);
        out.push(
          `<line x1="${x}" y1="${Y(s.y)}" x2="${x}" y2="${Y(s.y + s.h)}" stroke="${C.wall}" stroke-width="1.5"/>`,
        );
      }
    }
  }

  // Стены: внутренние, затем наружные поверх
  for (const [x1, y1, x2, y2] of p.walls)
    out.push(
      `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${C.wall}" stroke-width="${wi}" stroke-linecap="square"/>`,
    );
  out.push(
    `<polygon points="${poly(p.outline)}" fill="none" stroke="${C.wall}" stroke-width="${we}" stroke-linejoin="miter"/>`,
  );

  // Двери: проём в стене, полотно и дуга открывания
  for (const d of p.doors) {
    const s = d.s ?? 1;
    const gap = we + 4;
    if (d.h) {
      const [a, z, y] = d.h;
      const len = (z - a) * S;
      const hx = X(d.e ? z : a);
      const fx = X(d.e ? a : z);
      out.push(`<rect x="${X(a)}" y="${Y(y) - gap / 2}" width="${len}" height="${gap}" fill="#fff"/>`);
      const ly = Y(y) + s * len;
      out.push(`<line x1="${hx}" y1="${Y(y)}" x2="${hx}" y2="${ly}" stroke="${C.wall}" stroke-width="3"/>`);
      const sweep = (d.e ? 1 : 0) ^ (s > 0 ? 1 : 0);
      out.push(
        `<path d="M ${hx} ${ly} A ${len} ${len} 0 0 ${sweep} ${fx} ${Y(y)}" fill="none" stroke="${C.muted}" stroke-width="1.5" stroke-dasharray="6 5"/>`,
      );
    } else {
      const [a, z, x] = d.v;
      const len = (z - a) * S;
      const hy = Y(d.e ? z : a);
      const fy = Y(d.e ? a : z);
      out.push(`<rect x="${X(x) - gap / 2}" y="${Y(a)}" width="${gap}" height="${len}" fill="#fff"/>`);
      const lx = X(x) + s * len;
      out.push(`<line x1="${X(x)}" y1="${hy}" x2="${lx}" y2="${hy}" stroke="${C.wall}" stroke-width="3"/>`);
      const sweep = (d.e ? 0 : 1) ^ (s > 0 ? 1 : 0);
      out.push(
        `<path d="M ${lx} ${hy} A ${len} ${len} 0 0 ${sweep} ${X(x)} ${fy}" fill="none" stroke="${C.muted}" stroke-width="1.5" stroke-dasharray="6 5"/>`,
      );
    }
  }

  // Печь
  for (const st of p.stove ?? []) {
    const x = X(st.x);
    const y = Y(st.y);
    const z = 0.6 * S;
    out.push(
      `<rect x="${x}" y="${y}" width="${z}" height="${z}" fill="${C.brand}" stroke="${C.wall}" stroke-width="2"/>`,
    );
    out.push(
      `<path d="M ${x} ${y} L ${x + z} ${y + z} M ${x + z} ${y} L ${x} ${y + z}" stroke="#fff" stroke-width="2"/>`,
    );
  }

  // Подписи помещений: номер, название, площадь
  for (const r of p.rooms) {
    const [cx, cy] = [X(r.at[0]), Y(r.at[1])];
    const lines = r.name.split("\n");
    const lh = fs * 1.15;
    const y0 = cy - ((lines.length - 1) * lh) / 2 - fs * 0.35;
    const color = r.open ? C.muted : C.ink;
    lines.forEach((l, i) =>
      out.push(
        `<text x="${cx}" y="${y0 + i * lh}" font-size="${fs}" font-weight="700" fill="${color}" text-anchor="middle">${esc(l)}</text>`,
      ),
    );
    out.push(
      `<text x="${cx}" y="${y0 + lines.length * lh + 2}" font-size="${fs * 0.85}" fill="${r.open ? C.muted : C.brand}" font-weight="600" text-anchor="middle">${esc(area(r.area))}</text>`,
    );
  }

  // Размерные цепочки: сверху по осям X, слева по осям Y, плюс общий размер
  const dim = (horizontal, axes, offset, big) => {
    const sw = big ? 2 : 1.5;
    const tick = (x, y) =>
      `<line x1="${x - 7}" y1="${y + 7}" x2="${x + 7}" y2="${y - 7}" stroke="${C.muted}" stroke-width="2.5"/>`;
    const a0 = axes[0];
    const a1 = axes[axes.length - 1];
    const segs = big ? [a0, a1] : axes;
    if (horizontal) {
      const y = top - offset;
      out.push(
        `<line x1="${X(a0) - 15}" y1="${y}" x2="${X(a1) + 15}" y2="${y}" stroke="${C.muted}" stroke-width="${sw}"/>`,
      );
      segs.forEach((v, i) => {
        out.push(tick(X(v), y));
        out.push(
          `<line x1="${X(v)}" y1="${y - 10}" x2="${X(v)}" y2="${top - 12}" stroke="${C.hatch}" stroke-width="1.5"/>`,
        );
        if (i) {
          const m = (X(segs[i - 1]) + X(v)) / 2;
          out.push(
            `<text x="${m}" y="${y - 12}" font-size="${big ? 26 : 22}" font-weight="${big ? 700 : 500}" fill="${C.muted}" text-anchor="middle">${num(v - segs[i - 1])} м</text>`,
          );
        }
      });
    } else {
      const x = left + shift - offset;
      out.push(
        `<line x1="${x}" y1="${Y(a0) - 15}" x2="${x}" y2="${Y(a1) + 15}" stroke="${C.muted}" stroke-width="${sw}"/>`,
      );
      segs.forEach((v, i) => {
        out.push(tick(x, Y(v)));
        out.push(
          `<line x1="${x + 10}" y1="${Y(v)}" x2="${left + shift - 12}" y2="${Y(v)}" stroke="${C.hatch}" stroke-width="1.5"/>`,
        );
        if (i) {
          const m = (Y(segs[i - 1]) + Y(v)) / 2;
          out.push(
            `<text x="${x - 12}" y="${m}" font-size="${big ? 26 : 22}" font-weight="${big ? 700 : 500}" fill="${C.muted}" text-anchor="middle" transform="rotate(-90 ${x - 12} ${m})">${num(v - segs[i - 1])} м</text>`,
          );
        }
      });
    }
  };
  // Оси рисуем только в пределах plan bbox: цепочки сдвинуты от края картинки
  if (p.axesX.length > 2) dim(true, p.axesX, 45, false);
  dim(true, p.axesX, p.axesX.length > 2 ? 100 : 55, true);
  if (p.axesY.length > 2) dim(false, p.axesY, 45, false);
  dim(false, p.axesY, p.axesY.length > 2 ? 100 : 55, true);

  // Подвал: название, итог по площадям, пометка
  const heated = p.rooms.filter((r) => !r.open).reduce((s, r) => s + r.area, 0);
  const open = p.rooms.filter((r) => r.open).reduce((s, r) => s + r.area, 0);
  const fy = H - footer + 40;
  out.push(
    `<line x1="60" y1="${fy - 30}" x2="${W - 60}" y2="${fy - 30}" stroke="${C.hatch}" stroke-width="2"/>`,
  );
  out.push(
    `<text x="60" y="${fy + 20}" font-size="40" font-weight="800" fill="${C.ink}">${esc(p.title)}</text>`,
  );
  out.push(
    `<text x="60" y="${fy + 70}" font-size="26" fill="${C.muted}">Помещения ${esc(area(heated))}${open ? ` · открытые площадки ${esc(area(open))}` : ""} · ${esc(label)}</text>`,
  );
  out.push(
    `<text x="${W - 60}" y="${fy + 20}" font-size="28" font-weight="700" fill="${C.brand}" text-anchor="end">МИШАЛЕ</text>`,
  );

  // Пример — крупная пометка поверх, чтобы картинку нельзя было принять за чертёж компании
  if (p.example) {
    out.push(
      `<g transform="rotate(-24 ${W / 2} ${top + ph / 2})" opacity="0.16"><text x="${W / 2}" y="${top + ph / 2 + 50}" font-size="150" font-weight="800" fill="${C.demo}" text-anchor="middle">СХЕМА-ПРИМЕР</text></g>`,
    );
    out.push(
      `<rect x="60" y="${fy + 100}" width="740" height="56" rx="10" fill="${C.demo}"/><text x="82" y="${fy + 138}" font-size="26" font-weight="800" fill="#fff">СХЕМА-ПРИМЕР — нужна планировка от компании</text>`,
    );
  }

  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="${font}">${out.join("\n")}</svg>`,
    width: W,
    height: H,
  };
}

async function render(p, file, label) {
  const { svg } = draw(p, { label });
  await mkdir(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(file);
  console.log(path.relative(root, file));
}

const rooms = (p) => p.rooms.map((r) => ({ name: r.name.replace("\n", " "), area: r.area }));
const readJson = async (f) => JSON.parse(await readFile(f, "utf8"));
const writeJson = (f, v) => writeFile(f, JSON.stringify(v, null, 2) + "\n");

const planNote = {
  need: "Планировка с размерами и площадью комнат (DWG, PDF или SVG)",
  why: "Планировку смотрят сразу после цены: поместится ли семья, где санузел и вход. Сейчас здесь схема-пример по размерам модулей, а не чертёж компании.",
  ask: "раздел 3",
};

for (const [slug, p] of Object.entries(plans)) {
  if (!p.example) {
    // Настоящая планировка: картинка и список помещений — в данные проекта
    const src = `/images/projects/${slug}/plans/0/src.png`;
    await render(p, path.join(root, "public", src), "по чертежу компании");
    const f = path.join(root, "content", "projects", `${slug}.json`);
    const data = await readJson(f);
    data.plans = [{ src, alt: `Планировка: ${p.title.toLowerCase()}`, render: false, rooms: rooms(p) }];
    await writeJson(f, data);
  } else {
    const src = `/images/demo/plans/${slug}.png`;
    await render(p, path.join(root, "public", src), "пример, чертежа компании нет");
    const f = path.join(root, "content", "demo", "projects", `${slug}.json`);
    const data = await readJson(f);
    data.fill = {
      ...data.fill,
      plans: [{ src, alt: `Пример планировки: ${p.title.toLowerCase()}`, render: false, rooms: rooms(p) }],
    };
    data.notes = { ...data.notes, plans: data.notes?.plans ?? planNote };
    await writeJson(f, data);
  }
}

// Варианты с баней внутри: планировка дома, где часть помещений стала парной и моечной
for (const [slug, v] of Object.entries(banyaVariants)) {
  const base = plans[slug];
  const p = {
    ...base,
    example: true,
    title: `${base.title} с баней`,
    stove: v.stove,
    rooms: base.rooms.map((r) => {
      const name = v.rename[r.n] ?? v.rename[String(r.area)];
      return name ? { ...r, name } : r;
    }),
  };
  const src = `/images/demo/plans/${slug}-s-banei.png`;
  await render(p, path.join(root, "public", src), "пример: где может быть баня");
  const f = path.join(root, "content", "demo", "projects", `${slug}.json`);
  const data = await readJson(f);
  data.banyaVariant.fill.plans = [
    { src, alt: `Пример планировки: ${p.title.toLowerCase()}`, render: false, rooms: rooms(p) },
  ];
  await writeJson(f, data);
}
