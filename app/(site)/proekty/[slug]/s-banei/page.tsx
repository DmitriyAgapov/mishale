import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView, projectMetadata } from "@/components/ProjectView";
import {
  asBanyaVariant,
  getDemoSlots,
  getProject,
  getProjects,
  getSettings,
  projectHref,
} from "@/lib/content";

// Вариант дома с баней внутри: /proekty/<slug>/s-banei
// С Cache Components список параметров не может быть пустым, поэтому собираем все проекты,
// у которых вариант описан; неопубликованные отдают 404 (proxy.ts и notFound ниже).
export async function generateStaticParams() {
  return (await getProjects()).filter((p) => p.banyaVariant).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/proekty/[slug]/s-banei">): Promise<Metadata> {
  const { slug } = await params;
  const base = await getProject(slug);
  const v = base && asBanyaVariant(base);
  return base && v ? projectMetadata(v, projectHref(base, true)) : {};
}

export default async function BanyaVariantPage({ params }: PageProps<"/proekty/[slug]/s-banei">) {
  const { slug } = await params;
  const [base, settings, all, slots] = await Promise.all([
    getProject(slug),
    getSettings(),
    getProjects(),
    getDemoSlots(),
  ]);
  const variant = base && asBanyaVariant(base);
  if (!base || !variant) notFound();
  return <ProjectView base={base} project={variant} withBanya settings={settings} all={all} slots={slots} />;
}
