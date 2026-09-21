# Cyberdyansk — Plan of Implementation

Поэтапный план разработки форка. GDD: `GAME_DESIGN.md`. Стек: **React + TypeScript** (UI-слой), Electron — оболочка на позднем этапе (Phase 8).

**Текущий статус (2026-09-21):** Phase 1–4 ✅ завершены; **актуальная фаза — Phase 5** 🚧 (исполнение действий работает без броска: трата стоимости + эффекты, `successChance` — плоский % из данных карты). В Phase 6 уже заложены заделы: флаг `dayOver` с гейтингом UI, `world-store.newDay()`, `card-store.reshuffleForNewDay()`. Тесты: 45 unit-тестов (`tests/world-store.test.ts`, `effect.test.ts`, `time-engine.test.ts`, `cards.test.ts`).

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

**Языковая конвенция:** UI-строки — английский (как в оригинале); комментарии и имена в коде — русский.

### Структура репозитория
```
cyberdyansk/
  GAME_DESIGN.md          # этот GDD — источник правды по механикам
  PLAN.md                 # этот план
  package.json / vite.config.ts / tailwind.config.js / tsconfig.json
  content/                # YAML: decks/*.yaml, balance.yaml (Phase 7+: items/, locations/)
  src/
    app/                  # композиция приложения, роутинг вкладок
      Shell.tsx           # верхняя навигация + левая/правая панели
      StoryView.tsx       # сетка локаций + рука (Phase 4)
      CharacterView.tsx   # вкладки характеристик (Phase 2)
      CardWindow.tsx      # окно карты: flavor, требования, действия (Phase 4–5)
      LeftPanel.tsx / RightPanel.tsx   # панели дайджеста и предупреждений (GDD §11)
      CharacterCreation.tsx            # экран создания мира (Phase 3)
      StatusTile.tsx      # единый формат отчётности (GDD §12.2)
    core/                 # чистый домен, без React
      status.ts           # Status, Effect — базовые примитивы GDD §3
      effect.ts           # applyEffects — применение Effect[] к статусам мира
      world-store.ts      # zustand store: AP, время, деньги, stash, capacity...
      time-engine.ts      # AP ↔ игровые часы (Phase 1)
      balance.ts          # zod-схема + DEFAULT_BALANCE (зеркало content/balance.yaml)
      new-game.ts         # сборка стартового мира из контента (Phase 3)
      persistence.ts      # save/load мира в localStorage, автосейв (Phase 3+)
      checks.ts           # success chance из skills/moods/equipment (Phase 5)
    cards/                # карточная система (Phase 4–6)
      types.ts            # Card, Deck, Action, Cost, Requirement (zod-схемы)
      deck-loader.ts      # YAML → zod-валидированные колоды
      hand.ts             # раздача, размер руки (статус с TTL), discard/defer/draw
      card-store.ts       # zustand: рука/колоды/добор/playCard/reshuffle (Phase 4)
      starter-content.ts  # загрузка стартовых колод и локаций из content/ (Phase 3–4)
    content/              # (Phase 7+) items/*.yaml, locations/*.yaml
  electron/               # main/preload (Phase 8)
```

**Правило:** `core/` и `cards/` (логика) не импортируют React — только типы. Это keeps домен тестируемым и позволяет позже перенести его в Electron main-процесс, если понадобится.

---

## Phase 1 — Ядро: статусы, эффекты, время (неделя 1) ✅

Цель: базовые примитивы GDD §2–3 работают и покрыты тестами. UI не нужен.

- [x] `Status { name: string; value: number | string }`, неймспейсированные имена (`Category/Sub`), парсинг/валидация имени
- [x] `Effect { statusName, delta }`; `applyEffects(worldState, effects[]) → changed[]` с поддержкой числовых и текстовых статусов (текст — замена значения)
- [x] Дельта за период: store хранит изменения (`dayChanges`), UI получает `(+2)/(−3)` из этого (GDD §3)
- [x] Производные статусы: декларативный список `{ name, formula(state) }` (пример: Perceived temperature = Temperature + модификатор)
- [x] World store (zustand+immer): AP (50/день), игровые часы `HH:MM`, Ohio Dollars, current stash, carrying capacity, carpe diem; правила GDD §2: **stash=0 → блокирует reload и смену экипировки**, **capacity=0 → нельзя забирать предметы**
- [x] Time engine: действие `{ apCost?, timeCost? }` тратит AP и двигает часы; исчерпание AP → флаг `dayOver` (переход в Phase 6)
- [x] Unit-тесты: применение эффектов, дельты, производные статусы, гейтинг stash/capacity

**Acceptance:** тестовый сценарий «сделать действие → AP упало, часы сдвинулись, эффекты применились» проходит без UI. ✅ (`tests/world-store.test.ts`)

## Phase 2 — Каркас приложения и окна (неделя 1–2) ✅

Цель: виден скелет игры по раскладке GDD §11.

- [x] Vite + React + TS strict + Tailwind; дизайн-токены: фон, панели, цвета рам/тиров (оранжевый/синий/зелёный/фиолетовый), шрифт
- [x] `Shell.tsx`: верхние вкладки (STORY / WEAPONS / OUTFIT / SOCKET / EQUIPMENT / INFO / INVENTORY / CHARACTER / PEOPLE / PROGRESS / QUESTS / JOBS / WORLD + MENU) — нерабочие заглушки, активная подсвечивается
- [x] Левая панель: портрет, Actions (refresh/clear hand/binge mode/buy credits), кредиты, локация; **контекстный дайджест** — компонент `Digest { sections }`, секции передаются из store (GDD §11: панель пересобирается)
- [x] Правая панель: Daytime/Aggression/Comedown/Vehicle + блок предупреждений (генерируется из условий мира: stash=0 → «You're out of stash...»)
- [x] `StoryView` — заглушка: пустое место под сетку локаций и руку
- [x] `CharacterView` — **реальная вёрстка** по GDD §3: 4 секции (Skills/Moods/Menaces/Mutations + Character/Body) рендерит статусы из store с дельтами; фильтр by name
- [x] Компонент `StatusTile { status, delta? }` — единый формат отчётности (GDD §12.2): будет переиспользован в результатах действий и сводке дня

**Acceptance:** открываешь app → видишь раскладку как на скриншотах; CharacterView показывает реальные данные из store с дельтами. ✅

## Phase 3 — Создание персонажа (неделя 2–3) ✅

Цель: генерация/создание мира в начале игры.

- [x] Экран создания: имя, базовые текстовые статусы (Base gender, Preferred style, Your time/Your life...) по образцу GDD §Character; стартовые числовые значения skills/moods (`src/app/CharacterCreation.tsx` + `src/core/new-game.ts`)
- [x] Стартовый мир: локация Cinci Bordertown, кредиты ($50), stash/capacity, транспорт, первые колоды из `content/decks/` и сетка действий локации `content/locations/cinci-bordertown.yaml` (Phase 4)
- [x] Сохранение мира в localStorage (`src/core/persistence.ts`, автосейв в `App.tsx`) — задел на save/load; с Phase 4 сериализуется и рука

**Acceptance:** «New game» → экран создания → попадание в StoryView с заполненным левым дайджестом. ✅ (проверено в браузере)

## Phase 4 — Колоды, карточки, рука (неделя 3–5) ✅

Цель: сердце игры работает по GDD §4.

- [x] Типы: `Card { id, title, flavor, deckId, requirements?, daily?, actions[] }`, `Action { verb, cost?: Cost, successChance? | check?, enabledCondition? }`, `Cost = time | credits | items | probabilistic` (`src/cards/types.ts`, zod-схемы)
- [x] Загрузка колод из YAML + zod-валидация; стартовые колоды: Bordertown Life (локация), Life/Survival, Down to Work; DMM — заглушка (GDD §13). **Стартовый контент**: placeholder-YAML в `content/decks/` (+ daily-карта «The daily feed»); финальный список карт предоставит пользователь. Локации: `content/locations/*.yaml`, загрузка через `src/cards/starter-content.ts`
- [x] `hand.ts`: раздача N карт в руку. **Механика руки (решено 2026-09-20, закрывает GDD §13):** исполнение или сброс карты возвращает её в колоду, её слот в руке пустует; клик по баннеру колоды (или «Refresh» слева) — добор заполняет пустые слоты, каждый добранный карт тратит AP (`drawApCostPerCard` из balance.yaml); полный reshuffle + новая раздача при новом дне. **Размер руки = базовый статус с TTL-модификаторами** (world-store хранит `handSizeBase`/`handSizeModifiers`; уведомления «increased/dropped» — UI, закрывается кликом)
- [x] Daily-карты: гарантированная выдача раз в день вне колоды (первый слот; флаг `dailyDealtToday`)
- [x] `StoryView` — финальный вид: баннеры колод + рука (4 слота, пустые слоты видны) + сетка статичных действий локации из YAML
- [x] `CardWindow.tsx`: flavor, системная заметка о частоте, бейджи CARD REQUIREMENTS, кнопки DISCARD/CLOSE; список действий с verb, стоимостью (−N AP · +Nh), `[ Success: N% ]`; недоступные действия — серые
- [x] Требования карты к миру (NPC/статусы) как условия появления (missing-статусы подсвечиваются, действие блокируется)

**Acceptance:** из YAML-колод раздаётся рука ✅, размер руки меняется по TTL с уведомлениями ✅ (`addHandSizeModifier` + notice в world-store), daily-карта появляется раз в день ✅, окно карточки соответствует GDD §4 ✅. Unit-тесты: `tests/cards.test.ts` (21 тест).

## Phase 5 — Движок действий и исходов (неделя 5–6) 🚧

Цель: нажатие кнопки даёт честный результат по GDD §5.

**Текущее состояние (задел):** исполнение действия уже работает без броска — `CardWindow.perform` тратит стоимость (`world.spend({apCost, timeCostHours}, effects)` + `spendCredits`) и возвращает карту в колоду; `successChance` хранится как плоский % в данных карты (`src/cards/types.ts`, отображается как `[ Success: N% ]`); гейтинг по AP/кредитам/dayOver уже есть. Осталось: бросок, пороги вердикта и варианты эффектов на исход.

- [ ] `checks.ts`: success chance = f(base, skills, moods/equipment bonuses) — формула прозрачная и тестируемая; раскладка компонентов для тултипа (пока шанс берётся плоским из данных карты)
- [ ] Бросок → вердикт (bad / okay / good) по порогам (пороги — в `content/balance.yaml`)
- [x] Применение результата: трата стоимости (AP/время/кредиты) + `Effect[]` из карточки через `world.spend` ✅; осталось: варианты эффектов на исход, вероятностное потребление предметов
- [ ] Экран результата: вердикт-заголовок, нарратив по исходу, сетка `StatusTile` изменений (используя компонент из Phase 2), кнопка forward
- [ ] Навык растёт за попытку независимо от исхода; цена успеха (moods/penalty) — из данных карточки

**Acceptance:** полный цикл «открыл карту → нажал действие → бросок → вердикт → тайлы изменений» с unit-тестами формул и порогов.

## Phase 6 — Цикл дня/ночи (неделя 7)

Цель: GDD §6. Задел уже есть: флаг `dayOver` в world-store ставится при исчерпании AP, UI гейтится по нему (действия карт/локации блокируются с подсказкой «The day is over»), `world-store.newDay()` и `card-store.reshuffleForNewDay()` готовы (сброс AP/часов, expired-TTL hand-size, reshuffle + новая раздача).

- [ ] Исчерпание AP → окно «Another day/Another night»: `Move`, `Do it | 3` (отсрочка на реальные 30 мин, один раз в день), `Deep` (заглушка до ответа по GDD §13)
- [ ] Сводка дня: экран тайлов всех изменений за сессию («The right side of longing») — тот же `StatusTile`, данные из журнала эффектов store (`dayChanges`)
- [ ] Новый день: сброс AP/часов (world-store.newDay уже готов), пересадка руки, daily-карты

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

## Решения по открытым вопросам (GDD §13)

- **Момент пересадки руки** — решено 2026-09-20: карта возвращается в колоду при исполнении/сбросе, слот пустует; добор кликом по баннеру колоды за AP; полный reshuffle на новый день.
- **Стартовый контент** — финальный список карт стартовых колод предоставит пользователь (placeholder уже в `content/decks/`).
- DMM deck и действие `Deep` — заглушки до уточнения.
- Точные пороги вердиктов / формула success chance — первичные значения уйдут в `content/balance.yaml`.
