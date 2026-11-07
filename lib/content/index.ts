import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { fillImageSizes } from "./images";
import { normalizeStored } from "./normalize";
import { projectSchema, settingsSchema, type Project, type Settings } from "./schemas";

const root = path.join(process.cwd(), "content");

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8"));
}

// Файл в форме Keystatic → проверенные данные сайта. Адрес проекта — имя файла.
export async function parseSettings(raw: unknown): Promise<Settings> {
  const data = normalizeStored(raw);
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) throw new Error(`content/settings.json: ${parsed.error.message}`);
  return parsed.data;
}

export async function parseProject(raw: unknown, file: string, publicDir?: string): Promise<Project> {
  const data = normalizeStored(raw) as Record<string, unknown>;
  data.slug = path.basename(file, ".json");
  await fillImageSizes(data, publicDir);
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) throw new Error(`content/projects/${path.basename(file)}: ${parsed.error.message}`);
  return parsed.data;
}

// Контент меняется только коммитом и пересборкой — кэшируем навсегда
export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheLife("max");
  return parseSettings(await readJson(path.join(root, "settings.json")));
}

export async function getAllProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  const dir = path.join(root, "projects");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  const projects = await Promise.all(
    files.map(async (f) => parseProject(await readJson(path.join(dir, f)), f)),
  );
  return projects.sort((a, b) => a.order - b.order);
}

export async function getProjects(): Promise<Project[]> {
  return (await getAllProjects()).filter((p) => p.published);
}

export async function getProject(slug: string): Promise<Project | null> {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

// Минимальная известная цена проекта: комплектации, затем поле priceFrom
export function projectPriceFrom(p: Project): number | null {
  const prices = p.packages.map((x) => x.price).filter((x): x is number => x !== null);
  if (prices.length) return Math.min(...prices);
  return p.priceFrom;
}

// Проекты, у которых опубликован вариант с баней внутри
export async function getBanyaVariantProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.banyaVariant?.published);
}

export function projectHref(p: Project, withBanya = false): string {
  return withBanya ? `/proekty/${p.slug}/s-banei` : `/proekty/${p.slug}`;
}

// Проект в виде варианта с баней: шаблон страницы тот же, данные — из banyaVariant
export function asBanyaVariant(p: Project): Project | null {
  const v = p.banyaVariant;
  if (!v?.published) return null;
  return {
    ...p,
    title: v.title,
    summary: v.summary ?? p.summary,
    params: { ...p.params, area: v.area ?? p.params.area },
    priceFrom: v.priceFrom,
    // Фасад обычно тот же — если своих фото нет, берём фото основного проекта
    photos: v.photos.length ? v.photos : p.photos,
    plans: v.plans,
    packages: v.packages,
    options: v.options,
    specs: v.specs,
    calcExample: null,
    seo: v.seo,
  };
}
