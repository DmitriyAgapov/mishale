"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { site } from "@/lib/site";

type Ym = (id: number, method: string, ...args: unknown[]) => void;

// Где счётчик собирает статистику (решение пользователя от 13.11.2026): тестовый сайт на Vercel и домены
// нового сайта. localhost, технический адрес Amvera и автотесты в статистику не попадают
const METRIKA_HOST = /^(mishale\.vercel\.app|(www\.)?mishale174\.ru|(www\.)?mishale74\.ru)$/;
const noop = () => () => {};

// Счётчик Яндекс Метрики (код из кабинета Метрики). Грузится, только если задан site.metrikaId
// и сайт открыт на одном из адресов METRIKA_HOST. Переходы внутри сайта не перезагружают страницу,
// поэтому просмотр отправляется вручную (hit).
export function Metrika() {
  // На сервере адреса нет — счётчик появляется после гидратации
  const onAllowedHost = useSyncExternalStore(
    noop,
    () => METRIKA_HOST.test(window.location.hostname),
    () => false,
  );
  const id = onAllowedHost ? site.metrikaId : null;
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
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${id}","ym");
ym(${id},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`}
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
