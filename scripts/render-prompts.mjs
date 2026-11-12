// Промпты и пакеты визуализаций для ChatGPT: node scripts/render-prompts.mjs
//  → docs/RENDER-PROMPTS.md (все промпты, для истории в репозитории)
//  → ../site-assets/render-pack/<slug>/ (вне репозитория): CHATGPT.md — инструкция для ChatGPT, README.md — порядок работы,
//    refs/ — чертёж, фото и копии образцов стиля, results/ — готовые картинки. Папку дома отправляют в один чат целиком.
// Данные — scripts/renders/data.mjs. Готовые картинки подключает scripts/add-renders.mjs.
import { existsSync } from "node:fs";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  anchorText,
  angles,
  backText,
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
      metal ? metalAnchorText : key === "back" ? backText : anchorText,
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

// Файлы пакета — плоские уникальные имена: их можно перетащить в чат все разом, без папок
const styleFile = { exterior: "style-exterior.png", interior: "style-interior.png" };

// Что приложить: сначала чертёж и фото, образец — последним. Второму ракурсу образец — главный фасад этого же дома.
// Возвращает { file — путь в пакете, name — имя файла в чате, ru, en — что это за файл }
function attachments(h, key) {
  const list = [];
  if (h.plan) list.push({ file: "refs/plan.png", ru: "чертёж", en: "construction drawing (floor plan)" });
  photosFor(h, key).forEach((p) =>
    list.push({ file: `refs/${refName(p)}`, ru: "фото", en: "photo of the real built house" }),
  );
  if (key === "back")
    list.push({
      file: "results/front.png",
      ru: "главный фасад этого дома (поэтому второй ракурс делается после него)",
      en: "the main view of this same house: the front.png you generated earlier in this chat, or the uploaded front.png",
    });
  else list.push({ file: `refs/${styleFile[angles[key].kind]}`, ru: "образец стиля", en: "style reference" });
  return list.map((a) => ({ ...a, name: path.basename(a.file) }));
}

const refName = (p) =>
  "photo-" +
  path
    .basename(p)
    .replace(/\.[^.]+$/, "")
    .toLowerCase() +
  ".jpg";

// Готовые картинки: одобренные пользователем (done) и уже лежащие в results/
const doneKeys = (slug, h) =>
  keysOf(h).filter(
    (k) => h.done?.includes(k) || existsSync(path.join(packRoot, slug, "results", `${k}.png`)),
  );

// Образцы стиля читаются один раз до пересборки пакетов (у дома 75 м² они лежат в его же папке)
async function loadStyle() {
  const out = {};
  for (const [kind, rel] of Object.entries(styleRefs)) {
    const src = path.join(packRoot, "dom-75", rel.replace("../dom-75/", ""));
    if (!existsSync(src)) throw new Error(`Нет образца стиля: ${src}`);
    out[kind] = await sharp(src)
      .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
  }
  return out;
}

// Красные подписи дверей и ступеней поверх чертежа: на белой подложке, чтобы читались поверх линий
function labelsSvg(labels, width, height) {
  const size = 34;
  const items = labels.map(([text, x, y, anchor]) => {
    const w = Math.round(text.length * size * 0.66) + 16;
    const left = anchor === "end" ? x - w : anchor === "middle" ? x - w / 2 : x;
    return (
      `<rect x="${left}" y="${y - size}" width="${w}" height="${size + 12}" fill="white" stroke="#d00000" stroke-width="3"/>` +
      `<text x="${left + w / 2}" y="${y}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size}" font-weight="bold" fill="#d00000">${text}</text>`
    );
  });
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${items.join("")}</svg>`,
  );
}

// Копии образцов: до 2048 px, без метаданных (геометка, камера)
async function buildRefs(slug, h, style) {
  const dir = path.join(packRoot, slug, "refs");
  // Очищаем содержимое, а не саму папку: открытая в Проводнике папка не даёт себя удалить (EBUSY)
  await mkdir(dir, { recursive: true });
  for (const f of await readdir(dir)) await rm(path.join(dir, f), { recursive: true });
  await mkdir(path.join(packRoot, slug, "results"), { recursive: true });
  if (h.plan) {
    const plan = sharp(path.join(root, "assets", "plans-original", `${slug}.jpg`))
      .resize(2000, null, { kernel: "lanczos3" })
      .sharpen();
    const { width, height } = await sharp(await plan.clone().png().toBuffer()).metadata();
    await plan
      .composite(h.labels?.length ? [{ input: labelsSvg(h.labels, width, height), top: 0, left: 0 }] : [])
      .png()
      .toFile(path.join(dir, "plan.png"));
  }
  const all = new Set(Object.values(h.photos ?? {}).flat());
  for (const p of all)
    await sharp(path.join(clientRoot, p))
      .rotate()
      .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 88 })
      .toFile(path.join(dir, refName(p)));
  for (const [kind, buf] of Object.entries(style)) await writeFile(path.join(dir, styleFile[kind]), buf);
}

// Что отправить в чат: инструкцию, образцы для ещё не сделанных картинок и готовый главный фасад, если он нужен второму ракурсу
function uploadList(slug, h) {
  const done = doneKeys(slug, h);
  const todo = keysOf(h).filter((k) => !done.includes(k));
  const files = new Set(["CHATGPT.md"]);
  todo.forEach((k) => attachments(h, k).forEach((a) => a.file.startsWith("refs/") && files.add(a.file)));
  if (todo.includes("back") && !todo.includes("front")) files.add("results/front.png");
  return [...files];
}

// Инструкция для ChatGPT: по-английски, как и промпты; с пользователем — по-русски
function chatgptDoc(slug, h) {
  const done = doneKeys(slug, h);
  const todo = keysOf(h).filter((k) => !done.includes(k));
  const images = uploadList(slug, h)
    .filter((f) => f !== "CHATGPT.md")
    .map((f) => path.basename(f));
  const out = [
    `# Task: photorealistic visualizations of "${h.title}" (${slug})`,
    "",
    "You are making a set of visualizations of a real modular house for the manufacturer's website. Everything you need is in this file and the attached images. Talk to the user in Russian.",
    "",
    "## Files",
    "",
    `The user uploads this file together with these reference images: ${images.join(", ")} — either as separate files or as a zip archive of the house folder (images are in refs/ and results/). ` +
      "If it is an archive, unpack it. If your image generation tool cannot use the images from the archive as references, stop and ask the user in Russian to attach these image files directly to the chat.",
    "",
    "## How to work",
    "",
    "1. Generate the images strictly in the order below, one image at a time, with your image generation tool: 3:2 landscape, highest quality. " +
      "Each image is a separate generation that uses only its own prompt and its own references. Never put several views, the floor plan or the reference images into one picture: every result is one single photograph.",
    "2. For each image use the prompt exactly as written — do not shorten, translate or rewrite it — and pass the listed files as image references in the listed order.",
    "3. Under each image write its file name, for example `back.png`, so the user can save it.",
    "4. Check every image against the checklist below. If one thing is wrong, regenerate once fixing only that thing, then move on.",
    '5. Go on to the next image without waiting for confirmation. If you cannot make more images in this reply, stop and write in Russian: «Напишите "дальше"».',
    "6. At the end list in Russian which images are done and which may need a fix.",
    "",
    "## Checklist",
    "",
    "- Exactly one storey, low roof; only ordinary rectangular windows, no panoramic or floor-to-ceiling glazing.",
    `- House shape, terrace, porch, steps, doors and windows as on the ${h.plan ? "floor plan" : "photos of the real house"}.`,
    "- Colours and light as in the style reference: grey boards outside" +
      (h.metal ? " (dark profiled metal only in metal.png)" : "") +
      ", light pine inside, warm early-autumn day.",
    "- back.png shows the opposite side of the house, not the same angle as front.png.",
    "- No people, text, logos or watermarks.",
    "",
  ];
  if (done.length) out.push(`Already done — do not generate: ${done.map((k) => `${k}.png`).join(", ")}.`, "");
  out.push("## Images", "");
  todo.forEach((key, i) => {
    out.push(`### ${i + 1}. \`${key}.png\` — ${angles[key].title}`, "", "References:", "");
    attachments(h, key).forEach((a) => out.push(`- \`${a.name}\` — ${a.en}`));
    out.push("", "```text", prompt(h, key), "```", "");
  });
  out.push(
    "## Negative prompt",
    "",
    "If you can pass a negative prompt, use this one:",
    "",
    "```text",
    negative,
    "```",
    "",
  );
  return out.join("\n");
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
  out.push(
    "## Как отправить в ChatGPT",
    "",
    "1. Новый чат в ChatGPT.",
    "2. Перетащить в чат эти файлы из папки (если все сразу не принимает — двумя сообщениями):",
    "",
    ...uploadList(slug, h).map((f) => `   - \`${f}\``),
    "",
    "   Можно и архивом всей папки, но картинки из архива генератор может не увидеть — тогда ChatGPT сам попросит приложить их отдельно.",
    "3. Написать: «Выполни инструкцию из CHATGPT.md».",
    "4. Картинки приходят по одной, под каждой — имя файла. Сохранять в `results/` под этим именем. Остановился — написать «дальше».",
    "5. Проверить по списку из `../README.md`. Одна ошибка — попросить исправить только её в том же чате.",
    "",
    "Ниже — те же промпты по одному, если удобнее делать вручную.",
    "",
  );
  if (h.extra) out.push(...h.extra, "");
  const done = doneKeys(slug, h);
  keysOf(h).forEach((key, i) => {
    out.push(`## ${i + 1}. ${angles[key].title}${done.includes(key) ? " — готово" : ""}`, "");
    out.push(`**Сохранить как:** \`results/${key}.png\``, "", "**Приложить:**", "");
    attachments(h, key).forEach((a) => out.push(`- \`${a.file}\` — ${a.ru}`));
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
  "1. **Образцы готовы.** Фасады всех домов делаются по образцу `dom-75/results/front.png`, интерьеры — по `dom-75/results/living.png`. Копии образцов лежат в `refs/` каждого дома как `style-exterior.png` и `style-interior.png`.",
  "2. **Один дом — один чат.** Папка дома самодостаточна: в `CHATGPT.md` инструкция для ChatGPT со всеми промптами, в `refs/` чертёж, фото и образцы. Что перетащить в чат и что написать — в начале `README.md` дома.",
  "3. **Одна модель и один формат.** ChatGPT, 3:2 горизонтально, самое высокое качество.",
  "4. **Второй ракурс — после главного:** образцом для него служит главный фасад этого же дома, сделанный в том же чате. Если модель всё равно повторяет главный ракурс — попросить ещё раз в новом чате без главного фасада, а стиль поправить вторым сообщением.",
  "5. **Промпт не сокращать:** общие куски (свет, материалы, объектив) одинаковые во всех промптах — на них держится стиль.",
  "6. Ошибка одна — просить исправить только её в том же чате. Ошибок много — эту картинку заново в новом чате по промпту из `README.md` дома.",
  "7. Готовое сохранять в `results/` дома под указанным именем и сообщить исполнителю: он сверит с чертежом и подключит к сайту. При пересборке пакетов готовые картинки из `CHATGPT.md` убираются.",
  "",
  "## Что проверять",
  "",
  "- Один этаж, низкая кровля, никаких панорамных окон и остекления в пол.",
  "- Форма дома, терраса, крыльцо, ступени, двери и окна — как на чертеже или фото.",
  "- Двери и ступени — ровно там, где сказано в промпте: дверь в боковой стене террасы смотрит вбок, а не в камеру; лишних дверей и ступеней нет. На чертежах они подписаны красным — на картинке этих подписей быть не должно.",
  "- Цвет и свет как у образца: серая доска снаружи (у фасада «в металлическом профиле» — обшивка как на фото), светлая сосна внутри, тёплый осенний день.",
  "- Нет людей, надписей, логотипов.",
  "",
  "Когда у дома готов новый главный фасад (`results/front.png`), при подключении старые визуализации со старого сайта у этого дома убираются автоматически.",
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
const style = await loadStyle();
for (const [slug, h] of Object.entries(houses)) {
  await buildRefs(slug, h, style);
  await writeFile(path.join(packRoot, slug, "README.md"), houseReadme(slug, h));
  await writeFile(path.join(packRoot, slug, "CHATGPT.md"), chatgptDoc(slug, h));
  doc.push(`## ${h.title} — \`${slug}\``, "");
  for (const key of keysOf(h)) {
    doc.push(`### \`${key}\` — ${angles[key].title}`, "", "```text", prompt(h, key), "```", "");
    count++;
  }
}
await writeFile(path.join(packRoot, "README.md"), overview);
await writeFile(path.join(root, "docs", "RENDER-PROMPTS.md"), doc.join("\n"));
console.log(`Пакеты: ${Object.keys(houses).length} домов, промптов: ${count}`);
