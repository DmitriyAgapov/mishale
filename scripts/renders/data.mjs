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
  "Exactly one storey. Only standard-size rectangular windows; where the plan shows long glazing, draw a solid wall with ordinary windows instead; no panoramic or floor-to-ceiling glazing. " +
  "Doors and steps only exactly where the description says: a door described as being in a side wall faces sideways, not towards the camera; no other doors or steps.";

export const interiorStyle =
  "Photorealistic interior photograph, 3:2 landscape, camera at 1.5 m height, 20-24 mm lens without distortion, straight verticals. " +
  "Soft natural daylight from the windows, calm and warm. Finishes: light pine horizontal boards on walls and flat ceiling (about 2.5 m), " +
  "small round white ceiling spotlights, light grey wood-effect floor, white interior doors with black handles, white window frames. " +
  "Furniture: simple Scandinavian, light oak, beige and sage-green textiles; kitchens with sage-green flat fronts and a light wood worktop. " +
  "Only standard-size windows; no panoramic or floor-to-ceiling glazing.";

export const anchorText =
  "The style reference image is from the same series of visualizations: match its lighting, colour grading, materials and level of detail exactly. Do not copy its layout or shape.";

export const planText =
  "The floor plan image is the construction drawing: follow it exactly for the outline, walls, doors and window positions. Do not add, remove or move rooms, doors or windows. " +
  "The red labels on the plan (ENTRANCE DOOR, TERRACE DOOR, BACK DOOR, DOOR, STEPS) mark where the doors and steps are; they are notes only, never draw them in the image.";

// Второй ракурс (решение пользователя от 12.11.2026): вместо общего образца прикладывается главный фасад этого же дома
// (results/front.png), а камера описывается словами — что в кадре слева направо и чего в кадре быть не должно.
// Иначе модель повторяла ракурс образца (у дома 75 м² образец — он сам), а «камера сверху справа от плана» не понимала.
export const backText =
  "The last image is a finished photograph of THIS SAME HOUSE from its main viewpoint. Create a new photograph of the same house from the opposite side. " +
  "Keep exactly the same house, materials, colours, roof, lighting, season, colour grading and level of detail as in that photograph, " +
  "but put the camera on the other side of the house, so the view is completely different. Do not repeat its camera angle.";

export const metalAnchorText =
  "The style reference image is from the same series of visualizations: match its lighting, colour grading, setting and level of detail exactly, but use the cladding described below, not its cladding. Do not copy its shape.";

export const metalPhotoText =
  "The photos show the real built house: reproduce its shape, proportions, roof, terrace, openings and its metal cladding exactly.";

export const photoText =
  "The photos show the real built house: reproduce its shape, proportions, roof, terrace and openings exactly; take only the shape from them, not the cladding colour.";

// Против коллажей (решение пользователя от 12.11.2026): ChatGPT склеивал несколько ракурсов или вставлял чертёж и образцы в кадр
export const ending =
  "One single photograph of this one view filling the whole frame: not a collage, grid, split screen, diptych or sheet of several views; " +
  "do not show the floor plan, the reference images or any inset. No people, animals, vehicles, text, logos, signs or watermarks.";

export const negative =
  "two storeys, attic, dormers, panoramic windows, floor-to-ceiling glazing, glass walls, brick, stone, log cabin, steep roof, " +
  "distorted proportions, extra rooms, text, logo, watermark, people, cartoon, collage, grid, split screen, multiple views, inset, floor plan in the image";

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
// labels — красные подписи дверей и ступеней на plan.png: [текст, x, y, выравнивание] в пикселях plan.png шириной 2000
// (решение пользователя от 12.11.2026: ChatGPT не понимает дуги дверей и штриховку ступеней на чертеже).
// done — картинки, уже одобренные пользователем. metal — ещё один фасад в металлическом профиле, как на фото построенного
// (решение пользователя от 09.11.2026: основной набор в серой доске, профиль — дополнительно).
export const houses = {
  "dom-20": {
    title: "Модульный дом 20 м²",
    plan: true,
    labels: [
      ["ENTRANCE DOOR", 1190, 1045, "end"],
      ["STEPS", 1066, 1495, "middle"],
    ],
    shape:
      "Compact house 6 x 6 m built from two modules under one low-pitch gable roof. One corner of the square, 3.5 x 3.5 m (bottom-left on the plan), " +
      "is an open covered terrace under the main roof, with a timber post at its outer corner, a railing and 3 steps at the right end of its front edge. " +
      "The glazed entrance door is in the right-hand wall of the terrace (the side wall of the kitchen-living room), at a right angle to the front facade.",
    views: {
      front:
        "Camera at the bottom-left corner of the plan, in front of the terrace. Visible, left to right in the frame: on the left, the left side of the house going away to the left: the open left side of the terrace with a low wooden railing, behind it the solid left wall of the bedroom; in the middle, the open terrace corner with a timber post at its outer corner; at the back of the terrace, the bedroom wall with one ordinary window and no door; the right-hand wall of the terrace is the side wall of the kitchen-living room, at a right angle to the front facade, and the glazed entrance door is in the middle of this side wall, facing left across the terrace, not towards the camera; 3 wooden steps about 1.6 m wide on the front edge of the terrace at its right end, next to the kitchen-living room wall, with a railing along the rest of the front edge up to the corner post; on the right, the front wall of the kitchen-living room (2.5 m) going away to the right, with ordinary windows as on the plan.",
      back: "Camera behind the house at the corner diagonally opposite the terrace (top-right corner of the plan). Visible, left to right in the frame: on the left, closest to the camera, the right side wall (6 m) going away to the left, with one small bathroom window near the corner nearest the camera, the rest of the wall solid; on the right, the rear wall (6 m) going away to the right, solid without windows. Not visible: the terrace, its steps, the entrance door and the kitchen windows — they are on the other side of the house.",
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
      back: "Camera on the side opposite the terrace. Visible: the rear short wall and the other long side, with ordinary windows as on the real house. Not visible: the terrace, its steps and the entrance door — they are on the other side of the house.",
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
    labels: [
      ["TERRACE DOOR", 1180, 621, "middle"],
      ["STEPS", 1113, 409, "start"],
      ["ENTRANCE DOOR", 1247, 1500, "middle"],
      ["STEPS", 1035, 1630, "middle"],
    ],
    shape:
      "Rectangular house 7.5 x 6 m built from three modules under one low-pitch gable roof whose ridge runs from the terrace side to the entrance side, so the terrace facade is a gable end. " +
      "A deep covered terrace 2.9 m along the whole 7.5 m top facade of the plan, on four timber posts with a railing, 3 wide steps in the middle of its front edge and a glazed door from the kitchen-living room near its right end. " +
      "A small covered entrance porch 1.7 x 1.5 m at the bottom-right corner, with the entrance door in the house wall and 3 steps on its left side.",
    views: {
      front:
        "Camera at the top-right corner of the plan, in front of the terrace. Visible, left to right in the frame: on the left, the right side wall (6 m) going away to the left, with one ordinary window of the kitchen-living room and, at its far end, the corner of the small entrance porch; at the corner nearest the camera, the right end of the terrace with a railing; on the right, the terrace facade (7.5 m) going away to the right: the covered terrace 2.9 m deep on four timber posts with a low gable above it, 3 wooden steps 2.5 m wide in the middle of its front edge between the two middle posts, a railing along the rest of the front edge; under the terrace roof, the house wall with ordinary windows and the glazed door to the kitchen-living room near the end of the terrace closest to the camera. Not visible: the entrance door and the porch steps, they are on the other side of the house.",
      back: "Camera at the entrance corner (bottom-right corner of the plan), on the side opposite the long terrace. Visible, left to right in the frame: on the left, the long rear wall (7.5 m) going away to the left, solid with one small high bathroom window; at the corner nearest the camera, a small covered entrance porch 1.7 x 1.5 m on a post, with the entrance door in the house wall at the back of the porch and 3 wooden steps on the left side of the porch, descending to the left along the rear wall; on the right, the side wall (6 m) going away to the right with one ordinary window of the kitchen-living room. Not visible: the long terrace with wide steps and the glazed terrace door — they are on the other side of the house.",
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
      back: "Camera on the side opposite the terrace. Visible: the rear long wall and one gable end, with ordinary windows. Not visible: the terrace, its posts and steps — they are on the other side of the house.",
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
    labels: [
      ["TERRACE DOOR", 1159, 621, "middle"],
      ["STEPS", 994, 580, "end"],
      ["ENTRANCE DOOR", 1123, 1377, "middle"],
      ["STEPS", 1314, 1366, "start"],
    ],
    done: ["living"],
    shape:
      "L-shaped house: main volume 12 x 5 m plus a 6 x 2.5 m wing on the left half of the bottom side of the plan; one low-pitch gable roof with the ridge along the 12 m length. " +
      "A covered terrace 6 x 2.5 m on posts in front of the right half of the top facade, with steps at its left end and a door from the living room. " +
      "An open entrance porch 2 x 2.5 m in the inner corner of the L with 3 steps on its right side; the entrance door is in the left wall of the porch (the end wall of the wing), at a right angle to the facade. The right gable end has two ordinary windows.",
    views: {
      front:
        "Camera at the bottom-right of the plan, three-quarter view of the entrance side: the wing with two small high windows, the porch with steps, two windows of the main volume and the right gable end.",
      back: "Camera behind the house at the terrace corner (top-right corner of the plan). Visible, left to right in the frame: on the left, closest to the camera, the right gable end with two ordinary windows and the triangular gable under the roof; then the long rear wall going away to the right — along its near half a covered wooden terrace 6 x 2.5 m on slim posts under the roof, with one bedroom window and the glazed living-room door under it and 3 wooden steps at the far (right) end of the terrace, next to the house wall, descending sideways away from the camera; the far half of the rear wall has no terrace, only plain cladding with two ordinary windows (living room and kitchen). Not visible: the entrance porch, the entrance door, the low wing with small high windows — they are on the other side of the house.",
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
      "Фасад и гостиная готовы и служат образцами стиля для всех домов.",
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
    labels: [
      ["DOOR", 771, 776, "end"],
      ["DOOR", 1252, 776, "start"],
      ["STEPS", 1247, 419, "start"],
      ["STEPS", 1247, 1418, "start"],
      ["BACK DOOR", 1180, 1258, "end"],
    ],
    shape:
      "Symmetrical house 15 m wide: a central living block 5 m wide projecting forward (top of the plan) under its own low-pitch gable roof, and two lower side wings 5 x 6 m. " +
      "A U-shaped covered terrace wraps the central block on three sides: 2 m deep in front of it and 2.3 m wide along its sides, with 3 wooden steps 5 m wide across the whole front, " +
      "and two glazed doors in the side walls of the central block opening sideways onto the side arms of the terrace. " +
      "At the bottom, a recessed covered veranda 5 x 2 m between the two wings, with 3 steps across its front and the back door in its right side wall.",
    views: {
      front:
        "Camera at the top-left corner of the plan, in front of the house. Visible, left to right in the frame: on the left, the front of the house going away to the left: closest, the front wall of the left wing with one ordinary window; then the left arm of the U-shaped covered terrace along the side of the projecting central block, with the kitchen window in its back wall and a glazed terrace door in the side wall of the central block, facing sideways along the terrace, not towards the camera; then the projecting central block 5 m wide with its own low gable facing the camera, ordinary windows in its front wall, the front part of the terrace 2 m deep in front of it on posts and 3 wooden steps 5 m wide across the whole front of the terrace; further away, the right arm of the terrace and the right wing. On the right, closest to the camera, the solid left side wall (6 m) of the left wing without windows. Not visible: the rear veranda and its steps, they are on the other side of the house.",
      back: "Camera behind the house at the bottom-right corner of the plan. Visible, left to right in the frame: on the left, the rear facade going away to the left — closest the right wing with ordinary windows as on the plan, then the recessed covered veranda 5 x 2 m between the two wings with 3 wooden steps across its whole front, ordinary windows in its back wall and the back door in its right side wall, facing sideways, not towards the camera; then the left wing further away; above the veranda, the roof of the taller central block. On the right, closest to the camera, the solid side wall (6 m) of the right wing without windows. Not visible: the U-shaped front terrace and the glazed front of the central block — they are on the other side of the house.",
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
    labels: [
      ["DOOR", 466, 937, "middle"],
      ["STEPS", 321, 1035, "middle"],
      ["ENTRANCE DOOR", 1107, 1346, "start"],
      ["STEPS", 1242, 1459, "start"],
      ["DOOR", 1511, 1255, "middle"],
    ],
    shape:
      "Large house 12 x 10 m under one low-pitch gable roof, with a notch at the bottom-right of the plan. A covered veranda 2.5 m deep along the whole 10 m left side facade on five timber posts with a railing, " +
      "3 steps on its outer edge between the second and third posts from the top, a glazed door from the kitchen opposite the steps. " +
      "A second covered veranda 6 x 2.5 m fills the bottom-right notch, open on two sides, with 3 steps at the left end of its front edge; the entrance door is in its left inner wall, at a right angle to the bottom facade.",
    views: {
      front:
        "Camera at the top-left corner of the plan. Visible, left to right in the frame: on the left, the top facade (12 m) going away to the left, with ordinary bedroom windows as on the plan; at the corner nearest the camera, the end of the long covered veranda; on the right, the long left side facade going away to the right: the covered veranda 2.5 m deep along its whole 10 m length on five timber posts with a railing between them; 3 wooden steps about 2 m wide in the gap between the second and third posts from the camera, descending from the veranda edge to the lawn; under the veranda roof, the house wall with ordinary windows as on the plan and the glazed kitchen door opposite the steps. Not visible: the entrance veranda in the bottom-right notch, it is on the other side of the house.",
      back: "Camera at the bottom-right corner of the plan. Visible, left to right in the frame: on the left, the bottom facade going away to the left — nearest the corner veranda 6 x 2.5 m recessed under the main roof, open on two sides with posts, 3 wooden steps on its front edge at its left end; the entrance door in the left inner wall of the veranda, at a right angle to the facade; in the back wall of the veranda an ordinary window and, at its right end, a door to the bedroom; further left a solid wall with two small windows (bathroom and vestibule). On the right, the right side wall (10 m) going away to the right with ordinary bedroom windows as on the plan. The long veranda along the left side and its steps are not visible, only perhaps the far end of that veranda in the distance.",
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
    labels: [
      ["TERRACE DOOR", 1113, 1470, "middle"],
      ["STEPS", 1682, 1553, "start"],
      ["ENTRANCE DOOR", 352, 662, "end"],
      ["STEPS", 352, 849, "end"],
    ],
    shape:
      "Large rectangular house 10 x 12 m built from eight modules under one low-pitch gable roof. A covered terrace 2.5 m deep along the whole 10 m bottom facade of the plan, " +
      "on five timber posts with a railing, 3 steps across its right end descending sideways, a glazed door in the middle of the house wall. " +
      "A small covered entrance porch 1.5 x 2.3 m on the left side, with the entrance door in the house wall and 3 steps at its bottom end.",
    views: {
      front:
        "Camera at the bottom-right corner of the plan. Visible, left to right in the frame: on the left, the terrace facade (10 m) going away to the left: a covered terrace 2.5 m deep along the whole facade on five timber posts, with a railing along its front edge and its far end; under the terrace roof, the house wall with ordinary windows and one glazed door in its middle; at the corner nearest the camera, 3 wooden steps 2.3 m wide across the right end of the terrace, descending sideways to the right, parallel to the right side wall; on the right, the right side wall (12 m) going away to the right with ordinary windows as on the plan. Not visible: the entrance porch, it is on the other side of the house.",
      back: "Camera behind the house at the top-left corner of the plan. Visible, left to right in the frame: on the left, the rear wall (10 m) going away to the left, solid with one small bathroom window in the middle; on the right, the left side wall going away to the right — closest a bedroom window, then a small covered entrance porch 1.5 x 2.3 m on posts, with the entrance door in the house wall at the back of the porch and 3 wooden steps at its far end, then a large kitchen window; at the far end only the corner of the terrace. Not visible: the long terrace facade with its steps and glazed door — it is on the other side of the house.",
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
      back: "Camera behind the sauna house. Visible: the rear wall and the side wall with the stainless steel chimney, the single-pitch roof sloping as in the photos. Not visible: the front veranda, its railings and the entrance door — they are on the other side of the house.",
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
