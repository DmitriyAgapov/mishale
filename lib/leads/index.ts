import { type Env } from "./env";
import { bitrixConfigFromEnv, sendToBitrix } from "./bitrix";
import { type Lead } from "./schema";
import { sendToYougile, yougileConfigFromEnv } from "./yougile";

export type LeadTarget = "yougile" | "bitrix";

export function leadTarget(env: Env = process.env): LeadTarget {
  return env.LEAD_TARGET === "bitrix" ? "bitrix" : "yougile";
}

// Отправка заявки выбранному получателю: 1 попытка + 2 повтора с паузой
export async function deliverLead(
  lead: Lead,
  opts: { env?: Env; fetchImpl?: typeof fetch; retryDelayMs?: number } = {},
) {
  const env = opts.env ?? process.env;
  const fetchImpl = opts.fetchImpl ?? fetch;
  const delay = opts.retryDelayMs ?? 700;
  const target = leadTarget(env);
  const send =
    target === "bitrix"
      ? () => sendToBitrix(lead, bitrixConfigFromEnv(env), fetchImpl)
      : () => sendToYougile(lead, yougileConfigFromEnv(env), fetchImpl);

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return { target, ...(await send()) };
    } catch (e) {
      lastError = e;
      if (attempt < 2) await new Promise((r) => setTimeout(r, delay * (attempt + 1)));
    }
  }
  throw lastError;
}
