import { defineConfig } from "@playwright/test";

// Проверки на собранном сайте: npm run build, затем npm run test:e2e
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: { baseURL: "http://localhost:3100" },
  webServer: {
    command: "npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 60_000,
    // Без настоящего ключа YouGile заявка не доставится — проверяем ответы формы, а не доставку
    env: { YOUGILE_API_KEY: "", YOUGILE_COLUMN_ID: "" },
  },
});
