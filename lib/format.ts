// Форматирование для сайта: цены, площади, даты

const nbsp = " ";

export function formatPrice(rub: number): string {
  // 1290000 → «1 290 000 ₽» с неразрывными пробелами
  return `${Math.round(rub).toLocaleString("ru-RU").replace(/\s/g, nbsp)}${nbsp}₽`;
}

export function formatArea(m2: number): string {
  return `${String(m2).replace(".", ",")}${nbsp}м²`;
}

export function pluralModules(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} модуль`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} модуля`;
  return `${n} модулей`;
}

// Маска телефона для поля ввода: «+7 (912) 345-67-89»
export function maskPhone(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("8") || d.startsWith("7")) d = d.slice(1);
  d = d.slice(0, 10);
  if (!d) return "";
  let out = "+7 (" + d.slice(0, 3);
  if (d.length >= 3) out += ")";
  if (d.length > 3) out += " " + d.slice(3, 6);
  if (d.length > 6) out += "-" + d.slice(6, 8);
  if (d.length > 8) out += "-" + d.slice(8, 10);
  return out;
}

// Неразрывный пробел между числом и единицей: «45 м²» не разрывается на две строки
export function keepUnits(s: string): string {
  // \b после кириллицы в JS не работает — граница проверяется опережающим просмотром
  return s.replace(/(\d) (?=м²|мм(?![а-яё])|м(?![а-яё])|модул|недел|₽)/g, `$1${nbsp}`);
}
