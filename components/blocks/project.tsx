import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Minus } from "lucide-react";
import type { FAQPage } from "schema-dts";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { LEAD_ANCHOR } from "@/components/layout/nav";
import { projectPriceFrom } from "@/lib/content";
import type { Project, Settings } from "@/lib/content/schemas";
import { formatArea, formatPrice, keepUnits, pluralModules } from "@/lib/format";

// Блоки страницы проекта (ТЗ §7.4). Блок без данных не выводится.

export function ProjectHero({ project, settings }: { project: Project; settings: Settings }) {
  const photo = project.photos[0];
  const price = projectPriceFrom(project);
  const facts = [
    ["Площадь", formatArea(project.params.area)],
    ["Модули", pluralModules(project.params.modules)],
    ["Размер модуля", project.params.moduleSize],
    ["Производство", `${project.params.productionWeeks ?? settings.productionWeeks} недели`],
  ];
  return (
    <section className="pt-4 pb-10 md:pb-14">
      <div className="mx-auto grid w-full max-w-(--container-site) gap-6 px-4 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10 md:px-6">
        <figure className="rounded-card bg-brand-soft relative overflow-hidden">
          {photo && (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
              className="h-auto w-full"
            />
          )}
          {photo?.render && (
            <figcaption className="bg-ink/70 absolute right-3 bottom-3 rounded-full px-3 py-1 text-xs text-white">
              Визуализация
            </figcaption>
          )}
        </figure>
        <div>
          {project.stock.available && (
            <p className="bg-accent mb-3 inline-block rounded-full px-3 py-1 text-sm font-semibold text-white">
              В наличии
              {project.stock.deliveryWeeks ? `, поставка за ${project.stock.deliveryWeeks} нед.` : ""}
            </p>
          )}
          <h1 className="text-h1 font-extrabold md:text-5xl">{keepUnits(project.title)}</h1>
          {project.summary && <p className="text-ink-muted mt-3 text-lg">{project.summary}</p>}
          <dl className="mt-6 grid grid-cols-2 gap-3">
            {facts.map(([k, v]) => (
              <div key={k} className="rounded-control bg-surface p-3">
                <dt className="text-ink-muted text-sm">{k}</dt>
                <dd className="font-extrabold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-2xl font-extrabold">
            {price ? `от ${formatPrice(price)}` : "Цена — по запросу"}
          </p>
          {!price && <p className="text-ink-muted">Рассчитаем стоимость под ваш участок и комплектацию.</p>}
          <div className="mt-6 flex flex-col gap-3">
            <a href={LEAD_ANCHOR} className={button({ size: "lg" })}>
              Получить смету на этот проект
            </a>
            {settings.whatsapp && (
              <a
                href={`${settings.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует ${project.title}`)}`}
                target="_blank"
                rel="noopener"
                data-goal="click_whatsapp"
                className={button({ variant: "whatsapp", size: "lg" })}
              >
                Написать в WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SuitableFor({ project }: { project: Project }) {
  if (!project.suitableFor.length) return null;
  return (
    <Section title="Кому подходит" tone="surface">
      <ul className="grid gap-4 md:grid-cols-3">
        {project.suitableFor.map((s) => (
          <li key={s.title} className="rounded-card border-line border p-5">
            <h3 className="text-h3 font-extrabold">{s.title}</h3>
            <p className="text-ink-muted mt-2">{s.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function FloorPlans({ project }: { project: Project }) {
  if (!project.plans.length) return null;
  return (
    <Section title="Планировка">
      <div className="grid gap-6 md:grid-cols-2">
        {project.plans.map((p) => (
          <figure key={p.src} className="rounded-card bg-surface shadow-card p-4">
            <a href={p.src} target="_blank" rel="noopener" title="Открыть в полном размере">
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
              />
            </a>
            {p.rooms.length > 0 && (
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {p.rooms.map((r) => (
                  <li key={r.name} className="border-line flex justify-between border-b py-1">
                    <span>{r.name}</span>
                    <span className="font-semibold">{formatArea(r.area)}</span>
                  </li>
                ))}
              </ul>
            )}
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function Gallery({ project }: { project: Project }) {
  // Первое фото уже на первом экране
  const rest = project.photos.slice(1);
  if (!rest.length) return null;
  return (
    <Section title="Фото">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {rest.map((p) => (
          <figure key={p.src} className="rounded-control relative overflow-hidden">
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="h-full w-full object-cover"
            />
            {p.render && (
              <figcaption className="bg-ink/70 absolute right-2 bottom-2 rounded-full px-2 py-0.5 text-xs text-white">
                Визуализация
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function Packages({ project }: { project: Project }) {
  if (!project.packages.length) return null;
  return (
    <Section id="komplektacii" title="Комплектации и цены" tone="surface">
      <div className="grid gap-4 md:grid-cols-3">
        {project.packages.map((p) => (
          <article key={p.name} className="rounded-card border-line flex flex-col border p-5">
            <h3 className="text-h3 font-extrabold">{p.name}</h3>
            <p className="mt-2 text-2xl font-extrabold">{p.price ? formatPrice(p.price) : "По запросу"}</p>
            {p.priceDate && (
              <p className="text-ink-muted text-sm">
                Цена действует с {new Date(p.priceDate).toLocaleDateString("ru-RU")}
              </p>
            )}
            <ul className="mt-4 flex flex-col gap-2">
              {p.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <Check className="text-accent mt-0.5 size-5 shrink-0" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <a href={LEAD_ANCHOR} className={button({ variant: "secondary", full: true })}>
                Выбрать
              </a>
            </div>
          </article>
        ))}
        <article className="rounded-card border-brand flex flex-col border border-dashed p-5">
          <h3 className="text-h3 font-extrabold">Своя комплектация</h3>
          <p className="text-ink-muted mt-2">Соберём состав под ваши задачи и бюджет.</p>
          <div className="mt-auto pt-6">
            <a href={LEAD_ANCHOR} className={button({ variant: "primary", full: true })}>
              Обсудить с менеджером
            </a>
          </div>
        </article>
      </div>
    </Section>
  );
}

export function Options({ project }: { project: Project }) {
  if (!project.options.length) return null;
  return (
    <Section title="Опции">
      <ul className="grid gap-2 md:grid-cols-2">
        {project.options.map((o) => (
          <li key={o.name} className="rounded-control bg-surface flex justify-between gap-4 p-4">
            <span>{o.name}</span>
            <span className="font-semibold whitespace-nowrap">
              {o.price ? formatPrice(o.price) : "по запросу"}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function IncludedExtra({ project }: { project: Project }) {
  if (!project.included.length && !project.extra.length) return null;
  return (
    <Section title="Что входит в цену" tone="surface">
      <div className="grid gap-6 md:grid-cols-2">
        <ul className="flex flex-col gap-2">
          {project.included.map((i) => (
            <li key={i} className="flex gap-2">
              <Check className="text-accent mt-0.5 size-5 shrink-0" aria-hidden />
              {i}
            </li>
          ))}
        </ul>
        {project.extra.length > 0 && (
          <div>
            <h3 className="font-extrabold">Оплачивается отдельно</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {project.extra.map((i) => (
                <li key={i} className="text-ink-muted flex gap-2">
                  <Minus className="mt-0.5 size-5 shrink-0" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}

export function CalcExample({ project }: { project: Project }) {
  const c = project.calcExample;
  if (!c) return null;
  return (
    <Section
      title="Пример расчёта под ключ"
      lead={`${c.city}, ${new Date(c.date).toLocaleDateString("ru-RU")}. Точная смета зависит от участка.`}
    >
      <table className="w-full max-w-2xl">
        <tbody>
          {c.rows.map((r) => (
            <tr key={r.name} className="border-line border-b">
              <td className="py-3">{r.name}</td>
              <td className="py-3 text-right font-semibold whitespace-nowrap">{formatPrice(r.sum)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-3 text-lg font-extrabold">Итого</td>
            <td className="py-3 text-right text-lg font-extrabold whitespace-nowrap">
              {formatPrice(c.total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </Section>
  );
}

export function Specs({ project, settings }: { project: Project; settings: Settings }) {
  if (project.specs.length) {
    return (
      <Section title="Технические характеристики">
        <dl className="grid max-w-3xl gap-x-6 md:grid-cols-[auto_1fr]">
          {project.specs.map((s) => (
            <div key={s.name} className="contents">
              <dt className="border-line text-ink-muted border-b py-3">{s.name}</dt>
              <dd className="border-line border-b py-3 font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Section>
    );
  }
  // Пока у проекта нет своих характеристик — общий состав конструкции
  return <Construction settings={settings} />;
}

export function Construction({ settings }: { settings: Settings }) {
  return (
    <Section title="Из чего строим" lead="Базовая комплектация, одинаковая для всех проектов.">
      <div className="grid gap-4 md:grid-cols-3">
        {settings.construction.map((g) => (
          <div key={g.title} className="rounded-card bg-surface shadow-card p-5">
            <h3 className="text-h3 font-extrabold">{g.title}</h3>
            <ul className="text-ink-muted mt-3 flex flex-col gap-2">
              {g.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <Check className="text-accent mt-0.5 size-4 shrink-0" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Steps({ settings }: { settings: Settings }) {
  return (
    <Section title="Как строим" tone="surface">
      <ol className="grid gap-4 md:grid-cols-3">
        {settings.steps.map((s, i) => (
          <li key={s.title} className="rounded-card border-line border p-5">
            <span className="bg-brand flex size-10 items-center justify-center rounded-full text-lg font-extrabold text-white">
              {i + 1}
            </span>
            <h3 className="text-h3 mt-3 font-extrabold">{s.title}</h3>
            <p className="text-ink-muted mt-1">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Delivery({ settings }: { settings: Settings }) {
  if (!settings.delivery.length) return null;
  return (
    <Section title="Доставка и монтаж">
      <ul className="flex max-w-3xl flex-col gap-3">
        {settings.delivery.map((d) => (
          <li key={d} className="flex gap-3 text-lg">
            <Check className="text-accent mt-1 size-5 shrink-0" aria-hidden />
            {d}
          </li>
        ))}
      </ul>
    </Section>
  );
}

// Аккордеон на <details>: работает без JavaScript
export function Faq({
  items,
  title = "Вопросы и ответы",
}: {
  items: { q: string; a: string }[];
  title?: string;
}) {
  if (!items.length) return null;
  return (
    <Section title={title} tone="surface">
      <div className="divide-line border-line flex max-w-3xl flex-col divide-y border-y">
        {items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="text-brand text-2xl transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="text-ink-muted mt-3">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd<FAQPage>
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </Section>
  );
}

export function ProjectPager({ prev, next }: { prev?: Project; next?: Project }) {
  return (
    <div className="mt-8 flex justify-between gap-4">
      {prev ? (
        <Link
          href={`/proekty/${prev.slug}`}
          className="hover:text-brand flex items-center gap-2 font-semibold"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={`/proekty/${next.slug}`}
          className="hover:text-brand flex items-center gap-2 text-right font-semibold"
        >
          {next.title}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
