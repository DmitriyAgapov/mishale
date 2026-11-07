"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { purposes, purposeTitles } from "@/lib/content/schemas";
import { reachGoal } from "@/lib/metrika";

// Подбор по назначению (02 §4.1, блок 5). Карточки рендерит сервер,
// здесь только атрибут data-filter: CSS в globals.css прячет неподходящие карточки и пустые группы.
export function PurposeFilter({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<(typeof purposes)[number] | "all">("all");
  const options = [["all", "Все"] as const, ...purposes.map((p) => [p, purposeTitles[p]] as const)];
  return (
    <div data-filter={value}>
      <div role="group" aria-label="Подбор по назначению" className="mb-8 flex flex-wrap gap-2">
        {options.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={value === key}
            onClick={() => {
              setValue(key);
              if (key !== "all") reachGoal("filter_purpose", { purpose: key });
            }}
            className={cn(
              "rounded-control border-line min-h-11 border px-4 font-semibold",
              value === key ? "bg-brand border-brand text-white" : "bg-surface hover:border-brand",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
