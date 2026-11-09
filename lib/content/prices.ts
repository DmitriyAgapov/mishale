import type { Project, Settings } from "./schemas";

// Комплектации по ставке за м² (решение от 09.11.2026): цена = площадь дома по модулям × ставка комплектации
// + терраса и крыльцо с планировки × отдельная ставка. Ставки и составы — в настройках (settings.priceTiers),
// поэтому новая цена меняется в одном месте для всех домов.
// Свои комплектации в файле проекта важнее: тогда расчёт не применяется.

type Plans = Project["plans"];

const OUTDOOR = /терраса|крыльцо/i;

// Площадь террас и крылец с первой планировки, у которой есть список помещений
export function outdoorArea(plans: Plans): number | null {
  const plan = plans.find((p) => p.rooms.length);
  if (!plan) return null;
  return plan.rooms.filter((r) => OUTDOOR.test(r.name)).reduce((s, r) => s + r.area, 0);
}

const roundThousand = (n: number) => Math.round(n / 1000) * 1000;
const num = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

export function tierPackages(
  area: number,
  plans: Plans,
  settings: Pick<Settings, "priceTiers" | "terracePricePerM2">,
): Project["packages"] {
  const outdoor = outdoorArea(plans);
  const terraceRate = settings.terracePricePerM2;
  return settings.priceTiers.map((t) => {
    const terraceSum = outdoor && terraceRate ? outdoor * terraceRate : 0;
    const lines = [`Дом ${num(area)} м² × ${rub(t.pricePerM2)}`];
    if (terraceSum) lines.push(`Терраса и крыльцо ${num(outdoor!)} м² × ${rub(terraceRate!)}`);
    // Планировки нет — площадь террасы неизвестна, считаем её отдельно
    else if (outdoor === null && terraceRate) lines.push(`Терраса — ${rub(terraceRate)} за м², по проекту`);
    return {
      name: t.name,
      price: roundThousand(area * t.pricePerM2 + terraceSum),
      items: [...lines, ...t.items],
      ...(t.priceDate ? { priceDate: t.priceDate } : {}),
    };
  });
}

// Подставляет расчётные комплектации домам (и вариантам с баней), у которых своих нет. Бани не трогаем:
// ставки для них компания не давала.
export function withTierPackages(p: Project, settings: Settings): Project {
  if (p.category === "banya" || !settings.priceTiers.length) return p;
  const packages = p.packages.length ? p.packages : tierPackages(p.params.area, p.plans, settings);
  const v = p.banyaVariant;
  const banyaVariant =
    v && !v.packages.length
      ? { ...v, packages: tierPackages(v.area ?? p.params.area, v.plans, settings) }
      : v;
  return { ...p, packages, banyaVariant };
}
