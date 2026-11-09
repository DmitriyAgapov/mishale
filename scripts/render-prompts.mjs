// Промпты для нейросетевых визуализаций: node scripts/render-prompts.mjs → docs/RENDER-PROMPTS.md
// Промпт = ракурс + описание дома (по планировке, scripts/plans/data.mjs) + общий стиль.
// Готовые картинки кладутся в assets/renders/<slug>/<ракурс>.jpg и подключаются
// скриптом scripts/add-renders.mjs (на сайте подписываются «Визуализация»).
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { angles, houses, negative, style } from "./renders/data.mjs";

const lines = [
  "# Промпты для визуализаций домов",
  "",
  "Файл собирается скриптом `node scripts/render-prompts.mjs` — правки вносить в скрипт, не сюда.",
  "",
  "## Как пользоваться",
  "",
  "1. Генерировать в одном сервисе и одной модели для всех домов — так картинки будут в одном стиле.",
  "2. **Если сервис принимает картинку-образец** (Midjourney `--sref`/`--cref`, GPT, Kandinsky «по образцу») — прикладывать нынешнюю визуализацию дома из `public/images/projects/<slug>/photos/0/src.jpg`: форма дома и отделка сохранятся лучше, чем по тексту.",
  "3. Формат: 3:2 или 16:10 для фасадов, 4:3 для интерьеров; не меньше 1600 px по ширине.",
  "4. Готовые файлы класть в `assets/renders/<slug>/<ракурс>.jpg` (имена ракурсов — в заголовках ниже, например `assets/renders/dom-45/front.jpg`) и запускать `node scripts/add-renders.mjs` — картинки сожмутся, попадут в фото проекта и подпишутся на сайте «Визуализация».",
  "5. Проверять каждую картинку по планировке: число модулей, где терраса и вход. Нейросеть часто добавляет второй этаж или крутую крышу — такие варианты не брать.",
  "",
  "**Стоп-слова** (negative prompt, если сервис поддерживает):",
  "",
  "```",
  negative,
  "```",
  "",
  "Дома с пометкой «форма условная» — планировки от компании нет, промпт составлен по схеме-примеру. Визуализации для них лучше сделать после получения планировки (раздел 3 вопросов к компании).",
  "",
];

for (const [slug, h] of Object.entries(houses)) {
  lines.push(`## ${h.title} — \`${slug}\`${h.example ? " (форма условная)" : ""}`, "");
  for (const a of h.angles) {
    const angle = angles[a];
    lines.push(`### \`${a}\` — ${angle.title}`, "", "```", `${angle.prompt} ${h.text} ${style}`, "```", "");
  }
}

await writeFile(path.join(process.cwd(), "docs", "RENDER-PROMPTS.md"), lines.join("\n"));
console.log(
  "docs/RENDER-PROMPTS.md:",
  Object.values(houses).reduce((s, h) => s + h.angles.length, 0),
  "промптов",
);
