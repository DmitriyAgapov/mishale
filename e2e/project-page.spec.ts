import { expect, test } from "@playwright/test";

test.describe("страница проекта", () => {
  test("первый экран, крошки и микроразметка", async ({ page }) => {
    await page.goto("/proekty/dom-45");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Модульный дом 45 м²");
    await expect(page.getByRole("navigation", { name: "Хлебные крошки" })).toContainText("Проекты и цены");
    await expect(page).toHaveTitle(/Модульный дом 45 м² под ключ/);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((t) => t.includes('"@type":"Product"'))).toBe(true);
    expect(ld.some((t) => t.includes('"@type":"BreadcrumbList"'))).toBe(true);
  });

  test("у проекта без планировки блок не выводится", async ({ page }) => {
    await page.goto("/proekty/dom-35");
    await expect(page.getByRole("heading", { name: "Планировка" })).toHaveCount(0);
    await page.goto("/proekty/dom-45");
    await expect(page.getByRole("heading", { name: "Планировка" })).toHaveCount(1);
  });

  test("несуществующий проект — 404", async ({ request }) => {
    const res = await request.get("/proekty/net-takogo");
    expect(res.status()).toBe(404);
  });
});

test.describe("форма заявки", () => {
  test("показывает ошибки пустых полей", async ({ page }) => {
    await page.goto("/proekty/dom-45");
    const form = page.locator("#zayavka form");
    await form.getByRole("button", { name: "Получить смету" }).click();
    await expect(form).toContainText("Как к вам обращаться?");
    await expect(form).toContainText("Введите номер полностью");
    await expect(form).toContainText("Нужно ваше согласие");
  });

  test("маска телефона и сообщение о сбое с телефоном компании", async ({ page }) => {
    await page.goto("/proekty/dom-45");
    const form = page.locator("#zayavka form");
    await form.getByLabel("Имя").fill("Тест");
    const phone = form.getByLabel("Телефон");
    await phone.pressSequentially("89123456789");
    await expect(phone).toHaveValue("+7 (912) 345-67-89");
    await form.getByRole("checkbox", { name: /Даю согласие/ }).check();
    // Защита от спама отсеивает отправку быстрее 3 секунд
    await page.waitForTimeout(3100);
    await form.getByRole("button", { name: "Получить смету" }).click();
    // В тестах YouGile не настроен — ждём понятную ошибку и ссылку на звонок
    await expect(form.getByRole("alert")).toContainText("Позвонить");
  });
});

test.describe("телефон", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("меню открывается и закрывается после перехода", async ({ page }) => {
    await page.goto("/proekty/dom-45");
    await page.getByLabel("Меню", { exact: true }).click();
    const menu = page.getByRole("navigation", { name: "Меню на телефоне" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Проекты и цены" }).click();
    await expect(page).toHaveURL(/\/proekty$/);
    await expect(menu).toBeHidden();
  });

  test("нижняя панель видна", async ({ page }) => {
    await page.goto("/proekty");
    const bar = page.getByRole("navigation", { name: "Быстрая связь" });
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("link", { name: "Позвонить" })).toHaveAttribute("href", "tel:+79822888828");
  });
});

test.describe("варианты и бани", () => {
  test("неопубликованный вариант с баней и баня без данных — 404", async ({ request }) => {
    expect((await request.get("/proekty/dom-45/s-banei")).status()).toBe(404);
    expect((await request.get("/proekty/dom-20/s-banei")).status()).toBe(404);
    expect((await request.get("/proekty/banya-1")).status()).toBe(404);
  });

  test("каталог разбит на группы", async ({ page }) => {
    await page.goto("/proekty");
    await expect(page.getByRole("heading", { name: "Небольшие дома — 2 модуля" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Средние дома" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Большие дома", exact: true })).toBeVisible();
    // Бани без данных — карточки «Скоро» с формой «Узнать цену» (ТЗ §0)
    await expect(page.getByRole("heading", { name: "Бани", exact: true })).toBeVisible();
    await expect(page.getByText("Скоро", { exact: true })).toHaveCount(2);
  });

  test("карточка «Скоро» открывает форму «Узнать цену»", async ({ page }) => {
    await page.goto("/proekty");
    await page.getByRole("button", { name: "Узнать цену" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Узнать цену" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("фильтр по площади оставляет одну группу", async ({ page }) => {
    await page.goto("/proekty");
    await page.getByRole("group", { name: "Площадь" }).getByRole("button", { name: "Бани" }).click();
    await expect(page.getByRole("heading", { name: "Средние дома" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "Бани", exact: true })).toBeVisible();
  });

  test("на среднем доме — предложение варианта с баней", async ({ page }) => {
    await page.goto("/proekty/dom-45");
    await expect(page.getByText("Есть вариант с баней внутри")).toBeVisible();
  });

  test("опубликованный вариант 60 м² с баней: переключатель, цены, построенный дом", async ({ page }) => {
    await page.goto("/proekty/dom-60");
    await page
      .getByRole("navigation", { name: "Вариант дома" })
      .getByRole("link", { name: "С баней внутри" })
      .click();
    await expect(page).toHaveURL(/\/proekty\/dom-60\/s-banei$/);
    await expect(page.getByRole("heading", { level: 1, name: "Модульный дом 60 м² с баней" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Комфорт", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Дом 60 м² с баней внутри" })).toBeVisible();
  });
});

test.describe("новые страницы", () => {
  test("вопросы: страница, одна разметка FAQPage", async ({ page }) => {
    await page.goto("/voprosy");
    await expect(page.getByRole("heading", { level: 1, name: "Вопросы и ответы" })).toBeVisible();
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.filter((t) => t.includes('"FAQPage"'))).toHaveLength(1);
  });

  test("404 показывает проекты и телефон", async ({ page }) => {
    await page.goto("/net-takoi-stranicy");
    await expect(page.getByRole("navigation", { name: "Проекты" }).getByRole("link")).not.toHaveCount(0);
    await expect(page.getByRole("main").getByRole("link", { name: "8 982 28-888-28" })).toBeVisible();
  });

  test("без демо-режима нет пометок и сводки", async ({ page, request }) => {
    expect((await request.get("/chego-ne-hvataet")).status()).toBe(404);
    await page.goto("/");
    await expect(page.locator("[data-demo]")).toHaveCount(0);
    await expect(page.getByText("Тестовая версия сайта")).toHaveCount(0);
  });
});
