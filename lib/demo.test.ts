import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { asBanyaVariant, parseProject, parseSettings } from "./content/index";
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
      const p = await parseProject(read("projects", f), f, undefined, mergeLayers(common.projects, own));
      expect(p.published, slug).toBe(true);
      expect(p.packages.length, slug).toBeGreaterThan(0);
      expect(p.demo.packages, slug).toBeDefined();
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
    expect(s.legal?.name).toContain("Пример");
    expect(s.demo.legal).toBeDefined();
    for (const slot of Object.values(common.slots)) expect(() => demoSlotSchema.parse(slot)).not.toThrow();
  });
});
