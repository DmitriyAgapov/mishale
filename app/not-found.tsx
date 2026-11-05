import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBar } from "@/components/layout/MobileBar";
import { button } from "@/components/ui/button";

export const metadata = { title: "Страница не найдена" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <div className="mx-auto flex w-full max-w-(--container-site) flex-col items-start gap-4 px-4 py-20 md:px-6">
          <p className="text-brand text-lg font-extrabold">Ошибка 404</p>
          <h1 className="text-h1 font-extrabold md:text-5xl">Такой страницы нет</h1>
          <p className="text-ink-muted max-w-xl text-lg">
            Возможно, адрес изменился после обновления сайта. Посмотрите все проекты или вернитесь на главную.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/proekty" className={button({ size: "lg" })}>
              Все проекты
            </Link>
            <Link href="/" className={button({ variant: "secondary", size: "lg" })}>
              На главную
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
