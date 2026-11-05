import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";

// Настоящий код 404 для несуществующих проектов и неопубликованных вариантов с баней.
// С частичным пререндером оболочка страницы уходит со статусом 200 раньше, чем сработает notFound(),
// поэтому адрес проверяется здесь, до рендера (docs: not-found.md, streaming.md «Status codes»).

type Index = { projects: Set<string>; banya: Set<string> };
let index: Index | null = null;

function publishedIndex(): Index {
  if (index) return index;
  const dir = path.join(process.cwd(), "content", "projects");
  const projects = new Set<string>();
  const banya = new Set<string>();
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".json")) continue;
    const data = JSON.parse(readFileSync(path.join(dir, f), "utf8")) as {
      slug?: string;
      published?: boolean;
      banyaVariant?: { published?: boolean } | null;
    };
    if (!data.published || !data.slug) continue;
    projects.add(data.slug);
    if (data.banyaVariant?.published) banya.add(data.slug);
  }
  index = { projects, banya };
  return index;
}

export function proxy(request: NextRequest) {
  const [, , slug, variant] = request.nextUrl.pathname.split("/");
  const { projects, banya } = publishedIndex();
  const ok = variant === "s-banei" ? banya.has(slug) : projects.has(slug);
  if (slug && !ok) {
    // Путь без маршрута: Next.js отдаёт not-found со статусом 404
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/proekty/:slug", "/proekty/:slug/s-banei"],
};
