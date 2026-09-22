# AXIS — происхождение ассетов

| Файл / группа | Источник, автор | Права / обработка |
|---|---|---|
| src/three/architecture.js; assets/models/courtyard.glb, atrium.glb | Оригинальные параметрические концепции, созданы для AXIS | Собственная геометрия, не сторонний скачанный объект; исходники доступны. Для этих моделей проектом применяется CC0-1.0 |
| assets/images/courtyard-*.webp, atrium-*.webp, park-*.webp | tools/render-assets.cjs + та же собственная геометрия | Собственные статичные WebGL-рендеры; не фотографии построенных объектов |
| assets/diagrams/*.svg | Собственные условные схемы по габаритам/логике концепций | Не обмерные планы, не инженерная документация |
| assets/images/interior-{cover,kitchen,bedroom}.png | Built-in imagegen, 19.09.2026 | Созданы для проекта; не взяты из портфолио архитектора. Согласованные концептуальные иллюстрации, не точный BIM-набор. Промпты/референсы: docs/image-prompts.json |
| assets/images/interior-*.webp | Локальные производные PNG, tools/optimize-images.cjs | WebP q.87, исходный размер и вариант 640px |
| assets/logos/favicon.svg, текстовый AXIS | Собственная графика концепта | Не заявление о регистрации товарного знака |
| assets/fonts/InterVariable.woff2 | Rasmus Andersson, https://rsms.me/inter/ | SIL OFL 1.1, assets/fonts/OFL.txt; независимая локальная копия |
| assets/vendor/three/* | Three.js contributors, r170, https://github.com/mrdoob/three.js/tree/r170 | MIT, LICENSE.txt; GLTFLoader/BufferGeometryUtils с локальными относительными imports |

Источник GLB — собственный генератор, не marketplace/CDN. Покупок и загрузки чужих архитектурных проектов нет. Критичные ассеты не hotlink'ятся. Права на коммерческое использование названия AXIS отдельно не проверялись. AI-изображения не обозначаются как съёмка реального объекта. PNG остаются исходниками и не загружаются сайтом.


## Текущий главный проект

«Горизонт» заменяет прежний courtyard; старые изображения и GLB главного дома не включены в эту сборку. Новая собственная геометрия — pavilion/model.js. Презентационный рендер и WebGL-кадры относятся к одной архитектуре. Текстуры древесины Romantic Veneer — Jenelle van Heerden / Poly Haven, CC0: https://polyhaven.com/a/romantic_veneer . Лицензии и происхождение: pavilion/LICENSES.md.
