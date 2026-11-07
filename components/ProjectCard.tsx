import Image from "next/image";
import Link from "next/link";
import { projectPriceFrom } from "@/lib/content";
import type { Project } from "@/lib/content/schemas";
import { formatArea, formatPrice, keepUnits, pluralModules } from "@/lib/format";

export function ProjectCard({ project }: { project: Project }) {
  const photo = project.photos[0];
  const price = projectPriceFrom(project);
  return (
    <Link
      href={`/proekty/${project.slug}`}
      data-card
      data-p={project.purposes.join(" ")}
      className="group rounded-card bg-surface shadow-card flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="bg-brand-soft relative aspect-[4/3]">
        {photo && (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {project.stock.available && (
            <span className="bg-accent rounded-full px-3 py-1 text-sm font-semibold text-white">
              В наличии
            </span>
          )}
          {project.banyaVariant?.published && (
            <span className="bg-surface/90 text-ink rounded-full px-3 py-1 text-sm font-semibold">
              Есть вариант с баней
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="text-h3 group-hover:text-brand font-extrabold">{keepUnits(project.title)}</h3>
        <p className="text-ink-muted">
          {formatArea(project.params.area)} · {pluralModules(project.params.modules)}
        </p>
        <p className="mt-auto pt-3 text-lg font-extrabold">
          {price ? `от ${formatPrice(price)}` : "Цена по запросу"}
        </p>
      </div>
    </Link>
  );
}
