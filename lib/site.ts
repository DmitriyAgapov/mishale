// Общие настройки сайта.
// Сайт собирается на компьютере исполнителя (scripts/deploy.sh), переменные сервера при сборке недоступны,
// поэтому всё, что нужно при сборке, хранится здесь, а не в .env.

export const site = {
  name: "МИШАЛЕ",
  url: "https://mishale74.ru",
  // ID счётчика Яндекс Метрики (код от компании 13.11.2026). Счётчик грузится только на mishale.vercel.app
  // и доменах сайта (components/Metrika.tsx): localhost и автотесты в статистику не попадают.
  metrikaId: 114223473 as number | null,
  // Индексация поисковиками. Открыта 20.11.2026 (решение пользователя): сайт запущен на mishale74.ru.
  // Адреса кроме mishale74.ru и www (IP сервера, localhost) закрывает X-Robots-Tag в proxy.ts.
  indexable: true,
} as const;
