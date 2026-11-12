import { z } from "zod";
import { demoNotesSchema } from "@/lib/demo";

// Схемы данных сайта (ТЗ §5). Битый JSON роняет сборку, а не сайт.
// Файлы пишет админка Keystatic (keystatic.config.ts); перед проверкой их приводит к этой форме normalize.ts:
// пустые значения превращаются в «нет значения», поэтому у необязательных полей есть значения по умолчанию.

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

const price = z.number().int().positive().nullable().default(null);

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
  .object({ title: z.string().nullable().default(null), description: z.string().nullable().default(null) })
  .default({ title: null, description: null });

// Вариант дома «с баней внутри» — своя страница /proekty/<slug>/s-banei.
// Пустые списки не берутся из основного проекта: у варианта своя планировка и цены.
const banyaVariantSchema = z.object({
  published: z.boolean(),
  title: z.string().min(1),
  summary: z.string().optional(),
  area: z.number().positive().nullable().default(null),
  priceFrom: price,
  photos: z.array(image).default([]),
  plans: z.array(planImage).default([]),
  packages: z.array(packageSchema).default([]),
  options: z.array(z.object({ name: z.string(), price })).default([]),
  specs: z.array(z.object({ name: z.string(), value: z.string() })).default([]),
  seo: seoSchema,
  // Пояснения к полям, заполненным примерами (только в демо-режиме, lib/demo.ts)
  demo: demoNotesSchema,
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
    moduleSize: z.string().nullable().default(null),
    ceiling: z.number().positive().nullable().default(null),
    productionWeeks: z.string().nullable().default(null),
  }),
  // Цена «от» — минимальная цена комплектаций; если комплектаций нет — отдельное поле
  priceFrom: price,
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
    .object({
      available: z.boolean().default(false),
      deliveryWeeks: z.number().nullable().default(null),
      salePrice: price,
    })
    .default({ available: false, deliveryWeeks: null, salePrice: null }),
  specs: z.array(z.object({ name: z.string(), value: z.string() })).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  similar: z.array(z.string()).default([]),
  seo: seoSchema,
  banyaVariant: banyaVariantSchema.nullable().default(null),
  demo: demoNotesSchema,
});
export type Project = z.output<typeof projectSchema>;

export const settingsSchema = z.object({
  phone: z.object({ display: z.string(), href: z.string().startsWith("tel:") }),
  email: z.string().email().nullable().default(null),
  whatsapp: z.string().url().nullable().default(null),
  telegram: z.string().url().nullable().default(null),
  vk: z.string().url().nullable().default(null),
  avito: z.string().url().nullable().default(null),
  address: z.object({ text: z.string(), lat: z.number(), lng: z.number() }).nullable().default(null),
  workHours: z.string().nullable().default(null),
  // Реквизиты оператора ПДн; address — юридический адрес (карточка предприятия от 12.11.2026)
  legal: z
    .object({ name: z.string(), inn: z.string(), ogrn: z.string(), address: z.string().optional() })
    .nullable()
    .default(null),
  trust: z.array(z.object({ value: z.string(), label: z.string() })),
  // Пусто — считается сама: минимальная цена опубликованных домов
  priceFromAll: z.number().int().positive().nullable().default(null),
  // Комплектации по ставке за м² для всех домов (lib/content/prices.ts)
  priceTiers: z
    .array(
      z.object({
        name: z.string(),
        pricePerM2: z.number().int().positive(),
        items: z.array(z.string()).default([]),
        priceDate: z.string().optional(),
      }),
    )
    .default([]),
  terracePricePerM2: price,
  warrantyYears: z.number().int().positive(),
  // Что покрывает гарантия — блок «Гарантия» на главной и в «Производстве»
  warrantyItems: z.array(z.string()).default([]),
  productionWeeks: z.string(),
  // Общий состав конструкции — показывается на страницах проектов, пока у проекта нет своих характеристик
  construction: z.array(z.object({ title: z.string(), items: z.array(z.string()) })),
  steps: z.array(z.object({ title: z.string(), text: z.string() })),
  delivery: z.array(z.string()),
  projectFaq: z.array(z.object({ q: z.string(), a: z.string() })),
  // Вопросы на главной и в «Производстве»: общие + вопросы по проекту
  generalFaq: z.array(z.object({ q: z.string(), a: z.string() })),
  // «Цех против стройки на участке» (02 §6.2) — только подтверждённые строки
  workshopVsSite: z.array(z.object({ topic: z.string(), workshop: z.string(), site: z.string() })),
  // Экскурсия в цех: блок и форма показываются, только когда компания подтвердит формат
  excursion: z
    .object({
      schedule: z.string(),
      online: z.boolean().default(false),
      gift: z.string().nullable().default(null),
    })
    .nullable()
    .default(null),
  // Как доехать до цеха — под картой на странице контактов
  directions: z.string().nullable().default(null),
  // Сезонное предложение — главная и страницы проектов
  offer: z
    .object({ title: z.string(), text: z.string(), until: z.string().nullable().default(null) })
    .nullable()
    .default(null),
  // Построенные дома и отзывы. project + withBanya — к какому проекту относится дом:
  // на странице проекта (или его варианта с баней) показываются только его дома
  cases: z
    .array(
      z.object({
        title: z.string(),
        city: z.string(),
        date: z.string(),
        text: z.string(),
        project: z.string().nullable().default(null),
        withBanya: z.boolean().default(false),
        review: z.string().nullable().default(null),
        author: z.string().nullable().default(null),
        photos: z.array(image).default([]),
      }),
    )
    .default([]),
  // Главное фото первого экрана; пусто — фото проекта 45 м²
  heroPhoto: image.nullable().default(null),
  // Фото цеха — «Производство»
  productionPhotos: z.array(image).default([]),
  // Фото доставки и монтажа — блок «Доставка и монтаж»
  deliveryPhotos: z.array(image).default([]),
  // Для бизнеса: глэмпинги, базы отдыха, предприятия
  business: z
    .object({ text: z.string(), items: z.array(z.string()).default([]) })
    .nullable()
    .default(null),
  // Ипотека и рассрочка — страницы проектов
  financing: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
  // «Производство» подробно: материалы, контроль качества, команда
  productionDetails: z.array(z.object({ title: z.string(), items: z.array(z.string()) })).default([]),
  demo: demoNotesSchema,
});
export type Settings = z.output<typeof settingsSchema>;
export type Case = Settings["cases"][number];
