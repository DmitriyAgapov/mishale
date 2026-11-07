"use client";

import { useRef } from "react";
import { Bath, X } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";
import { button } from "@/components/ui/button";
import { reachGoal } from "@/lib/metrika";

type Phone = { display: string; href: string };

// Окно с формой «Узнать цену» на нативном <dialog>: фокус, Esc и затемнение даёт браузер
function PriceDialog({
  title,
  project,
  phone,
  trigger,
  className,
}: {
  title: string;
  project: string;
  phone: Phone;
  trigger: string;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className={className ?? button({ variant: "secondary" })}
        onClick={() => {
          ref.current?.showModal();
          reachGoal("open_price_form", { project });
        }}
      >
        {trigger}
      </button>
      <dialog
        ref={ref}
        aria-label={title}
        className="rounded-card m-auto w-[min(32rem,calc(100%-2rem))] p-0 backdrop:bg-black/50"
        onClick={(e) => {
          // клик по затемнению закрывает окно
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="bg-surface p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-h3 font-extrabold">{title}</h2>
            <button
              type="button"
              aria-label="Закрыть"
              className="hover:text-brand -m-2 p-2"
              onClick={() => ref.current?.close()}
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>
          <LeadForm form="project" project={project} phone={phone} submitLabel="Узнать цену" />
        </div>
      </dialog>
    </>
  );
}

// Проект, который ещё не опубликован (нет цен и планировок): карточка «Скоро» с формой (ТЗ §0)
export function SoonCard({ title, purposes, phone }: { title: string; purposes: string[]; phone: Phone }) {
  return (
    <div
      data-card
      data-p={purposes.join(" ")}
      className="rounded-card bg-surface shadow-card flex flex-col overflow-hidden"
    >
      <div className="bg-brand-soft text-brand relative flex aspect-[4/3] items-center justify-center">
        <Bath className="size-16" aria-hidden />
        <span className="bg-ink absolute top-3 left-3 rounded-full px-3 py-1 text-sm font-semibold text-white">
          Скоро
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="text-h3 font-extrabold">{title}</h3>
        <p className="text-ink-muted">Готовим страницу проекта. Цену и планировку пришлём по запросу.</p>
        <div className="mt-auto pt-4">
          <PriceDialog
            title={title}
            project={title}
            phone={phone}
            trigger="Узнать цену"
            className={button({ variant: "secondary", full: true })}
          />
        </div>
      </div>
    </div>
  );
}

// На странице среднего или большого дома, пока у варианта с баней нет данных
export function BanyaVariantHint({ project, phone }: { project: { title: string }; phone: Phone }) {
  const title = `${project.title} с баней внутри`;
  return (
    <section className="pb-6">
      <div className="mx-auto w-full max-w-(--container-site) px-4 md:px-6">
        <div className="rounded-card bg-brand-soft flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            <Bath className="text-brand size-8 shrink-0" aria-hidden />
            <div>
              <p className="font-extrabold">Есть вариант с баней внутри</p>
              <p className="text-ink-muted">
                Парная и моечная в самом доме — без отдельной постройки на участке.
              </p>
            </div>
          </div>
          <PriceDialog title={title} project={title} phone={phone} trigger="Узнать цену варианта" />
        </div>
      </div>
    </section>
  );
}
