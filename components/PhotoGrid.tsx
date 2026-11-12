import Image from "next/image";
import type { SiteImage } from "@/lib/content/schemas";
import { cn } from "@/lib/cn";

// Сетка фото одного размера (4:3): фото с телефона бывают и вертикальные, и горизонтальные
// visible — сколько фото показать сразу; остальные — под кнопкой «Показать ещё» (<details>, работает без JavaScript)
export function PhotoGrid({
  photos,
  cols = 3,
  visible,
  className,
}: {
  photos: SiteImage[];
  cols?: 2 | 3 | 4;
  visible?: number;
  className?: string;
}) {
  if (!photos.length) return null;
  if (visible && photos.length > visible) {
    const more = photos.length - visible;
    return (
      <div className={className}>
        <Grid photos={photos.slice(0, visible)} cols={cols} />
        <details className="group mt-3">
          <summary className="rounded-control border-line hover:border-brand hover:text-brand mx-auto flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 border px-5 font-semibold group-open:mb-3 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Показать ещё {more} фото</span>
            <span className="hidden group-open:inline">Свернуть</span>
          </summary>
          <Grid photos={photos.slice(visible)} cols={cols} />
        </details>
      </div>
    );
  }
  return <Grid photos={photos} cols={cols} className={className} />;
}

function Grid({ photos, cols, className }: { photos: SiteImage[]; cols: 2 | 3 | 4; className?: string }) {
  // Ширина фото при контенте заданной ширины: промежутки между колонками — 12 px (gap-3)
  const photoWidth = (content: number) => Math.ceil((content - 12 * (cols - 1)) / cols);
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3",
        cols === 3 && "md:grid-cols-3",
        cols === 4 && "md:grid-cols-4",
        className,
      )}
    >
      {photos.map((p) => (
        <figure key={p.src} className="rounded-control bg-surface relative aspect-[4/3] overflow-hidden">
          <Image
            src={p.src}
            alt={p.alt}
            width={p.width}
            height={p.height}
            sizes={`(min-width: 1440px) ${photoWidth(1312)}px, (min-width: 1216px) ${photoWidth(1168)}px, (min-width: 768px) ${Math.round(100 / cols)}vw, 50vw`}
            className="h-full w-full object-cover"
          />
          {p.render && (
            <figcaption className="bg-ink/70 absolute right-2 bottom-2 rounded-full px-2 py-0.5 text-xs text-white">
              Визуализация
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
