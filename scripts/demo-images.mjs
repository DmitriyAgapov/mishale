// Картинки-заглушки для демо-режима (lib/demo.ts): node scripts/demo-images.mjs
// Пишет public/images/demo/*.jpg. На рабочем сайте не используются — только в данных content/demo/.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const out = path.join(process.cwd(), "public", "images", "demo");

// имя файла → [заголовок, подпись, ширина, высота]
const images = {
  "fasad.jpg": ["Фото дома", "Фасад готового дома на участке", 1200, 900],
  "interer.jpg": ["Фото интерьера", "Комната с отделкой «под ключ»", 1200, 900],
  "terrasa.jpg": ["Фото террасы", "Терраса и вход, вид с участка", 1200, 900],
  "banya.jpg": ["Фото бани", "Баня снаружи и парная изнутри", 1200, 900],
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function svg(title, caption, w, h) {
  // Диагональная штриховка + рамка: сразу видно, что это не настоящее фото
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="40" height="40" fill="#fff7e0"/><rect width="20" height="40" fill="#fdecb8"/></pattern></defs>
  <rect width="100%" height="100%" fill="url(#p)"/>
  <rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="none" stroke="#b45309" stroke-width="6" stroke-dasharray="24 14"/>
  <g font-family="Arial, Helvetica, sans-serif" text-anchor="middle" fill="#7c2d12">
    <text x="50%" y="${h / 2 - 40}" font-size="${Math.round(w / 16)}" font-weight="700">НЕТ ФОТО</text>
    <text x="50%" y="${h / 2 + 30}" font-size="${Math.round(w / 24)}" font-weight="700">${esc(title)}</text>
    <text x="50%" y="${h / 2 + 85}" font-size="${Math.round(w / 34)}">${esc(caption)}</text>
  </g>
</svg>`;
}

await mkdir(out, { recursive: true });
for (const [file, [title, caption, w, h]] of Object.entries(images)) {
  await sharp(Buffer.from(svg(title, caption, w, h)))
    .jpeg({ quality: 70 })
    .toFile(path.join(out, file));
  console.log("public/images/demo/" + file);
}
