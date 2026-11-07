import type { Metadata } from "next";
import { LeadSection } from "@/components/blocks/common";
import { Faq, FaqJsonLd } from "@/components/blocks/project";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Вопросы и ответы о модульных домах",
  description:
    "Зимнее проживание, фундамент, доставка, сроки производства и гарантия: ответы на частые вопросы о модульных домах МИШАЛЕ.",
  alternates: { canonical: "/voprosy" },
};

// Вопросы и ответы (ТЗ §6, §7.10): по разделам, разметка FAQPage — в блоке Faq, форма «Не нашли ответ»
export default async function QuestionsPage() {
  const settings = await getSettings();
  return (
    <>
      <Breadcrumbs items={[{ href: "/voprosy", label: "Вопросы и ответы" }]} />
      <Section className="pt-6 pb-0 md:pt-8 md:pb-0">
        <h1 className="text-h1 font-extrabold md:text-5xl">Вопросы и ответы</h1>
        <p className="text-ink-muted mt-3 max-w-2xl text-lg">
          Собрали то, о чём чаще всего спрашивают перед покупкой модульного дома.
        </p>
      </Section>
      <Faq items={settings.generalFaq} title="О компании и производстве" jsonLd={false} />
      <Faq items={settings.projectFaq} title="О доме: проживание, фундамент, доставка" jsonLd={false} />
      <FaqJsonLd items={[...settings.generalFaq, ...settings.projectFaq]} />
      <LeadSection
        settings={settings}
        title="Не нашли ответ?"
        text="Задайте вопрос — менеджер перезвонит и ответит, а если нужно, посчитает стоимость дома под ваш участок."
      />
    </>
  );
}
