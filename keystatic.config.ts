import { collection, config, fields, singleton } from "@keystatic/core";
import { categories, categoryTitles, purposes, purposeTitles } from "./lib/content/schemas";

// Админка Keystatic (ТЗ §10). Режим local: работает только у исполнителя в `npm run dev`,
// на рабочем сайте /keystatic и /api/keystatic отдают 404 (proxy.ts и сами маршруты).
// Поля повторяют lib/content/schemas.ts; форму, которую пишет Keystatic, к схеме сайта приводит lib/content/normalize.ts.

const text = (label: string, description?: string) => fields.text({ label, description });
const longText = (label: string) => fields.text({ label, multiline: true });
const price = (label = "Цена, ₽") =>
  fields.integer({ label, description: "Пусто — «по запросу»", validation: { min: 1 } });

// dir — папка в public/images: projects (из админки) или real (фото от компании, npm run photos)
const projectImage = (label: string, dir = "projects") =>
  fields.object(
    {
      src: fields.image({
        label: "Файл",
        directory: `public/images/${dir}`,
        publicPath: `/images/${dir}`,
        validation: { isRequired: true },
      }),
      alt: text("Описание для поисковиков и незрячих (alt)", "Например: «Модульный дом 60 м², фасад»"),
      caption: text("Подпись", "Например: «Миасс, 2026»"),
      render: fields.checkbox({ label: "Это визуализация, а не фото готового дома", defaultValue: false }),
    },
    { label },
  );

const images = (label: string) =>
  fields.array(projectImage("Изображение"), {
    label,
    itemLabel: (p) => p.fields.alt.value || "Изображение",
  });

const plans = fields.array(
  fields.object(
    {
      ...projectImage("Планировка").fields,
      rooms: fields.array(
        fields.object({
          name: text("Комната"),
          area: fields.number({ label: "Площадь, м²", step: 0.01, validation: { isRequired: true } }),
        }),
        { label: "Комнаты", itemLabel: (p) => `${p.fields.name.value} — ${p.fields.area.value ?? ""} м²` },
      ),
    },
    { label: "Планировка" },
  ),
  { label: "Планировки", itemLabel: (p) => p.fields.alt.value || "Планировка" },
);

const packages = fields.array(
  fields.object({
    name: text("Название", "Одинаковые названия для всех проектов"),
    price: price(),
    items: fields.array(text("Пункт"), { label: "Состав", itemLabel: (p) => p.value }),
    priceDate: fields.date({ label: "Цена действует с" }),
  }),
  { label: "Комплектации", itemLabel: (p) => p.fields.name.value || "Комплектация" },
);

const options = fields.array(fields.object({ name: text("Опция"), price: price() }), {
  label: "Опции",
  itemLabel: (p) => p.fields.name.value || "Опция",
});

const specs = fields.array(fields.object({ name: text("Параметр"), value: text("Значение") }), {
  label: "Технические характеристики",
  itemLabel: (p) => `${p.fields.name.value}: ${p.fields.value.value}`,
});

const faq = (label: string) =>
  fields.array(fields.object({ q: text("Вопрос"), a: longText("Ответ") }), {
    label,
    itemLabel: (p) => p.fields.q.value || "Вопрос",
  });

const seo = fields.object(
  {
    title: text("Title", "Пусто — по шаблону: «<название> под ключ — цена от …, Миасс»"),
    description: longText("Description"),
  },
  { label: "SEO" },
);

const strings = (label: string, item: string) =>
  fields.array(text(item), { label, itemLabel: (p) => p.value });

export default config({
  storage: { kind: "local" },
  ui: { brand: { name: "МИШАЛЕ" } },
  collections: {
    projects: collection({
      label: "Проекты",
      path: "content/projects/*",
      format: { data: "json" },
      slugField: "title",
      columns: ["title", "category", "published"],
      schema: {
        title: fields.slug({
          name: { label: "Название", description: "Например: «Модульный дом 60 м²»" },
          slug: {
            label: "Адрес страницы",
            description: "Латиница, например dom-60. После публикации не менять — сломаются ссылки",
          },
        }),
        published: fields.checkbox({ label: "Опубликован", defaultValue: false }),
        order: fields.integer({ label: "Порядок в каталоге", validation: { isRequired: true } }),
        category: fields.select({
          label: "Группа",
          options: categories.map((c) => ({ label: categoryTitles[c], value: c })),
          defaultValue: "medium",
        }),
        params: fields.object(
          {
            area: fields.number({ label: "Площадь, м²", step: 0.1, validation: { isRequired: true } }),
            modules: fields.integer({ label: "Модулей", validation: { isRequired: true, min: 1 } }),
            moduleSize: text("Размер модуля", "Например: 2,5 × 6 м"),
            ceiling: fields.number({ label: "Высота потолков, м", step: 0.01 }),
            productionWeeks: text("Срок производства, недель", "Пусто — общий срок из настроек"),
          },
          { label: "Параметры" },
        ),
        priceFrom: price("Цена «от», ₽ — если комплектаций нет"),
        purposes: fields.multiselect({
          label: "Кому подходит (фильтр)",
          options: purposes.map((p) => ({ label: purposeTitles[p], value: p })),
        }),
        summary: longText("Короткое описание"),
        photos: images("Фото (первое — на первом экране)"),
        plans,
        packages,
        included: strings("Входит в цену", "Пункт"),
        extra: strings("Оплачивается отдельно", "Пункт"),
        suitableFor: fields.array(fields.object({ title: text("Сценарий"), text: longText("Пояснение") }), {
          label: "Кому подходит",
          itemLabel: (p) => p.fields.title.value || "Сценарий",
        }),
        options,
        calcExample: fields.conditional(fields.checkbox({ label: "Есть пример расчёта под ключ" }), {
          true: fields.object({
            city: text("Город"),
            date: fields.date({ label: "Дата расчёта", validation: { isRequired: true } }),
            rows: fields.array(
              fields.object({
                name: text("Строка"),
                sum: fields.integer({ label: "Сумма, ₽", validation: { isRequired: true } }),
              }),
              { label: "Строки", itemLabel: (p) => p.fields.name.value || "Строка" },
            ),
            total: fields.integer({ label: "Итого, ₽", validation: { isRequired: true } }),
          }),
          false: fields.empty(),
        }),
        stock: fields.object(
          {
            available: fields.checkbox({ label: "В наличии", defaultValue: false }),
            deliveryWeeks: fields.integer({ label: "Поставка, недель" }),
            salePrice: price("Цена со скидкой, ₽"),
          },
          { label: "Наличие" },
        ),
        specs,
        faq: faq("Вопросы по проекту (пусто — общие)"),
        similar: fields.array(fields.relationship({ label: "Проект", collection: "projects" }), {
          label: "Похожие проекты",
          itemLabel: (p) => p.value ?? "Проект",
        }),
        seo,
        banyaVariant: fields.conditional(
          fields.checkbox({ label: "Есть вариант с баней внутри (только средние и большие дома)" }),
          {
            true: fields.object({
              published: fields.checkbox({ label: "Вариант опубликован", defaultValue: false }),
              title: text("Название", "Например: «Модульный дом 60 м² с баней»"),
              summary: longText("Короткое описание (пусто — как у дома)"),
              area: fields.number({ label: "Площадь, м² (пусто — как у дома)", step: 0.1 }),
              priceFrom: price("Цена «от», ₽ — если комплектаций нет"),
              photos: images("Фото (пусто — фото дома)"),
              plans,
              packages,
              options,
              specs,
              seo,
            }),
            false: fields.empty(),
          },
        ),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: "Настройки и контакты",
      path: "content/settings",
      format: { data: "json" },
      schema: {
        phone: fields.object(
          {
            display: text("Как показывать", "Например: 8 982 28-888-28"),
            href: text("Ссылка", "tel:+79822888828"),
          },
          { label: "Телефон" },
        ),
        email: text("E-mail"),
        whatsapp: text("WhatsApp", "https://wa.me/79822888828"),
        telegram: text("Telegram", "https://t.me/…"),
        vk: text("ВКонтакте"),
        avito: text("Авито"),
        address: fields.conditional(fields.checkbox({ label: "Указать адрес цеха" }), {
          true: fields.object({
            text: text("Адрес"),
            lat: fields.number({ label: "Широта", step: 0.000001, validation: { isRequired: true } }),
            lng: fields.number({ label: "Долгота", step: 0.000001, validation: { isRequired: true } }),
          }),
          false: fields.empty(),
        }),
        workHours: text("Режим работы"),
        legal: fields.conditional(fields.checkbox({ label: "Указать реквизиты (оператор ПДн)" }), {
          true: fields.object({
            name: text("Юрлицо или ИП"),
            inn: text("ИНН"),
            ogrn: text("ОГРН / ОГРНИП"),
            address: text("Юридический адрес"),
          }),
          false: fields.empty(),
        }),
        trust: fields.array(fields.object({ value: text("Цифра"), label: text("Подпись") }), {
          label: "Цифры доверия",
          itemLabel: (p) => `${p.fields.value.value} — ${p.fields.label.value}`,
        }),
        priceFromAll: fields.integer({
          label: "Цена «от» на главной, ₽",
          description: "Пусто — минимальная цена опубликованных домов",
          validation: { min: 1 },
        }),
        priceTiers: fields.array(
          fields.object({
            name: text("Название", "Например: Комфорт"),
            pricePerM2: fields.integer({
              label: "Цена за м² дома, ₽",
              validation: { isRequired: true, min: 1 },
            }),
            items: strings("Состав", "Пункт"),
            priceDate: fields.date({ label: "Цена действует с" }),
          }),
          {
            label: "Комплектации для всех домов",
            description:
              "Цена = площадь дома × цена за м² + терраса и крыльцо с планировки. Свои комплектации в проекте важнее",
            itemLabel: (p) => `${p.fields.name.value} — ${p.fields.pricePerM2.value ?? "?"} ₽/м²`,
          },
        ),
        terracePricePerM2: price("Терраса и крыльцо, ₽ за м²"),
        warrantyYears: fields.integer({ label: "Гарантия, лет", validation: { isRequired: true, min: 1 } }),
        warrantyItems: strings("Что покрывает гарантия", "Пункт"),
        productionWeeks: text("Срок производства, недель", "Например: 2–4"),
        construction: fields.array(
          fields.object({ title: text("Раздел"), items: strings("Пункты", "Пункт") }),
          { label: "Из чего строим", itemLabel: (p) => p.fields.title.value },
        ),
        steps: fields.array(fields.object({ title: text("Этап"), text: longText("Описание") }), {
          label: "Этапы строительства",
          itemLabel: (p) => p.fields.title.value,
        }),
        delivery: strings("Доставка и монтаж", "Пункт"),
        projectFaq: faq("Вопросы на страницах проектов"),
        generalFaq: faq("Общие вопросы"),
        workshopVsSite: fields.array(
          fields.object({ topic: text("Тема"), workshop: text("Цех"), site: text("Стройка на участке") }),
          { label: "Цех против стройки", itemLabel: (p) => p.fields.topic.value },
        ),
        excursion: fields.conditional(fields.checkbox({ label: "Показывать экскурсию в цех" }), {
          true: fields.object({
            schedule: text("Когда", "Например: по субботам в 11:00, по записи"),
            online: fields.checkbox({ label: "Есть онлайн-экскурсия", defaultValue: false }),
            gift: text("Подарок или скидка за визит"),
          }),
          false: fields.empty(),
        }),
        directions: longText("Как доехать до цеха"),
        offer: fields.conditional(fields.checkbox({ label: "Показывать сезонное предложение" }), {
          true: fields.object({
            title: text("Заголовок"),
            text: longText("Условия"),
            until: fields.date({ label: "Действует до" }),
          }),
          false: fields.empty(),
        }),
        cases: fields.array(
          fields.object({
            title: text("Что построили", "Например: Дом 45 м² «Комфорт»"),
            city: text("Город"),
            date: text("Когда сдали", "Например: сентябрь 2026"),
            text: longText("Коротко об объекте"),
            review: longText("Отзыв владельца"),
            author: text("Автор отзыва", "Только с согласия на публикацию"),
            project: fields.relationship({
              label: "Проект",
              collection: "projects",
              description: "Пусто — дом не по проекту: показывается только на главной",
            }),
            withBanya: fields.checkbox({ label: "Это вариант с баней внутри", defaultValue: false }),
            photos: fields.array(projectImage("Фото", "real"), {
              label: "Фото",
              itemLabel: (p) => p.fields.alt.value,
            }),
          }),
          {
            label: "Построенные дома и отзывы",
            itemLabel: (p) => `${p.fields.title.value}, ${p.fields.city.value}`,
          },
        ),
        inStock: fields.array(
          fields.object({
            title: text("Название", "Например: Дом 42 м² с кухней и сантехникой"),
            size: text("Площадь или размеры", "Например: 30 м² + терраса 12 м²"),
            purpose: text("Для чего подходит", "Необязательно"),
            items: fields.array(text("Пункт"), { label: "Что входит", itemLabel: (p) => p.value }),
            price: fields.integer({ label: "Цена, ₽", description: "Пусто — «Цена по запросу»" }),
            photos: fields.array(projectImage("Фото", "stock"), {
              label: "Фото",
              itemLabel: (p) => p.fields.alt.value,
            }),
          }),
          { label: "Готовые дома в наличии", itemLabel: (p) => p.fields.title.value },
        ),
        heroPhoto: fields.conditional(fields.checkbox({ label: "Своё фото на первом экране главной" }), {
          true: projectImage("Фото", "real"),
          false: fields.empty(),
        }),
        productionPhotos: fields.array(projectImage("Фото", "real"), {
          label: "Фото цеха",
          itemLabel: (p) => p.fields.alt.value,
        }),
        deliveryPhotos: fields.array(projectImage("Фото", "real"), {
          label: "Фото доставки и монтажа",
          itemLabel: (p) => p.fields.alt.value,
        }),
        business: fields.conditional(fields.checkbox({ label: "Показывать блок «Для бизнеса»" }), {
          true: fields.object({ text: longText("Вступление"), items: strings("Условия", "Пункт") }),
          false: fields.empty(),
        }),
        financing: fields.array(fields.object({ title: text("Способ"), text: longText("Условия") }), {
          label: "Ипотека и рассрочка",
          itemLabel: (p) => p.fields.title.value,
        }),
        productionDetails: fields.array(
          fields.object({ title: text("Раздел"), items: strings("Пункты", "Пункт") }),
          { label: "Производство подробно", itemLabel: (p) => p.fields.title.value },
        ),
      },
    }),
  },
});
