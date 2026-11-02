import { type Env } from "./env";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deliverLead, leadTarget } from "./index";
import { _resetRateLimit, clientIp, looksLikeBot, rateLimited } from "./guard";
import { detectSource, leadInputSchema, type LeadInput } from "./schema";
import { yougileTaskBody } from "./yougile";

const now = Date.now();
const base: LeadInput = {
  form: "project",
  name: "Иван",
  phone: "8 (912) 345-67-89",
  consent: true,
  startedAt: now - 10_000,
  project: "Модульный дом 60 м²",
  package: "Под ключ",
  options: ["Терраса"],
  utm: { source: "yandex", medium: "cpc", campaign: "gornozavodsk" },
};

const parse = (over: Partial<LeadInput> = {}) => leadInputSchema.parse({ ...base, ...over });

describe("схема заявки", () => {
  it("приводит телефон к +7XXXXXXXXXX", () => {
    expect(parse().phone).toBe("+79123456789");
    expect(parse({ phone: "+7 912 345 67 89" }).phone).toBe("+79123456789");
    expect(parse({ phone: "9123456789" }).phone).toBe("+79123456789");
  });

  it("отклоняет короткий телефон и заявку без согласия", () => {
    expect(leadInputSchema.safeParse({ ...base, phone: "12345" }).success).toBe(false);
    expect(leadInputSchema.safeParse({ ...base, consent: false }).success).toBe(false);
  });

  it("определяет источник по UTM", () => {
    expect(detectSource({ source: "yandex", medium: "cpc" })).toBe("direct");
    expect(detectSource({ source: "avito" })).toBe("avito");
    expect(detectSource({})).toBe("site");
  });
});

describe("защита от спама", () => {
  beforeEach(() => _resetRateLimit());

  it("ловит заполненную ловушку и слишком быструю отправку", () => {
    expect(looksLikeBot({ website: "x", startedAt: now - 10_000 }, now)).toBe(true);
    expect(looksLikeBot({ startedAt: now - 500 }, now)).toBe(true);
    expect(looksLikeBot({ startedAt: now - 10_000 }, now)).toBe(false);
  });

  it("ограничивает 5 заявок за 10 минут с одного IP", () => {
    for (let i = 0; i < 5; i++) expect(rateLimited("1.1.1.1", now + i)).toBe(false);
    expect(rateLimited("1.1.1.1", now + 6)).toBe(true);
    expect(rateLimited("2.2.2.2", now + 6)).toBe(false);
  });

  it("берёт IP из x-forwarded-for", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "5.6.7.8, 10.0.0.1" }))).toBe("5.6.7.8");
  });
});

describe("YouGile", () => {
  it("собирает задачу с названием, колонкой и стикером источника", () => {
    const body = yougileTaskBody(parse(), {
      apiKey: "k",
      columnId: "col-1",
      sourceStickerId: "st-source",
      sourceStates: { direct: "state-direct" },
    });
    expect(body.title).toBe("Заявка по проекту — Модульный дом 60 м² — Иван");
    expect(body.columnId).toBe("col-1");
    expect(body.stickers).toEqual({ "st-source": "state-direct" });
    expect(body.description).toContain("Телефон: +79123456789");
    expect(body.description).toContain("Источник: Яндекс Директ");
  });

  it("экранирует HTML в описании", () => {
    const body = yougileTaskBody(parse({ comment: "<script>x</script>" }), { apiKey: "k", columnId: "c" });
    expect(body.description).not.toContain("<script>");
  });
});

describe("доставка заявки", () => {
  const env = { LEAD_TARGET: "yougile", YOUGILE_API_KEY: "key", YOUGILE_COLUMN_ID: "col" } as Env;

  it("по умолчанию отправляет в YouGile", () => {
    expect(leadTarget({} as Env)).toBe("yougile");
    expect(leadTarget({ LEAD_TARGET: "bitrix" } as Env)).toBe("bitrix");
  });

  it("повторяет запрос после сбоя и отправляет ключ в заголовке", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("err", { status: 500 }))
      .mockResolvedValueOnce(Response.json({ id: "task-1" }, { status: 201 }));
    const res = await deliverLead(parse(), { env, fetchImpl, retryDelayMs: 1 });
    expect(res).toEqual({ target: "yougile", id: "task-1" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const [url, init] = fetchImpl.mock.calls[1];
    expect(url).toBe("https://ru.yougile.com/api-v2/tasks");
    expect(init.headers.Authorization).toBe("Bearer key");
  });

  it("после трёх неудач пробрасывает ошибку", async () => {
    const fetchImpl = vi.fn().mockImplementation(async () => new Response("err", { status: 503 }));
    await expect(deliverLead(parse(), { env, fetchImpl, retryDelayMs: 1 })).rejects.toThrow("503");
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("в Битрикс24 создаёт контакт, потом сделку с UTM", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ result: 11 }))
      .mockResolvedValueOnce(Response.json({ result: 22 }));
    const res = await deliverLead(parse(), {
      env: { LEAD_TARGET: "bitrix", BITRIX_WEBHOOK_URL: "https://x.bitrix24.ru/rest/1/abc" } as Env,
      fetchImpl,
      retryDelayMs: 1,
    });
    expect(res).toEqual({ target: "bitrix", id: "22" });
    expect(fetchImpl.mock.calls[0][0]).toBe("https://x.bitrix24.ru/rest/1/abc/crm.contact.add.json");
    const deal = JSON.parse(fetchImpl.mock.calls[1][1].body);
    expect(deal.fields.CONTACT_ID).toBe(11);
    expect(deal.fields.UTM_SOURCE).toBe("yandex");
  });
});
