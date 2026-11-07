// 301-перенаправления со старого сайта (ТЗ §6). Источник: sitemap.xml и ссылки старого сайта, 07.11.2026.
// У каждой страницы старого сайта два адреса: короткий (/60) и служебный Tilda (/page112807856.html).

const projects: Array<[area: number, tildaId: number]> = [
  [20, 112516976],
  [35, 112516996],
  [45, 112807576],
  [60, 112807856],
  [75, 112807986],
  [90, 112808106],
  [105, 112808296],
  [120, 112808326],
];

export const legacyRedirects: Array<{ source: string; destination: string; statusCode: 301 }> = [
  { source: "/project", destination: "/proekty", statusCode: 301 },
  { source: "/page111403266.html", destination: "/proekty", statusCode: 301 },
  { source: "/personal", destination: "/soglasie", statusCode: 301 },
  { source: "/politic", destination: "/politika", statusCode: 301 },
  ...projects.flatMap(([area, id]) => [
    { source: `/${area}`, destination: `/proekty/dom-${area}`, statusCode: 301 as const },
    { source: `/page${id}.html`, destination: `/proekty/dom-${area}`, statusCode: 301 as const },
  ]),
];
