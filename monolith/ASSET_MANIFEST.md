# MONOLITH — реестр материалов

Все runtime-ассеты локальны. Нет hotlink/CDN. Word-ТЗ сохранено без изменений.

| Файлы | Источник / автор | Условия / изменения |
|---|---|---|
| assets/images/{production,lab,delivery,housing,logistics,industrial,infrastructure}.png | Созданы встроенным image_gen для проекта, 18–19.09.2026 | Сгенерированные концептуальные изображения, не фото компании и не подтверждение поставок. Не приписывается чужое авторство. Промпты: docs/image-prompts.json. Правовой статус генерации не назван CC0 или эксклюзивным авторским правом. |
| Одноимённые .webp | Производные указанных PNG | Browser canvas encode, 1280 px, quality .85. Исходники сохранены. |
| assets/images/cube.webp | Собственный рендер scripts/cube.js | Та же геометрия, что в live-сцене; не самостоятельная неподходящая фотография. |
| assets/images/concrete-texture.webp | Собственный детерминированный canvas texture из scripts/cube.js | Поры/зернистость, 512×512; используется в лёгком переходе. |
| assets/vendor/three/three.module.js | Three.js r170, https://github.com/mrdoob/three.js/tree/r170 | MIT, полный LICENSE.txt рядом. Зафиксированная локальная копия, независимая от TORQ при запуске. |
| assets/fonts/InterVariable.woff2 | Inter, Rasmus Andersson, https://github.com/rsms/inter | SIL OFL 1.1, полный OFL.txt рядом. Без модификации. |
| assets/documents/*.html | Собственные учебные шаблоны | Видимая маркировка «ДЕМО / НЕ ДЕЙСТВУЮЩИЙ ДОКУМЕНТ», без печатей и подписей. |

Собственная процедурная геометрия куба и texture доступны для портфолио; не CAD и не средство проверки качества смеси. Внешние коммерческие документы, реальные реквизиты и контакты не предоставлены.
