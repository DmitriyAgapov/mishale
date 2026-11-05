// UTM-метки первого захода: сохраняются в браузере, чтобы заявка с любой страницы знала источник.
// Хранилище может быть недоступно (приватный режим) — тогда просто не запоминаем.

const KEY = "mishale_utm";
const FIELDS = ["source", "medium", "campaign", "content", "term"] as const;
export type Utm = Partial<Record<(typeof FIELDS)[number], string>>;

export function parseUtm(search: string): Utm {
  const q = new URLSearchParams(search);
  const utm: Utm = {};
  for (const f of FIELDS) {
    const v = q.get(`utm_${f}`);
    if (v) utm[f] = v.slice(0, 200);
  }
  return utm;
}

export function captureUtm() {
  const utm = parseUtm(window.location.search);
  if (!Object.keys(utm).length) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...utm, at: Date.now() }));
  } catch {}
}

export function readUtm(): Utm {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const { at, ...utm } = JSON.parse(raw) as Utm & { at?: number };
    // Метки старше 90 дней не учитываем
    if (at && Date.now() - at > 90 * 24 * 3600 * 1000) return {};
    return utm;
  } catch {
    return {};
  }
}
