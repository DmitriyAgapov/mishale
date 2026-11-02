// Защита формы от спама: ограничение частоты по IP и проверка времени заполнения.
// Хранилище в памяти процесса: на одном контейнере Amvera этого достаточно.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 3000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_PER_WINDOW;
}

export function looksLikeBot(input: { website?: string; startedAt: number }, now = Date.now()): boolean {
  if (input.website) return true;
  const elapsed = now - input.startedAt;
  return elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS;
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

// Для тестов
export function _resetRateLimit() {
  hits.clear();
}
