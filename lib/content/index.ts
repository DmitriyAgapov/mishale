import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { applyDemoLayer, demoMode, demoSlotSchema, mergeLayers, type DemoLayer, type DemoSlot } from "@/lib/demo";
import { fillImageSizes } from "./images";
import { normalizeStored } from "./normalize";
import { withTierPackages } from "./prices";
import { projectSchema, settingsSchema, type Project, type Settings } from "./schemas";

const root = path.join(process.cwd(), "content");

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8"));
}

// Примеры для тестового адреса (lib/demo.ts). Без DEMO_CONTENT=1 не читаются вовсе.
type DemoFile = { projects?: DemoLayer; settings?: DemoLayer; slots?: Record<string, unknown> };
async function readDemo(): Promise<DemoFile> {
  return (await readJson(path.join(root, "demo", "common.json"))) as DemoFile;
}
async function readDemoProject(slug: string): Promise<DemoLayer | undefined> {
  return (await readJson(path.join(root, "demo", "projects", `${slug}.json`)).catch(() => undefined)) as
    | DemoLayer
    | undefined;
}

// Файл в форме Keystatic → проверенные данные сайта. Адрес проекта — имя файла.
export async function parseSettings(raw: unknown, demo?: DemoLayer): Promise<Settings> {
  const data = normalizeStored(raw) as Record<string, unknown>;
  applyDemoLayer(data, demo);
  await fillImageSizes(data);
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) throw new Error(`content/settings.json: ${parsed.error.message}`);
  return parsed.data;
}

export async function parseProject(
  raw: unknown,
  file: string,
  publicDir?: string,
  demo?: DemoLayer,
): Promise<Project> {
  const data = normalizeStored(raw) as Record<string, unknown>;
  data.slug = path.basename(file, ".json");
  if (demo) {
    applyDemoLayer(data, demo);
    // Вариант с баней — свой слой внутри слоя проекта
    const variant = demo.banyaVariant as DemoLayer | undefined;
    if (variant && data.banyaVariant && typeof data.banyaVariant === "object") {
      applyDemoLayer(data.banyaVariant as Record<string, unknown>, variant);
    }
  }
  await fillImageSizes(data, publicDir);
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) throw new Error(`content/projects/${path.basename(file)}: ${parsed.error.message}`);
  return parsed.data;
}

// Контент меняется только коммитом и пересборкой — кэшируем навсегда
export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheLife("max");
  const demo = demoMode ? (await readDemo()).settings : undefined;
  return parseSettings(await readJson(path.join(root, "settings.json")), demo);
}

// Блоки, которых на сайте пока нет, — показываются заглушками только в демо-режиме
export async function getDemoSlots(): Promise<Record<string, DemoSlot>> {
  "use cache";
  cacheLife("max");
  if (!demoMode) return {};
  const slots = (await readDemo()).slots ?? {};
  return Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, demoSlotSchema.parse(v)]));
}

export async function getAllProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  const dir = path.join(root, "projects");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  const common = demoMode ? (await readDemo()).projects : undefined;
  const settings = await getSettings();
  const projects = await Promise.all(
    files.map(async (f) => {
      const demo = demoMode ? mergeLayers(common, await readDemoProject(path.basename(f, ".json"))) : undefined;
      const p = await parseProject(await readJson(path.join(dir, f)), f, undefined, demo);
      return withTierPackages(p, settings);
    }),
  );
  return projects.sort((a, b) => a.order - b.order);
}

export async function getProjects(): Promise<Project[]> {
  return (await getAllProjects()).filter((p) => p.published);
}

// Для каталога: опубликованные проекты и заготовки — карточкой «Скоро» с формой «Узнать цену» (ТЗ §0)
export async function getCatalogProjects(): Promise<Project[]> {
  return getAllProjects();
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

// Цена «от» на главной: из настроек, иначе — минимальная цена опубликованных домов
export function siteMinPrice(settings: Settings, projects: Project[]): number | null {
  if (settings.priceFromAll) return settings.priceFromAll;
  const prices = projects
    .filter((p) => p.published)
    .map(projectPriceFrom)
    .filter((x): x is number => x !== null);
  return prices.length ? Math.min(...prices) : null;
}

// Проекты, у которых опубликован вариант с баней внутри
export async function getBanyaVariantProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.banyaVariant?.published);
}

// Готовый дом в наличии — своя страница (settings.inStock)
export type StockItem = Settings["inStock"][number];
export function stockHref(item: StockItem): string {
  return `/v-nalichii/${item.slug}`;
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
    // Пометки демо-режима: свои у варианта; пометка фото — от основного проекта, если фото взяты оттуда
    demo: { ...(v.photos.length || !p.demo.photos ? {} : { photos: p.demo.photos }), ...v.demo },
  };
}
