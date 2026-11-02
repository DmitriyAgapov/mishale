import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Модульные дома под ключ от производителя в Миассе | МИШАЛЕ",
    template: "%s | МИШАЛЕ",
  },
  description:
    "Модульные каркасные дома под ключ от собственного производства в Миассе. Доставка и монтаж по Челябинской области.",
  icons: { icon: "/logo.svg" },
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#894720",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
