// Данные для промптов визуализаций (scripts/render-prompts.mjs) и подключения картинок (scripts/add-renders.mjs)

// Общий стиль — по нынешним визуализациям компании, чтобы новые картинки не выбивались из ряда
export const style =
  "Single-storey modular frame house on screw piles with a dark graphite skirting. " +
  "Natural light pine horizontal board cladding with graphite-black accent panels, " +
  "low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, " +
  "large panoramic windows with dark frames, covered terrace on square timber posts " +
  "with horizontal wooden slat railings. Photorealistic architectural visualization, " +
  "Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, " +
  "soft natural daylight, realistic proportions, no text, no watermark.";

export const negative =
  "two storeys, attic, brick, stone, log cabin, steep roof, pitched gable roof, " +
  "distorted proportions, extra floors, text, logo, watermark, people in focus, cartoon";

// Ракурсы: ключ — имя файла в assets/renders/<slug>/
export const angles = {
  front: {
    title: "Фасад со стороны террасы, 3/4",
    alt: "фасад со стороны террасы",
    prompt: "Eye-level three-quarter view from the terrace side.",
  },
  back: {
    title: "Тыльный и боковой фасад, 3/4",
    alt: "тыльный фасад",
    prompt: "Eye-level three-quarter view of the rear and side facades, entrance side visible.",
  },
  aerial: {
    title: "Вид с высоты (дрон)",
    alt: "вид сверху на участок",
    prompt:
      "Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible.",
  },
  evening: {
    title: "Терраса вечером",
    alt: "терраса вечером",
    prompt:
      "Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture.",
  },
  living: {
    title: "Интерьер: кухня-гостиная",
    alt: "интерьер кухни-гостиной",
    prompt:
      "Interior of the kitchen-living room: light wood-panelled walls and ceiling, compact modern kitchen, sofa, dining table, panoramic window to the terrace, Scandinavian style, daylight.",
  },
  bedroom: {
    title: "Интерьер: спальня",
    alt: "интерьер спальни",
    prompt:
      "Interior of a cozy bedroom: light wood-panelled walls, double bed, window with view of pine trees, Scandinavian style, soft daylight.",
  },
  sauna: {
    title: "Интерьер: парная",
    alt: "интерьер парной",
    prompt:
      "Interior of a wood-lined steam room (Russian banya): linden wood benches in two tiers, black metal wood-burning stove with stones, warm light, small window.",
  },
};

// Описание каждого дома — по планировке. example: планировки от компании нет, форма дома условная.
export const houses = {
  "dom-20": {
    title: "Модульный дом 20 м²",
    angles: ["front", "back", "aerial", "evening", "living"],
    text: "Compact square house 6 x 6 m made of two modules; one corner under the common roof is an open covered terrace 3.5 x 3.5 m with steps, a tall panoramic window on the gable end.",
  },
  "dom-35": {
    title: "Модульный дом 35 м²",
    example: true,
    angles: ["front", "back", "aerial", "evening", "living", "bedroom"],
    text: "Small rectangular house 5 x 7 m made of two modules, covered terrace 1.6 m deep along the short front facade with the entrance door and a large window.",
  },
  "dom-45": {
    title: "Модульный дом 45 м²",
    angles: ["front", "back", "aerial", "evening", "living", "bedroom"],
    text: "Rectangular house 7.5 x 6 m made of three modules, a deep covered terrace 2.9 m wide along the whole long facade with panoramic windows and a glass door onto it, small entrance porch with steps at the back.",
  },
  "dom-60": {
    title: "Модульный дом 60 м²",
    example: true,
    angles: ["front", "back", "aerial", "evening", "living", "bedroom"],
    text: "Long rectangular house 10 x 6 m made of four modules, covered terrace 2 m deep along most of the long facade, panoramic windows of the living room onto the terrace.",
  },
  "dom-75": {
    title: "Модульный дом 75 м²",
    angles: ["front", "back", "aerial", "evening", "living", "bedroom"],
    text: "L-shaped house: main volume 12 x 5 m plus a 6 x 2.5 m wing at the back, covered terrace 6 x 2.5 m on one half of the front facade with panoramic windows, open entrance porch with steps in the inner corner of the L.",
  },
  "dom-90": {
    title: "Модульный дом 90 м²",
    angles: ["front", "back", "aerial", "evening", "living", "bedroom"],
    text: "Symmetrical house 15 m wide: a central living block 5 m wide projecting forward with floor-to-ceiling windows, two lower side wings 5 x 6 m; a U-shaped covered terrace wraps the central block at the front, a small covered veranda 5 x 2 m with steps at the back.",
  },
  "dom-105": {
    title: "Модульный дом 105 м²",
    angles: ["front", "back", "aerial", "evening", "living", "bedroom"],
    text: "Large rectangular house 12 x 10 m, a long covered veranda 2.7 m deep along the whole 10 m side facade with steps, and a second covered veranda 6 x 2.5 m in one corner of the front facade with the entrance.",
  },
  "dom-120": {
    title: "Модульный дом 120 м²",
    angles: ["front", "back", "aerial", "evening", "living", "bedroom"],
    text: "Large house 10 x 12 m made of eight modules, a covered terrace 2.5 m deep along the whole 10 m front facade with panoramic windows of the kitchen and living room, small side entrance porch with steps.",
  },
  "banya-1": {
    title: "Модульная баня 18 м²",
    example: true,
    angles: ["front", "back", "evening", "sauna"],
    text: "Small single-module sauna house 6 x 3 m (Russian banya) with a metal chimney, a small open porch with steps at one end, a narrow horizontal window in the steam room, a regular window in the rest room.",
  },
  "banya-2": {
    title: "Модульная баня 30 м²",
    example: true,
    angles: ["front", "back", "aerial", "evening", "sauna"],
    text: "Sauna house 6 x 5 m made of two modules (Russian banya) with a metal chimney, open terrace 3.5 x 1.5 m in front of the rest room with a panoramic window, side entrance with steps.",
  },
};
