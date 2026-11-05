import { z } from "zod";

// Схемы данных сайта (ТЗ §5). Битый JSON роняет сборку, а не сайт.

const image = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: z.string().optional(),
  // Визуализация, а не фото готового дома — подписывается на сайте
  render: z.boolean().default(false),
});
export type SiteImage = z.output<typeof image>;

export const purposes = ["dacha", "permanent", "guest", "rent"] as const;
export const purposeTitles: Record<(typeof purposes)[number], string> = {
  dacha: "Дача",
  permanent: "Для постоянного жилья",
  guest: "Гостевой дом",
  rent: "Для сдачи",
};

const price = z.number().int().positive().nullable();

// Линейка: 2 малых дома (2 модуля), 4 средних, 2 больших, 2 бани
export const categories = ["small", "medium", "large", "banya"] as const;
export type Category = (typeof categories)[number];
export const categoryTitles: Record<Category, string> = {
  small: "Небольшие дома — 2 модуля",
  medium: "Средние дома",
  large: "Большие дома",
  banya: "Бани",
};

const planImage = image.extend({
  rooms: z.array(z.object({ name: z.string(), area: z.number() })).default([]),
});
const packageSchema = z.object({
  name: z.string(),
  price,
  items: z.array(z.string()).min(1),
  priceDate: z.string().optional(),
});
const seoSchema = z
  .object({ title: z.string().nullable(), description: z.string().nullable() })
  .default({ title: null, description: null });

// Вариант дома «с баней внутри» — своя страница /proekty/<slug>/s-banei.
// Пустые списки не берутся из основного проекта: у варианта своя планировка и цены.
const banyaVariantSchema = z.object({
  published: z.boolean(),
  title: z.string().min(1),
  summary: z.string().optional(),
  area: z.number().positive().nullable().default(null),
  priceFrom: price.default(null),
  photos: z.array(image).default([]),
  plans: z.array(planImage).default([]),
  packages: z.array(packageSchema).default([]),
  options: z.array(z.object({ name: z.string(), price })).default([]),
  specs: z.array(z.object({ name: z.string(), value: z.string() })).default([]),
  seo: seoSchema,
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  published: z.boolean(),
  order: z.number().int(),
  category: z.enum(categories),
  params: z.object({
    area: z.number().positive(),
    modules: z.number().int().positive(),
    moduleSize: z.string(),
    ceiling: z.number().positive().nullable().default(null),
    productionWeeks: z.string().nullable().default(null),
  }),
  // Цена «от» — минимальная цена комплектаций; если комплектаций нет — отдельное поле
  priceFrom: price.default(null),
  purposes: z.array(z.enum(purposes)).default([]),
  summary: z.string().optional(),
  photos: z.array(image).default([]),
  plans: z.array(planImage).default([]),
  packages: z.array(packageSchema).default([]),
  included: z.array(z.string()).default([]),
  extra: z.array(z.string()).default([]),
  suitableFor: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
  options: z.array(z.object({ name: z.string(), price })).default([]),
  calcExample: z
    .object({
      city: z.string(),
      date: z.string(),
      rows: z.array(z.object({ name: z.string(), sum: z.number().int() })).min(1),
      total: z.number().int(),
    })
    .nullable()
    .default(null),
  stock: z
    .object({ available: z.boolean(), deliveryWeeks: z.number().nullable(), salePrice: price })
    .default({ available: false, deliveryWeeks: null, salePrice: null }),
  specs: z.array(z.object({ name: z.string(), value: z.string() })).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  similar: z.array(z.string()).default([]),
  seo: seoSchema,
  banyaVariant: banyaVariantSchema.nullable().default(null),
});
export type Project = z.output<typeof projectSchema>;

export const settingsSchema = z.object({
  phone: z.object({ display: z.string(), href: z.string().startsWith("tel:") }),
  email: z.string().email().nullable(),
  whatsapp: z.string().url().nullable(),
  telegram: z.string().url().nullable(),
  vk: z.string().url().nullable(),
  avito: z.string().url().nullable(),
  address: z.object({ text: z.string(), lat: z.number(), lng: z.number() }).nullable(),
  workHours: z.string().nullable(),
  legal: z.object({ name: z.string(), inn: z.string(), ogrn: z.string() }).nullable(),
  trust: z.array(z.object({ value: z.string(), label: z.string() })),
  priceFromAll: z.number().int().positive().nullable(),
  warrantyYears: z.number().int().positive(),
  productionWeeks: z.string(),
  // Общий состав конструкции — показывается на страницах проектов, пока у проекта нет своих характеристик
  construction: z.array(z.object({ title: z.string(), items: z.array(z.string()) })),
  steps: z.array(z.object({ title: z.string(), text: z.string() })),
  delivery: z.array(z.string()),
  projectFaq: z.array(z.object({ q: z.string(), a: z.string() })),
});
export type Settings = z.output<typeof settingsSchema>;
