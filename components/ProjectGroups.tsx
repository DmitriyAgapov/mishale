import { ProjectCard } from "@/components/ProjectCard";
import { PurposeFilter } from "@/components/PurposeFilter";
import type { Project } from "@/lib/content/schemas";
import { categories, categoryTitles } from "@/lib/content/schemas";

// Проекты по группам (малые, средние, большие, бани) с подбором по назначению.
// Пустая группа не выводится; при фильтре группы без подходящих карточек прячет CSS.
// eagerCount — сколько первых карточек на первом экране (каталог: 3, на главной проекты ниже первого экрана)
export function ProjectGroups({
  projects,
  headingLevel = 2,
  eagerCount = 0,
}: {
  projects: Project[];
  headingLevel?: 2 | 3;
  eagerCount?: number;
}) {
  const groups = categories
    .map((c) => ({ c, items: projects.filter((p) => p.category === c) }))
    .filter((g) => g.items.length);
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <PurposeFilter>
      <div className="flex flex-col gap-10">
        {groups.map(({ c, items }, gi) => (
          <div key={c} data-group>
            <H className="text-h3 font-extrabold md:text-2xl">{categoryTitles[c]}</H>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  eager={gi === 0 && i < eagerCount ? (i === 0 ? "first" : "visible") : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PurposeFilter>
  );
}
