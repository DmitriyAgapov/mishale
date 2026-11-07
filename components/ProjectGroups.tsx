import { ProjectCard } from "@/components/ProjectCard";
import { PurposeFilter } from "@/components/PurposeFilter";
import { SoonCard } from "@/components/SoonCard";
import type { Project, Settings } from "@/lib/content/schemas";
import { categories, categoryTitles } from "@/lib/content/schemas";

// Подпись группы для фильтра по площади: «до 35 м²», «45–90 м²», «Бани»
function areaLabel(category: string, items: Project[]): string {
  if (category === "banya") return "Бани";
  const areas = items.filter((p) => p.published).map((p) => p.params.area);
  if (!areas.length) return categoryTitles[category as keyof typeof categoryTitles];
  const min = Math.min(...areas);
  const max = Math.max(...areas);
  return min === max ? `${min} м²` : `${min}–${max} м²`;
}

// Проекты по группам (малые, средние, большие, бани) с подбором по назначению и площади.
// Неопубликованный проект (нет цен и планировок) — карточка «Скоро» с формой «Узнать цену» (ТЗ §0).
// Пустая группа не выводится; при фильтре группы без подходящих карточек прячет CSS.
// eagerCount — сколько первых карточек на первом экране (каталог: 3, на главной проекты ниже первого экрана)
export function ProjectGroups({
  projects,
  phone,
  headingLevel = 2,
  eagerCount = 0,
}: {
  projects: Project[];
  phone: Settings["phone"];
  headingLevel?: 2 | 3;
  eagerCount?: number;
}) {
  const groups = categories
    .map((c) => ({ c, items: projects.filter((p) => p.category === c) }))
    .filter((g) => g.items.length);
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <PurposeFilter
      areas={groups.map((g) => ({ key: g.c, label: areaLabel(g.c, g.items) }))}
      index={projects.map((p) => ({ purposes: p.purposes, group: p.category }))}
    >
      <div className="flex flex-col gap-10">
        {groups.map(({ c, items }, gi) => (
          <div key={c} data-group={c}>
            <H className="text-h3 font-extrabold md:text-2xl">{categoryTitles[c]}</H>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) =>
                p.published ? (
                  <ProjectCard
                    key={p.slug}
                    project={p}
                    eager={gi === 0 && i < eagerCount ? (i === 0 ? "first" : "visible") : undefined}
                  />
                ) : (
                  <SoonCard key={p.slug} title={p.title} purposes={p.purposes} phone={phone} />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </PurposeFilter>
  );
}
