// Приводит JSON в форме, которую пишет Keystatic, к форме схемы сайта (schemas.ts):
// - условный блок {discriminant, value} → value или «нет значения»;
// - пустая строка и null → «нет значения» (дальше zod подставляет значения по умолчанию);
// - пустые пункты списков удаляются.
export function normalizeStored(v: unknown): unknown {
  if (v === "" || v === null) return undefined;
  if (Array.isArray(v)) return v.map(normalizeStored).filter((x) => x !== undefined);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    const keys = Object.keys(o);
    if (typeof o.discriminant === "boolean" && keys.every((k) => k === "discriminant" || k === "value")) {
      return o.discriminant ? normalizeStored(o.value) : undefined;
    }
    return Object.fromEntries(
      Object.entries(o)
        .map(([k, x]) => [k, normalizeStored(x)] as const)
        .filter(([, x]) => x !== undefined),
    );
  }
  return v;
}
