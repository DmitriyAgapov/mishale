import type { Metadata } from "next";
import Link from "next/link";
import {
  LeadSection,
  ProductionDetails,
  ProductionPhotos,
  TrustNumbers,
  Warranty,
  WorkshopVsSite,
} from "@/components/blocks/common";
import { DemoFrame, DemoSlotBlock } from "@/components/demo/Demo";
import { Construction, Delivery, Steps } from "@/components/blocks/project";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { getDemoSlots, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Производство модульных домов в Миассе — собственный цех 3 000 м²",
  description:
    "Модульные дома собираются в собственном крытом цеху 3 000 м² в Миассе: каркас из бруса, базальтовое утепление, окна Veka. Производство 2–4 недели, гарантия 5 лет.",
  alternates: { canonical: "/proizvodstvo" },
};

// «Производство» (ТЗ §7.5): фото цеха и монтажа — от компании; видео, люди, контроль качества
// и документы — когда компания пришлёт материалы.
export default async function ProductionPage() {
  const [settings, slots] = await Promise.all([getSettings(), getDemoSlots()]);
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
        </div>
      </Section>
      <TrustNumbers settings={settings} />
      <DemoFrame note={settings.demo.productionPhotos}>
        <ProductionPhotos settings={settings} />
      </DemoFrame>
      <WorkshopVsSite settings={settings} title="Цех против стройки на участке" />
      <Construction settings={settings} />
      <DemoSlotBlock slot={slots.video} />
      <Steps settings={settings} />
      <DemoFrame note={settings.demo.productionDetails}>
        <ProductionDetails settings={settings} />
      </DemoFrame>
      <DemoFrame note={settings.demo.deliveryPhotos}>
        <Delivery settings={settings} />
      </DemoFrame>
      <DemoFrame note={settings.demo.warrantyItems}>
        <Warranty settings={settings} />
      </DemoFrame>
      <LeadSection settings={settings} />
    </>
  );
}
