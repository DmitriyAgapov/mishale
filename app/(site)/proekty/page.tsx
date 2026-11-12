import type { Metadata } from "next";
import { LeadSection } from "@/components/blocks/common";
import { InStock } from "@/components/blocks/InStock";
import { Quiz } from "@/components/forms/Quiz";
import { Faq } from "@/components/blocks/project";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProjectGroups } from "@/components/ProjectGroups";
import { Section } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import { getCatalogProjects, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Проекты модульных домов и бань — цены и планировки",
  description:
    "Модульные каркасные дома от 20 до 120 м², варианты с баней внутри и отдельные бани от производителя в Миассе: планировки, комплектации, цены.",
  alternates: { canonical: "/proekty" },
};

// Каталог (ТЗ §7.3): группы, подбор по назначению и площади, карточки «Скоро», квиз кнопкой, вопросы, форма
export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getCatalogProjects(), getSettings()]);
  return (
    <>
      <Breadcrumbs items={[{ href: "/proekty", label: "Проекты и цены" }]} />
      <Section className="pt-6 md:pt-8">
        <h1 className="text-h1 font-extrabold md:text-5xl">Проекты модульных домов</h1>
        <p className="text-ink-muted mt-3 mb-8 max-w-2xl text-lg">
          Дома от 20 до 120 м², у средних и больших — вариант с баней внутри. Все дома собираются в нашем цеху
          в Миассе и приезжают на участок готовыми.
        </p>
        <ProjectGroups projects={projects} phone={settings.phone} eagerCount={3} />
      </Section>
      <InStock settings={settings} />
      {/* Квиз кнопкой (ТЗ §7.3): <details> раскрывается без JavaScript */}
      <Section tone="brand">
        <details className="group">
          <summary className="flex cursor-pointer list-none flex-col gap-4 md:flex-row md:items-center md:justify-between [&::-webkit-details-marker]:hidden">
            <span>
              <span className="text-h2 block font-extrabold md:text-3xl">
                Не знаете, какой проект выбрать?
              </span>
              <span className="text-ink-muted mt-2 block text-lg">
                Ответьте на 4 вопроса — подберём проект и посчитаем стоимость под ключ.
              </span>
            </span>
            <span className={button({ size: "lg" }) + " group-open:hidden"}>Рассчитать за 1 минуту</span>
          </summary>
          <div className="mt-8 max-w-3xl">
            <Quiz phone={settings.phone} />
          </div>
        </details>
      </Section>
      <Faq items={settings.generalFaq} />
      <LeadSection
        settings={settings}
        title="Не нашли подходящий проект?"
        text="Расскажите, какой дом нужен, — подберём проект или адаптируем планировку и посчитаем стоимость под ключ."
      />
    </>
  );
}
