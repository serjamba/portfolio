# MOKA — происхождение материалов

Все runtime-ассеты локальные. Нет CDN или зависимости от соседних проектов. Исходное Word-ТЗ не изменено.

## Собственные материалы

| Материал | Файл | Происхождение |
|---|---|---|
| Геометрия чашки, ручки, блюдца | src/three/cup-model.js | Создано для MOKA, оригинальная геометрия, CC0-1.0 dedication. |
| Постеры той же чашки | assets/images/cup-poster.webp, cup-mobile.webp | Render tools/render-cup.cjs через ту же сцену, не чужая фотография. |
| Wordmark, favicon, карта | HTML/CSS, assets/logos/favicon.svg | Собственные code-native элементы. Карта условная, не геоданные. |
| Glaze/roughness/shadow | CanvasTexture в cup-model.js | Детерминированные текстуры, максимум1024×512; без realtime shadow/postprocessing. |

## Растровые материалы

21 отдельная генерация встроенным imagegen, по одному вызову на ассет. Полные prompts: docs/image-prompts.json. Исходники PNG сохранены, WebP1280/640 используются в интерфейсе. Foam640 — в3D; полный foam не загружается. PNG — архив исходников, не payload страницы.

| Имя | Локальный путь | Источник |
|---|---|---|
| space | assets/images/space.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| espresso | assets/images/espresso.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| cappuccino | assets/images/cappuccino.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| americano | assets/images/americano.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| flat-white | assets/images/flat-white.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| latte | assets/images/latte.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| raf | assets/images/raf.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| filter | assets/images/filter.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| matcha | assets/images/matcha.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| cocoa | assets/images/cocoa.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| tea | assets/images/tea.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| foam-texture | assets/images/foam-texture.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| croissant | assets/images/croissant.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| lemon-cake | assets/images/lemon-cake.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| about | assets/images/about.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| gallery-light | assets/images/gallery-light.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| gallery-process | assets/images/gallery-process.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| gallery-detail | assets/images/gallery-detail.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| profile-balance | assets/images/profile-balance.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| profile-filter | assets/images/profile-filter.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |
| profile-seasonal | assets/images/profile-seasonal.png → .webp / -640.webp | Built-in imagegen, 19.09.2026 |

AI-generated иллюстрации концепции, не фотографии действующего заведения/конкретной партии. Space использован reference для about и gallery. Условия использования — применимые условия сервиса генерации; не приписываем им стороннюю CC-лицензию и не гарантируем эксклюзивные права на AI-изображения. Все выбранные результаты осмотрены. Сжатие/resize: tools/optimize.cjs, Canvas encode WebP .82; без творческой подмены содержимого.

## Библиотека и шрифты

Three.js r170 (0.170.0), MIT: assets/vendor/three/three.module.js, LICENSE.txt. Официальный источник https://github.com/mrdoob/three.js/tree/r170 . Локальная копия, major version не менялась. compile.js — cancellable адаптер поведения закреплённой версии.

Lora/Manrope загрузить не удалось. Применён предусмотренный ТЗ системный резерв Georgia/Arial. Системные шрифты не распространяются. Источники для будущего разрешённого добавления: https://github.com/google/fonts/tree/main/ofl/lora и https://github.com/google/fonts/tree/main/ofl/manrope с их OFL.

## Данные

Цены, часы, профили — демонстрационные. Нет реальных отзывов/наград/сертификатов, адресов и контактов случайного бизнеса. venue.confirmed=false. LocalStorage содержит только motion; нет персональных данных, аналитики, отправок, платежей.

