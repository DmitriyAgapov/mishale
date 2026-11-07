import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { getSettings } from "@/lib/content";
import { button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { LEAD_ANCHOR, nav } from "./nav";

// Один адаптивный блок. Меню на телефоне — <details>, без JavaScript.
export async function Header() {
  const s = await getSettings();
  return (
    <header className="border-line bg-bg/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-(--container-site) items-center gap-4 px-4 md:h-20 md:px-6">
        <Link href="/" className="shrink-0" aria-label="МИШАЛЕ — на главную">
          <Image
            src="/logo.svg"
            alt="МИШАЛЕ"
            width={116}
            height={48}
            className="h-10 w-auto md:h-12"
            loading="eager"
          />
        </Link>

        <nav aria-label="Основное меню" className="ml-6 hidden gap-6 md:flex">
          {nav.map((i) => (
            <Link key={i.href} href={i.href} className="text-ink hover:text-brand font-semibold">
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 md:flex">
          <a
            href={s.phone.href}
            data-goal="click_phone"
            className="hover:text-brand flex items-center gap-2 font-extrabold whitespace-nowrap"
          >
            <Phone className="size-4" aria-hidden />
            {s.phone.display}
          </a>
          <a href={LEAD_ANCHOR} className={button({ variant: "primary" })}>
            Рассчитать стоимость
          </a>
        </div>

        <MobileMenu className="group ml-auto md:hidden">
          <summary
            className="rounded-control border-line flex size-11 cursor-pointer list-none items-center justify-center border [&::-webkit-details-marker]:hidden"
            aria-label="Меню"
          >
            <Menu className="size-6 group-open:hidden" aria-hidden />
            <X className="hidden size-6 group-open:block" aria-hidden />
          </summary>
          <div className="border-line bg-bg shadow-card absolute inset-x-0 top-16 border-b px-4 pb-6">
            <nav aria-label="Меню на телефоне" className="flex flex-col">
              {nav.map((i) => (
                <Link key={i.href} href={i.href} className="border-line border-b py-4 text-lg font-semibold">
                  {i.label}
                </Link>
              ))}
            </nav>
            <a href={s.phone.href} className="mt-4 flex items-center gap-2 text-lg font-extrabold">
              <Phone className="size-5" aria-hidden />
              {s.phone.display}
            </a>
          </div>
        </MobileMenu>
      </div>
    </header>
  );
}
