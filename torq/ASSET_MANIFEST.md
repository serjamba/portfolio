# TORQ — материалы и зависимости

Подробный пофайловый реестр: [RESOURCE_SOURCES.md](RESOURCE_SOURCES.md).

| Материал | Локальный путь | Происхождение / условия | Изменения |
|---|---|---|---|
| Предметные изображения, автомобили, hero | assets/images/, assets/products/ | Встроенный ImageGen, концептуальные изображения, не точные SKU/реальная собственность TORQ | Промпты docs/asset-prompts-polish.json; будущие WebP-производные не заменяют оригиналы |
| Suspensions GLB | assets/models/suspension.glb | Собственная параметрическая геометрия, CC0-1.0, LICENSE.txt рядом | tools/build-suspension.mjs |
| Three.js r170 | assets/vendor/three/ | mrdoob/three.js, MIT, локальная LICENSE.txt | Только относительные imports |
| Inter Variable | assets/fonts/ | Rasmus Andersson / rsms/inter, SIL OFL 1.1 | Локальный оригинальный woff2 |
| Lucide icons | assets/icons/ | Lucide contributors, ISC | Единые размеры/цвет CSS |
| Логотипы производителей | assets/logos/ | Источники каждого SVG в RESOURCE_SOURCES.md; права на товарные знаки у владельцев | SVG сохранены как исходники; `*-display.png` — локальные 2× растровые копии для плавной анимации ленты, без заявления партнёрства |

Открытый репозиторий не является универсальным разрешением на использование товарного знака. Отдельное подтверждение коммерческих прав на логотипы не получено; публикация/коммерческий запуск не выполняются. ATE — текстовое обозначение, не утверждение оригинальности логотипа.

## Оптимизированные производные

- 26 WebP рядом с оригинальными PNG: `tools/optimize-images.cjs`, качество .87, максимум 900 px детали / 960 px автомобили / 1200 px hero. Исходники не изменены. Объём 39 558 305 → 1 287 294 bytes для всего набора, не только первого экрана. Пофайловые размеры: docs/image-optimization.json.
- `assets/models/studio-environment.bin.gz` + JSON: собственное студийное освещение из четырёх softbox-плоскостей, заранее рассчитано Three.js r170 через `tools/bake-environment.cjs`. CC0-1.0 для собственного результата; 768×1024 RGBA HalfFloat, 6 291 456 bytes распаковано / 243 574 bytes gzip. Это не внешнее HDR-фото. Геометрия подвески не менялась.

Никаких hotlinks runtime, покупок ассетов и внешних отправок.
