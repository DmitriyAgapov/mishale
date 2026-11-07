import { site } from "./site";

// Цели Яндекс Метрики. Счётчик подключается на этапе 4; до этого вызовы ничего не делают.
export type Goal =
  | "click_phone"
  | "click_whatsapp"
  | "lead_submit"
  | "lead_submit_project"
  | "lead_submit_quiz"
  | "lead_submit_catalog"
  | "lead_submit_excursion"
  | "lead_error"
  | "filter_purpose"
  | "quiz_start"
  | "quiz_step";

type Ym = (id: number, method: string, ...args: unknown[]) => void;

export function reachGoal(goal: Goal, params?: Record<string, unknown>) {
  const ym = (globalThis as { ym?: Ym }).ym;
  if (!site.metrikaId || typeof ym !== "function") return;
  try {
    ym(site.metrikaId, "reachGoal", goal, params);
  } catch {
    // Метрика заблокирована расширением — заявка важнее статистики
  }
}

export function getClientId(): Promise<string | undefined> {
  const ym = (globalThis as { ym?: Ym }).ym;
  if (!site.metrikaId || typeof ym !== "function") return Promise.resolve(undefined);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(undefined), 500);
    try {
      ym(site.metrikaId!, "getClientID", (id: string) => {
        clearTimeout(timer);
        resolve(id);
      });
    } catch {
      clearTimeout(timer);
      resolve(undefined);
    }
  });
}
