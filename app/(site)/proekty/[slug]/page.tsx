import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView, projectMetadata } from "@/components/ProjectView";
import { getProject, getProjects, getSettings, projectHref } from "@/lib/content";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/proekty/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  return p ? projectMetadata(p, projectHref(p)) : {};
}

export default async function ProjectPage({ params }: PageProps<"/proekty/[slug]">) {
  const { slug } = await params;
  const [project, settings, all] = await Promise.all([getProject(slug), getSettings(), getProjects()]);
  if (!project) notFound();
  return <ProjectView base={project} project={project} withBanya={false} settings={settings} all={all} />;
}
