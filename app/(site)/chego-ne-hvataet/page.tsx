import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DEMO_PAGE } from "@/components/demo/Demo";
import { Section } from "@/components/ui/Section";
import { asBanyaVariant, getDemoSlots, getProjects, getSettings, projectHref } from "@/lib/content";
import { demoMode, type DemoNote } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Чего не хватает для запуска",
  robots: { index: false, follow: false },
};

type Row = DemoNote & { title?: string; where: Array<{ label: string; href?: string }> };

// Сводка для компании: все примеры и скрытые блоки тестового сайта (lib/demo.ts).
// Только в демо-режиме; на рабочем сайте адрес отдаёт 404 (proxy.ts).
export default async function MissingPage() {
  if (!demoMode) notFound();
  const [projects, settings, slots] = await Promise.all([getProjects(), getSettings(), getDemoSlots()]);

  // Одинаковые пояснения у разных проектов собираем в одну строку со списком страниц
  const rows = new Map<string, Row>();
  const add = (note: DemoNote, where: { label: string; href?: string }, title?: string) => {
    const row = rows.get(note.need) ?? { ...note, title, where: [] };
    if (!row.where.some((w) => w.label === where.label)) row.where.push(where);
    rows.set(note.need, row);
  };
  for (const [, slot] of Object.entries(slots)) {
    add(slot, { label: slot.where }, slot.title);
  }
  for (const note of Object.values(settings.demo)) add(note, { label: "Общие данные сайта" });
  for (const p of projects) {
    for (const note of Object.values(p.demo)) add(note, { label: p.title, href: projectHref(p) });
    const v = asBanyaVariant(p);
    if (v)
      for (const note of Object.values(p.banyaVariant?.demo ?? {}))
        add(note, { label: v.title, href: projectHref(p, true) });
  }
  const list = [...rows.values()].sort((a, b) =>
    (a.ask ?? "").localeCompare(b.ask ?? "", "ru", { numeric: true }),
  );

  return (
    <>
      <Breadcrumbs items={[{ href: DEMO_PAGE, label: "Чего не хватает" }]} />
      <Section className="pt-6 md:pt-8">
        <h1 className="text-h1 font-extrabold md:text-5xl">Чего не хватает для запуска</h1>
        <p className="text-ink-muted mt-4 max-w-3xl text-lg">
          На тестовом сайте вместо недостающих данных стоят примеры — они отмечены жёлтым. Ниже — что нужно от
          компании, зачем это на сайте и где оно появится. Номер раздела — из списка вопросов к компании. Как
          только данные приходят, пример заменяется настоящими данными, а пометка исчезает.
        </p>
        <p className="mt-4 font-semibold">Всего пунктов: {list.length}</p>
        <ol className="mt-8 flex flex-col gap-4">
          {list.map((r, i) => (
            <li key={r.need} className="rounded-card bg-surface shadow-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-h3 font-extrabold">
                  {i + 1}. {r.title ?? r.need}
                </h2>
                {r.ask && <span className="text-ink-muted text-sm">Вопросы к компании, {r.ask}</span>}
              </div>
              {r.title && (
                <p className="mt-2">
                  <span className="font-semibold">Нужно:</span> {r.need}
                </p>
              )}
              <p className="mt-2">
                <span className="font-semibold">Зачем:</span> {r.why}
              </p>
              <p className="text-ink-muted mt-2 text-sm">
                Где на сайте:{" "}
                {r.where.map((w, j) => (
                  <span key={w.label}>
                    {j > 0 && ", "}
                    {w.href ? (
                      <Link href={w.href} className="hover:text-brand underline underline-offset-2">
                        {w.label}
                      </Link>
                    ) : (
                      w.label
                    )}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
