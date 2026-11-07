// Меню сайта. Разделы второй очереди (кейсы, оплата, для бизнеса) добавятся после запуска.
export const nav = [
  { href: "/proekty", label: "Проекты и цены" },
  { href: "/proizvodstvo", label: "Производство" },
  { href: "/voprosy", label: "Вопросы" },
  { href: "/kontakty", label: "Контакты" },
] as const;

// Якорь формы заявки на каждой странице
export const LEAD_ANCHOR = "#zayavka";
