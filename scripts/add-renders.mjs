// Подключение нейросетевых визуализаций: node scripts/add-renders.mjs
// Берёт assets/renders/<slug>/<ракурс>.(jpg|jpeg|png|webp) — ракурсы из scripts/renders/data.mjs,
// сжимает в public/images/projects/<slug>/photos/render-<ракурс>/src.jpg и дописывает в конец фото
// проекта (content/projects/<slug>.json) с отметкой render: true — на сайте подпись «Визуализация».
// Повторный запуск обновляет картинки и не дублирует записи. Порядок фото можно поменять в админке.
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { angles, houses } from "./renders/data.mjs";

const root = process.cwd();
// По умолчанию assets/renders/<slug>/; можно указать папку пакетов: node scripts/add-renders.mjs ../site-assets/render-pack
// — тогда картинки берутся из <slug>/results/
const inbox = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, "assets", "renders");
const exts = [".jpg", ".jpeg", ".png", ".webp"];

if (!existsSync(inbox)) {
  console.log("Нет папки assets/renders — класть картинки в assets/renders/<slug>/<ракурс>.jpg");
  process.exit(0);
}

let added = 0;
let updated = 0;
let removed = 0;
for (const slug of await readdir(inbox)) {
  const house = houses[slug];
  const base = path.join(inbox, slug);
  if (!(await stat(base)).isDirectory()) continue;
  const dir = existsSync(path.join(base, "results")) ? path.join(base, "results") : base;
  if (!house) {
    console.warn(`Пропуск ${slug}: нет такого проекта в scripts/renders/data.mjs`);
    continue;
  }
  const files = (await readdir(dir)).filter((f) => exts.includes(path.extname(f).toLowerCase()));
  // Порядок — как в списке ракурсов: сначала фасады, потом интерьеры
  const order = Object.keys(angles);
  files.sort((a, b) => order.indexOf(path.parse(a).name) - order.indexOf(path.parse(b).name));

  const jsonFile = path.join(root, "content", "projects", `${slug}.json`);
  const data = JSON.parse(await readFile(jsonFile, "utf8"));
  data.photos ??= [];

  for (const f of files) {
    const key = path.parse(f).name;
    const angle = angles[key];
    if (!angle) {
      console.warn(`Пропуск ${slug}/${f}: неизвестный ракурс, допустимые: ${order.join(", ")}`);
      continue;
    }
    const src = `/images/projects/${slug}/photos/render-${key}/src.jpg`;
    const out = path.join(root, "public", src);
    await mkdir(path.dirname(out), { recursive: true });
    await sharp(path.join(dir, f))
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);

    const alt = `${house.title}, ${angle.alt}`;
    const existing = data.photos.find((p) => p.src === src);
    if (existing) {
      existing.alt = alt;
      existing.render = true;
      updated++;
    } else {
      data.photos.push({ src, alt, render: true });
      added++;
    }
    console.log(src);
  }
  // Новый главный фасад заменяет старые визуализации со старого сайта (решение пользователя от 09.11.2026):
  // убираются записи render: true не из этого скрипта и их файлы; настоящие фото не трогаются
  if (files.some((f) => path.parse(f).name === "front")) {
    const old = data.photos.filter((p) => p.render && !p.src.includes("/photos/render-"));
    for (const p of old) {
      await rm(path.join(root, "public", path.dirname(p.src)), { recursive: true, force: true });
      console.log(`Убрана старая визуализация ${p.src}`);
      removed++;
    }
    data.photos = data.photos.filter((p) => !old.includes(p));
  }
  await writeFile(jsonFile, JSON.stringify(data, null, 2) + "\n");
}
console.log(`Добавлено ${added}, обновлено ${updated}, убрано старых ${removed}`);
