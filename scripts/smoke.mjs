// Быстрая проверка развёрнутого сайта: node scripts/smoke.mjs https://<адрес>
// Проверяет страницы, 301 со старых адресов, 404, robots.txt и sitemap.xml. Заявки не отправляет.

const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) {
  console.error("Укажите адрес: node scripts/smoke.mjs https://mishale74.ru");
  process.exit(2);
}

const checks = [];
const check = (name, fn) => checks.push({ name, fn });
const get = (path, opts = {}) => fetch(base + path, { redirect: "manual", ...opts });

for (const path of [
  "/",
  "/proekty",
  "/proekty/dom-45",
  "/proizvodstvo",
  "/kontakty",
  "/politika",
  "/soglasie",
]) {
  check(`200 ${path}`, async () => {
    const res = await get(path);
    if (res.status !== 200) throw new Error(`код ${res.status}`);
    const html = await res.text();
    if (!html.includes('id="zayavka"') && !["/politika", "/soglasie"].includes(path))
      throw new Error("нет формы заявки");
  });
}

for (const [from, to] of [
  ["/project", "/proekty"],
  ["/60", "/proekty/dom-60"],
  ["/page112807856.html", "/proekty/dom-60"],
  ["/politic", "/politika"],
]) {
  check(`301 ${from} → ${to}`, async () => {
    const res = await get(from);
    const loc = res.headers.get("location") || "";
    if (res.status !== 301) throw new Error(`код ${res.status}`);
    if (new URL(loc, base).pathname !== to) throw new Error(`ведёт на ${loc}`);
  });
}

check("404 /proekty/net-takogo", async () => {
  const res = await get("/proekty/net-takogo");
  if (res.status !== 404) throw new Error(`код ${res.status}`);
});

check("robots.txt и индексация", async () => {
  const robots = await (await get("/robots.txt")).text();
  const page = await get("/");
  const xRobots = page.headers.get("x-robots-tag");
  const html = await page.text();
  const closed = robots.includes("Disallow: /\n") || /Disallow: \/\s*$/.test(robots);
  const metaNoindex = /<meta name="robots" content="noindex/.test(html);
  console.log(
    `   robots.txt: ${closed ? "закрыт" : "открыт"}; meta robots: ${metaNoindex ? "noindex" : "index"}; X-Robots-Tag: ${xRobots ?? "нет"}`,
  );
});

check("sitemap.xml", async () => {
  const res = await get("/sitemap.xml");
  if (res.status !== 200) throw new Error(`код ${res.status}`);
  const n = ((await res.text()).match(/<loc>/g) || []).length;
  if (n < 5) throw new Error(`адресов: ${n}`);
  console.log(`   адресов в sitemap: ${n}`);
});

let failed = 0;
for (const { name, fn } of checks) {
  try {
    await fn();
    console.log(`ok   ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${name}: ${e.message}`);
  }
}
console.log(failed ? `\nНе прошло: ${failed}` : "\nВсё прошло");
process.exit(failed ? 1 : 0);
