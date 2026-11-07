import path from "node:path";
import sharp from "sharp";

// Ширина и высота картинок нужны next/image, но в админке их не вводят — читаем из файла
export async function fillImageSizes(
  v: unknown,
  publicDir = path.join(process.cwd(), "public"),
): Promise<void> {
  if (Array.isArray(v)) {
    await Promise.all(v.map((x) => fillImageSizes(x, publicDir)));
    return;
  }
  if (!v || typeof v !== "object") return;
  const o = v as Record<string, unknown>;
  if (
    typeof o.src === "string" &&
    o.src.startsWith("/") &&
    (o.width === undefined || o.height === undefined)
  ) {
    const file = path.join(publicDir, o.src);
    const meta = await sharp(file)
      .metadata()
      .catch(() => {
        throw new Error(`Нет файла картинки: public${o.src}`);
      });
    o.width = meta.width;
    o.height = meta.height;
  }
  await Promise.all(Object.values(o).map((x) => fillImageSizes(x, publicDir)));
}
