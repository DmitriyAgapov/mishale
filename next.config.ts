import type { NextConfig } from "next";
import { legacyRedirects } from "./redirects";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async redirects() {
    return legacyRedirects;
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    // images.ts читает размеры картинок из public/ при сборке. Предупреждение о трассировке всего проекта
    // касается только output: "standalone", которого у нас нет (Amvera запускает next start из полной папки)
    ignoreIssue: [{ path: "**/lib/content/images.ts", title: /Dynamic filesystem access/ }],
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
