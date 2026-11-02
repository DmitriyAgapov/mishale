import { z } from "zod";

// Виды форм на сайте (ТЗ §9)
export const leadForms = ["contact", "project", "quiz", "catalog", "excursion", "business"] as const;
export type LeadFormType = (typeof leadForms)[number];

export const formTitles: Record<LeadFormType, string> = {
  contact: "Заявка",
  project: "Заявка по проекту",
  quiz: "Квиз",
  catalog: "Каталог PDF",
  excursion: "Экскурсия в цех",
  business: "Заявка от бизнеса",
};

export const messengers = ["phone", "whatsapp", "telegram", "max"] as const;

const utmSchema = z
  .object({
    source: z.string().max(200).optional(),
    medium: z.string().max(200).optional(),
    campaign: z.string().max(200).optional(),
    content: z.string().max(200).optional(),
    term: z.string().max(200).optional(),
  })
  .partial()
  .default({});

// Российский мобильный или городской номер: 10 цифр после кода страны
const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .transform((d) => (d.length === 11 && (d.startsWith("7") || d.startsWith("8")) ? d.slice(1) : d))
  .refine((d) => d.length === 10, { message: "Введите номер телефона полностью" })
  .transform((d) => `+7${d}`);

export const leadInputSchema = z.object({
  form: z.enum(leadForms),
  name: z.string().trim().min(1, "Как к вам обращаться?").max(100),
  phone: phoneSchema,
  messenger: z.enum(messengers).default("phone"),
  comment: z.string().trim().max(2000).optional(),
  // Контекст заявки
  project: z.string().max(100).optional(),
  package: z.string().max(100).optional(),
  options: z.array(z.string().max(100)).max(30).optional(),
  answers: z.record(z.string().max(100), z.string().max(500)).optional(),
  company: z.string().trim().max(200).optional(),
  // Откуда пришёл посетитель
  page: z.string().max(500).optional(),
  utm: utmSchema,
  clientId: z.string().max(100).optional(),
  // 152-ФЗ: без согласия заявку не принимаем
  consent: z.literal(true, { message: "Нужно согласие на обработку персональных данных" }),
  // Защита от спама: поле-ловушка и время начала заполнения. Проверяются в guard.ts,
  // а не схемой — иначе бот по ошибке 422 поймёт, что попался
  website: z.string().max(500).optional(),
  startedAt: z.number().int().positive(),
});

export type LeadInput = z.input<typeof leadInputSchema>;
export type Lead = z.output<typeof leadInputSchema>;

// Источник заявки для учёта: по UTM-меткам
export type LeadSource = "direct" | "seo" | "avito" | "maps" | "social" | "other" | "site";

export function detectSource(utm: Lead["utm"]): LeadSource {
  const s = (utm.source ?? "").toLowerCase();
  const m = (utm.medium ?? "").toLowerCase();
  if (!s) return "site";
  if (s.includes("yandex") && (m.includes("cpc") || m.includes("direct"))) return "direct";
  if (s.includes("avito")) return "avito";
  if (s.includes("2gis") || s.includes("maps")) return "maps";
  if (["vk", "telegram", "tg", "dzen", "rutube"].some((x) => s.includes(x))) return "social";
  if (m.includes("organic")) return "seo";
  return "other";
}

export const sourceTitles: Record<LeadSource, string> = {
  direct: "Яндекс Директ",
  seo: "Поиск",
  avito: "Авито",
  maps: "Карты",
  social: "Соцсети",
  other: "Другое",
  site: "Сайт",
};
