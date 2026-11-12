import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createReader } from "@keystatic/core/reader";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import keystaticConfig from "../../keystatic.config";
import { asBanyaVariant, parseProject, parseSettings, projectHref } from "./index";
import { normalizeStored } from "./normalize";
import type { Project } from "./schemas";

const dir = path.join(process.cwd(), "content", "projects");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const all: Project[] = await Promise.all(
  files.map((f) => parseProject(JSON.parse(readFileSync(path.join(dir, f), "utf8")), f)),
);

describe("файлы данных и админка", () => {
  it("Keystatic открывает все проекты и настройки без ошибок", async () => {
    const reader = createReader(process.cwd(), keystaticConfig);
    const projects = await reader.collections.projects.all();
    expect(projects.map((p) => p.slug).sort()).toEqual(files.map((f) => f.replace(".json", "")).sort());
    expect(await reader.singletons.settings.read()).not.toBeNull();
  });

  it("настройки проходят схему сайта", async () => {
    const s = await parseSettings(
      JSON.parse(readFileSync(path.join(process.cwd(), "content", "settings.json"), "utf8")),
    );
    expect(s.phone.href).toMatch(/^tel:/);
    expect(s.legal?.inn).toBe("7415094224");
  });

  it("размеры картинок читаются из файлов", async () => {
    const p = all.find((x) => x.slug === "dom-45")!;
    // Сверяем с самим файлом, а не с числом: картинки меняются при подключении новых визуализаций
    const meta = await sharp(path.join(process.cwd(), "public", p.photos[0].src)).metadata();
    expect(p.photos[0].width).toBe(meta.width);
    expect(p.photos[0].height).toBe(meta.height);
  });

  it("форма Keystatic приводится к схеме сайта", () => {
    expect(normalizeStored({ discriminant: false })).toBeUndefined();
    expect(normalizeStored({ discriminant: true, value: { a: "" } })).toEqual({});
    expect(normalizeStored({ seo: { title: "", description: "x" }, list: ["a", ""] })).toEqual({
      seo: { description: "x" },
      list: ["a"],
    });
  });

  it("сохранённый из админки файл проекта читается сайтом", async () => {
    // Так Keystatic пишет новый проект с минимумом полей
    const stored = {
      title: "Тест",
      published: false,
      order: 99,
      category: "small",
      params: { area: 30, modules: 2, moduleSize: "", ceiling: null, productionWeeks: "" },
      priceFrom: null,
      purposes: [],
      summary: "",
      photos: [],
      plans: [],
      packages: [{ name: "База", price: 1000000, items: ["Каркас"], priceDate: null }],
      included: [],
      extra: [],
      suitableFor: [],
      options: [{ name: "Терраса", price: null }],
      calcExample: { discriminant: false },
      stock: { available: false, deliveryWeeks: null, salePrice: null },
      specs: [],
      faq: [],
      similar: [],
      seo: { title: "", description: "" },
      banyaVariant: { discriminant: false },
    };
    const p = await parseProject(stored, "test-dom.json");
    expect(p.slug).toBe("test-dom");
    expect(p.params.productionWeeks).toBeNull();
    expect(p.params.moduleSize).toBeNull();
    expect(p.packages[0].priceDate).toBeUndefined();
    expect(p.options[0].price).toBeNull();
    expect(p.calcExample).toBeNull();
    expect(p.banyaVariant).toBeNull();
    expect(p.seo.title).toBeNull();
  });
});

describe("данные проектов", () => {
  it("линейка: 2 малых, 4 средних, 2 больших, 2 бани", () => {
    const count = (c: string) => all.filter((p) => p.category === c).length;
    expect([count("small"), count("medium"), count("large"), count("banya")]).toEqual([2, 4, 2, 2]);
  });

  it("малые дома — 2 модуля и без варианта с баней", () => {
    for (const p of all.filter((x) => x.category === "small")) {
      expect(p.params.modules).toBe(2);
      expect(p.banyaVariant).toBeNull();
    }
  });

  it("вариант с баней — только у средних и больших", () => {
    for (const p of all.filter((x) => x.banyaVariant)) expect(["medium", "large"]).toContain(p.category);
  });

  it("похожие проекты ссылаются на существующие", () => {
    const slugs = new Set(all.map((p) => p.slug));
    for (const p of all) for (const s of p.similar) expect(slugs.has(s)).toBe(true);
  });
});

describe("вариант с баней", () => {
  const base = all.find((p) => p.slug === "dom-45")!;

  it("неопубликованный вариант не собирается", () => {
    expect(asBanyaVariant(base)).toBeNull();
  });

  it("берёт свои планировку и цены, фото — от основного проекта, если своих нет", () => {
    const v = asBanyaVariant({
      ...base,
      banyaVariant: { ...base.banyaVariant!, published: true, area: 66, priceFrom: 3_000_000, photos: [] },
    })!;
    expect(v.title).toBe("Модульный дом 45 м² с баней");
    expect(v.params.area).toBe(66);
    expect(v.priceFrom).toBe(3_000_000);
    expect(v.plans).toEqual([]);
    expect(v.photos).toEqual(base.photos);
    expect(projectHref(base, true)).toBe("/proekty/dom-45/s-banei");
  });

  it("вариант 60 м² с баней опубликован: свои фото, площадь — от основного проекта", () => {
    const v = asBanyaVariant(all.find((p) => p.slug === "dom-60")!)!;
    expect(v).not.toBeNull();
    expect(v.params.area).toBe(60);
    expect(v.photos[0].src).toContain("/real/");
  });
});
