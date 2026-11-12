import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AppWindow,
  ArrowRight,
  Frame,
  House,
  PaintRoller,
  ThermometerSnowflake,
  TreePine,
} from "lucide-react";
import type { HomeAndConstructionBusiness } from "schema-dts";
import {
  Business,
  Cases,
  LeadSection,
  Offer,
  TrustNumbers,
  Warranty,
  WorkshopVsSite,
} from "@/components/blocks/common";
import { DemoFrame, DemoSlotBlock } from "@/components/demo/Demo";
import { InStock } from "@/components/blocks/InStock";
import { Faq, Steps } from "@/components/blocks/project";
import { Quiz } from "@/components/forms/Quiz";
import { JsonLd } from "@/components/JsonLd";
import { ProjectGroups } from "@/components/ProjectGroups";
import { Section } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { getCatalogProjects, getDemoSlots, getSettings, siteMinPrice } from "@/lib/content";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Модульные дома под ключ от производителя в Миассе | МИШАЛЕ" },
  description:
    "Модульные каркасные дома от 20 до 120 м² и бани из собственного цеха в Миассе. Производство от 2 недель, гарантия 5 лет, бесплатный монтаж по Челябинской области.",
  alternates: { canonical: "/" },
};

// Иконки для «Что входит в стоимость» — по названиям групп из settings.construction
const icons: Record<string, typeof Frame> = {
  Каркас: Frame,
  Утепление: ThermometerSnowflake,
  Крыша: House,
  Окна: AppWindow,
  "Внутренняя отделка": PaintRoller,
  "Наружная отделка": TreePine,
};

// Главная (ТЗ §7.2). Блоки без данных компании не выводятся; на тестовом сайте в них примеры (lib/demo.ts),
// а для каталога PDF и видео — заглушки.
export default async function Home() {
  const [projects, settings, slots] = await Promise.all([
    getCatalogProjects(),
    getSettings(),
    getDemoSlots(),
  ]);
  const minPrice = siteMinPrice(settings, projects);
  const hero =
    settings.heroPhoto ?? projects.find((p) => p.slug === "dom-45")?.photos[0] ?? projects[0]?.photos[0];

  return (
    <>
      {/* Первый экран */}
      <section className="pt-6 pb-10 md:pt-12 md:pb-16">
        <div className="mx-auto grid w-full max-w-(--container-site) gap-8 px-4 md:grid-cols-[1fr_1.1fr] md:items-center md:px-6">
          <div>
            <h1 className="text-h1 font-extrabold md:text-5xl lg:text-6xl">
              Модульные дома под ключ от производителя в Миассе
            </h1>
            <p className="text-ink-muted mt-4 text-lg md:text-xl">
              Доставка и монтаж по горнозаводской зоне и всей Челябинской области.
            </p>
            <ul className="mt-6 flex flex-col gap-2 text-lg">
              {minPrice && (
                <li>
                  Цена <strong>от {formatPrice(minPrice)}</strong>
                </li>
              )}
              <li>
                Производство <strong>от 2 недель</strong> в собственном крытом цеху
              </li>
              <li>
                Гарантия <strong>{settings.warrantyYears} лет</strong> по договору
              </li>
            </ul>
            <div className="mt-8 flex max-w-md flex-col gap-3">
              <a href="#kviz" className={button({ size: "lg" })}>
                Рассчитать свой дом за 1 минуту
              </a>
              {settings.whatsapp && (
                <a
                  href={settings.whatsapp}
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
          {hero && (
            <figure className="rounded-card bg-brand-soft relative overflow-hidden">
              <Image
                src={hero.src}
                alt={hero.alt}
                width={hero.width}
                height={hero.height}
                fetchPriority="high"
                loading="eager"
                sizes="(min-width: 1440px) 670px, (min-width: 1216px) 595px, (min-width: 768px) 52vw, 100vw"
                className="h-auto w-full"
              />
              {hero.render && (
                <figcaption className="bg-ink/70 absolute right-3 bottom-3 rounded-full px-3 py-1 text-xs text-white">
                  Визуализация
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </section>

      <TrustNumbers settings={settings} />
      <DemoFrame note={settings.demo.offer}>
        <Offer settings={settings} />
      </DemoFrame>
      <InStock settings={settings} />

      <Section
        id="proekty"
        title="Проекты и цены"
        lead="Выберите, для чего нужен дом, — покажем подходящие проекты."
      >
        <ProjectGroups projects={projects} phone={settings.phone} headingLevel={3} />
        <Link href="/proekty" className="hover:text-brand mt-8 inline-flex items-center gap-2 font-semibold">
          Все проекты на одной странице
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>

      <Section
        id="kviz"
        tone="brand"
        title="Рассчитайте свой дом за 1 минуту"
        lead="4 вопроса — и мы подберём проект и посчитаем стоимость под ключ."
      >
        <div className="max-w-3xl">
          <Quiz phone={settings.phone} />
        </div>
      </Section>

      <DemoSlotBlock slot={slots.catalog} />

      <WorkshopVsSite settings={settings} />
      <div className="mx-auto -mt-6 w-full max-w-(--container-site) px-4 pb-6 md:px-6">
        <Link href="/proizvodstvo" className="hover:text-brand inline-flex items-center gap-2 font-semibold">
          Как устроено производство
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <Section
        title="Что входит в стоимость дома"
        tone="surface"
        lead="Дом приезжает с отделкой, окнами и инженерией."
      >
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {settings.construction.map((g) => {
            const Icon = icons[g.title] ?? House;
            return (
              <li key={g.title} className="rounded-card border-line border p-5">
                <Icon className="text-brand size-8" aria-hidden />
                <h3 className="mt-3 font-extrabold">{g.title}</h3>
                <p className="text-ink-muted mt-1 text-sm">{g.items[0]}</p>
              </li>
            );
          })}
        </ul>
        <Link
          href="/proizvodstvo"
          className="hover:text-brand mt-6 inline-flex items-center gap-2 font-semibold"
        >
          Подробно о технологии
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>

      <DemoSlotBlock slot={slots.video} />
      <DemoFrame note={settings.demo.cases}>
        <Cases settings={settings} />
      </DemoFrame>
      <DemoFrame note={settings.demo.business}>
        <Business settings={settings} />
      </DemoFrame>
      <Steps settings={settings} />
      <DemoFrame note={settings.demo.warrantyItems}>
        <Warranty settings={settings} />
      </DemoFrame>
      <Faq items={[...settings.generalFaq, ...settings.projectFaq]} />
      <LeadSection settings={settings} />

      <JsonLd<HomeAndConstructionBusiness>
        data={{
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          name: site.name,
          url: site.url,
          logo: `${site.url}/logo.svg`,
          telephone: settings.phone.href.replace("tel:", ""),
          ...(settings.email ? { email: settings.email } : {}),
          areaServed: "Челябинская область",
          ...(settings.address
            ? {
                address: {
                  "@type": "PostalAddress",
                  streetAddress: settings.address.text,
                  addressLocality: "Миасс",
                  addressRegion: "Челябинская область",
                  addressCountry: "RU",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: settings.address.lat,
                  longitude: settings.address.lng,
                },
              }
            : {}),
        }}
      />
    </>
  );
}
