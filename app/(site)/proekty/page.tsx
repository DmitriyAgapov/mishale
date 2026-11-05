import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/ui/Section";
import { getProjects } from "@/lib/content";
import { categories, categoryTitles } from "@/lib/content/schemas";

export const metadata: Metadata = {
  title: "Проекты модульных домов и бань — цены и планировки",
  description:
    "Модульные каркасные дома от 20 до 120 м², варианты с баней внутри и отдельные бани от производителя в Миассе: планировки, комплектации, цены.",
  alternates: { canonical: "/proekty" },
};

// Каталог по группам: малые, средние, большие дома, бани. Пустая группа не выводится.
// Подбор по назначению — этап 3.
export default async function ProjectsPage() {
  const projects = await getProjects();
  const groups = categories
    .map((c) => ({ c, items: projects.filter((p) => p.category === c) }))
    .filter((g) => g.items.length);
  return (
    <>
      <Breadcrumbs items={[{ href: "/proekty", label: "Проекты и цены" }]} />
      <Section className="pt-6 md:pt-8">
        <h1 className="text-h1 font-extrabold md:text-5xl">Проекты модульных домов</h1>
        <p className="text-ink-muted mt-3 max-w-2xl text-lg">
          Дома от 20 до 120 м², у средних и больших — вариант с баней внутри. Все дома собираются в нашем цеху
          в Миассе и приезжают на участок готовыми.
        </p>
        {groups.map(({ c, items }) => (
          <div key={c} className="mt-10">
            <h2 className="text-h2 font-extrabold">{categoryTitles[c]}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        ))}
      </Section>
    </>
  );
}
