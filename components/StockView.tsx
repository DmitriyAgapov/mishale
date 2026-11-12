import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import type { Product } from "schema-dts";
import { Delivery } from "@/components/blocks/project";
import { Excursion } from "@/components/blocks/common";
import { StockCard } from "@/components/blocks/InStock";
import { DemoFrame } from "@/components/demo/Demo";
import { LeadForm } from "@/components/forms/LeadForm";
import { Lightbox, PhotoTrigger } from "@/components/Lightbox";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEAD_ANCHOR } from "@/components/layout/nav";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Section } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { stockHref, type StockItem } from "@/lib/content";
import type { Settings } from "@/lib/content/schemas";
import { formatPrice, keepUnits } from "@/lib/format";
import { site } from "@/lib/site";

// Страница готового дома в наличии (/v-nalichii/<slug>) — по образцу страницы проекта,
// но без комплектаций и планировок: дом уже собран, состав и цена — из settings.inStock

export function stockMetadata(item: StockItem): Metadata {
  const title = `${item.title} в наличии — ${item.price ? formatPrice(item.price) : "цена по запросу"}, Миасс`;
  const description = `${item.title}, ${item.size}. Уже собран в цеху МИШАЛЕ в Миассе, установка на участке за 1–2 дня.`;
  return {
    title,
    description,
    alternates: { canonical: stockHref(item) },
    openGraph: { title, description, images: item.photos[0] ? [{ url: item.photos[0].src }] : undefined },
  };
}

export function StockView({ item, settings }: { item: StockItem; settings: Settings }) {
  const [photo, ...rest] = item.photos;
  const others = settings.inStock.filter((x) => x.slug !== item.slug);
  const lead = `В наличии: ${item.title}`;
  const facts: Array<[string, string]> = [["Площадь", item.size]];
  if (item.purpose) facts.push(["Для чего", item.purpose]);
  facts.push(["Установка", "1–2 дня"]);

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/proekty#v-nalichii", label: "Готовые дома в наличии" },
          { href: stockHref(item), label: item.title },
        ]}
      />
      <section className="pt-4 pb-10 md:pb-14">
        <div className="mx-auto grid w-full max-w-(--container-site) gap-6 px-4 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10 md:px-6">
          {/* Рамка 4:3: вертикальное фото не вытягивает первый экран */}
          <Lightbox photos={item.photos}>
            <figure className="rounded-card bg-brand-soft relative aspect-[4/3] overflow-hidden">
              {photo && <PhotoTrigger index={0} alt={photo.alt} />}
              {photo && (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  fetchPriority="high"
                  loading="eager"
                  sizes="(min-width: 1440px) 742px, (min-width: 1216px) 658px, (min-width: 768px) 55vw, 100vw"
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </figure>
          </Lightbox>
          <div>
            <p className="bg-accent mb-3 inline-block rounded-full px-3 py-1 text-sm font-semibold text-white">
              В наличии
            </p>
            <h1 className="text-h1 font-extrabold md:text-5xl">{keepUnits(item.title)}</h1>
            <p className="text-ink-muted mt-3 text-lg">
              Уже собран в нашем цеху и готов к перевозке — можно приехать и посмотреть вживую.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {facts.map(([k, v]) => (
                <div key={k} className="rounded-control bg-surface p-3">
                  <dt className="text-ink-muted text-sm">{k}</dt>
                  <dd className="font-extrabold">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-2xl font-extrabold">
              {item.price ? formatPrice(item.price) : "Цена — по запросу"}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a href={LEAD_ANCHOR} className={button({ size: "lg" })}>
                Забронировать
              </a>
              {settings.whatsapp && (
                <a
                  href={`${settings.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует ${lead}`)}`}
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

      {item.items.length > 0 && (
        <Section title="Что входит" tone="surface">
          <ul className="flex max-w-3xl flex-col gap-3">
            {item.items.map((i) => (
              <li key={i} className="flex gap-3 text-lg">
                <Check className="text-accent mt-1 size-5 shrink-0" aria-hidden />
                {i}
              </li>
            ))}
          </ul>
          <p className="text-ink-muted mt-6">
            Можно под ключ: септик, скважина, мебель. В пределах города бесплатно приедем на участок и оценим,
            можно ли поставить дом.
          </p>
        </Section>
      )}

      {rest.length > 0 && (
        <Section title="Фото">
          <PhotoGrid photos={rest} />
        </Section>
      )}

      <DemoFrame note={settings.demo.deliveryPhotos}>
        <Delivery settings={settings} />
      </DemoFrame>
      <DemoFrame note={settings.demo.excursion}>
        <Excursion settings={settings} />
      </DemoFrame>

      {others.length > 0 && (
        <Section title="Другие дома в наличии">
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((x) => (
              <StockCard key={x.slug} item={x} settings={settings} />
            ))}
          </div>
        </Section>
      )}

      <Section id="zayavka" tone="brand">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-h2 font-extrabold md:text-4xl">Забронировать {item.title.toLowerCase()}</h2>
            <p className="text-ink-muted mt-3 text-lg">
              Готовый дом может уйти другому покупателю. Оставьте заявку — придержим его за вами, расскажем
              про доставку на ваш участок и покажем дом в цеху.
            </p>
            <a
              href={settings.phone.href}
              data-goal="click_phone"
              className="hover:text-brand mt-6 inline-block text-2xl font-extrabold"
            >
              {settings.phone.display}
            </a>
          </div>
          <LeadForm form="project" project={lead} phone={settings.phone} submitLabel="Забронировать" />
        </div>
      </Section>

      <JsonLd<Product>
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: item.title,
          description: `${item.title}, ${item.size}`,
          url: `${site.url}${stockHref(item)}`,
          image: item.photos.map((p) => `${site.url}${p.src}`),
          brand: { "@type": "Brand", name: site.name },
          ...(item.price
            ? {
                offers: {
                  "@type": "Offer",
                  priceCurrency: "RUB",
                  price: item.price,
                  availability: "https://schema.org/InStock",
                },
              }
            : {}),
        }}
      />
    </>
  );
}
