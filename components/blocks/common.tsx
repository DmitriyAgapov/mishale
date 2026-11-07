import { Check, ShieldCheck, X } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";
import { Section } from "@/components/ui/Section";
import type { Settings } from "@/lib/content/schemas";

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

// Экскурсия в цех (02 §6.5). Показывается, только когда компания подтвердит расписание
export function Excursion({ settings }: { settings: Settings }) {
  const e = settings.excursion;
  if (!e) return null;
  return (
    <Section id="ekskursiya" title="Приезжайте в цех" tone="surface">
      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <div className="text-lg">
          <p>Покажем модули в работе, материалы и готовые дома. {e.schedule}.</p>
          {e.online && (
            <p className="text-ink-muted mt-3">Далеко ехать? Проведём онлайн-экскурсию по видеосвязи.</p>
          )}
          {e.gift && <p className="mt-3 font-semibold">{e.gift}</p>}
          {settings.address && <p className="text-ink-muted mt-3">{settings.address.text}</p>}
        </div>
        <LeadForm form="excursion" phone={settings.phone} submitLabel="Записаться на экскурсию" />
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
