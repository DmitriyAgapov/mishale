import type { Metadata } from "next";
import Link from "next/link";
import type { Product } from "schema-dts";
import {
  CalcExample,
  Delivery,
  Faq,
  FloorPlans,
  Gallery,
  IncludedExtra,
  Options,
  Packages,
  ProjectHero,
  ProjectPager,
  Specs,
  Steps,
  SuitableFor,
} from "@/components/blocks/project";
import { DemoFrame, DemoSlotBlock } from "@/components/demo/Demo";
import { Excursion } from "@/components/blocks/common";
import { BanyaVariantHint } from "@/components/SoonCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/ui/Section";
import { projectHref, projectPriceFrom } from "@/lib/content";
import type { Project, Settings } from "@/lib/content/schemas";
import type { DemoSlot } from "@/lib/demo";
import { cn } from "@/lib/cn";
import { formatArea, formatPrice, pluralModules } from "@/lib/format";
import { site } from "@/lib/site";

// Один шаблон для страницы проекта и для его варианта с баней внутри (ТЗ §7.4)

export function projectMetadata(p: Project, href: string): Metadata {
  const price = projectPriceFrom(p);
  // Шаблон из 02 §5.5; поля seo в JSON переопределяют
  const title =
    p.seo.title ??
    `${p.title} под ключ — ${price ? `цена от ${formatPrice(price)}` : "цена и планировка"}, Миасс`;
  const description =
    p.seo.description ??
    `${p.title}: ${pluralModules(p.params.modules)}, ${formatArea(p.params.area)}. Производство в собственном цеху в Миассе, гарантия 5 лет, монтаж по Челябинской области.`;
  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: { title, description, images: p.photos[0] ? [{ url: p.photos[0].src }] : undefined },
  };
}

function VariantSwitch({ base, withBanya }: { base: Project; withBanya: boolean }) {
  const item = "flex-1 rounded-control px-4 py-2 text-center font-semibold";
  return (
    <nav aria-label="Вариант дома" className="mx-auto w-full max-w-(--container-site) px-4 pt-4 md:px-6">
      <div className="border-line bg-surface inline-flex w-full max-w-md gap-1 rounded-[calc(var(--radius-control)+4px)] border p-1">
        <Link
          href={projectHref(base)}
          aria-current={!withBanya ? "page" : undefined}
          className={cn(item, !withBanya ? "bg-brand text-white" : "hover:text-brand")}
        >
          Без бани
        </Link>
        <Link
          href={projectHref(base, true)}
          aria-current={withBanya ? "page" : undefined}
          className={cn(item, withBanya ? "bg-brand text-white" : "hover:text-brand")}
        >
          С баней внутри
        </Link>
      </div>
    </nav>
  );
}

type Props = {
  base: Project; // основной проект — для переключателя, похожих проектов и листалки
  project: Project; // то, что показываем: сам проект или его вариант с баней
  withBanya: boolean;
  settings: Settings;
  all: Project[];
  slots: Record<string, DemoSlot>;
};

export function ProjectView({ base, project, withBanya, settings, all, slots }: Props) {
  const href = projectHref(base, withBanya);
  const houses = all.filter((p) => p.category !== "banya");
  const idx = houses.findIndex((p) => p.slug === base.slug);
  const similar = base.similar
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const price = projectPriceFrom(project);
  const d = project.demo;

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/proekty", label: "Проекты и цены" },
          { href: projectHref(base), label: base.title },
          ...(withBanya ? [{ href, label: "С баней внутри" }] : []),
        ]}
      />
      {base.banyaVariant?.published && <VariantSwitch base={base} withBanya={withBanya} />}
      <DemoFrame note={d.params ?? d.title}>
        <ProjectHero project={project} settings={settings} />
      </DemoFrame>
      {/* Вариант с баней ещё не опубликован — предлагаем узнать цену (средние и большие дома) */}
      {!withBanya && base.banyaVariant && !base.banyaVariant.published && (
        <BanyaVariantHint project={base} phone={settings.phone} />
      )}
      <DemoFrame note={d.suitableFor}>
        <SuitableFor project={project} />
      </DemoFrame>
      <DemoFrame note={d.photos}>
        <Gallery project={project} />
      </DemoFrame>
      <DemoFrame note={d.plans}>
        <FloorPlans project={project} />
      </DemoFrame>
      <DemoFrame note={d.packages}>
        <Packages project={project} />
      </DemoFrame>
      <DemoFrame note={d.options}>
        <Options project={project} />
      </DemoFrame>
      <DemoFrame note={d.included ?? d.extra}>
        <IncludedExtra project={project} />
      </DemoFrame>
      <DemoFrame note={d.calcExample}>
        <CalcExample project={project} />
      </DemoFrame>
      <DemoSlotBlock slot={slots.financing} />
      <DemoFrame note={d.specs}>
        <Specs project={project} settings={settings} />
      </DemoFrame>
      <Steps settings={settings} />
      <DemoSlotBlock slot={slots.offer} />
      <Delivery settings={settings} />
      <DemoSlotBlock slot={slots.cases} />
      <DemoFrame note={settings.demo.excursion}>
        <Excursion settings={settings} />
      </DemoFrame>
      <Faq items={project.faq.length ? project.faq : settings.projectFaq} title="Вопросы по проекту" />

      {similar.length > 0 && (
        <Section title="Похожие проекты">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          {idx >= 0 && <ProjectPager prev={houses[idx - 1]} next={houses[idx + 1]} />}
        </Section>
      )}

      <Section id="zayavka" tone="brand">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-h2 font-extrabold md:text-4xl">
              Получите смету на {project.title.toLowerCase()}
            </h2>
            <p className="text-ink-muted mt-3 text-lg">
              Посчитаем полную стоимость под ключ для вашего участка: дом, фундамент, доставку и подключение.
              Перезвоним в рабочее время.
            </p>
            <a
              href={settings.phone.href}
              data-goal="click_phone"
              className="hover:text-brand mt-6 inline-block text-2xl font-extrabold"
            >
              {settings.phone.display}
            </a>
          </div>
          <LeadForm
            form="project"
            project={project.title}
            packages={project.packages.map((p) => p.name)}
            options={project.options.map((o) => o.name)}
            phone={settings.phone}
            submitLabel="Получить смету"
          />
        </div>
      </Section>

      <JsonLd<Product>
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: project.title,
          description: project.summary,
          url: `${site.url}${href}`,
          image: project.photos.map((p) => `${site.url}${p.src}`),
          brand: { "@type": "Brand", name: site.name },
          ...(price
            ? {
                offers: {
                  "@type": "AggregateOffer",
                  priceCurrency: "RUB",
                  lowPrice: price,
                  offerCount: Math.max(project.packages.length, 1),
                  availability: "https://schema.org/InStock",
                },
              }
            : {}),
        }}
      />
    </>
  );
}
