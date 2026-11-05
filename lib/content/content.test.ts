import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { asBanyaVariant, projectHref } from "./index";
import { projectSchema, type Project } from "./schemas";

const dir = path.join(process.cwd(), "content", "projects");
const all: Project[] = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => projectSchema.parse(JSON.parse(readFileSync(path.join(dir, f), "utf8"))));

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
  const base = all.find((p) => p.slug === "dom-60")!;

  it("неопубликованный вариант не собирается", () => {
    expect(asBanyaVariant(base)).toBeNull();
  });

  it("берёт свои планировку и цены, фото — от основного проекта, если своих нет", () => {
    const v = asBanyaVariant({
      ...base,
      banyaVariant: { ...base.banyaVariant!, published: true, area: 66, priceFrom: 3_000_000 },
    })!;
    expect(v.title).toBe("Модульный дом 60 м² с баней");
    expect(v.params.area).toBe(66);
    expect(v.priceFrom).toBe(3_000_000);
    expect(v.plans).toEqual([]);
    expect(v.photos).toEqual(base.photos);
    expect(projectHref(base, true)).toBe("/proekty/dom-60/s-banei");
  });
});
