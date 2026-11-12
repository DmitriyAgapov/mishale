import type { MetadataRoute } from "next";
import { getProjects, getSettings, projectHref, stockHref } from "@/lib/content";
import { site } from "@/lib/site";

// Карта сайта из данных: опубликованные проекты, варианты с баней и готовые дома в наличии.
// lastModified не указываем: дата сборки не говорит поисковику, менялась ли страница.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  const pages = ["/", "/proekty", "/proizvodstvo", "/kontakty"];
  const projectPages = projects.flatMap((p) => [
    projectHref(p),
    ...(p.banyaVariant?.published ? [projectHref(p, true)] : []),
  ]);
  const stockPages = settings.inStock.map(stockHref);
  return [...pages, ...projectPages, ...stockPages].map((path) => ({ url: `${site.url}${path}` }));
}
