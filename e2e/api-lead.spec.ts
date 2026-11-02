import { expect, test } from "@playwright/test";

const valid = {
  form: "contact",
  name: "Тест",
  phone: "+7 912 345-67-89",
  consent: true,
  startedAt: Date.now() - 10_000,
};

test("главная отвечает и закрыта от индексации", async ({ request }) => {
  const res = await request.get("/");
  expect(res.status()).toBe(200);
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
});

test("невалидная заявка — 422 с полями", async ({ request }) => {
  const res = await request.post("/api/lead", { data: { ...valid, phone: "123", consent: false } });
  expect(res.status()).toBe(422);
  const body = await res.json();
  expect(body.fields.phone).toBeTruthy();
  expect(body.fields.consent).toBeTruthy();
});

test("бот получает «успех», но заявка не отправляется", async ({ request }) => {
  const res = await request.post("/api/lead", { data: { ...valid, website: "spam" } });
  expect(res.status()).toBe(200);
});

test("без настроек YouGile — 502 и просьба позвонить", async ({ request }) => {
  const res = await request.post("/api/lead", {
    data: { ...valid, startedAt: Date.now() - 10_000 },
    headers: { "x-forwarded-for": "9.9.9.9" },
  });
  expect(res.status()).toBe(502);
  expect((await res.json()).error).toContain("Позвоните");
});
