"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { purposes, purposeTitles } from "@/lib/content/schemas";
import { reachGoal } from "@/lib/metrika";

type Purpose = (typeof purposes)[number] | "all";

// Подбор по назначению (02 §4.1, блок 5) и по площади (ТЗ §7.3). Карточки рендерит сервер,
// здесь только атрибуты data-filter и data-area: CSS в globals.css прячет неподходящие карточки и группы.
// Фильтр по цене добавится, когда у проектов будут цены (решение пользователя от 07.11.2026).
export function PurposeFilter({
  areas,
  index,
  children,
}: {
  // Группы по площади: ключ группы и подпись кнопки («до 35 м²»)
  areas?: Array<{ key: string; label: string }>;
  // Назначения и группа каждой карточки — чтобы показать «ничего не нашли»
  index: Array<{ purposes: string[]; group: string }>;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState<Purpose>("all");
  const [area, setArea] = useState("all");
  const options = [["all", "Все"] as const, ...purposes.map((p) => [p, purposeTitles[p]] as const)];
  const found = index.some(
    (c) => (value === "all" || c.purposes.includes(value)) && (area === "all" || c.group === area),
  );
  const chip = (active: boolean) =>
    cn(
      "rounded-control border-line min-h-11 border px-4 font-semibold",
      active ? "bg-brand border-brand text-white" : "bg-surface hover:border-brand",
    );
  return (
    <div data-filter={value} data-area={area}>
      <div className="mb-8 flex flex-col gap-3">
        <div role="group" aria-label="Подбор по назначению" className="flex flex-wrap gap-2">
          {options.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={value === key}
              onClick={() => {
                setValue(key);
                if (key !== "all") reachGoal("filter_purpose", { purpose: key });
              }}
              className={chip(value === key)}
            >
              {label}
            </button>
          ))}
        </div>
        {areas && areas.length > 1 && (
          <div role="group" aria-label="Площадь" className="flex flex-wrap gap-2">
            {[{ key: "all", label: "Любая площадь" }, ...areas].map((a) => (
              <button
                key={a.key}
                type="button"
                aria-pressed={area === a.key}
                onClick={() => {
                  setArea(a.key);
                  if (a.key !== "all") reachGoal("filter_purpose", { area: a.key });
                }}
                className={chip(area === a.key)}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {children}
      {!found && (
        <p className="text-ink-muted text-lg" role="status">
          Под такой запрос готового проекта нет — оставьте заявку, подберём или адаптируем планировку.
        </p>
      )}
    </div>
  );
}
