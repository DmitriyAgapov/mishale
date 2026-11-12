"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import type { SiteImage } from "@/lib/content/schemas";

// Просмотр фото крупно на нативном <dialog> (фокус, Esc и затемнение даёт браузер).
// Обёртка ловит клики по элементам с data-lightbox-index внутри children — сами превью остаются
// серверной разметкой (PhotoTrigger). Листание: кнопки, стрелки клавиатуры, свайп.
export function Lightbox({ photos, children }: { photos: SiteImage[]; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const photo = photos[index];
  const many = photos.length > 1;
  const go = (step: number) => setIndex((i) => (i + step + photos.length) % photos.length);

  return (
    <div
      onClick={(e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox-index]");
        if (!el) return;
        e.stopPropagation(); // вложенный Lightbox не откроет второе окно
        setIndex(Number(el.dataset.lightboxIndex));
        ref.current?.showModal();
      }}
    >
      {children}
      <dialog
        ref={ref}
        aria-label="Просмотр фото"
        className="m-auto h-full max-h-none w-full max-w-none bg-black/90 p-0 backdrop:bg-black/60"
        onClick={(e) => {
          // клик мимо фото и кнопок закрывает окно
          if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop)
            ref.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === "ArrowRight") go(1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {photo && (
          <div data-backdrop="1" className="flex h-full flex-col gap-3 p-4 pt-16 md:px-20 md:pb-6">
            {/* Фото вписывается в оставшееся место целиком (object-contain) */}
            <div data-backdrop="1" className="relative min-h-0 flex-1">
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <p className="text-center text-sm text-white/80">
              {photo.alt}
              {photo.render ? " · визуализация" : ""}
              {many ? ` · ${index + 1} из ${photos.length}` : ""}
            </p>
          </div>
        )}
        <button
          type="button"
          aria-label="Закрыть"
          className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"
          onClick={() => ref.current?.close()}
        >
          <X className="size-6" aria-hidden />
        </button>
        {many && (
          <>
            <button
              type="button"
              aria-label="Предыдущее фото"
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 md:left-4"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="size-7" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 md:right-4"
              onClick={() => go(1)}
            >
              <ChevronRight className="size-7" aria-hidden />
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}

// Прозрачная кнопка поверх превью: открывает фото номер index в ближайшем Lightbox
export function PhotoTrigger({ index, alt }: { index: number; alt: string }) {
  return (
    <button
      type="button"
      data-lightbox-index={index}
      aria-label={`Открыть фото крупно: ${alt}`}
      className="focus-visible:outline-brand absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-3 focus-visible:-outline-offset-4"
    />
  );
}
