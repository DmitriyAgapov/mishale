// Фото от компании: npm run photos
// Берёт файлы из site-assets/from-client (путь — PHOTOS_SRC, по умолчанию ../site-assets/from-client),
// сжимает (фото проектов — в public/images/projects/<slug>/real/, остальные — в public/images/real/) и записывает в данные по списку scripts/photos/data.mjs:
// - фото проектов — в начало галереи (перед визуализациями), фото варианта с баней — в banyaVariant.photos;
// - построенные дома, фото цеха, доставки, первого экрана и готовых домов в наличии — в content/settings.json.
// Повторный запуск обновляет картинки и не дублирует записи; чужие фото в галереях не трогает.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import * as data from "./photos/data.mjs";

const root = process.cwd();
const source = path.resolve(root, process.env.PHOTOS_SRC ?? "../site-assets/from-client");
// Фото проектов — в папке проекта (так их ждёт админка Keystatic), остальные — в /images/real/
const SETTINGS_DIR = "/images/real/";
const projectDir = (slug) => `/images/projects/${slug}/real/`;

if (!existsSync(source)) {
  console.log(`Нет папки с фото: ${source}`);
  process.exit(0);
}

// Имя файла на сайте — латиница из пути исходника и короткий хэш (одинаковые имена в разных папках не столкнутся)
function publicName(rel, dir) {
  const base = path
    .parse(rel)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const hash = createHash("md5").update(rel).digest("hex").slice(0, 6);
  return `${dir}${base}-${hash}.jpg`;
}

const done = new Map();
async function image([rel, alt], dir = SETTINGS_DIR) {
  const src = publicName(rel, dir);
  if (!done.has(src)) {
    const out = path.join(root, "public", src);
    await mkdir(path.dirname(out), { recursive: true });
    await sharp(path.join(source, rel))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(out);
    done.set(src, true);
  }
  return { src, alt, render: false };
}
const images = (list, dir = SETTINGS_DIR) => Promise.all(list.map((x) => image(x, dir)));

// Галерея: свои фото из этого скрипта заменяются целиком, остальные (визуализации, фото из админки) — после них
function mergeGallery(current = [], fresh) {
  return [...fresh, ...current.filter((p) => !p.src.includes("/real/"))];
}

const projectsDir = path.join(root, "content", "projects");
const slugs = new Set([...Object.keys(data.projectPhotos), ...Object.keys(data.variantPhotos)]);
for (const slug of slugs) {
  const file = path.join(projectsDir, `${slug}.json`);
  const json = JSON.parse(await readFile(file, "utf8"));
  if (data.projectPhotos[slug])
    json.photos = mergeGallery(json.photos, await images(data.projectPhotos[slug], projectDir(slug)));
  if (data.variantPhotos[slug]) {
    // Keystatic хранит вариант как условный блок {discriminant, value}
    const v = json.banyaVariant?.value;
    if (!v) throw new Error(`${slug}: у проекта нет варианта с баней`);
    v.photos = mergeGallery(v.photos, await images(data.variantPhotos[slug], projectDir(slug)));
  }
  await writeFile(file, JSON.stringify(json, null, 2) + "\n");
  console.log(`content/projects/${slug}.json`);
}

const settingsFile = path.join(root, "content", "settings.json");
const settings = JSON.parse(await readFile(settingsFile, "utf8"));
settings.cases = await Promise.all(
  data.cases.map(async ({ photos, ...c }) => ({ ...c, photos: await images(photos) })),
);
settings.productionPhotos = await images(data.productionPhotos);
settings.deliveryPhotos = await images(data.deliveryPhotos);
// Условный блок Keystatic: есть фото / нет фото
settings.heroPhoto = { discriminant: true, value: await image(data.heroPhoto) };
// Готовые дома: фото — в /images/stock/<адрес>/ (туда же кладёт админка), заменяются целиком
for (const item of settings.inStock ?? []) {
  const list = data.stockPhotos[item.slug];
  if (list) item.photos = await images(list, `/images/stock/${item.slug}/`);
}
await writeFile(settingsFile, JSON.stringify(settings, null, 2) + "\n");
console.log(`content/settings.json; картинок: ${done.size}`);
