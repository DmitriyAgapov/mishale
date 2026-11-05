"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// <details> работает без JavaScript; скрипт только закрывает меню после перехода на другую страницу
export function MobileMenu({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);
  return (
    <details ref={ref} className={className}>
      {children}
    </details>
  );
}
