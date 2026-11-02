import { type Env } from "./env";
import { escapeHtml, leadLines, leadTitle } from "./format";
import { detectSource, type Lead } from "./schema";

// Адаптер YouGile (ТЗ §9). Формат API v2 не сверен с документацией:
// портал документации — одностраничное приложение, автоматически не читается.
// Проверить на реальном ключе: адрес, формат description (HTML?), формат stickers.

export type YougileConfig = {
  apiKey: string;
  columnId: string;
  baseUrl?: string;
  // Стикер «Источник»: id стикера и соответствие источник → id состояния
  sourceStickerId?: string;
  sourceStates?: Partial<Record<ReturnType<typeof detectSource>, string>>;
};

export function yougileConfigFromEnv(env: Env = process.env): YougileConfig {
  const apiKey = env.YOUGILE_API_KEY;
  const columnId = env.YOUGILE_COLUMN_ID;
  if (!apiKey || !columnId) throw new Error("YouGile не настроен: нет YOUGILE_API_KEY или YOUGILE_COLUMN_ID");
  let sourceStates: YougileConfig["sourceStates"];
  if (env.YOUGILE_SOURCE_STATES) {
    sourceStates = JSON.parse(env.YOUGILE_SOURCE_STATES);
  }
  return {
    apiKey,
    columnId,
    baseUrl: env.YOUGILE_BASE_URL || undefined,
    sourceStickerId: env.YOUGILE_STICKER_SOURCE_ID || undefined,
    sourceStates,
  };
}

export function yougileTaskBody(lead: Lead, cfg: YougileConfig) {
  const body: {
    title: string;
    columnId: string;
    description: string;
    stickers?: Record<string, string>;
  } = {
    title: leadTitle(lead),
    columnId: cfg.columnId,
    description: leadLines(lead).map(escapeHtml).join("<br>"),
  };
  const state = cfg.sourceStates?.[detectSource(lead.utm)];
  if (cfg.sourceStickerId && state) body.stickers = { [cfg.sourceStickerId]: state };
  return body;
}

export async function sendToYougile(lead: Lead, cfg: YougileConfig, fetchImpl: typeof fetch = fetch) {
  const base = cfg.baseUrl ?? "https://ru.yougile.com/api-v2";
  const res = await fetchImpl(`${base}/tasks`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(yougileTaskBody(lead, cfg)),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`YouGile ответил ${res.status}`);
  const data = (await res.json().catch(() => ({}))) as { id?: string };
  return { id: data.id ?? null };
}
