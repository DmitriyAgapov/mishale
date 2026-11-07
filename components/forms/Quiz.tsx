"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { LeadForm } from "@/components/forms/LeadForm";
import { cn } from "@/lib/cn";
import { reachGoal } from "@/lib/metrika";

// Квиз «Рассчитайте свой дом за 1 минуту» (ТЗ §7.1, 02 §4.2): 4 вопроса, затем контакт.
// Ответы уходят в заявку — менеджер звонит уже подготовленным.
const questions = [
  {
    q: "Для чего нужен дом?",
    a: ["Дача на выходные", "Постоянное жильё", "Гостевой дом", "Для сдачи посуточно", "Баня"],
  },
  { q: "Какая площадь нужна?", a: ["До 35 м²", "45–60 м²", "75–90 м²", "105–120 м²", "Пока не знаю"] },
  {
    q: "Есть ли участок?",
    a: ["Есть, со светом и водой", "Есть, без коммуникаций", "Пока выбираю участок"],
  },
  {
    q: "Когда планируете строить?",
    a: ["В ближайший месяц", "В течение 3 месяцев", "Весной", "Пока присматриваюсь"],
  },
] as const;

export function Quiz({ phone }: { phone: { display: string; href: string } }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = step >= questions.length;
  const current = questions[step];

  const choose = (answer: string) => {
    if (step === 0) reachGoal("quiz_start");
    reachGoal("quiz_step", { step: step + 1 });
    setAnswers((prev) => ({ ...prev, [current.q]: answer }));
    setStep(step + 1);
  };

  return (
    <div className="rounded-card bg-surface shadow-card p-5 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-ink-muted font-semibold">
          {done ? "Последний шаг" : `Вопрос ${step + 1} из ${questions.length}`}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="hover:text-brand flex min-h-11 items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Назад
          </button>
        )}
      </div>
      <div
        className="bg-brand-soft mt-3 h-2 overflow-hidden rounded-full"
        role="progressbar"
        aria-label="Прогресс квиза"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={Math.min(step, questions.length)}
      >
        <div
          className="bg-brand h-full transition-[width]"
          style={{ width: `${(Math.min(step, questions.length) / questions.length) * 100}%` }}
        />
      </div>

      {!done ? (
        <fieldset className="mt-6" key={step}>
          <legend className="text-h3 font-extrabold">{current.q}</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {current.a.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => choose(a)}
                className={cn(
                  "rounded-control border-line hover:border-brand hover:bg-brand-soft min-h-13 border px-4 py-3 text-left font-semibold",
                  answers[current.q] === a && "border-brand bg-brand-soft",
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <div className="mt-6">
          <p className="text-h3 font-extrabold">Куда прислать расчёт?</p>
          <p className="text-ink-muted mt-1">
            Подберём проекты под ваши ответы и посчитаем стоимость под ключ.
          </p>
          <ul className="text-ink-muted mt-4 text-sm">
            {Object.entries(answers).map(([q, a]) => (
              <li key={q}>
                {q} — <span className="text-ink font-semibold">{a}</span>
              </li>
            ))}
          </ul>
          <LeadForm
            form="quiz"
            answers={answers}
            phone={phone}
            submitLabel="Получить расчёт"
            className="mt-4 p-0 shadow-none md:p-0"
          />
        </div>
      )}
    </div>
  );
}
