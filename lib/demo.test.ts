import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { asBanyaVariant, parseProject, parseSettings } from "./content/index";
import { withTierPackages } from "./content/prices";
import { applyDemoLayer, demoSlotSchema, mergeLayers, type DemoLayer } from "./demo";

const root = path.join(process.cwd(), "content");
const read = (...p: string[]) => JSON.parse(readFileSync(path.join(root, ...p), "utf8"));
const common = read("demo", "common.json") as {
  projects: DemoLayer;
  settings: DemoLayer;
  slots: Record<string, unknown>;
};
const note = { need: "Цены", why: "Без цены уходят" };

describe("слой примеров", () => {
  it("заполняет только пустые поля и помечает только их", () => {
    const target: Record<string, unknown> = { packages: [], specs: [{ name: "Стены", value: "150 мм" }] };
    applyDemoLayer(target, {
      fill: { packages: [{ name: "Пример" }], specs: [{ name: "Пример", value: "—" }] },
      notes: { packages: note, specs: note },
    });
    expect(target.packages).toEqual([{ name: "Пример" }]);
    expect(target.specs).toEqual([{ name: "Стены", value: "150 мм" }]);
    expect(Object.keys(target.demo as object)).toEqual(["packages"]);
  });

  it("дописывает к спискам и заменяет заготовки", () => {
    const target: Record<string, unknown> = { photos: [{ src: "/a.jpg" }], published: false };
    applyDemoLayer(target, {
      append: { photos: [{ src: "/b.jpg" }] },
      override: { published: true },
    });
    expect(target.photos).toEqual([{ src: "/a.jpg" }, { src: "/b.jpg" }]);
    expect(target.published).toBe(true);
    expect(target.demo).toBeUndefined();
  });

  it("слой проекта важнее общего", () => {
    const merged = mergeLayers({ fill: { a: 1, b: 1 } }, { fill: { b: 2 } });
    expect(merged?.fill).toEqual({ a: 1, b: 2 });
  });
});

describe("файлы примеров", () => {
  const files = readdirSync(path.join(root, "projects")).filter((f) => f.endsWith(".json"));
  const settingsPromise = parseSettings(read("settings.json"), common.settings);
  let settings: Awaited<typeof settingsPromise>;
  beforeAll(async () => {
    settings = await settingsPromise;
  });

  it("с примерами каждый проект проходит схему, бани и варианты с баней публикуются", async () => {
    for (const f of files) {
      const slug = f.replace(".json", "");
      const own = (() => {
        try {
          return read("demo", "projects", f) as DemoLayer;
        } catch {
          return undefined;
        }
      })();
      const p = withTierPackages(
        await parseProject(read("projects", f), f, undefined, mergeLayers(common.projects, own)),
        settings,
      );
      expect(p.published, slug).toBe(true);
      expect(p.packages.length, slug).toBeGreaterThan(0);
      // Цены домов — настоящие (ставки за м²), примеры — только у бань
      if (p.category === "banya") expect(p.demo.packages, slug).toBeDefined();
      else expect(p.demo.packages, slug).toBeUndefined();
      if (p.category === "medium" || p.category === "large") {
        const v = asBanyaVariant(p);
        expect(v, slug).not.toBeNull();
        expect(v!.plans.length, slug).toBeGreaterThan(0);
      }
    }
  });

  it("без примеров заготовки остаются скрытыми", async () => {
    const p = await parseProject(read("projects", "banya-1.json"), "banya-1.json");
    expect(p.published).toBe(false);
    expect(p.demo).toEqual({});
  });

  it("настройки с примерами проходят схему, заглушки блоков заполнены", async () => {
    const s = await parseSettings(read("settings.json"), common.settings);
    // Реквизиты настоящие (карточка предприятия от 12.11.2026) — пример не подставляется
    expect(s.legal?.name).toBe("ООО «МИШАЛЕ»");
    expect(s.demo.legal).toBeUndefined();
    // Блоки, закрытые примерами: предложение, для бизнеса, рассрочка, производство, как доехать
    for (const k of ["offer", "business", "financing", "productionDetails", "directions"])
      expect(s.demo[k], k).toBeDefined();
    // Построенные дома, фото цеха и доставки — настоящие (от компании): примеры не подставляются
    for (const k of ["cases", "productionPhotos", "deliveryPhotos"]) expect(s.demo[k], k).toBeUndefined();
    expect(s.cases[0].photos[0].width).toBeGreaterThan(0);
    for (const slot of Object.values(common.slots)) expect(() => demoSlotSchema.parse(slot)).not.toThrow();
  });
});
