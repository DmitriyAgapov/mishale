import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StockView, stockMetadata } from "@/components/StockView";
import { getSettings } from "@/lib/content";

// Страницы готовых домов в наличии — по списку settings.inStock
export async function generateStaticParams() {
  return (await getSettings()).inStock.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v-nalichii/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = (await getSettings()).inStock.find((x) => x.slug === slug);
  return item ? stockMetadata(item) : {};
}

export default async function StockPage({ params }: PageProps<"/v-nalichii/[slug]">) {
  const { slug } = await params;
  const settings = await getSettings();
  const item = settings.inStock.find((x) => x.slug === slug);
  if (!item) notFound();
  return <StockView item={item} settings={settings} />;
}
