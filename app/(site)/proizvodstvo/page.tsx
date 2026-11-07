import type { Metadata } from "next";
import Link from "next/link";
import { Excursion, LeadSection, TrustNumbers, WorkshopVsSite } from "@/components/blocks/common";
import { Construction, Delivery, Faq, Steps } from "@/components/blocks/project";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Производство модульных домов в Миассе — собственный цех 3 000 м²",
  description:
    "Модульные дома собираются в собственном крытом цеху 3 000 м² в Миассе: каркас из бруса, базальтовое утепление, окна Veka. Производство 2–4 недели, гарантия 5 лет.",
  alternates: { canonical: "/proizvodstvo" },
};

// «Производство», короткая версия на запуск (ТЗ §0, §7.5). Видео, фото цеха, люди, контроль качества
// и документы — когда компания пришлёт материалы.
export default async function ProductionPage() {
  const settings = await getSettings();
  return (
    <>
      <Breadcrumbs items={[{ href: "/proizvodstvo", label: "Производство" }]} />
      <Section className="pt-6 md:pt-8">
        <h1 className="text-h1 max-w-4xl font-extrabold md:text-5xl">
          Собственный крытый цех 3 000 м² в Миассе
        </h1>
        <p className="text-ink-muted mt-4 max-w-2xl text-lg">
          Мы не строим дом на участке месяцами. Модули собираются под крышей по одной технологии и приезжают к
          вам готовыми: с отделкой, окнами и инженерией.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/proekty" className={button({ size: "lg" })}>
            Смотреть проекты
          </Link>
          {settings.excursion && (
            <a href="#ekskursiya" className={button({ variant: "secondary", size: "lg" })}>
              Записаться на экскурсию
            </a>
          )}
        </div>
      </Section>
      <TrustNumbers settings={settings} />
      <WorkshopVsSite settings={settings} title="Цех против стройки на участке" />
      <Construction settings={settings} />
      <Steps settings={settings} />
      <Delivery settings={settings} />
      <Excursion settings={settings} />
      <Faq items={settings.generalFaq} />
      <LeadSection settings={settings} />
    </>
  );
}
