# Сайт МИШАЛЕ (mishale74.ru)

Next.js 16 (App Router, Cache Components), Tailwind CSS 4, TypeScript. ТЗ — `../docs/tz-nextjs-amvera.md`, состояние — [docs/STATUS.md](docs/STATUS.md).

## Команды

| Команда                  | Что делает                                              |
| ------------------------ | ------------------------------------------------------- |
| `npm run dev`            | Разработка на http://localhost:3000                     |
| `npm run build`          | Сборка                                                  |
| `npm run start`          | Запуск собранного сайта (так же запускает Amvera)       |
| `npm run check`          | Линтер + типы + модульные тесты — перед каждым коммитом |
| `npm run test:e2e`       | Проверки на собранном сайте (сначала `npm run build`)   |
| `npm run format`         | Prettier                                                |
| `npm run plans`          | Перерисовать планировки из `scripts/plans/data.mjs`     |
| `npm run renders`        | Подключить визуализации из `assets/renders/`            |
| `npm run render-prompts` | Собрать `docs/RENDER-PROMPTS.md`                        |

## Важно

- **`.npmrc`: `legacy-peer-deps=true`.** npm 10 падает на цикле необязательных peer-зависимостей `vite` → `@vitejs/devtools` → `vitest@*`. С этой настройкой npm не ставит peer-зависимости сам, поэтому они указаны явно (`vite`, `react`, `eslint`, `typescript`). Добавляя пакет, проверьте его peer-зависимости.
- **Версии пакетов закреплены точно** (без `^`). Обновление — отдельным коммитом.
- **Amvera не передаёт переменные окружения на этапе сборки.** Всё, что нужно при сборке (адрес сайта, ID Метрики, индексация), — в `lib/site.ts`. В `.env.example` — только то, что читается во время работы сервера.
- **Индексация** выключена (`site.indexable = false`) до дня запуска.
- В `next.config.ts` включены `cacheComponents` и `partialPrefetching`: данные, читаемые из файлов, оборачиваются в `'use cache'`. Перед работой с API Next.js читайте документацию в `node_modules/next/dist/docs/` (см. `AGENTS.md`).

## Админка

`npm run dev` → http://localhost:3000/keystatic. Изменения сразу пишутся в `content/` и `public/images/projects/`; на сайт попадают после коммита и деплоя. На собранном сайте админка отдаёт 404 (режим `local` пишет файлы без авторизации). Файлы `content/` вручную лучше не править: формат — тот, что пишет Keystatic (см. `docs/STATUS.md`).

## Заявки

`POST /api/lead` → проверка схемой (`lib/leads/schema.ts`) → защита от спама (`lib/leads/guard.ts`) → адаптер по `LEAD_TARGET`: YouGile (`lib/leads/yougile.ts`) или Битрикс24 (`lib/leads/bitrix.ts`), 3 попытки. Персональные данные в логи не пишутся.

## Демо-режим (тестовый сайт)

`DEMO_CONTENT=1 npm run build` и `DEMO_CONTENT=1 npm run start` (переменная нужна и при запуске) — недостающие данные заполняются примерами из `content/demo/` с жёлтыми пометками «нужно / зачем», сводка — `/chego-ne-hvataet`. Только для тестового адреса: на рабочем сайте переменную не задавать (подробности — `lib/demo.ts`, `docs/STATUS.md`).

## Деплой

`amvera.yml`: окружение node 22, Amvera выполняет `npm install` и `npm run build`, запускает `npm run start` на порту 3000. Сборка — при пуше в `master` репозитория Amvera или через вебхук GitHub.
