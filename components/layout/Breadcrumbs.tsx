import Link from "next/link";
import type { BreadcrumbList } from "schema-dts";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";

type Crumb = { href: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ href: "/", label: "Главная" }, ...items];
  return (
    <>
      <nav aria-label="Хлебные крошки" className="mx-auto w-full max-w-(--container-site) px-4 pt-4 md:px-6">
        <ol className="text-ink-muted flex flex-wrap gap-x-2 text-sm">
          {all.map((c, i) => (
            <li key={c.href} className="flex gap-2">
              {i > 0 && <span aria-hidden>→</span>}
              {i === all.length - 1 ? (
                <span aria-current="page">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-brand">
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd<BreadcrumbList>
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: `${site.url}${c.href}`,
          })),
        }}
      />
    </>
  );
}
