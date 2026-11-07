import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { demoMode, type DemoNote, type DemoSlot } from "@/lib/demo";
import { cn } from "@/lib/cn";

// Разметка демо-режима (lib/demo.ts). Без DEMO_CONTENT=1 все компоненты ничего не выводят
// или отдают содержимое как есть — на рабочем сайте их не видно.

export const DEMO_PAGE = "/chego-ne-hvataet";

function NoteText({ note, title }: { note: DemoNote; title?: string }) {
  return (
    <div className="flex gap-3">
      <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div>
        <p className="font-extrabold">
          {title ? `${title}: ` : "Пример — "}нет данных от компании
          {note.ask && <span className="font-normal"> (вопросы к компании, {note.ask})</span>}
        </p>
        <p className="mt-1">
          <span className="font-semibold">Нужно:</span> {note.need}
        </p>
        <p className="mt-1">
          <span className="font-semibold">Зачем:</span> {note.why}
        </p>
      </div>
    </div>
  );
}

// Блок с примерными данными: жёлтая пунктирная рамка и пояснение сверху
export function DemoFrame({
  note,
  children,
  className,
}: {
  note?: DemoNote;
  children: React.ReactNode;
  className?: string;
}) {
  if (!demoMode || !note) return <>{children}</>;
  return (
    <div
      data-demo
      className={cn("outline-demo relative outline-2 -outline-offset-4 outline-dashed", className)}
    >
      <div className="bg-demo-soft text-demo-ink border-demo mx-auto mt-4 w-[calc(100%-2rem)] max-w-(--container-site) rounded-lg border px-4 py-3 text-sm md:text-base">
        <NoteText note={note} />
      </div>
      {children}
    </div>
  );
}

// Короткая плашка рядом со значением-примером (цена в карточке, в первом экране)
export function DemoBadge({ note, label = "пример" }: { note?: DemoNote; label?: string }) {
  if (!demoMode || !note) return null;
  return (
    <span
      title={`Нужно: ${note.need}. Зачем: ${note.why}`}
      className="bg-demo text-demo-on ml-2 inline-block rounded px-1.5 py-0.5 align-middle text-xs font-bold uppercase"
    >
      {label}
    </span>
  );
}

// Блок, которого на сайте пока нет совсем: место на странице и что для него нужно
export function DemoSlotBlock({ slot }: { slot?: DemoSlot }) {
  if (!demoMode || !slot) return null;
  return (
    <Section>
      <div
        data-demo
        className="border-demo bg-demo-soft text-demo-ink rounded-card border-2 border-dashed p-6 md:p-8"
      >
        <p className="text-sm font-bold tracking-wide uppercase">Здесь будет блок</p>
        <h2 className="text-h3 mt-1 font-extrabold md:text-2xl">{slot.title}</h2>
        <div className="mt-4">
          <NoteText note={slot} title="Блок скрыт" />
        </div>
      </div>
    </Section>
  );
}

// Полоса над шапкой на каждой странице тестового сайта
export function DemoBanner() {
  if (!demoMode) return null;
  return (
    <div className="bg-demo text-demo-on px-4 py-2 text-center text-sm font-semibold">
      Тестовая версия сайта. Жёлтым отмечены примеры вместо данных, которых пока нет, — цены и реквизиты
      ненастоящие, заявки не отправляются.{" "}
      <Link href={DEMO_PAGE} className="underline underline-offset-2">
        Список того, чего не хватает
      </Link>
    </div>
  );
}
