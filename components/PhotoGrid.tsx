import Image from "next/image";
import type { SiteImage } from "@/lib/content/schemas";
import { cn } from "@/lib/cn";

// Сетка фото одного размера (4:3): фото с телефона бывают и вертикальные, и горизонтальные
export function PhotoGrid({
  photos,
  cols = 3,
  className,
}: {
  photos: SiteImage[];
  cols?: 2 | 3 | 4;
  className?: string;
}) {
  if (!photos.length) return null;
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
            sizes={`(min-width: 768px) ${Math.round(100 / cols)}vw, 50vw`}
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
