import { expect, test } from "@playwright/test";

test("все страницы запуска открываются, у каждой один H1 и форма #zayavka", async ({ page }) => {
  for (const path of ["/", "/proekty", "/proekty/dom-45", "/proizvodstvo", "/kontakty"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page.locator("#zayavka form"), path).toHaveCount(1);
  }
  for (const path of ["/politika", "/soglasie"]) {
    expect((await page.goto(path))?.status(), path).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("ссылки меню и подвала ведут на существующие страницы", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page
    .locator("header a[href^='/'], footer a[href^='/']")
    .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("href")!))]);
  for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
});

test("квиз: 4 вопроса, назад, затем форма с ответами", async ({ page }) => {
  await page.goto("/");
  const quiz = page.locator("#kviz");
  await quiz.getByRole("button", { name: "Постоянное жильё" }).click();
  await quiz.getByRole("button", { name: "45–60 м²" }).click();
  await quiz.getByRole("button", { name: "Назад" }).click();
  await expect(quiz).toContainText("Какая площадь нужна?");
  await quiz.getByRole("button", { name: "75–90 м²" }).click();
  await quiz.getByRole("button", { name: "Есть, без коммуникаций" }).click();
  await quiz.getByRole("button", { name: "Весной" }).click();
  await expect(quiz).toContainText("Куда прислать расчёт?");
  await expect(quiz).toContainText("75–90 м²");
  await expect(quiz.getByLabel("Телефон")).toBeVisible();
});

test("подбор по назначению прячет неподходящие проекты и пустые группы", async ({ page }) => {
  await page.goto("/proekty");
  const cards = page.locator("[data-card]");
  const total = await cards.count();
  await page.getByRole("button", { name: "Гостевой дом" }).click();
  await expect(page.getByRole("button", { name: "Гостевой дом" })).toHaveAttribute("aria-pressed", "true");
  const visible = await cards.filter({ visible: true }).count();
  expect(visible).toBeGreaterThan(0);
  expect(visible).toBeLessThan(total);
  // Гостевые — только малые дома, группа больших прячется
  await expect(page.getByRole("heading", { name: "Большие дома", exact: true })).toBeHidden();
  await page.getByRole("button", { name: "Все", exact: true }).click();
  expect(await cards.filter({ visible: true }).count()).toBe(total);
});

test("в форме есть ссылки на согласие и политику", async ({ page }) => {
  await page.goto("/kontakty");
  const form = page.locator("#zayavka form");
  await expect(form.getByRole("link", { name: "согласие на обработку персональных данных" })).toHaveAttribute(
    "href",
    "/soglasie",
  );
  await expect(form.getByRole("link", { name: "политике" })).toHaveAttribute("href", "/politika");
});

test("микроразметка организации на главной, вопросов и ответов на сайте нет", async ({ page }) => {
  await page.goto("/");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
  expect(ld).toContain('"@type":"HomeAndConstructionBusiness"');
  expect(ld).not.toContain('"@type":"FAQPage"');
  await expect(page.getByRole("heading", { name: "Вопросы и ответы" })).toHaveCount(0);
});

test("старые адреса перенаправляются на новые (301)", async ({ request }) => {
  const cases: Array<[string, string]> = [
    ["/project", "/proekty"],
    ["/page111403266.html", "/proekty"],
    ["/60", "/proekty/dom-60"],
    ["/page112807856.html", "/proekty/dom-60"],
    ["/120", "/proekty/dom-120"],
    ["/personal", "/soglasie"],
    ["/politic", "/politika"],
  ];
  for (const [from, to] of cases) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(new URL(res.headers()["location"], "http://x").pathname, from).toBe(to);
  }
});

test("sitemap содержит опубликованные страницы и не содержит скрытых", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("https://mishale74.ru/proekty/dom-45</loc>");
  expect(xml).toContain("https://mishale74.ru/proizvodstvo</loc>");
  expect(xml).not.toContain("banya-1");
  expect(xml).toContain("https://mishale74.ru/proekty/dom-60/s-banei</loc>");
  expect(xml).not.toContain("dom-45/s-banei");
});

test("вне основного домена — X-Robots-Tag noindex, на mishale74.ru — нет", async ({ request }) => {
  const local = await request.get("/proekty");
  expect(local.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  for (const host of ["mishale74.ru", "www.mishale74.ru"]) {
    const res = await request.get("/proekty", { headers: { "x-forwarded-host": host } });
    expect(res.headers()["x-robots-tag"], host).toBeUndefined();
  }
  const tech = await request.get("/", { headers: { "x-forwarded-host": "mishale.user.mia0.amvera.tech" } });
  expect(tech.headers()["x-robots-tag"]).toBe("noindex, nofollow");
});

test("админка закрыта на собранном сайте", async ({ request }) => {
  expect((await request.get("/keystatic")).status()).toBe(404);
  expect((await request.get("/keystatic/collection/projects")).status()).toBe(404);
  expect((await request.post("/api/keystatic/update", { data: {} })).status()).toBe(404);
  expect((await request.get("/api/keystatic/tree", { headers: { "no-cors": "1" } })).status()).toBe(404);
});

test("готовые дома в наличии: блок на главной и в каталоге, бронь в окне", async ({ page }) => {
  for (const path of ["/", "/proekty"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "Готовые дома в наличии" }), path).toBeVisible();
  }
  const block = page.locator("#v-nalichii");
  await block.getByRole("button", { name: "Забронировать" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Дом 42 м² с кухней и сантехникой" });
  await expect(dialog.getByRole("button", { name: "Забронировать" })).toBeVisible();
});

test("страница готового дома: фото, состав, цена и бронь", async ({ page }) => {
  await page.goto("/proekty");
  await page.locator("#v-nalichii").getByRole("link", { name: "Дом 42 м² с кухней и сантехникой" }).click();
  await expect(page).toHaveURL(/\/v-nalichii\/dom-42-s-kuhnei$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Дом 42 м² с кухней и сантехникой" }),
  ).toBeVisible();
  await expect(page.getByText(/2\s240\s000\s₽/).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Что входит" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Фото" })).toBeVisible();
  // Остальные дома — карточками внизу, сам дом в них не повторяется
  const others = page
    .getByRole("heading", { name: "Другие дома в наличии" })
    .locator("xpath=ancestor::section");
  await expect(others.getByRole("link", { name: "Дом 42 м² базовый" })).toBeVisible();
  await expect(others.getByRole("link", { name: "Дом 42 м² с кухней и сантехникой" })).toHaveCount(0);
  await expect(page.locator("#zayavka").getByRole("button", { name: "Забронировать" })).toBeVisible();
});

test("производство: 6 фото цеха сразу, остальные — по кнопке", async ({ page }) => {
  await page.goto("/proizvodstvo");
  const section = page.getByRole("heading", { name: "Наш цех" }).locator("xpath=ancestor::section");
  const more = section.getByText(/Показать ещё \d+ фото/);
  await expect(section.locator("img:visible")).toHaveCount(6);
  await more.click();
  await expect(section.locator("img:visible")).toHaveCount(17);
  await section.getByText("Свернуть").click();
  await expect(section.locator("img:visible")).toHaveCount(6);
});
