import { type NextRequest } from "next/server";
import { deliverLead } from "@/lib/leads";
import { clientIp, looksLikeBot, rateLimited } from "@/lib/leads/guard";
import { leadInputSchema } from "@/lib/leads/schema";

const PHONE_HINT = "Не получилось отправить заявку. Позвоните нам, пожалуйста.";

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = leadInputSchema.safeParse(json);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [i.path.join("."), i.message]));
    return Response.json({ ok: false, error: "Проверьте поля формы", fields }, { status: 422 });
  }
  const lead = parsed.data;

  // Ботам отвечаем «успехом», чтобы они не подбирали обход
  if (looksLikeBot(lead)) return Response.json({ ok: true });

  if (rateLimited(clientIp(request.headers))) {
    return Response.json(
      { ok: false, error: "Слишком много заявок. Попробуйте позже или позвоните нам." },
      { status: 429 },
    );
  }

  try {
    await deliverLead(lead);
    return Response.json({ ok: true });
  } catch (e) {
    // В лог — только причина, без персональных данных (152-ФЗ)
    console.error("[lead] не доставлена:", lead.form, e instanceof Error ? e.message : "unknown");
    return Response.json({ ok: false, error: PHONE_HINT }, { status: 502 });
  }
}
