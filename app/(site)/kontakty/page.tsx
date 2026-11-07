import type { Metadata } from "next";
import { Excursion, LeadSection } from "@/components/blocks/common";
import { DemoBadge, DemoFrame, DemoSlotBlock } from "@/components/demo/Demo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { getDemoSlots, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Контакты — производство модульных домов в Миассе",
  description:
    "Телефон, мессенджеры и адрес цеха МИШАЛЕ в Миассе. Перезвоним и посчитаем стоимость дома под ключ.",
  alternates: { canonical: "/kontakty" },
};

// Контакты (ТЗ §7.10). Адрес, карта, режим работы и реквизиты выводятся, когда компания их пришлёт.
export default async function ContactsPage() {
  const [s, slots] = await Promise.all([getSettings(), getDemoSlots()]);
  const mapUrl = s.address ? `https://yandex.ru/maps/?pt=${s.address.lng},${s.address.lat}&z=16&l=map` : null;
  return (
    <>
      <Breadcrumbs items={[{ href: "/kontakty", label: "Контакты" }]} />
      <Section className="pt-6 md:pt-8">
        <h1 className="text-h1 font-extrabold md:text-5xl">Контакты</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-card bg-surface shadow-card flex flex-col gap-4 p-6">
            <div>
              <p className="text-ink-muted text-sm">Телефон</p>
              <a
                href={s.phone.href}
                data-goal="click_phone"
                className="hover:text-brand text-2xl font-extrabold"
              >
                {s.phone.display}
              </a>
            </div>
            {s.email && (
              <div>
                <p className="text-ink-muted text-sm">Почта</p>
                <a href={`mailto:${s.email}`} className="hover:text-brand text-lg font-semibold">
                  {s.email}
                </a>
              </div>
            )}
            {s.workHours && (
              <div>
                <p className="text-ink-muted text-sm">Режим работы</p>
                <p className="text-lg font-semibold">
                  {s.workHours}
                  <DemoBadge note={s.demo.workHours} />
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {s.whatsapp && (
                <a
                  href={s.whatsapp}
                  target="_blank"
                  rel="noopener"
                  data-goal="click_whatsapp"
                  className={button({ variant: "whatsapp" })}
                >
                  WhatsApp
                </a>
              )}
              {s.telegram && (
                <a
                  href={s.telegram}
                  target="_blank"
                  rel="noopener"
                  className={button({ variant: "secondary" })}
                >
                  Telegram
                </a>
              )}
              {s.vk && (
                <a href={s.vk} target="_blank" rel="noopener" className={button({ variant: "secondary" })}>
                  ВКонтакте
                </a>
              )}
            </div>
          </div>

          <div className="rounded-card bg-surface shadow-card flex flex-col gap-4 p-6">
            <div>
              <p className="text-ink-muted text-sm">Производство</p>
              <p className="text-lg font-semibold">
                {s.address ? s.address.text : "Собственный цех в Миассе"}
                <DemoBadge note={s.demo.address} />
              </p>
            </div>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noopener" className={button({ variant: "secondary" })}>
                Открыть на Яндекс Картах
              </a>
            )}
            {s.legal && (
              <div className="text-ink-muted text-sm">
                <p>
                  {s.legal.name}
                  <DemoBadge note={s.demo.legal} />
                </p>
                <p>ИНН {s.legal.inn}</p>
                <p>ОГРН {s.legal.ogrn}</p>
              </div>
            )}
          </div>
        </div>
      </Section>
      <DemoSlotBlock slot={slots.map} />
      <DemoFrame note={s.demo.excursion}>
        <Excursion settings={s} />
      </DemoFrame>
      <LeadSection settings={s} title="Оставьте заявку" />
    </>
  );
}
