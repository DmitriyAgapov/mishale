import { type Env } from "./env";
import { leadLines, leadTitle } from "./format";
import { type Lead } from "./schema";

// Адаптер Битрикс24 (ТЗ §9): контакт + сделка в воронке «Заказ дома».
// Включается с 31.01.2027 переменной LEAD_TARGET=bitrix. Проверить на портале компании.

export type BitrixConfig = {
  webhookUrl: string; // https://<портал>.bitrix24.ru/rest/<user>/<token>/
  categoryId?: string;
};

export function bitrixConfigFromEnv(env: Env = process.env): BitrixConfig {
  const webhookUrl = env.BITRIX_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("Битрикс24 не настроен: нет BITRIX_WEBHOOK_URL");
  return {
    webhookUrl: webhookUrl.endsWith("/") ? webhookUrl : `${webhookUrl}/`,
    categoryId: env.BITRIX_DEAL_CATEGORY_ID,
  };
}

async function call<T>(
  cfg: BitrixConfig,
  method: string,
  payload: unknown,
  fetchImpl: typeof fetch,
): Promise<T> {
  const res = await fetchImpl(`${cfg.webhookUrl}${method}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });
  const data = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
  if (!res.ok || data.error || data.result === undefined) {
    throw new Error(`Битрикс24 ${method}: ${res.status} ${data.error ?? ""}`.trim());
  }
  return data.result;
}

export async function sendToBitrix(lead: Lead, cfg: BitrixConfig, fetchImpl: typeof fetch = fetch) {
  const contactId = await call<number>(
    cfg,
    "crm.contact.add",
    {
      fields: {
        NAME: lead.name,
        PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }],
        SOURCE_ID: "WEB",
      },
    },
    fetchImpl,
  );
  const dealId = await call<number>(
    cfg,
    "crm.deal.add",
    {
      fields: {
        TITLE: leadTitle(lead),
        CONTACT_ID: contactId,
        SOURCE_ID: "WEB",
        ...(cfg.categoryId ? { CATEGORY_ID: cfg.categoryId } : {}),
        COMMENTS: leadLines(lead).join("\n"),
        UTM_SOURCE: lead.utm.source,
        UTM_MEDIUM: lead.utm.medium,
        UTM_CAMPAIGN: lead.utm.campaign,
        UTM_CONTENT: lead.utm.content,
        UTM_TERM: lead.utm.term,
      },
    },
    fetchImpl,
  );
  return { id: String(dealId) };
}
