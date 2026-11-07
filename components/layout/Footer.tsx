import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/content";
import { nav } from "./nav";

export async function Footer() {
  const s = await getSettings();
  return (
    <footer className="border-line bg-surface mt-auto border-t pb-24 md:pb-0">
      <div className="mx-auto grid w-full max-w-(--container-site) gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <Image src="/logo.svg" alt="МИШАЛЕ" width={145} height={60} className="h-14 w-auto" />
          <p className="text-ink-muted mt-4">Модульные каркасные дома под ключ от производителя в Миассе.</p>
        </div>

        <nav aria-label="Разделы сайта" className="flex flex-col gap-3">
          <Link href="/" className="hover:text-brand font-semibold">
            Главная
          </Link>
          {nav.map((i) => (
            <Link key={i.href} href={i.href} className="hover:text-brand font-semibold">
              {i.label}
            </Link>
          ))}
          <Link href="/politika" className="text-ink-muted hover:text-brand">
            Политика обработки персональных данных
          </Link>
          <Link href="/soglasie" className="text-ink-muted hover:text-brand">
            Согласие на обработку персональных данных
          </Link>
        </nav>

        <address className="flex flex-col gap-2 not-italic">
          <a href={s.phone.href} className="hover:text-brand text-xl font-extrabold">
            {s.phone.display}
          </a>
          {s.email && (
            <a href={`mailto:${s.email}`} className="hover:text-brand">
              {s.email}
            </a>
          )}
          {s.whatsapp && (
            <a href={s.whatsapp} target="_blank" rel="noopener" className="hover:text-brand">
              Написать в WhatsApp
            </a>
          )}
          {s.address && <span>{s.address.text}</span>}
          {s.workHours && <span className="text-ink-muted">{s.workHours}</span>}
          {s.legal && (
            <span className="text-ink-muted mt-2 text-sm">
              {s.legal.name}, ИНН {s.legal.inn}, ОГРН {s.legal.ogrn}
            </span>
          )}
        </address>
      </div>
    </footer>
  );
}
