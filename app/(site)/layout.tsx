import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBar } from "@/components/layout/MobileBar";
import { Tracking } from "@/components/Tracking";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="focus:rounded-control focus:bg-surface sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:p-3"
      >
        Перейти к содержимому
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileBar />
      <Tracking />
    </>
  );
}
