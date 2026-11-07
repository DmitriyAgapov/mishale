"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

type Ym = (id: number, method: string, ...args: unknown[]) => void;

// Счётчик Яндекс Метрики. Пока site.metrikaId не задан — ничего не загружается.
// Переходы внутри сайта не перезагружают страницу, поэтому просмотр отправляется вручную (hit).
export function Metrika() {
  const id = site.metrikaId;
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!id) return;
    if (first.current) {
      first.current = false; // первый просмотр отправляет init
      return;
    }
    const ym = (window as { ym?: Ym }).ym;
    ym?.(id, "hit", window.location.href, { referer: document.referrer });
  }, [id, pathname]);

  if (!id) return null;
  return (
    <>
      <Script id="metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${id},"init",{defer:false,clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
