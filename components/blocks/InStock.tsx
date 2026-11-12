import Image from "next/image";
import { Check, House } from "lucide-react";
import { PriceDialog } from "@/components/SoonCard";
import { Section } from "@/components/ui/Section";
import { button } from "@/components/ui/button";
import type { Settings } from "@/lib/content/schemas";
import { formatPrice } from "@/lib/format";

// Готовые дома и модули в наличии (settings.inStock): главная и каталог.
// Это не проекты каталога, поэтому своя карточка: состав, цена и заявка в окне
export function InStock({ settings }: { settings: Settings }) {
  if (!settings.inStock.length) return null;
  return (
    <Section
      id="v-nalichii"
      title="Готовые дома в наличии"
      lead="Уже собраны в нашем цеху и готовы к перевозке — установка на участке за 1–2 дня."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {settings.inStock.map((item) => {
          const photo = item.photos[0];
          return (
            <article
              key={item.title}
              className="rounded-card bg-surface shadow-card flex flex-col overflow-hidden"
            >
              <div className="bg-brand-soft text-brand relative flex aspect-[4/3] items-center justify-center">
                {photo ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="size-full object-cover"
                  />
                ) : (
                  <House className="size-16" aria-hidden />
                )}
                <span className="bg-accent absolute top-3 left-3 rounded-full px-3 py-1 text-sm font-semibold text-white">
                  В наличии
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-h3 font-extrabold">{item.title}</h3>
                <p className="text-ink-muted mt-1">{item.size}</p>
                {item.purpose && <p className="text-ink-muted text-sm">{item.purpose}</p>}
                <p className="mt-3 text-2xl font-extrabold">
                  {item.price ? formatPrice(item.price) : "Цена — по запросу"}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {item.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="text-accent mt-0.5 size-5 shrink-0" aria-hidden />
                      {i}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <PriceDialog
                    title={item.title}
                    project={`В наличии: ${item.title}`}
                    phone={settings.phone}
                    trigger="Забронировать"
                    submitLabel="Забронировать"
                    className={button({ variant: "primary", full: true })}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="text-ink-muted mt-6">
        Можно под ключ: септик, скважина, мебель. В пределах города бесплатно приедем на участок и оценим,
        можно ли поставить дом.
      </p>
    </Section>
  );
}
