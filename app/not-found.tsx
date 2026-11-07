import Link from "next/link";
import { DemoBanner } from "@/components/demo/Demo";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBar } from "@/components/layout/MobileBar";
import { button } from "@/components/ui/button";
import { getProjects, getSettings, projectHref } from "@/lib/content";
import { formatArea } from "@/lib/format";

export const metadata = { title: "Страница не найдена" };

// 404 (ТЗ §6): список проектов вместо поиска — их всего 10, и контакты
export default async function NotFound() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  return (
    <>
      <DemoBanner />
      <Header />
      <main id="main" className="flex-1">
        <div className="mx-auto flex w-full max-w-(--container-site) flex-col items-start gap-4 px-4 py-16 md:px-6 md:py-20">
          <p className="text-brand text-lg font-extrabold">Ошибка 404</p>
          <h1 className="text-h1 font-extrabold md:text-5xl">Такой страницы нет</h1>
          <p className="text-ink-muted max-w-xl text-lg">
            Возможно, адрес изменился после обновления сайта. Выберите проект или позвоните — подскажем.
          </p>
          <div className="mt-4 grid w-full gap-8 md:grid-cols-[2fr_1fr]">
            <nav aria-label="Проекты">
              <h2 className="text-h3 font-extrabold">Проекты</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={projectHref(p)}
                      className="rounded-control bg-surface hover:text-brand flex min-h-11 items-center justify-between gap-3 px-4 py-2 font-semibold"
                    >
                      {p.title}
                      <span className="text-ink-muted text-sm font-normal">{formatArea(p.params.area)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h2 className="text-h3 font-extrabold">Связаться</h2>
              <a
                href={settings.phone.href}
                data-goal="click_phone"
                className="hover:text-brand mt-4 block text-2xl font-extrabold"
              >
                {settings.phone.display}
              </a>
              {settings.workHours && <p className="text-ink-muted mt-1">{settings.workHours}</p>}
              <div className="mt-4 flex flex-col gap-3">
                {settings.whatsapp && (
                  <a
                    href={settings.whatsapp}
                    target="_blank"
                    rel="noopener"
                    data-goal="click_whatsapp"
                    className={button({ variant: "whatsapp" })}
                  >
                    Написать в WhatsApp
                  </a>
                )}
                <Link href="/" className={button({ variant: "secondary" })}>
                  На главную
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
