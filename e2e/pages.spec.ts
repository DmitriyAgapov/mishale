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
  await expect(form.getByRole("link", { name: "политику" })).toHaveAttribute("href", "/politika");
});

test("микроразметка организации и вопросов на главной", async ({ page }) => {
  await page.goto("/");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
  expect(ld).toContain('"@type":"HomeAndConstructionBusiness"');
  expect(ld).toContain('"@type":"FAQPage"');
});
