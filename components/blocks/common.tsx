import Image from "next/image";
import {
  Building2,
  CalendarClock,
  Check,
  MapPin,
  Quote,
  ShieldCheck,
  Snowflake,
  Wallet,
  X,
} from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";
import { Section } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import type { Case, Settings } from "@/lib/content/schemas";
import { cn } from "@/lib/cn";
import { PhotoGrid } from "@/components/PhotoGrid";

// Блоки, общие для главной, «Производства» и контактов (ТЗ §7.1)

export function TrustNumbers({ settings }: { settings: Settings }) {
  if (!settings.trust.length) return null;
  return (
    <section aria-label="Цифры о компании" className="bg-surface border-line border-y">
      <dl className="mx-auto grid w-full max-w-(--container-site) grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-6">
        {settings.trust.map((t) => (
          <div key={t.label}>
            <dt className="sr-only">{t.label}</dt>
            <dd className="text-brand text-2xl font-extrabold md:text-4xl">{t.value}</dd>
            <dd className="text-ink-muted mt-1">{t.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function WorkshopVsSite({
  settings,
  title = "Дом из цеха или стройка на участке",
}: {
  settings: Settings;
  title?: string;
}) {
  const rows = settings.workshopVsSite;
  if (!rows.length) return null;
  return (
    <Section title={title} lead="Почему мы собираем дома в цеху, а не на участке.">
      {/* На телефоне — карточки, на компьютере — таблица */}
      <div className="grid gap-4 md:hidden">
        {rows.map((r) => (
          <div key={r.topic} className="rounded-card bg-surface shadow-card p-5">
            <h3 className="text-h3 font-extrabold">{r.topic}</h3>
            <p className="mt-3 flex gap-2">
              <Check className="text-accent mt-0.5 size-5 shrink-0" aria-label="Цех" />
              {r.workshop}
            </p>
            <p className="text-ink-muted mt-2 flex gap-2">
              <X className="mt-0.5 size-5 shrink-0" aria-label="Стройка на участке" />
              {r.site}
            </p>
          </div>
        ))}
      </div>
      <table className="rounded-card bg-surface shadow-card hidden w-full overflow-hidden text-left md:table">
        <thead>
          <tr className="border-line border-b">
            <th scope="col" className="p-4" />
            <th scope="col" className="text-brand p-4 text-lg font-extrabold">
              Дом из цеха МИШАЛЕ
            </th>
            <th scope="col" className="text-ink-muted p-4 text-lg font-extrabold">
              Стройка на участке
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.topic} className="border-line border-b last:border-0">
              <th scope="row" className="p-4 font-semibold">
                {r.topic}
              </th>
              <td className="p-4">{r.workshop}</td>
              <td className="text-ink-muted p-4">{r.site}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

// Секция с формой заявки: якорь #zayavka есть на каждой странице — на него ведут кнопки шапки и панели
export function LeadSection({
  settings,
  title = "Рассчитаем стоимость вашего дома",
  text = "Посчитаем полную стоимость под ключ для вашего участка: дом, фундамент, доставку и подключение. Перезвоним в рабочее время.",
}: {
  settings: Settings;
  title?: string;
  text?: string;
}) {
  return (
    <Section id="zayavka" tone="brand">
      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="text-h2 font-extrabold md:text-4xl">{title}</h2>
          <p className="text-ink-muted mt-3 text-lg">{text}</p>
          <a
            href={settings.phone.href}
            data-goal="click_phone"
            className="hover:text-brand mt-6 inline-block text-2xl font-extrabold"
          >
            {settings.phone.display}
          </a>
        </div>
        <LeadForm form="contact" phone={settings.phone} />
      </div>
    </Section>
  );
}

// Гарантия (ТЗ §7.2 блок 13, §7.5). Срок — из настроек; что покрывает — список, когда компания его даст
export function Warranty({ settings }: { settings: Settings }) {
  return (
    <Section title={`Гарантия ${settings.warrantyYears} лет по договору`}>
      <div className="flex max-w-3xl gap-4">
        <ShieldCheck className="text-brand size-10 shrink-0" aria-hidden />
        <div className="text-lg">
          {settings.warrantyItems.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {settings.warrantyItems.map((i) => (
                <li key={i} className="flex gap-2">
                  <Check className="text-success mt-1 size-5 shrink-0" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              Гарантийный срок прописан в договоре. Менеджер до подписания расскажет, на что действует
              гарантия и как к ней обратиться.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}

// Сезонное предложение (02 §6.4): главная и страницы проектов.
// Тёмная карточка выделяется среди светлых блоков: слева условия и срок, справа выгоды списком
export function Offer({ settings }: { settings: Settings }) {
  const o = settings.offer;
  if (!o) return null;
  const until = o.until
    ? new Date(o.until).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
    : null;
  return (
    <Section>
      <div className="rounded-card bg-brand relative overflow-hidden px-6 py-10 text-white md:px-12 md:py-14">
        {/* Декоративные снежинки — только фон */}
        <Snowflake
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 size-56 text-white/10 md:size-72"
          strokeWidth={1}
        />
        <Snowflake
          aria-hidden
          className="pointer-events-none absolute -bottom-8 left-1/3 hidden size-32 text-white/5 md:block"
          strokeWidth={1}
        />
        <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-bold tracking-wide uppercase">
              <Snowflake className="size-4" aria-hidden />
              Предложение сезона
            </p>
            <h2 className="text-h2 mt-4 font-extrabold md:text-4xl">{o.title}</h2>
            <p className="mt-4 text-lg text-white/85">{o.text}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#zayavka"
                className={cn(button({ size: "lg" }), "text-brand bg-white hover:bg-white/90")}
              >
                Забронировать место
              </a>
              {until && (
                <p className="flex items-center gap-2 font-semibold text-white/90">
                  <CalendarClock className="size-5 shrink-0" aria-hidden />
                  Действует до {until}
                </p>
              )}
            </div>
          </div>
          {o.points.length > 0 && (
            <ul className="flex flex-col gap-3">
              {o.points.map((p) => (
                <li key={p} className="rounded-control flex gap-3 bg-white/10 p-4 text-lg">
                  <Check className="mt-1 size-5 shrink-0" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}

// Построенные дома и отзывы (02 §6.6). На странице проекта — только дома этого проекта
export function Cases({
  settings,
  items = settings.cases,
  title = "Построенные дома",
  lead = "Дома, которые мы уже собрали и поставили.",
}: {
  settings: Settings;
  items?: Case[];
  title?: string;
  lead?: string;
}) {
  if (!items.length) return null;
  return (
    <Section title={title} lead={lead}>
      <div
        className={cn(
          "grid gap-6",
          items.length > 1 && "md:grid-cols-2",
          items.length > 2 && "lg:grid-cols-3",
        )}
      >
        {items.map((c) => {
          const [main, ...rest] = c.photos;
          return (
            <article
              key={`${c.title}-${c.city}`}
              className={cn(
                "rounded-card bg-surface shadow-card overflow-hidden",
                // Один дом — горизонтальная карточка, иначе фото на всю ширину страницы
                items.length === 1 && "md:grid md:grid-cols-2",
              )}
            >
              <div>
                {main && (
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={main.src}
                      alt={main.alt}
                      fill
                      sizes={
                        items.length > 2
                          ? "(min-width: 1440px) 421px, (min-width: 1216px) 373px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          : "(min-width: 1440px) 656px, (min-width: 768px) 50vw, 100vw"
                      }
                      className="object-cover"
                    />
                  </div>
                )}
                {rest.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 p-1">
                    {rest.slice(0, 3).map((p) => (
                      <div key={p.src} className="relative aspect-[4/3] overflow-hidden rounded">
                        <Image
                          src={p.src}
                          alt={p.alt}
                          fill
                          sizes="(min-width: 1440px) 220px, (min-width: 768px) 15vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={cn("p-5", items.length === 1 && "md:p-8")}>
                <h3 className="text-h3 font-extrabold">{c.title}</h3>
                <p className="text-ink-muted mt-1 flex items-center gap-1 text-sm">
                  <MapPin className="size-4" aria-hidden />
                  {c.city}, {c.date}
                </p>
                <p className="mt-3">{c.text}</p>
                {c.review && (
                  <blockquote className="border-brand mt-4 border-l-4 pl-4 italic">
                    <Quote className="text-brand mb-1 size-5" aria-hidden />
                    {c.review}
                    {c.author && (
                      <footer className="text-ink-muted mt-2 text-sm not-italic">— {c.author}</footer>
                    )}
                  </blockquote>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

// Для бизнеса: базы отдыха, глэмпинги, предприятия (02 §6.7)
export function Business({ settings }: { settings: Settings }) {
  const b = settings.business;
  if (!b) return null;
  return (
    <Section title="Для бизнеса" tone="surface">
      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <div className="flex gap-4">
          <Building2 className="text-brand size-10 shrink-0" aria-hidden />
          <p className="text-lg">{b.text}</p>
        </div>
        <ul className="flex flex-col gap-2 text-lg">
          {b.items.map((i) => (
            <li key={i} className="flex gap-2">
              <Check className="text-accent mt-1 size-5 shrink-0" aria-hidden />
              {i}
            </li>
          ))}
        </ul>
      </div>
      <a href="#zayavka" className={`${button({ variant: "secondary" })} mt-8`}>
        Обсудить заказ партии
      </a>
    </Section>
  );
}

// Ипотека и рассрочка — страницы проектов
export function Financing({ settings }: { settings: Settings }) {
  if (!settings.financing.length) return null;
  return (
    <Section title="Ипотека и рассрочка">
      <div className="grid gap-4 md:grid-cols-3">
        {settings.financing.map((f) => (
          <article key={f.title} className="rounded-card border-line border p-5">
            <Wallet className="text-brand size-8" aria-hidden />
            <h3 className="text-h3 mt-3 font-extrabold">{f.title}</h3>
            <p className="text-ink-muted mt-2">{f.text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

// Фото цеха — «Производство»
export function ProductionPhotos({ settings }: { settings: Settings }) {
  if (!settings.productionPhotos.length) return null;
  return (
    <Section
      title="Наш цех"
      lead="Модули собираются под крышей, по одной технологии, и проверяются до отгрузки."
    >
      <PhotoGrid photos={settings.productionPhotos} visible={6} />
    </Section>
  );
}

// «Производство» подробно: материалы, контроль качества, команда
export function ProductionDetails({ settings }: { settings: Settings }) {
  if (!settings.productionDetails.length) return null;
  return (
    <Section title="Материалы, контроль и люди" tone="surface">
      <div className="grid gap-6 md:grid-cols-3">
        {settings.productionDetails.map((g) => (
          <div key={g.title}>
            <h3 className="text-h3 font-extrabold">{g.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {g.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <Check className="text-accent mt-0.5 size-5 shrink-0" aria-hidden />
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

// Карта и как доехать — контакты. Виджет Яндекс Карт без ключа
export function MapBlock({ settings }: { settings: Settings }) {
  const a = settings.address;
  if (!a) return null;
  const point = `${a.lng},${a.lat}`;
  return (
    <Section title="Как доехать">
      {/* Карта на всю ширину контейнера, без адреса и описания проезда рядом (решение пользователя от 12.11.2026) */}
      <iframe
        title={`Карта: ${a.text}`}
        src={`https://yandex.ru/map-widget/v1/?ll=${point}&z=15&pt=${point},pm2rdm`}
        loading="lazy"
        className="rounded-card border-line h-[30rem] w-full border md:h-[36rem]"
      />
    </Section>
  );
}
