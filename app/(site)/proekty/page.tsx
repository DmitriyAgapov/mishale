import type { Metadata } from "next";
import { LeadSection } from "@/components/blocks/common";
import { Faq } from "@/components/blocks/project";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProjectGroups } from "@/components/ProjectGroups";
import { Section } from "@/components/ui/Section";
import { getProjects, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Проекты модульных домов и бань — цены и планировки",
  description:
    "Модульные каркасные дома от 20 до 120 м², варианты с баней внутри и отдельные бани от производителя в Миассе: планировки, комплектации, цены.",
  alternates: { canonical: "/proekty" },
};

// Каталог (ТЗ §7.3): группы и подбор по назначению, форма заявки, вопросы
export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  return (
    <>
      <Breadcrumbs items={[{ href: "/proekty", label: "Проекты и цены" }]} />
      <Section className="pt-6 md:pt-8">
        <h1 className="text-h1 font-extrabold md:text-5xl">Проекты модульных домов</h1>
        <p className="text-ink-muted mt-3 mb-8 max-w-2xl text-lg">
          Дома от 20 до 120 м², у средних и больших — вариант с баней внутри. Все дома собираются в нашем цеху
          в Миассе и приезжают на участок готовыми.
        </p>
        <ProjectGroups projects={projects} />
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
