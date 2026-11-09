# Промпты для визуализаций домов

Файл собирается скриптом `node scripts/render-prompts.mjs` — правки вносить в скрипт, не сюда.

## Как пользоваться

1. Генерировать в одном сервисе и одной модели для всех домов — так картинки будут в одном стиле.
2. **Если сервис принимает картинку-образец** (Midjourney `--sref`/`--cref`, GPT, Kandinsky «по образцу») — прикладывать нынешнюю визуализацию дома из `public/images/projects/<slug>/photos/0/src.jpg`: форма дома и отделка сохранятся лучше, чем по тексту.
3. Формат: 3:2 или 16:10 для фасадов, 4:3 для интерьеров; не меньше 1600 px по ширине.
4. Готовые файлы класть в `assets/renders/<slug>/<ракурс>.jpg` (имена ракурсов — в заголовках ниже, например `assets/renders/dom-45/front.jpg`) и запускать `node scripts/add-renders.mjs` — картинки сожмутся, попадут в фото проекта и подпишутся на сайте «Визуализация».
5. Проверять каждую картинку по планировке: число модулей, где терраса и вход. Нейросеть часто добавляет второй этаж или крутую крышу — такие варианты не брать.

**Стоп-слова** (negative prompt, если сервис поддерживает):

```
two storeys, attic, brick, stone, log cabin, steep roof, pitched gable roof, distorted proportions, extra floors, text, logo, watermark, people in focus, cartoon
```

Дома с пометкой «форма условная» — планировки от компании нет, промпт составлен по схеме-примеру. Визуализации для них лучше сделать после получения планировки (раздел 3 вопросов к компании).

## Модульный дом 20 м² — `dom-20`

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. Compact square house 6 x 6 m made of two modules; one corner under the common roof is an open covered terrace 3.5 x 3.5 m with steps, a tall panoramic window on the gable end. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. Compact square house 6 x 6 m made of two modules; one corner under the common roof is an open covered terrace 3.5 x 3.5 m with steps, a tall panoramic window on the gable end. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `aerial` — Вид с высоты (дрон)

```
Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible. Compact square house 6 x 6 m made of two modules; one corner under the common roof is an open covered terrace 3.5 x 3.5 m with steps, a tall panoramic window on the gable end. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. Compact square house 6 x 6 m made of two modules; one corner under the common roof is an open covered terrace 3.5 x 3.5 m with steps, a tall panoramic window on the gable end. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `living` — Интерьер: кухня-гостиная

```
Interior of the kitchen-living room: light wood-panelled walls and ceiling, compact modern kitchen, sofa, dining table, panoramic window to the terrace, Scandinavian style, daylight. Compact square house 6 x 6 m made of two modules; one corner under the common roof is an open covered terrace 3.5 x 3.5 m with steps, a tall panoramic window on the gable end. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

## Модульный дом 35 м² — `dom-35` (форма условная)

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. Small rectangular house 5 x 7 m made of two modules, covered terrace 1.6 m deep along the short front facade with the entrance door and a large window. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. Small rectangular house 5 x 7 m made of two modules, covered terrace 1.6 m deep along the short front facade with the entrance door and a large window. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `aerial` — Вид с высоты (дрон)

```
Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible. Small rectangular house 5 x 7 m made of two modules, covered terrace 1.6 m deep along the short front facade with the entrance door and a large window. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. Small rectangular house 5 x 7 m made of two modules, covered terrace 1.6 m deep along the short front facade with the entrance door and a large window. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `living` — Интерьер: кухня-гостиная

```
Interior of the kitchen-living room: light wood-panelled walls and ceiling, compact modern kitchen, sofa, dining table, panoramic window to the terrace, Scandinavian style, daylight. Small rectangular house 5 x 7 m made of two modules, covered terrace 1.6 m deep along the short front facade with the entrance door and a large window. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `bedroom` — Интерьер: спальня

```
Interior of a cozy bedroom: light wood-panelled walls, double bed, window with view of pine trees, Scandinavian style, soft daylight. Small rectangular house 5 x 7 m made of two modules, covered terrace 1.6 m deep along the short front facade with the entrance door and a large window. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

## Модульный дом 45 м² — `dom-45`

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. Rectangular house 7.5 x 6 m made of three modules, a deep covered terrace 2.9 m wide along the whole long facade with panoramic windows and a glass door onto it, small entrance porch with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. Rectangular house 7.5 x 6 m made of three modules, a deep covered terrace 2.9 m wide along the whole long facade with panoramic windows and a glass door onto it, small entrance porch with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `aerial` — Вид с высоты (дрон)

```
Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible. Rectangular house 7.5 x 6 m made of three modules, a deep covered terrace 2.9 m wide along the whole long facade with panoramic windows and a glass door onto it, small entrance porch with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. Rectangular house 7.5 x 6 m made of three modules, a deep covered terrace 2.9 m wide along the whole long facade with panoramic windows and a glass door onto it, small entrance porch with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `living` — Интерьер: кухня-гостиная

```
Interior of the kitchen-living room: light wood-panelled walls and ceiling, compact modern kitchen, sofa, dining table, panoramic window to the terrace, Scandinavian style, daylight. Rectangular house 7.5 x 6 m made of three modules, a deep covered terrace 2.9 m wide along the whole long facade with panoramic windows and a glass door onto it, small entrance porch with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `bedroom` — Интерьер: спальня

```
Interior of a cozy bedroom: light wood-panelled walls, double bed, window with view of pine trees, Scandinavian style, soft daylight. Rectangular house 7.5 x 6 m made of three modules, a deep covered terrace 2.9 m wide along the whole long facade with panoramic windows and a glass door onto it, small entrance porch with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

## Модульный дом 60 м² — `dom-60` (форма условная)

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. Long rectangular house 10 x 6 m made of four modules, covered terrace 2 m deep along most of the long facade, panoramic windows of the living room onto the terrace. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. Long rectangular house 10 x 6 m made of four modules, covered terrace 2 m deep along most of the long facade, panoramic windows of the living room onto the terrace. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `aerial` — Вид с высоты (дрон)

```
Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible. Long rectangular house 10 x 6 m made of four modules, covered terrace 2 m deep along most of the long facade, panoramic windows of the living room onto the terrace. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. Long rectangular house 10 x 6 m made of four modules, covered terrace 2 m deep along most of the long facade, panoramic windows of the living room onto the terrace. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `living` — Интерьер: кухня-гостиная

```
Interior of the kitchen-living room: light wood-panelled walls and ceiling, compact modern kitchen, sofa, dining table, panoramic window to the terrace, Scandinavian style, daylight. Long rectangular house 10 x 6 m made of four modules, covered terrace 2 m deep along most of the long facade, panoramic windows of the living room onto the terrace. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `bedroom` — Интерьер: спальня

```
Interior of a cozy bedroom: light wood-panelled walls, double bed, window with view of pine trees, Scandinavian style, soft daylight. Long rectangular house 10 x 6 m made of four modules, covered terrace 2 m deep along most of the long facade, panoramic windows of the living room onto the terrace. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

## Модульный дом 75 м² — `dom-75`

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. L-shaped house: main volume 12 x 5 m plus a 6 x 2.5 m wing at the back, covered terrace 6 x 2.5 m on one half of the front facade with panoramic windows, open entrance porch with steps in the inner corner of the L. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. L-shaped house: main volume 12 x 5 m plus a 6 x 2.5 m wing at the back, covered terrace 6 x 2.5 m on one half of the front facade with panoramic windows, open entrance porch with steps in the inner corner of the L. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `aerial` — Вид с высоты (дрон)

```
Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible. L-shaped house: main volume 12 x 5 m plus a 6 x 2.5 m wing at the back, covered terrace 6 x 2.5 m on one half of the front facade with panoramic windows, open entrance porch with steps in the inner corner of the L. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. L-shaped house: main volume 12 x 5 m plus a 6 x 2.5 m wing at the back, covered terrace 6 x 2.5 m on one half of the front facade with panoramic windows, open entrance porch with steps in the inner corner of the L. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `living` — Интерьер: кухня-гостиная

```
Interior of the kitchen-living room: light wood-panelled walls and ceiling, compact modern kitchen, sofa, dining table, panoramic window to the terrace, Scandinavian style, daylight. L-shaped house: main volume 12 x 5 m plus a 6 x 2.5 m wing at the back, covered terrace 6 x 2.5 m on one half of the front facade with panoramic windows, open entrance porch with steps in the inner corner of the L. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `bedroom` — Интерьер: спальня

```
Interior of a cozy bedroom: light wood-panelled walls, double bed, window with view of pine trees, Scandinavian style, soft daylight. L-shaped house: main volume 12 x 5 m plus a 6 x 2.5 m wing at the back, covered terrace 6 x 2.5 m on one half of the front facade with panoramic windows, open entrance porch with steps in the inner corner of the L. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

## Модульный дом 90 м² — `dom-90`

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. Symmetrical house 15 m wide: a central living block 5 m wide projecting forward with floor-to-ceiling windows, two lower side wings 5 x 6 m; a U-shaped covered terrace wraps the central block at the front, a small covered veranda 5 x 2 m with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. Symmetrical house 15 m wide: a central living block 5 m wide projecting forward with floor-to-ceiling windows, two lower side wings 5 x 6 m; a U-shaped covered terrace wraps the central block at the front, a small covered veranda 5 x 2 m with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `aerial` — Вид с высоты (дрон)

```
Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible. Symmetrical house 15 m wide: a central living block 5 m wide projecting forward with floor-to-ceiling windows, two lower side wings 5 x 6 m; a U-shaped covered terrace wraps the central block at the front, a small covered veranda 5 x 2 m with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. Symmetrical house 15 m wide: a central living block 5 m wide projecting forward with floor-to-ceiling windows, two lower side wings 5 x 6 m; a U-shaped covered terrace wraps the central block at the front, a small covered veranda 5 x 2 m with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `living` — Интерьер: кухня-гостиная

```
Interior of the kitchen-living room: light wood-panelled walls and ceiling, compact modern kitchen, sofa, dining table, panoramic window to the terrace, Scandinavian style, daylight. Symmetrical house 15 m wide: a central living block 5 m wide projecting forward with floor-to-ceiling windows, two lower side wings 5 x 6 m; a U-shaped covered terrace wraps the central block at the front, a small covered veranda 5 x 2 m with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `bedroom` — Интерьер: спальня

```
Interior of a cozy bedroom: light wood-panelled walls, double bed, window with view of pine trees, Scandinavian style, soft daylight. Symmetrical house 15 m wide: a central living block 5 m wide projecting forward with floor-to-ceiling windows, two lower side wings 5 x 6 m; a U-shaped covered terrace wraps the central block at the front, a small covered veranda 5 x 2 m with steps at the back. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

## Модульный дом 105 м² — `dom-105`

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. Large rectangular house 12 x 10 m, a long covered veranda 2.7 m deep along the whole 10 m side facade with steps, and a second covered veranda 6 x 2.5 m in one corner of the front facade with the entrance. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. Large rectangular house 12 x 10 m, a long covered veranda 2.7 m deep along the whole 10 m side facade with steps, and a second covered veranda 6 x 2.5 m in one corner of the front facade with the entrance. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `aerial` — Вид с высоты (дрон)

```
Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible. Large rectangular house 12 x 10 m, a long covered veranda 2.7 m deep along the whole 10 m side facade with steps, and a second covered veranda 6 x 2.5 m in one corner of the front facade with the entrance. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. Large rectangular house 12 x 10 m, a long covered veranda 2.7 m deep along the whole 10 m side facade with steps, and a second covered veranda 6 x 2.5 m in one corner of the front facade with the entrance. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `living` — Интерьер: кухня-гостиная

```
Interior of the kitchen-living room: light wood-panelled walls and ceiling, compact modern kitchen, sofa, dining table, panoramic window to the terrace, Scandinavian style, daylight. Large rectangular house 12 x 10 m, a long covered veranda 2.7 m deep along the whole 10 m side facade with steps, and a second covered veranda 6 x 2.5 m in one corner of the front facade with the entrance. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `bedroom` — Интерьер: спальня

```
Interior of a cozy bedroom: light wood-panelled walls, double bed, window with view of pine trees, Scandinavian style, soft daylight. Large rectangular house 12 x 10 m, a long covered veranda 2.7 m deep along the whole 10 m side facade with steps, and a second covered veranda 6 x 2.5 m in one corner of the front facade with the entrance. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

## Модульный дом 120 м² — `dom-120`

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. Large house 10 x 12 m made of eight modules, a covered terrace 2.5 m deep along the whole 10 m front facade with panoramic windows of the kitchen and living room, small side entrance porch with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. Large house 10 x 12 m made of eight modules, a covered terrace 2.5 m deep along the whole 10 m front facade with panoramic windows of the kitchen and living room, small side entrance porch with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `aerial` — Вид с высоты (дрон)

```
Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible. Large house 10 x 12 m made of eight modules, a covered terrace 2.5 m deep along the whole 10 m front facade with panoramic windows of the kitchen and living room, small side entrance porch with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. Large house 10 x 12 m made of eight modules, a covered terrace 2.5 m deep along the whole 10 m front facade with panoramic windows of the kitchen and living room, small side entrance porch with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `living` — Интерьер: кухня-гостиная

```
Interior of the kitchen-living room: light wood-panelled walls and ceiling, compact modern kitchen, sofa, dining table, panoramic window to the terrace, Scandinavian style, daylight. Large house 10 x 12 m made of eight modules, a covered terrace 2.5 m deep along the whole 10 m front facade with panoramic windows of the kitchen and living room, small side entrance porch with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `bedroom` — Интерьер: спальня

```
Interior of a cozy bedroom: light wood-panelled walls, double bed, window with view of pine trees, Scandinavian style, soft daylight. Large house 10 x 12 m made of eight modules, a covered terrace 2.5 m deep along the whole 10 m front facade with panoramic windows of the kitchen and living room, small side entrance porch with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

## Модульная баня 18 м² — `banya-1` (форма условная)

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. Small single-module sauna house 6 x 3 m (Russian banya) with a metal chimney, a small open porch with steps at one end, a narrow horizontal window in the steam room, a regular window in the rest room. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. Small single-module sauna house 6 x 3 m (Russian banya) with a metal chimney, a small open porch with steps at one end, a narrow horizontal window in the steam room, a regular window in the rest room. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. Small single-module sauna house 6 x 3 m (Russian banya) with a metal chimney, a small open porch with steps at one end, a narrow horizontal window in the steam room, a regular window in the rest room. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `sauna` — Интерьер: парная

```
Interior of a wood-lined steam room (Russian banya): linden wood benches in two tiers, black metal wood-burning stove with stones, warm light, small window. Small single-module sauna house 6 x 3 m (Russian banya) with a metal chimney, a small open porch with steps at one end, a narrow horizontal window in the steam room, a regular window in the rest room. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

## Модульная баня 30 м² — `banya-2` (форма условная)

### `front` — Фасад со стороны террасы, 3/4

```
Eye-level three-quarter view from the terrace side. Sauna house 6 x 5 m made of two modules (Russian banya) with a metal chimney, open terrace 3.5 x 1.5 m in front of the rest room with a panoramic window, side entrance with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `back` — Тыльный и боковой фасад, 3/4

```
Eye-level three-quarter view of the rear and side facades, entrance side visible. Sauna house 6 x 5 m made of two modules (Russian banya) with a metal chimney, open terrace 3.5 x 1.5 m in front of the rest room with a panoramic window, side entrance with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `aerial` — Вид с высоты (дрон)

```
Aerial drone view at 45 degrees showing the whole house on its plot, roof shape clearly visible. Sauna house 6 x 5 m made of two modules (Russian banya) with a metal chimney, open terrace 3.5 x 1.5 m in front of the rest room with a panoramic window, side entrance with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `evening` — Терраса вечером

```
Close view of the covered terrace at blue hour, warm interior light through the panoramic windows, string lights, outdoor furniture. Sauna house 6 x 5 m made of two modules (Russian banya) with a metal chimney, open terrace 3.5 x 1.5 m in front of the rest room with a panoramic window, side entrance with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```

### `sauna` — Интерьер: парная

```
Interior of a wood-lined steam room (Russian banya): linden wood benches in two tiers, black metal wood-burning stove with stones, warm light, small window. Sauna house 6 x 5 m made of two modules (Russian banya) with a metal chimney, open terrace 3.5 x 1.5 m in front of the rest room with a panoramic window, side entrance with steps. Single-storey modular frame house on screw piles with a dark graphite skirting. Natural light pine horizontal board cladding with graphite-black accent panels, low-pitch roof with dark graphite metal sheeting, dark gutters and downpipes, large panoramic windows with dark frames, covered terrace on square timber posts with horizontal wooden slat railings. Photorealistic architectural visualization, Russian Ural region setting: pine and birch trees, green lawn, paving-stone path, soft natural daylight, realistic proportions, no text, no watermark.
```
