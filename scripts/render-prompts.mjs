// Промпты и пакеты визуализаций для ChatGPT: node scripts/render-prompts.mjs
//  → docs/RENDER-PROMPTS.md (все промпты, для истории в репозитории)
//  → ../site-assets/render-pack/<slug>/ (вне репозитория): README.md с порядком работы, refs/ с образцами, results/ для картинок.
// Данные — scripts/renders/data.mjs. Готовые картинки подключает scripts/add-renders.mjs.
import { existsSync } from "node:fs";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  anchorText,
  angles,
  ending,
  exteriorMaterials,
  exteriorRules,
  exteriorScene,
  houses,
  interiorStyle,
  metalAnchorText,
  metalMaterials,
  metalPhotoText,
  negative,
  photoText,
  planText,
  styleRefs,
} from "./renders/data.mjs";

const root = process.cwd();
const packRoot = path.resolve(root, "..", "site-assets", "render-pack");
const clientRoot = path.resolve(root, "..", "site-assets", "from-client", "proekty");

// Ракурсы дома: два фасада и комнаты в порядке angles
const keysOf = (h) =>
  Object.keys(angles).filter(
    (k) => k === "front" || k === "back" || (k === "metal" && h.metal) || h.rooms[k],
  );

// Фото-образцы для ракурса: фасадам — фото снаружи, интерьеру — фото этой комнаты
const photosFor = (h, key) => (angles[key].kind === "exterior" ? h.photos?.exterior : h.photos?.[key]) ?? [];

function prompt(h, key) {
  const exterior = angles[key].kind === "exterior";
  const photos = photosFor(h, key);
  const parts = [];
  if (exterior) {
    const metal = key === "metal";
    parts.push("Create an exterior visualization of a real single-storey modular frame house.");
    if (h.plan) parts.push(planText);
    if (photos.length) parts.push(metal ? metalPhotoText : photoText);
    parts.push(
      metal ? metalAnchorText : anchorText,
      `House: ${h.shape}`,
      `View: ${h.views[key]}`,
      exteriorScene,
      metal ? metalMaterials : exteriorMaterials,
      exteriorRules,
    );
  } else {
    parts.push("Create an interior visualization of one room in a real single-storey modular frame house.");
    if (h.plan) parts.push(planText);
    if (photos.length)
      parts.push(
        "The interior photo shows the real room: keep its shape, windows and doors; replace finishes and furniture as described.",
      );
    parts.push(anchorText, `Room: ${h.rooms[key]}`, interiorStyle);
  }
  parts.push(ending);
  return parts.join(" ");
}

// Что приложить: сначала чертёж и фото, образец стиля — последним
function attachments(h, key) {
  const list = [];
  if (h.plan) list.push("`refs/plan.png` — чертёж");
  photosFor(h, key).forEach((p) => list.push(`\`refs/${refName(p)}\` — фото`));
  const anchor = angles[key].kind === "exterior" ? styleRefs.exterior : styleRefs.interior;
  list.push(`\`${anchor}\` — образец стиля`);
  return list;
}

const refName = (p) =>
  "photo-" +
  path
    .basename(p)
    .replace(/\.[^.]+$/, "")
    .toLowerCase() +
  ".jpg";

// Копии образцов: до 2048 px, без метаданных (геометка, камера)
async function buildRefs(slug, h) {
  const dir = path.join(packRoot, slug, "refs");
  if (existsSync(dir)) await rm(dir, { recursive: true });
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(packRoot, slug, "results"), { recursive: true });
  if (h.plan)
    await sharp(path.join(root, "assets", "plans-original", `${slug}.jpg`))
      .resize(2000, null, { kernel: "lanczos3" })
      .sharpen()
      .png()
      .toFile(path.join(dir, "plan.png"));
  const all = new Set(Object.values(h.photos ?? {}).flat());
  for (const p of all)
    await sharp(path.join(clientRoot, p))
      .rotate()
      .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 88 })
      .toFile(path.join(dir, refName(p)));
}

function houseReadme(slug, h) {
  const out = [`# ${h.title}: визуализации`, ""];
  out.push(
    `${h.metal ? "Шесть картинок в одном стиле: два фасада в серой доске, один в металлическом профиле, как на фото, и три интерьера" : "Пять картинок в одном стиле: два фасада и три интерьера"}. Общий порядок работы — в \`../README.md\`.`,
    "",
  );
  if (!h.plan)
    out.push(
      "Чертежа от компании нет: форма дома и комнат берётся с фото построенного дома. Когда компания пришлёт чертёж, промпты нужно обновить.",
      "",
    );
  if (h.extra) out.push(...h.extra, "");
  keysOf(h).forEach((key, i) => {
    const done = h.done?.includes(key);
    out.push(`## ${i + 1}. ${angles[key].title}${done ? " — готово" : ""}`, "");
    out.push(`**Сохранить как:** \`results/${key}.png\``, "", "**Приложить:**", "");
    attachments(h, key).forEach((a) => out.push(`- ${a}`));
    out.push("", "```text", prompt(h, key), "```", "");
  });
  return out.join("\n");
}

const overview = [
  "# Визуализации домов МИШАЛЕ: порядок работы",
  "",
  "Собирается скриптом `npm run render-prompts` в `site/` — правки вносить в `site/scripts/renders/data.mjs`, не сюда.",
  "",
  "## Как держать один стиль",
  "",
  "1. **Сначала образцы.** Фасады всех домов делаются по образцу `dom-75/results/front.png`, интерьеры — по `dom-75/results/living.png`. Поэтому первым шагом поправить фасад 75 м² (промпт правки — в `dom-75/README.md`).",
  "2. **Одна модель и один формат.** Все картинки в ChatGPT, 3:2 горизонтально, самое высокое качество.",
  "3. **Каждая картинка — в новом чате**, с файлами из списка «Приложить» в указанном порядке. Образец стиля прикладывать всегда, даже если кажется лишним.",
  "4. **Промпт не сокращать:** общие куски (свет, материалы, объектив) одинаковые во всех промптах — на них держится стиль.",
  "5. Ошибка одна — просить исправить только её в том же чате. Ошибок много — новый чат.",
  "6. Готовое сохранять в `results/` дома под указанным именем и сообщить исполнителю: он сверит с чертежом и подключит к сайту.",
  "",
  "## Что проверять",
  "",
  "- Один этаж, низкая кровля, никаких панорамных окон и остекления в пол.",
  "- Форма дома, терраса, крыльцо, ступени, двери и окна — как на чертеже или фото.",
  "- Цвет и свет как у образца: серая доска снаружи (у фасада «в металлическом профиле» — обшивка как на фото), светлая сосна внутри, тёплый осенний день.",
  "",
  "Когда у дома готов новый главный фасад (`results/front.png`), при подключении старые визуализации со старого сайта у этого дома убираются автоматически.",
  "- Нет людей, надписей, логотипов.",
  "",
  "## Дома",
  "",
  ...Object.entries(houses).map(
    ([slug, h]) =>
      `- [${h.title}](${slug}/README.md) — ${keysOf(h)
        .map((k) => angles[k].title.toLowerCase())
        .join(", ")}${h.plan ? "" : " (по фото, чертежа нет)"}`,
  ),
  "",
  "**Стоп-слова** (если сервис принимает negative prompt):",
  "",
  "```text",
  negative,
  "```",
  "",
].join("\n");

let count = 0;
const doc = [
  "# Промпты для визуализаций домов",
  "",
  "Файл собирается скриптом `npm run render-prompts` — правки вносить в `scripts/renders/data.mjs`, не сюда.",
  "Пакеты для работы в ChatGPT (образцы, порядок, сверка) — `../site-assets/render-pack/`, вне репозитория.",
  "",
];
await mkdir(packRoot, { recursive: true });
for (const [slug, h] of Object.entries(houses)) {
  await buildRefs(slug, h);
  await writeFile(path.join(packRoot, slug, "README.md"), houseReadme(slug, h));
  doc.push(`## ${h.title} — \`${slug}\``, "");
  for (const key of keysOf(h)) {
    doc.push(`### \`${key}\` — ${angles[key].title}`, "", "```text", prompt(h, key), "```", "");
    count++;
  }
}
await writeFile(path.join(packRoot, "README.md"), overview);
await writeFile(path.join(root, "docs", "RENDER-PROMPTS.md"), doc.join("\n"));
console.log(`Пакеты: ${(await readdir(packRoot)).length - 1} домов, промптов: ${count}`);
