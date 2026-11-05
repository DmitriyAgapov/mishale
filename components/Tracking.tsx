"use client";

import { useEffect } from "react";
import { reachGoal, type Goal } from "@/lib/metrika";
import { captureUtm } from "@/lib/utm";

// Запоминает UTM первого захода и отправляет цели по ссылкам с data-goal (телефон, WhatsApp)
export function Tracking() {
  useEffect(() => {
    captureUtm();
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-goal]");
      if (el?.dataset.goal) reachGoal(el.dataset.goal as Goal);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
