// Данные визуализаций: промпты и пакеты для ChatGPT (scripts/render-prompts.mjs) и подключение готовых картинок
// (scripts/add-renders.mjs).
//
// Решения пользователя от 09.11.2026: у каждого дома 2 фасада и 3 интерьера, все картинки в одном стиле;
// фасад серый; без панорамного остекления — только обычные окна и остеклённые двери там, где они на чертеже.
// Единый стиль держится тремя вещами: одинаковые блоки текста ниже, одинаковый формат 3:2 и одни и те же
// картинки-образцы, которые прикладываются к каждому запросу (styleRefs).

// Образцы стиля — одобренные картинки пробы дома 75 м², пути от папки пакета дома
export const styleRefs = {
  exterior: "../dom-75/results/front.png",
  interior: "../dom-75/results/living.png",
};

// Фасад = сцена + материалы + общие правила; у варианта в металлическом профиле (ракурс metal) свои материалы
export const exteriorScene =
  "Photorealistic architectural photograph, 3:2 landscape, camera at standing eye level (1.6 m), 28 mm lens, straight verticals. " +
  "Early autumn afternoon, soft side sunlight, a few light clouds. Southern Urals setting: birch and pine trees, mown lawn, a gravel path, no fence close to the house.";

export const exteriorMaterials =
  "Materials: grey horizontal wooden board cladding; graphite window frames, trims, gutters and downpipes; dark graphite standing-seam metal roof; " +
  "warm honey-coloured wooden deck, steps and posts; house raised on screw piles with a dark slatted skirting.";

export const metalMaterials =
  "Materials exactly as in the photos: dark graphite vertical profiled metal sheet cladding on the outer walls, natural wood boards on the wall under the terrace or veranda " +
  "and vertical wooden accent strips where the photos show them; graphite window frames, trims and posts; dark metal roof; warm wooden deck and steps; house on screw piles.";

export const exteriorRules =
  "Exactly one storey. Only standard-size rectangular windows; a glazed door only where the plan shows a door; no panoramic or floor-to-ceiling glazing.";

export const interiorStyle =
  "Photorealistic interior photograph, 3:2 landscape, camera at 1.5 m height, 20-24 mm lens without distortion, straight verticals. " +
  "Soft natural daylight from the windows, calm and warm. Finishes: light pine horizontal boards on walls and flat ceiling (about 2.5 m), " +
  "small round white ceiling spotlights, light grey wood-effect floor, white interior doors with black handles, white window frames. " +
  "Furniture: simple Scandinavian, light oak, beige and sage-green textiles; kitchens with sage-green flat fronts and a light wood worktop. " +
  "Only standard-size windows; no panoramic or floor-to-ceiling glazing.";

export const anchorText =
  "The style reference image is from the same series of visualizations: match its lighting, colour grading, materials and level of detail exactly. Do not copy its layout or shape.";

export const planText =
  "The floor plan image is the construction drawing: follow it exactly for the outline, walls, doors and window positions. Do not add, remove or move rooms, doors or windows.";

export const metalAnchorText =
  "The style reference image is from the same series of visualizations: match its lighting, colour grading, setting and level of detail exactly, but use the cladding described below, not its cladding. Do not copy its shape.";

export const metalPhotoText =
  "The photos show the real built house: reproduce its shape, proportions, roof, terrace, openings and its metal cladding exactly.";

export const photoText =
  "The photos show the real built house: reproduce its shape, proportions, roof, terrace and openings exactly; take only the shape from them, not the cladding colour.";

export const ending = "No people, animals, vehicles, text, logos, signs or watermarks.";

export const negative =
  "two storeys, attic, dormers, panoramic windows, floor-to-ceiling glazing, glass walls, brick, stone, log cabin, steep roof, " +
  "distorted proportions, extra rooms, text, logo, watermark, people, cartoon";

// Ракурсы: ключ — имя файла картинки (results/<ключ>.png в пакете, assets/renders/<slug>/<ключ>.* в репозитории).
// Порядок ключей — порядок фото на сайте: сначала фасады, потом интерьеры.
export const angles = {
  front: { title: "Фасад, главный ракурс", alt: "фасад", kind: "exterior" },
  back: { title: "Фасад, второй ракурс", alt: "фасад, второй ракурс", kind: "exterior" },
  metal: {
    title: "Фасад в металлическом профиле",
    alt: "фасад, обшивка металлическим профилем",
    kind: "exterior",
  },
  living: { title: "Гостиная", alt: "гостиная", kind: "interior" },
  kitchen: { title: "Кухня", alt: "кухня", kind: "interior" },
  bedroom: { title: "Спальня", alt: "спальня", kind: "interior" },
  bathroom: { title: "Санузел", alt: "санузел", kind: "interior" },
  rest: { title: "Комната отдыха", alt: "комната отдыха", kind: "interior" },
  sauna: { title: "Парная", alt: "парная", kind: "interior" },
  wash: { title: "Моечная", alt: "моечная", kind: "interior" },
};

// Дома. plan — чертёж компании assets/plans-original/<slug>.jpg; photos — фото построенного дома
// (site-assets/from-client/proekty/...), если чертежа нет. shape — общая форма, views и rooms — по ракурсам.
// done — картинки, уже одобренные пользователем. metal — ещё один фасад в металлическом профиле, как на фото построенного
// (решение пользователя от 09.11.2026: основной набор в серой доске, профиль — дополнительно).
export const houses = {
  "dom-20": {
    title: "Модульный дом 20 м²",
    plan: true,
    shape:
      "Compact house 6 x 6 m built from two modules under one low-pitch gable roof. One corner of the square, 3.5 x 3.5 m (bottom-left on the plan), " +
      "is an open covered terrace under the main roof, with a timber post at its outer corner and steps on its bottom edge. " +
      "The glazed entrance door opens from the terrace into the kitchen-living room.",
    views: {
      front:
        "Camera at the bottom-left of the plan, three-quarter view of the terrace corner and the entrance door.",
      back: "Camera at the top-right of the plan, three-quarter view of the two outer walls without the terrace.",
    },
    rooms: {
      living:
        "Kitchen-living room 8 m² (room 01): a compact straight kitchen along one wall and a small two-seat sofa; the glazed entrance door to the terrace. Camera in the corner opposite the entrance door.",
      bedroom:
        "Bedroom 6.9 m² (room 02): a double bed almost filling the room, headboard against a solid wall, two small bedside tables, the window and door as on the plan.",
      bathroom:
        "Bathroom 3.4 m² (room 03): a shower enclosure with a glass door, a toilet, a small vanity basin with a round mirror; light grey large-format tiles in the shower and behind the basin, pine boards elsewhere.",
    },
  },

  "dom-35": {
    title: "Модульный дом 35 м²",
    metal: true,
    photos: {
      exterior: ["dom-35/fasad/IMG_7200.JPG", "dom-35/fasad/IMG_7206.JPG"],
      living: ["dom-35/interer/IMG_7309.JPG"],
      bedroom: ["dom-35/interer/IMG_7308.JPG"],
      bathroom: ["dom-35/interer/IMG_7307.JPG"],
    },
    shape:
      "Small rectangular house about 7 x 5 m built from two modules; a covered terrace about 1.6 m deep across the short front facade on dark posts, with steps; " +
      "the entrance door and one window open onto the terrace. Roof shape exactly as in the photos.",
    views: {
      front: "Three-quarter view of the terrace front and one long side.",
      back: "Three-quarter view of the rear and the other long side.",
      metal: "Same camera as the main view: three-quarter view of the terrace front and one long side.",
    },
    rooms: {
      living:
        "Kitchen-living room about 20 m²: a straight sage-green kitchen along one wall, a small dining table, a sofa; the glazed door to the terrace. Room shape and openings as in the interior photo.",
      bedroom:
        "Bedroom about 8 m²: a double bed, bedside tables, a window with a light curtain. Room shape and window as in the interior photo.",
      bathroom:
        "Bathroom about 4 m²: a walk-in shower with a glass screen, a toilet, a dark vanity with a white basin, a small window; light grey tiles. Layout as in the interior photo.",
    },
  },

  "dom-45": {
    title: "Модульный дом 45 м²",
    plan: true,
    shape:
      "Rectangular house 7.5 x 6 m built from three modules under one low-pitch gable roof. A deep covered terrace 2.9 m along the whole long top facade on the plan, " +
      "on timber posts, with wide steps in its middle and a glazed door from the kitchen-living room. A small open entrance porch with steps at the bottom-right corner.",
    views: {
      front: "Camera at the top-right of the plan, three-quarter view of the long terrace facade.",
      back: "Camera at the bottom-right of the plan, three-quarter view of the entrance porch with steps and the right gable end.",
    },
    rooms: {
      living:
        "Living area of the kitchen-living room 21 m² (room 01): a sofa, a coffee table and an armchair, the glazed door to the terrace in the top wall; the kitchen only at the edge of the frame.",
      kitchen:
        "Kitchen area of the same room 01: a straight sage-green kitchen along the wall, a dining table for four by the window. Camera from the sofa area.",
      bedroom:
        "Bedroom 6.5 m² (room 03, bottom-left): a double bed, one bedside table, a narrow wardrobe, the window as on the plan. A compact but cosy room.",
    },
  },

  "dom-60": {
    title: "Модульный дом 60 м²",
    photos: {
      exterior: ["dom-60/postroennye/terenkul/fasad/Shine-89.jpg"],
      living: ["dom-60/postroennye/terenkul/interer/Shine-76.jpg"],
      kitchen: ["dom-60/postroennye/terenkul/interer/Shine-82.jpg"],
    },
    shape:
      "Long rectangular house about 10 x 6 m built from four modules; a covered terrace about 2 m deep along most of the long facade on dark posts, with steps. " +
      "Roof, terrace and openings exactly as in the photo.",
    views: {
      front: "Three-quarter view of the long terrace facade.",
      back: "Three-quarter view of the rear and the gable end.",
    },
    rooms: {
      living:
        "Living area of the kitchen-living room: a sofa, an armchair, a small round table by the window, light curtains. Room shape and openings as in the interior photo.",
      kitchen:
        "Kitchen: a straight sage-green kitchen along the wall under the window, a tall fridge column. Room shape as in the interior photo.",
      bedroom:
        "Bedroom: a double bed with an upholstered headboard, bedside tables with lamps, a window with a curtain.",
    },
  },

  "dom-75": {
    title: "Модульный дом 75 м²",
    plan: true,
    done: ["living"],
    shape:
      "L-shaped house: main volume 12 x 5 m plus a 6 x 2.5 m wing on the left half of the bottom side of the plan; one low-pitch gable roof with the ridge along the 12 m length. " +
      "A covered terrace 6 x 2.5 m on posts in front of the right half of the top facade, with steps at its left end and a door from the living room. " +
      "An open entrance porch 2 x 2.5 m in the inner corner of the L with steps on its right; the entrance door is in the wing. The right gable end has two ordinary windows.",
    views: {
      front:
        "Camera at the bottom-right of the plan, three-quarter view of the entrance side: the wing with two small high windows, the porch with steps, two windows of the main volume and the right gable end.",
      back: "Camera at the top-right of the plan, three-quarter view of the terrace with its steps, the kitchen and living room windows and the right gable end.",
    },
    rooms: {
      living:
        "Living room 22 m² (room 02): a two-seat sofa, a coffee table, two armchairs, one slim timber post near the centre; a window and the glazed terrace door in the top wall; the kitchen is a separate room.",
      kitchen:
        "Kitchen 11.4 m² (room 01), a separate closed room: sage-green kitchen along the left wall with the sink, stove and fridge along the bottom wall, a rectangular dining table with six chairs by the window in the top wall. Camera at the door (bottom right of the room) looking towards the window.",
      bedroom:
        "Bedroom 15.2 m² (room 03): a double bed with its headboard on the left wall, a small desk with a chair, an armchair in the corner; windows as on the plan, the right wall has two ordinary windows.",
    },
    extra: [
      "## Правка готовых картинок пробы",
      "",
      "Гостиная готова. Фасад (`results/front.png`) поправить **в том же чате**, где он получен, и сохранить поверх. Исправленный фасад — образец стиля для фасадов всех домов, поэтому его делать первым.",
      "",
      "```text",
      "Keep everything exactly the same: camera angle, house shape, roof, materials, porch, steps, lighting and setting. Change only the right gable end: replace the floor-to-ceiling glazing, including the glass triangle under the roof, with a solid wall in the same grey horizontal board cladding, with two ordinary rectangular windows of the same size, frame colour and sill height as the two windows on the long wall. No other changes.",
      "```",
      "",
      "3D-планировка (`results/plan-3d.png`) — сверх набора; правка правой стены спальни, в том же чате:",
      "",
      "```text",
      "Keep everything exactly the same: view, walls, rooms, furniture and finishes. Change only the right outer wall of the bedroom: replace the long glazing with a solid wall like the other outer walls, with two ordinary windows of the same style as the other windows. No other changes.",
      "```",
    ],
  },

  "dom-90": {
    title: "Модульный дом 90 м²",
    plan: true,
    shape:
      "Symmetrical house 15 m wide: a central living block 5 m wide projecting forward (top of the plan) under its own low-pitch gable roof, and two lower side wings 5 x 6 m. " +
      "A U-shaped covered terrace wraps the central block at the top, with wide steps in front and a glazed door from the kitchen-living room. " +
      "At the bottom, a recessed covered veranda 5 x 2 m between the two wings with steps and the back door.",
    views: {
      front:
        "Camera at the top-left of the plan, three-quarter view of the projecting central block and the U-shaped terrace.",
      back: "Camera at the bottom-right of the plan, three-quarter view of the recessed back veranda between the wings.",
    },
    rooms: {
      living:
        "Living part of the kitchen-living room 38 m² (room 01, central block): a large sofa, two armchairs, a coffee table, the glazed door and windows to the terrace.",
      kitchen:
        "Kitchen part of the same room 01: a sage-green kitchen along the wall, a dining table for six. Camera from the living part.",
      bedroom:
        "One of the two identical bedrooms 7.6 m² (room 02): a double bed, bedside tables, the window as on the plan, a door to its walk-in wardrobe.",
    },
  },

  "dom-105": {
    title: "Модульный дом 105 м²",
    plan: true,
    shape:
      "Large house 12 x 10 m under one low-pitch gable roof, with a notch at the bottom-right of the plan. A covered veranda 2.7 m deep along the whole 10 m left side facade on posts, " +
      "steps near its top end, a door from the house onto it. A second covered veranda 5.8 x 2.5 m fills the bottom-right notch, with steps and the entrance door.",
    views: {
      front: "Camera at the left of the plan, three-quarter view of the long side veranda.",
      back: "Camera at the bottom-right of the plan, three-quarter view of the corner veranda with the entrance door.",
    },
    rooms: {
      living:
        "Living room 22 m² (room 02): a large sofa, two armchairs, a coffee table, a TV wall; windows and doors as on the plan.",
      kitchen:
        "Kitchen 11.7 m² (room 01), a separate room: a sage-green kitchen along the walls, a dining table for six by the window.",
      bedroom:
        "Bedroom 15.4 m² (room 03, right middle): a double bed, bedside tables, a wardrobe, windows as on the plan.",
    },
  },

  "dom-120": {
    title: "Модульный дом 120 м²",
    plan: true,
    shape:
      "Large rectangular house 10 x 12 m built from eight modules under one low-pitch gable roof. A covered terrace 2.5 m deep along the whole 10 m bottom facade of the plan, " +
      "steps at its right end, a glazed door from the living area. A small covered entrance porch with steps on the left side.",
    views: {
      front: "Camera at the bottom-right of the plan, three-quarter view of the long terrace facade.",
      back: "Camera at the top-left of the plan, three-quarter view of the left side with the entrance porch.",
    },
    rooms: {
      living:
        "Living room 26.8 m² (room 02, bottom right): a large corner sofa, armchairs, a coffee table, the glazed door to the terrace.",
      kitchen:
        "Kitchen-dining room 27.3 m² (room 01, bottom left): a sage-green kitchen along the wall, a long dining table for eight under a pendant lamp.",
      bedroom: "Bedroom 12.4 m² (room 03): a double bed, bedside tables, a wardrobe, windows as on the plan.",
    },
  },

  "banya-1": {
    title: "Модульная баня 22 м²",
    metal: true,
    photos: {
      exterior: ["banya-1/postroennye/dinamo/IMG_0282.JPG", "banya-1/postroennye/dinamo/IMG_0281.JPG"],
      rest: ["banya-1/postroennye/dinamo/IMG_0272.JPG"],
      sauna: ["banya-1/postroennye/dinamo/lv_0_20261009092447.jpg"],
    },
    shape:
      "Small Russian sauna house (banya) of 22 m² built from two modules: a single-pitch roof, a covered veranda across the front under the roof extension on dark posts with X-pattern railings, " +
      "the entrance door and a small square window in the front wall, a stainless steel chimney. Shape and openings exactly as in the photos.",
    views: {
      front: "Three-quarter view of the front veranda.",
      back: "Three-quarter view of the rear and the side with the chimney.",
      metal: "Same camera as the main view: three-quarter view of the front veranda.",
    },
    rooms: {
      rest: "Rest room: a small square window, a wooden bench and a small table, a door to the steam room. Room shape as in the interior photo.",
      sauna:
        "Steam room: two-tier pine benches along one wall, a black metal wood-burning stove with stones and a stainless chimney pipe, a wall lamp with a wooden shade, a small square window; warmer, dimmer light than other rooms. Layout as in the interior photo.",
      wash: "Washroom: a shower on a tiled floor with a drain, light grey tiles to shoulder height and pine boards above, a wooden bench, a small window.",
    },
  },
};
