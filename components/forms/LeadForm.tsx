"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { maskPhone } from "@/lib/format";
import { getClientId, reachGoal, type Goal } from "@/lib/metrika";
import { readUtm } from "@/lib/utm";
import type { LeadFormType } from "@/lib/leads/schema";

const clientSchema = z.object({
  name: z.string().trim().min(1, "Как к вам обращаться?").max(100),
  phone: z.string().refine((v) => v.replace(/\D/g, "").length === 11, "Введите номер полностью"),
  messenger: z.enum(["phone", "whatsapp", "telegram", "max"]),
  package: z.string().optional(),
  options: z.array(z.string()).optional(),
  comment: z.string().max(2000).optional(),
  consent: z.boolean().refine((v) => v, "Нужно ваше согласие"),
  website: z.string().optional(),
});
type Values = z.infer<typeof clientSchema>;

const goals: Record<LeadFormType, Goal> = {
  contact: "lead_submit",
  project: "lead_submit_project",
  quiz: "lead_submit_quiz",
  catalog: "lead_submit_catalog",
  excursion: "lead_submit_excursion",
  business: "lead_submit",
};

type Props = {
  form: LeadFormType;
  project?: string;
  packages?: string[];
  options?: string[];
  // Ответы квиза — уходят в заявку как «вопрос: ответ»
  answers?: Record<string, string>;
  submitLabel?: string;
  phone: { display: string; href: string };
  className?: string;
};

type Status = { kind: "idle" } | { kind: "success" } | { kind: "error"; message: string };

export function LeadForm({
  form,
  project,
  packages = [],
  options = [],
  answers,
  submitLabel = "Получить расчёт",
  phone,
  className,
}: Props) {
  const id = useId();
  const startedAt = useRef(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      phone: "",
      messenger: "phone",
      options: [],
      comment: "",
      consent: false,
      website: "",
    },
  });

  const onSubmit = async (v: Values) => {
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          name: v.name,
          phone: v.phone,
          messenger: v.messenger,
          project,
          package: v.package || undefined,
          options: v.options?.length ? v.options : undefined,
          answers,
          comment: v.comment || undefined,
          consent: v.consent,
          website: v.website,
          startedAt: startedAt.current || Date.now() - 60_000,
          page: window.location.pathname,
          utm: readUtm(),
          clientId: await getClientId(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        reachGoal(goals[form], project ? { project } : undefined);
        setStatus({ kind: "success" });
      } else {
        reachGoal("lead_error");
        setStatus({ kind: "error", message: data.error ?? "Не получилось отправить заявку." });
      }
    } catch {
      reachGoal("lead_error");
      setStatus({ kind: "error", message: "Нет связи с сервером." });
    }
  };

  if (status.kind === "success") {
    return (
      <div role="status" className={cn("rounded-card bg-surface shadow-card p-6", className)}>
        <CheckCircle2 className="text-success size-10" aria-hidden />
        <p className="text-h3 mt-3 font-extrabold">Заявка отправлена</p>
        <p className="text-ink-muted mt-2">
          Перезвоним в рабочее время. Если срочно — звоните: {phone.display}.
        </p>
      </div>
    );
  }

  const field =
    "mt-1 block w-full rounded-control border border-line bg-surface px-4 py-3 text-base outline-none focus:border-brand";
  const err = "mt-1 text-sm text-danger";

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      noValidate
      className={cn("rounded-card bg-surface shadow-card flex flex-col gap-4 p-5 md:p-6", className)}
    >
      {/* Поле-ловушка для ботов: людям не видно */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Сайт
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="font-semibold">
          Имя
        </label>
        <input
          id={`${id}-name`}
          autoComplete="name"
          className={field}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <p className={err}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className="font-semibold">
          Телефон
        </label>
        <input
          id={`${id}-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          className={field}
          aria-invalid={!!errors.phone}
          {...register("phone", {
            onChange: (e) => setValue("phone", maskPhone(e.target.value)),
          })}
        />
        {errors.phone && <p className={err}>{errors.phone.message}</p>}
      </div>

      <fieldset>
        <legend className="font-semibold">Как удобнее связаться</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["phone", "Звонок"],
              ["whatsapp", "WhatsApp"],
              ["telegram", "Telegram"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="cursor-pointer">
              <input type="radio" value={value} className="peer sr-only" {...register("messenger")} />
              <span className="rounded-control border-line peer-checked:border-brand peer-checked:bg-brand-soft peer-focus-visible:outline-brand inline-flex min-h-11 items-center border px-4 peer-focus-visible:outline-3">
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {packages.length > 0 && (
        <div>
          <label htmlFor={`${id}-package`} className="font-semibold">
            Комплектация
          </label>
          <select id={`${id}-package`} className={field} {...register("package")}>
            <option value="">Пока не выбрал(а)</option>
            {packages.map((p) => (
              <option key={p}>{p}</option>
            ))}
            <option>Своя комплектация</option>
          </select>
        </div>
      )}

      {options.length > 0 && (
        <fieldset>
          <legend className="font-semibold">Опции</legend>
          <div className="mt-2 flex flex-col gap-2">
            {options.map((o) => (
              <label key={o} className="flex items-center gap-3">
                <input type="checkbox" value={o} className="accent-brand size-5" {...register("options")} />
                {o}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor={`${id}-comment`} className="font-semibold">
          Комментарий <span className="text-ink-muted font-normal">— необязательно</span>
        </label>
        <textarea id={`${id}-comment`} rows={3} className={field} {...register("comment")} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="accent-brand mt-0.5 size-5 shrink-0" {...register("consent")} />
          <span>
            Даю{" "}
            <Link href="/soglasie" className="text-brand underline" target="_blank">
              согласие на обработку персональных данных
            </Link>{" "}
            и принимаю{" "}
            <Link href="/politika" className="text-brand underline" target="_blank">
              политику
            </Link>
          </span>
        </label>
        {errors.consent && <p className={err}>{errors.consent.message}</p>}
      </div>

      {status.kind === "error" && (
        <p role="alert" className="rounded-control bg-danger/10 text-danger p-3">
          {status.message}{" "}
          <a href={phone.href} className="font-semibold underline">
            Позвонить: {phone.display}
          </a>
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className={button({ size: "lg", full: true })}>
        {isSubmitting && <Loader2 className="size-5 animate-spin" aria-hidden />}
        {isSubmitting ? "Отправляем…" : submitLabel}
      </button>
    </form>
  );
}
