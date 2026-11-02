import { detectSource, formTitles, sourceTitles, type Lead } from "./schema";

const messengerTitles: Record<Lead["messenger"], string> = {
  phone: "Звонок",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  max: "MAX",
};

export function leadTitle(lead: Lead): string {
  const parts = [formTitles[lead.form], lead.project, lead.name].filter(Boolean);
  return parts.join(" — ");
}

// Строки описания заявки «Поле: значение» — общие для YouGile и Битрикс24
export function leadLines(lead: Lead): string[] {
  const lines: Array<[string, string | undefined]> = [
    ["Имя", lead.name],
    ["Телефон", lead.phone],
    ["Удобная связь", messengerTitles[lead.messenger]],
    ["Компания", lead.company],
    ["Форма", formTitles[lead.form]],
    ["Проект", lead.project],
    ["Комплектация", lead.package],
    ["Опции", lead.options?.join(", ")],
    ["Комментарий", lead.comment],
  ];
  const out = lines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  if (lead.answers) {
    out.push("Ответы квиза:");
    for (const [q, a] of Object.entries(lead.answers)) out.push(`— ${q}: ${a}`);
  }
  out.push(`Источник: ${sourceTitles[detectSource(lead.utm)]}`);
  const utm = Object.entries(lead.utm)
    .filter(([, v]) => v)
    .map(([k, v]) => `utm_${k}=${v}`);
  if (utm.length) out.push(`UTM: ${utm.join(", ")}`);
  if (lead.page) out.push(`Страница: ${lead.page}`);
  if (lead.clientId) out.push(`ClientID Метрики: ${lead.clientId}`);
  return out;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
