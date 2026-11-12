import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseProject, parseSettings, projectPriceFrom, siteMinPrice } from "./index";
import { outdoorArea, tierPackages, withTierPackages } from "./prices";

const root = path.join(process.cwd(), "content");
const settings = await parseSettings(JSON.parse(readFileSync(path.join(root, "settings.json"), "utf8")));
const projects = await Promise.all(
  readdirSync(path.join(root, "projects"))
    .filter((f) => f.endsWith(".json"))
    .map(async (f) =>
      withTierPackages(
        await parseProject(JSON.parse(readFileSync(path.join(root, "projects", f), "utf8")), f),
        settings,
      ),
    ),
);
// toLocaleString ставит неразрывные пробелы
const plain = (s: string) => s.replace(/\s/g, " ");
const bySlug =(s: string) => projects.find((p) => p.slug === s)!;

const plan = (rooms: Array<[string, number]>) => [
  { src: "/x.png", alt: "x", width: 1, height: 1, render: false, rooms: rooms.map(([name, area]) => ({ name, area })) },
];
const tiers = {
  priceTiers: [
    { name: "Стандарт", pricePerM2: 45000, items: ["Состав"] },
    { name: "Комфорт", pricePerM2: 58000, items: [] },
  ],
  terracePricePerM2: 25000,
};

describe("комплектации по ставке за м²", () => {
  it("терраса и крыльцо берутся с планировки", () => {
    expect(outdoorArea(plan([["Кухня", 20], ["Терраса", 14.5], ["Крыльцо", 3.5]]))).toBe(18);
    expect(outdoorArea([])).toBeNull();
  });

  it("цена = площадь × ставка + терраса × 25 000, округление до тысяч", () => {
    const [st, cf] = tierPackages(45, plan([["Терраса", 18.03]]), tiers);
    expect(st.price).toBe(2_476_000); // 2 025 000 + 450 750
    expect(cf.price).toBe(3_061_000); // 2 610 000 + 450 750
    expect(st.items.map(plain)).toEqual([
      "Дом 45 м² × 45 000 ₽",
      "Терраса и крыльцо 18 м² × 25 000 ₽",
      "Состав",
    ]);
  });

  it("без планировки терраса не считается, но названа отдельно", () => {
    const [st] = tierPackages(35, [], tiers);
    expect(st.price).toBe(1_575_000);
    expect(plain(st.items[1])).toBe("Терраса — 25 000 ₽ за м², по проекту");
  });

  it("у всех опубликованных домов две комплектации: Стандарт и Комфорт", () => {
    for (const p of projects.filter((x) => x.published && x.category !== "banya")) {
      expect(p.packages.map((x) => x.name)).toEqual(["Стандарт", "Комфорт"]);
    }
    expect(bySlug("dom-45").packages.map((x) => x.price)).toEqual([2_476_000, 3_061_000]);
  });

  it("бани не считаются по ставке домов", () => {
    expect(bySlug("banya-1").packages).toEqual([]);
  });

  it("цена «от» на главной — минимальная по домам", () => {
    expect(siteMinPrice({ ...settings, priceFromAll: null }, projects)).toBe(projectPriceFrom(bySlug("dom-20")));
    expect(siteMinPrice({ ...settings, priceFromAll: 777_000 }, projects)).toBe(777_000);
  });
});
