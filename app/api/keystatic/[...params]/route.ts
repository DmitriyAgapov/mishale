import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

const handler = makeRouteHandler({ config });
const notFound = () => new Response("Not Found", { status: 404 });

// Только в `npm run dev`: на рабочем сайте запись файлов через админку закрыта
export const GET = process.env.NODE_ENV === "production" ? notFound : handler.GET;
export const POST = process.env.NODE_ENV === "production" ? notFound : handler.POST;
