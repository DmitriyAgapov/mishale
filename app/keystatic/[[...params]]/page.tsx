import { notFound } from "next/navigation";
import KeystaticApp from "../keystatic";

export const metadata = { title: "Админка", robots: { index: false, follow: false } };

// Только в `npm run dev` у исполнителя: в режиме local админка пишет файлы без авторизации
export default function KeystaticPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <KeystaticApp />;
}
