import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { projectSchema, settingsSchema, type Project, type Settings } from "./schemas";

const root = path.join(process.cwd(), "content");

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8"));
}

// Контент меняется только коммитом и пересборкой — кэшируем навсегда
export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheLife("max");
  const data = await readJson(path.join(root, "settings.json"));
  return settingsSchema.parse(data);
}

export async function getAllProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  const dir = path.join(root, "projects");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  const projects = await Promise.all(
    files.map(async (f) => {
      const parsed = projectSchema.safeParse(await readJson(path.join(dir, f)));
      if (!parsed.success) throw new Error(`content/projects/${f}: ${parsed.error.message}`);
      if (parsed.data.slug !== f.replace(/\.json$/, ""))
        throw new Error(`content/projects/${f}: slug не совпадает с именем файла`);
      return parsed.data;
    }),
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
