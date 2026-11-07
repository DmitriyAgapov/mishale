import type { MetadataRoute } from "next";
import { getProjects, projectHref } from "@/lib/content";
import { site } from "@/lib/site";

// Карта сайта из данных: только опубликованные проекты и варианты с баней.
// lastModified не указываем: дата сборки не говорит поисковику, менялась ли страница.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const pages = ["/", "/proekty", "/proizvodstvo", "/kontakty"];
  const projectPages = projects.flatMap((p) => [
    projectHref(p),
    ...(p.banyaVariant?.published ? [projectHref(p, true)] : []),
  ]);
  return [...pages, ...projectPages].map((path) => ({ url: `${site.url}${path}` }));
}
