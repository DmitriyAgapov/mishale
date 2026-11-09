import { z } from "zod";
import { site } from "./site";

// Демо-режим: только для тестового адреса, чтобы компания видела, каких данных не хватает и зачем они.
// Примеры лежат отдельно от настоящих данных — в content/demo/ — и накладываются при сборке,
// только если задана переменная DEMO_CONTENT=1 (Vercel передаёт переменные на сборку, Amvera — нет,
// поэтому на рабочем сайте демо выключено). Админка Keystatic эти файлы не видит и не перезаписывает.
// Пример подставляется, только пока настоящее поле пустое: как только компания пришлёт данные,
// пометка на сайте исчезает сама.

export const demoMode = process.env.DEMO_CONTENT === "1";

// Защита: выдуманные цены и реквизиты не должны попасть на сайт, открытый для поиска
if (demoMode && site.indexable) {
  throw new Error("DEMO_CONTENT=1 нельзя включать на сайте с индексацией (site.indexable = true)");
}

export const demoNoteSchema = z.object({
  // Что нужно от компании
  need: z.string().min(1),
  // Зачем это на сайте: что теряем без этих данных
  why: z.string().min(1),
  // Где этот вопрос в списке вопросов к компании, например «раздел 3»
  ask: z.string().optional(),
});
export type DemoNote = z.output<typeof demoNoteSchema>;
export const demoNotesSchema = z.record(z.string(), demoNoteSchema).default({});
export type DemoNotes = Record<string, DemoNote>;

// Слой примеров: fill — только в пустые поля, append — дописать к спискам, override — заменить
// (для заготовок с заведомо неверными значениями), notes — пояснение по каждому полю.
export type DemoLayer = {
  fill?: Record<string, unknown>;
  append?: Record<string, unknown[]>;
  override?: Record<string, unknown>;
  notes?: DemoNotes;
  [nested: string]: unknown;
};

const isEmpty = (v: unknown) => v === undefined || v === null || (Array.isArray(v) && v.length === 0);

// Накладывает слой на объект (уже приведённый normalize.ts) и записывает в target.demo
// пояснения только к тем полям, которые действительно заменены примером.
export function applyDemoLayer(target: Record<string, unknown>, layer: DemoLayer | undefined): void {
  if (!layer) return;
  const used: DemoNotes = { ...((target.demo as DemoNotes) ?? {}) };
  const note = (key: string) => {
    const n = layer.notes?.[key];
    if (n) used[key] = n;
  };
  for (const [key, value] of Object.entries(layer.fill ?? {})) {
    if (isEmpty(target[key])) {
      target[key] = structuredClone(value);
      note(key);
    }
  }
  for (const [key, value] of Object.entries(layer.append ?? {})) {
    // Пустой список в слое проекта отменяет общий (у проекта уже есть настоящие фото)
    if (!value.length) continue;
    const current = Array.isArray(target[key]) ? (target[key] as unknown[]) : [];
    target[key] = [...current, ...structuredClone(value)];
    note(key);
  }
  for (const [key, value] of Object.entries(layer.override ?? {})) {
    target[key] = structuredClone(value);
    note(key);
  }
  if (Object.keys(used).length) target.demo = used;
}

// Слои складываются: общий для всех проектов + слой проекта (свои поля проекта важнее)
export function mergeLayers(a: DemoLayer | undefined, b: DemoLayer | undefined): DemoLayer | undefined {
  if (!a) return b;
  if (!b) return a;
  return {
    ...a,
    ...b,
    fill: { ...a.fill, ...b.fill },
    append: { ...a.append, ...b.append },
    override: { ...a.override, ...b.override },
    notes: { ...a.notes, ...b.notes },
  };
}

// Блок, которого на сайте пока нет совсем (кейсы, сезонное предложение и т. п.)
export const demoSlotSchema = z.object({
  title: z.string(),
  // Где на сайте появится блок — для страницы «Чего не хватает»
  where: z.string(),
  need: z.string(),
  why: z.string(),
  ask: z.string().optional(),
});
export type DemoSlot = z.output<typeof demoSlotSchema>;
