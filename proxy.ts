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

// Любой адрес, кроме основного домена (технический *.amvera.tech, localhost), закрыт от индексации,
// чтобы после запуска в поиске не было дубля сайта. Здесь, а не в headers() next.config:
// в Next 16.4.2 заголовки из конфига попадают в манифест, но не отдаются (проверено 07.11.2026).
const PRODUCTION_HOST = /^(www\.)?mishale74\.ru$/;

function withRobots(request: NextRequest, response: NextResponse): NextResponse {
  // За обратным прокси Amvera публичный домен может прийти в x-forwarded-host
  const raw = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const host = raw.split(",")[0].trim().split(":")[0].toLowerCase();
  if (!PRODUCTION_HOST.test(host)) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export function proxy(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/");
  if (parts[1] === "proekty" && parts[2]) {
    const [, , slug, variant] = parts;
    const { projects, banya } = publishedIndex();
    const ok = variant === "s-banei" ? banya.has(slug) : variant === undefined && projects.has(slug);
    if (!ok) {
      // Путь без маршрута: Next.js отдаёт not-found со статусом 404
      return withRobots(request, NextResponse.rewrite(new URL("/__not-found", request.url)));
    }
  }
  return withRobots(request, NextResponse.next());
}

export const config = {
  // Все адреса, кроме статики Next и картинок
  matcher: ["/((?!_next/static|_next/image|images/|logo.svg).*)"],
};
