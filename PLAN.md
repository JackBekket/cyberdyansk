# Cyberdyansk — Plan of Implementation

Поэтапный план разработки форка. GDD: `GAME_DESIGN.md`. Стек: **React + TypeScript** (UI-слой), Electron — оболочка на позднем этапе (Phase 8).

---

## 0. Стек и инструменты

| Компонент | Выбор | Примечание |
|---|---|---|
| Build | Vite | быстрый dev, HMR |
| UI | React 18 + TypeScript strict | |
| Состояние | **zustand** (store) + **immer** | мир игры = один большой store; иммерсивные мутации для списков эффектов. Альтернатива: redux toolkit — тяжелее, не нужна без временных машин/undo |
| UI-кит | Tailwind CSS | тёмная табличная эстетика оригинала легко собирается из utility-классов; кастомные токены под цвета рам/тиров |
| Тесты | Vitest + React Testing Library | доменная логика (броски, эффекты, AP) — чистые unit-тесты без UI |
| Дата-модели | zod-схемы для карточек/предметов/статусов | валидация YAML/JSON контента при загрузке |
| Контент | YAML-файлы (колоды, карточки, предметы) | контент отдельно от кода; парсер + zod-валидация на старте |
| Электронная оболочка | electron + electron-builder | Phase 8, UI не должен зависеть от неё (window API за абстракцией) |

### Структура репозитория
```
cyberdyansk/
  GAME_DESIGN.md          # этот GDD — источник правды по механикам
  PLAN.md                 # этот план
  package.json / vite.config.ts / tailwind.config.js / tsconfig.json
  src/
    app/                  # композиция приложения, роутинг вкладок
      Shell.tsx           # верхняя навигация + левая/правая панели
      StoryView.tsx       # сетка локаций + рука (Phase 4)
      CharacterView.tsx   # вкладки характеристик (Phase 2)
      CharacterCreation.tsx (Phase 3)
    core/                 # чистый домен, без React
      status.ts           # Status, Effect — базовые примитивы GDD §3
      world-store.ts      # zustand store: AP, время, деньги, stash, capacity...
      time-engine.ts      # AP ↔ игровые часы (Phase 1)
      checks.ts           # success chance из skills/moods/equipment (Phase 5)
      effects-applier.ts  # применение Effect[] к статусам мира (Phase 5)
    cards/                # карточная система (Phase 4–6)
      types.ts            # Card, Deck, Action, Cost, Requirement
      deck-loader.ts      # YAML → zod-валидированные колоды
      hand.ts             # раздача, размер руки (статус с TTL), discard/defer
      card-window.tsx     # окно карточки: действия, стоимость, chance
    content/              # YAML: decks/*.yaml, items/*.yaml, locations/*.yaml
  electron/               # main/preload (Phase 8)
```

**Правило:** `core/` и `cards/` (логика) не импортируют React — только типы. Это keeps домен тестируемым и позволяет позже перенести его в Electron main-процесс, если понадобится.

---

## Phase 1 — Ядро: статусы, эффекты, время (неделя 1)

Цель: базовые примитивы GDD §2–3 работают и покрыты тестами. UI не нужен.

- [ ] `Status { name: string; value: number | string }`, неймспейсированные имена (`Category/Sub`), парсинг/валидация имени
- [ ] `Effect { statusName, delta }`; `applyEffects(worldState, effects[]) → changed[]` с поддержкой числовых и текстовых статусов (текст — замена значения)
- [ ] Дельта за период: store хранит `previousValue`, UI получит `(+2)/(−3)` из этого (GDD §3)
- [ ] Производные статусы: декларативный список `{ name, formula(state) }` (пример: Perceived temperature = Temperature + модификатор)
- [ ] World store (zustand+immer): AP (50/день), игровые часы `HH:MM`, Ohio Dollars, current stash, carrying capacity, carpe diem; правила GDD §2: **stash=0 → блокирует reload и смену экипировки**, **capacity=0 → нельзя забирать предметы**
- [ ] Time engine: действие `{ apCost?, timeCost? }` тратит AP и двигает часы; исчерпание AP → флаг `dayOver` (переход в Phase 6)
- [ ] Unit-тесты: применение эффектов, дельты, производные статусы, гейтинг stash/capacity

**Acceptance:** тестовый сценарий «сделать действие → AP упало, часы сдвинулись, эффекты применились» проходит без UI.

## Phase 2 — Каркас приложения и окна (неделя 1–2)

Цель: виден скелет игры по раскладке GDD §11.

- [ ] Vite + React + TS strict + Tailwind; дизайн-токены: фон, панели, цвета рам/тиров (оранжевый/синий/зелёный/фиолетовый), шрифт
- [ ] `Shell.tsx`: верхние вкладки (STORY / WEAPONS / OUTFIT / SOCKET / EQUIPMENT / INFO / INVENTORY / CHARACTER / PEOPLE / PROGRESS / QUESTS / JOBS / WORLD + MENU) — нерабочие заглушки, активная подсвечивается
- [ ] Левая панель: портрет, Actions (refresh/clear hand/binge mode/buy credits), кредиты, локация; **контекстный дайджест** — компонент `Digest { sections }`, секции передаются из store (GDD §11: панель пересобирается)
- [ ] Правая панель: Daytime/Aggression/Comedown/Vehicle + блок предупреждений (генерируется из условий мира: stash=0 → «You're out of stash...»)
- [ ] `StoryView` — заглушка: пустое место под сетку локаций и руку
- [ ] `CharacterView` — **реальная вёрстка** по GDD §3: 4 секции (Skills/Moods/Menaces/Mutations + Character/Body) рендерит статусы из store с дельтами; фильтр by name
- [ ] Компонент `StatusTile { status, delta? }` — единый формат отчётности (GDD §12.2): будет переиспользован в результатах действий и сводке дня

**Acceptance:** открываешь app → видишь раскладку как на скриншотах; CharacterView показывает реальные данные из store с дельтами.

## Phase 3 — Создание персонажа (неделя 2–3)

Цель: генерация/создание мира в начале игры.

- [ ] Экран создания: имя, базовые текстовые статусы (Base gender, Preferred style, Your time/Your life...) по образцу GDD §Character; стартовые числовые значения skills/moods
- [ ] Стартовый мир: локация Cinci Bordertown, кредиты, stash/capacity, транспорт, первый набор карточек локации из `content/`
- [ ] Сохранение мира в localStorage (сериализация store) — задел на save/load

**Acceptance:** «New game» → экран создания → попадание в StoryView с заполненным левым дайджестом.

## Phase 4 — Колоды, карточки, рука (неделя 3–5)

Цель: сердце игры работает по GDD §4.

- [ ] Типы: `Card { id, title, flavor, deckId, requirements?, daily?, actions[] }`, `Action { verb, cost?: Cost, successChance? | check?, enabledCondition? }`, `Cost = time | credits | items | probabilistic`
- [ ] Загрузка колод из YAML + zod-валидация; стартовые колоды: Bordertown Life (локация), Life/Survival, Down to Work; DMM — заглушка (GDD §13)
- [ ] `hand.ts`: раздача N карт в руку; **размер руки = статус с TTL** (модификаторы с истечением, уведомления «increased/dropped» как на скриншотах); discard/defer («Not right now»)
- [ ] Daily-карты: гарантированная выдача раз в день вне колоды
- [ ] `StoryView` — финальный вид: баннеры колод + рука (4 слота) + сетка статичных действий локации из YAML
- [ ] `CardWindow.tsx`: flavor, системная заметка о частоте, бейджи CARD REQUIREMENTS, кнопки DISCARD/CLOSE; список действий с verb, стоимостью (иконки −N/+N), `[ Success: N% ]` или раскладка в тултипе; недоступные действия — серые `[ Verb ]` + превью затрат
- [ ] Требования карты к миру (NPC/статусы) как условия появления

**Acceptance:** из YAML-колод раздаётся рука, размер руки меняется по TTL с уведомлениями, daily-карта появляется раз в день, окно карточки полностью соответствует GDD §4.

## Phase 5 — Движок действий и исходов (неделя 5–6)

Цель: нажатие кнопки даёт честный результат по GDD §5.

- [ ] `checks.ts`: success chance = f(base, skills, moods, equipment bonuses) — формула прозрачная и тестируемая; раскладка компонентов для тултипа
- [ ] Бросок → вердикт (bad / okay / good) по порогам
- [ ] Применение результата: `Effect[]` из карточки (варианты на исход) через effects-applier + трата стоимости (время/кредиты/предметы, вероятностное потребление)
- [ ] Экран результата: вердикт-заголовок, нарратив по исходу, сетка `StatusTile` изменений (используя компонент из Phase 2), кнопка forward
- [ ] Навык растёт за попытку независимо от исхода; цена успеха (moods/penalty) — из данных карточки

**Acceptance:** полный цикл «открыл карту → нажал действие → бросок → вердикт → тайлы изменений» с unit-тестами формул и порогов.

## Phase 6 — Цикл дня/ночи (неделя 7)

Цель: GDD §6.

- [ ] Исчерпание AP → окно «Another day/Another night»: `Move`, `Do it | 3` (отсрочка на реальные 30 мин, один раз в день), `Deep` (заглушка до ответа по GDD §13)
- [ ] Сводка дня: экран тайлов всех изменений за сессию («The right side of longing») — тот же `StatusTile`, данные из журнала эффектов store
- [ ] Новый день: сброс AP/часов, пересадка руки, daily-карты

**Acceptance:** полный игровой цикл «день → исчерпание AP → сводка → новый день» проходит.

## Phase 7 — Предметы и экипировка (неделя 8+)

По GDD §7–10: инвентарь с категориями/фильтрами, слоты экипировки + пассивные бонусы к скиллам, Neural Interface / SensPerience port со skill spikes, оружие (w/*-статы, per-weapon ammo, concealed/drawn, Clean/Parts), узлы хранилища character/home/vehicle с Dump/Load и capacity, магазины с вкладками-продавцами.

## Phase 8 — Electron-оболочка

Когда UI стабилен: electron main/preload (window API за абстракцией из `src/app`), auto-updates по желанию, сборка electron-builder под Linux/macOS/Windows.

---

## Критерии готовности MVP (конец Phase 6)

1. New game → создание персонажа → StoryView с рукой и сеткой локаций
2. Полный цикл дня: действия тратят AP/время, броски дают вердикты и тайлы изменений, навыки растут
3. Размер руки меняется по TTL; daily-карты работают
4. Исчерпание AP → переход дня/ночи со сводкой → новый день
5. CharacterView всегда отражает реальное состояние мира с дельтами
6. Домен покрыт unit-тестами (эффекты, броски, время, рука)

## Риски

| Риск | Митигация |
|---|---|
| Зависание в UI-красоте раньше работы механик | Phase 2 — только каркас; полировка позже отдельным проходом |
| Формулы chance/пороги у оригинала неизвестны (GDD §13) | Все константы — в `content/balance.yaml`, формула одна и тестируемая; править числа не трогая код |
| Рост сложности store при добавлении предметов/NPC | Мир = плоский словарь статусов + сущности с id; новые системы только добавляют статусы/эффекты (принцип GDD §12.1) |
