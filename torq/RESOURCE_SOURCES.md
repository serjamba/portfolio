# Реестр материалов TORQ

## Иллюстрации

Созданы встроенным ImageGen 18 сентября 2026 года, скопированы в проект. Не являются точными товарными фотографиями перечисленных брендов и не должны использоваться для подтверждения реальной комплектации или применимости.

| Файл | Содержание |
|---|---|
| `assets/images/suspension-hero.png` | Композиция стойки, пружины, рычага и тормозного диска |
| `assets/products/strut.png` | Амортизационная стойка |
| `assets/products/brake.png` | Вентилируемый тормозной диск |
| `assets/products/filter.png` | Масляный фильтр-картридж |
| `assets/products/arm.png` | Рычаг подвески |
| `assets/products/engine.png` | Двигатель в сборе |
| `assets/products/electric.png` | Генератор |
| `assets/products/transmission.png` | Диск сцепления |
| `assets/products/body.png` | Передняя фара |
| `assets/products/steering.png` | Рулевая рейка |

Промпт hero: «Premium photorealistic automotive product render. One technically recognizable suspension assembly: black coil spring strut, machined metal wheel hub with ventilated silver brake disc, dark control arm. Entire object visible, three-quarter perspective, isolated centered with generous margins. Matte black, brushed silver metal. Dark graphite solid background #111315, subtle soft studio lighting. No car, wheel, tire, text, logos or blue glowing effects. Landscape 3:2.»

Общий промпт предметных изображений: «Premium studio catalog photograph of [деталь из таблицы]. Entire object visible, isolated on pure white #FFFFFF, generous 18 percent margin, three-quarter view, subtle soft shadow, realistic engineering detail and metal. Square composition. No labels, text, logos, brand names or extra objects. For an illustrative auto parts portfolio demo.»

Файлы используются как локальные PNG. Hero-постер остаётся fallback для лениво загружаемой Three.js-сцены.

## Иконки

Lucide, оригинальные SVG из https://github.com/lucide-icons/lucide/tree/main/icons . Лицензия ISC, сохранена в `assets/icons/LICENSE.txt`. Экспортированные пути не перерисовывались. Применён единый размер 22 px.

## Шрифт

Inter Variable с кириллицей, https://github.com/rsms/inter/blob/master/docs/font-files/InterVariable.woff2 . Лицензия SIL Open Font License 1.1, сохранена в `assets/fonts/OFL.txt`. Шрифт подключён локально, запросов к Google Fonts нет.

## Логотипы

Оригинальные векторные знаки из открытых репозиториев, без генерации букв ImageGen. В UI применяется CSS grayscale для согласования с палитрой. У KYB, SACHS и TRW согласованы viewBox и intrinsic width/height, убраны фоновые белые прямоугольники. У BOSCH, Brembo, KYB и SACHS цветные/теневые заливки приведены к графиту; белые просветы сохранены. У SKF белая заливка знака заменена графитовой. Геометрия знаков сохранена.

| Бренд | Источник |
|---|---|
| BOSCH | https://github.com/detain/svg-logos/blob/master/svg/b/bosch.svg |
| KYB | https://github.com/detain/svg-logos/blob/master/svg/k/kyb.svg |
| MANN-FILTER | https://github.com/detain/svg-logos/blob/master/svg/m/mann-filter.svg |
| SACHS | https://github.com/detain/svg-logos/blob/master/svg/s/sachs.svg |
| TRW | https://github.com/detain/svg-logos/blob/master/svg/t/trw.svg |
| Brembo | https://github.com/chris-bhaila/E-commerce-website-with-Product-Recommendation/blob/main/admin/brands/brembo.svg |
| SKF | https://github.com/FutureMemories/futurememories-site/blob/master/src/images/partners/skf.svg |
| BMW | https://github.com/simple-icons/simple-icons/blob/develop/icons/bmw.svg |
| ATE | Временная текстовая подпись; оригинальный логотип не добавлен |

Файлы `assets/logos/*-display.png` локально отрендерены из перечисленных SVG в двойном разрешении скриптом `tools/render-logo-rasters.cjs`. Интерфейс использует эти копии, чтобы не растрировать сложные SVG заново во время движения ленты.

Открытый репозиторий не передаёт права на товарные знаки. Логотипы приведены для идентификации производителей в портфолио, не означают партнёрство или статус дилера. Перед коммерческим использованием нужно отдельно подтвердить допустимость использования с правообладателями. Simple Icons распространяется по CC0; права на бренд BMW сохраняются за владельцем.

## Данные и исходный дизайн

- Основной документ: `TORQ_Задание_на_дизайн_сайта.docx`, 23 страницы; прочитан полностью через OOXML, без изменения оригинала.
- Figma: https://www.figma.com/design/vUbc2WjbeHKyc5HuRvhkIb . Интеграция достигла лимита; окно с макетом обнаружено в Chrome, но Computer Use отказал в просмотре: `Computer Use was not approved to use Google Chrome`. Точное совпадение с макетом не подтверждено.
- Артикулы TQ-DEMO-*, номера DEMO-OEM-*, тестовые VIN, цены, остатки, применимость и сроки вымышлены.
- Вымышленные контакты: домен `.example`, несуществующий тестовый телефон. Реальные офисы на карте не обозначены.

## Дополнение: desktop polish, 3D и motion

Встроенным imagegen созданы 16 новых локальных файлов: 9 обратных ракурсов `assets/products/*-side.png`, 6 автомобилей `assets/images/car-*.png` и нейтральная упаковка `assets/products/packaging.png`. Полные промпты и референсы: `asset-prompts-polish.json`. Изображения концептуальные, не фотографии конкретного SKU или автомобиля пользователя.

3D: `assets/models/suspension.glb`, собственная геометрия TORQ из `tools/build-suspension.mjs`, CC0-1.0. Никаких внешних CAD-материалов. Детали и происхождение зафиксированы в README и `assets/models/LICENSE.txt`.

Three.js r170 и GLTFLoader получены из [официального репозитория](https://github.com/mrdoob/three.js/tree/r170), MIT, локальная копия лицензии в `assets/vendor/three/LICENSE.txt`. Импорт `three` заменён относительным локальным путём; прочий код библиотеки не изменялся.
