# Cyberdyansk — Game Design Document

Форк «Cyberpunk Dreams». Документ фиксирует механики базовой игры (реконструкция по скриншотам интерфейса) и принципы дизайна, которые мы сохраняем в своей реализации. Это источник правды для всех последующих решений по геймдизайну.

---

## 1. Ядро концепции

- Карточная life-sim в сеттинге киберпанк: игрок живёт по дням в Cinci Bordertown (и других локациях).
- Игровой процесс = выбор карточных действий. Каждое действие тратит **AP** и продвигает **игровые часы**.
- Когда AP исчерпано — переход «Another day/Another night» и сводка дня.
- Персонаж развивается через навыки, мутации, экипировку, отношения; мир реагирует на статусы игрока.

## 2. Создание персонажа («create your character»)

Экран с двумя полями имён и кнопками `» create` / `» account FAQ` / `» cancel` (реконструкция по скриншоту).

- **Street name** — публичное уникальное имя: другие игроки видят его в игре. Правила описаны прямо игроку:
  - минимум 3 символа; максимум 30; без специальных символов;
  - «Copy your intimate name if you like»;
  - постоянно (меняется за цену).
- Первое поле — вероятно, внутреннее имя персонажа («beckett» → в игре отображается как «Bekket»).
- **Мультиплеерный след**: street name видны другим игрокам = в оригинале есть общий мир/другие игроки. В форке решаем, сколько этого сохранять (минимум — уникальность и ограничение 3–30 символа).

### Выбор персонажа («Pick your character»)

Первый экран после входа: список всех персонажей аккаунта простыми кнопками (`Bekket`, `zer0 ex`). Подтверждает **мультиперсонажность**: один аккаунт → несколько персонажей, выбор при каждом входе. Имя в списке — street name (из поля «zer0_ex» получилось «zer0 ex»).

### Онбординг нового персонажа

Пошаговая последовательность экранов после создания персонажа (кнопка `» forward` внизу):

**Шаг 1 — «A beginning»:**
- story-карточка с красным значком «!»: интро о пересечении midwestern badlands, «the mission is you»; ниже — инфо-карта **Cincinnati** с кнопкой `Watch` (24 млн людей, lawless slum and favela).
- Стартовая локация — **Cinci Bordertown**.
- Ресурсы: Ohio Dollars 0; `credits: 1`; Actions `56/50`.
- Правая панель: блок **«A stranger»** с плейсхолдерным портретом (?) — старт «чужаком».

**Шаг 2 — «Empire of steel.»:**
- Панорамный арт Cincinnati с закатом.
- Нарратив: персонаж несколько дней наблюдал из укрытия, готовится к пересечению границы в город («The city has a hard border with the badlands»).
- Сетка тайлов получения **стартового снаряжения**:
  - Basic bloodclaws ×1 (оружие)
  - Desert boots ×1 → immediately equipped
  - Desert duster ×1 → immediately equipped
  - Desert gear ×1 → immediately equipped
  - Carpe diem ×10 (new total: 10) — стартовые заряды idle-действий
  - Survival pack ×1
- Формат тайлов совпадает с единым форматом отчётности (§6): `You've gained N item (new total M)` + `Your [item] has been equipped`.

**Шаг 3 — «The border»:**
- Story-карточка с артом пограничного поста: badlands, охрана в броне, минное поле, колючая проволока, шлюзы для людей и тяжёлые ворота для техники.
- **Два выбора** (карточки действий с кнопками `Talk` / `Explore`, без стоимости — это не обычные AP-действия):
  - **«Talk to the guards»** — «If you want to get into the city, you'll have to get this over with sooner or later.» Курсивом: *«This step defines your character and gives you an initial weapon and equipment»* → выбор определяет билд/персонажа.
  - **«Explore»** — «There's time enough, for now.» Курсивом: *«You will have to approach the guards sooner or later, but maybe "sooner" isn't your style»* → отложенное прохождение, но не навсегда.
- Это **ветвление онбординга**: оба пути ведут к одним и тем же целям (в город, через стражу), отличаются стилем/последствиями.

**Шаг 4 — результат ветки «Explore»:**
- Выбранная карточка `Explore` раскрывается и показывает результат: нарратив-описание локации («The border town. Dust. Dirt. Junk. People drifting in and out. Things to be found.»).
- Заголовок результата **«Heavy ~~light~~.»** — в заголовке поддержан **strikethrough**: зачёркнутое слово «Heavy» рядом с оставшимся «light». Похоже на игру слов: выбран лёгкий путь («light»), тяжёлый вариант перечёркнут.
- Сетка тайлов результата — два **флейвор-тайла без чисел** (`Drifting into this place.`, `Echoes in dirt.`) — подтверждает, что в едином формате отчётности существуют чисто нарративные тайлы (аналогично «Shifting»/«Echoes in dirt» в сводке дня у Bekket).
- Ветка Explore **не даёт предметов** — только флейвор; стартовый набор (Empire of steel) получен до ветвления.

**Шаг 5 — конец онбординга, основной story-экран:**
- Верх: красный баннер **«CLICK ME»** (туториал) + **три карты руки** (в том кадре с царапанным паттерном, вероятно недорисованное/рубашечное состояние; в рабочем состоянии карточки показаны лицом — см. §5 «Рука»). Размер руки на этом этапе = 3.
- Ниже: ряд **pinned-карт Cinci Bordertown** (позже туториал явно подписывает этот ряд как PINNED CARDS) — «Getting into the city» (иконка со стрелкой), «Back to the border post», «Bordertown bar». Подтверждает раскладку §5: рука сверху, pinned-карты снизу.
- После онбординга слот красного баннера «CLICK ME» занимает **баннер колоды** («BORDERTOWN LIFE») — по клику из неё добирают (первый клик открывает туториал-окно «Deck clicked», см. §5 «Рука»).

**Шаг 6 — туториал-уведомление «Click me»:**
- Клик по красной плашке в правом нижнем углу открывает диалоговое окно (кнопка `close`).
- Объяснение системы уведомлений: **уведомления в правом нижнем углу = события мира** — действия **других игроков**, туториалы; закрываются кликом, при большем контенте открывают диалог. Ещё одно подтверждение мультиплеера (см. §2 «Street name»).
- Приветствие: «Welcome to cyberpunkdreams, {street name}» — имя персонажа подставлено как ссылка.
- **Ключевая фраза**: *«The typewriter text that taps out after you play a card is just for flavour… but maybe you'll see something more than that in it, sometime»* — флейвор-текст «печатной машинки» после сыгранной карточки иногда несёт скрытую механику (прямое продолжение принципа №4 §13).
- Уведомление **персистентно**: остаётся в углу после игровых действий (сдачи руки) и диалог можно открывать повторным кликом до закрытия.
- Позже появляется **второе туториал-уведомление того же типа — «Click me two»** (*«We're just getting started…»*) в правом нижнем углу, тоже персистентное: онбординг распределён по нескольким «click-me» плашкам на протяжении ранней игры, а не одному окну.

- **UI расширяется по шагам**: на шаге 2 в левой панели появляются «Equipment & devices» и «Environment», на шаге 4 — **«Health & wellbeing»** (Sustenance: `Replete`, Alertness: `Full alertness` — текстовые значения статусов; Carpe diem: 10) и **«Threats & hazards»** (Black shakes / Hardship / Injury = 0); позже в этом же разделе появляется строка **Psychosis = 0** (после миссии «Got to get through») — список угроз тоже динамический, строки добавляются по мере актуальности. Табы верхнего меню тоже растут: STORY / INVENTORY → после получения носимых предметов появляется **OUTFIT** (STORY / OUTFIT / INVENTORY) — прогрессивное раскрытие UI по мере развития персонажа.

**Credits vs Ohio Dollars**: в левой панели `credits` (с кнопкой `buy credits`), в правой — Ohio Dollars; значения разные (у Bekket: 1 и 187). Это два разных ресурса/валюты; связь между ними не выяснена.

## 3. Время и ресурсы

| Ресурс | Описание |
|---|---|
| AP (номинал 50/день) | каждое действие тратит очки действий: **добор из колоды = 1 AP**, игра опции в карточке бесплатна (туториал). В левой панели отображается **вместе с игровым временем** (`49/50 \| 07:19`), но временная часть не обязательна — наблюдалось и просто `56/50`, а позже время снова появилось. Счётчик **динамический**: может превышать номинальный лимит, **снижаться** (`56/50 → 49/50`, затем `56/50 → 48/50` — вероятно добор нескольких карт) и снова **вырасти выше лимита** (`49/50 → 56/50` без перехода «Another day», наблюдалось дважды), затем **опуститься обратно под лимит** (`56/50 → 48/50`) — временная часть рядом снова появляется. Замечена корреляция (стабильна во всех наблюдениях): при AP > 50 временная часть рядом не отображается; при AP ≤ 50 — отображается. Связь с `binge mode` неясна |
| Игровые часы | `HH:MM` рядом со счётчиком AP (может отсутствовать, см. строку AP); у действия есть временная цена (`\| 1`, `\| 3`) — бейдж стоимости виден прямо на карточке в руке. **Часть действий явно продвигает время суток**: курсивная заметка в барной карте *«The time of day might move on a little while you're here.»* (разговор). Отображение **не монотонно и непоследовательно** между кадрами: `07:19 → 03:32 → 01:39` (падение), `09:52 → 08:42 → 08:50` (падение, затем рост на 8 мин), `→ 09:56` (рост), затем **`07:10` при неизменном AP** (`48/50`) — время сдвинулось без видимого расхода действий, и далее **`09:08` на экране результата** (`49/50`) — скачок вперёд ~2 ч сразу после игры «бесплатной» опции (§5 результат «Tall towers»), затем **`04:08` при том же AP `49/50`** (окно «Old magazines»), а на экране результата — **`02:31`** (сдвиг ещё назад, §5 результат «Ancient news»), затем **`08:19`** при том же AP `49/50` (окно «Exploring the town»), а в кадре результата «Walk the streets» время **опять отсутствует** при `56/50` (корреляция §3 строки AP сохраняется), затем **снова появляется как `09:56`**, когда AP опустился до `48/50` (новая рука), затем **`03:08` при том же AP `48/50`** (результат «Listen in», §5), затем **`09:36`** при AP `49/50` (окно «The last thread»), затем **`09:09`** при том же AP `49/50` (результат выбора «Keep it», §5), затем **`07:06`** при том же AP `49/50` (окно «Exploring the town» / «Going further»). Похоже на игровые часы суток со сменой по-разному; механизм неясен |
| Ohio Dollars | основная валюта |
| Current stash | быстрое хранилище. Пустой stash **блокирует перезарядку оружия и смену экипировки** (восполняется в accommodation) |
| Carrying capacity | переноска; без сумок/глубоких карманов = zero — блокирует забираемые предметы |
| Carpe diem | заряды, тратятся на idle-действия («Kill some time», «Get busy»), чтобы получить реальные бонусы вместо «ничего не произойдёт» |
| Коллекционные счётчики | `Rumour/<локация>` (+1 за наблюдательные карты), **`Hard fact/<локация>`** (+1 за встречи с NPC, напр. «Listen in»), `Rare Insight` (редкостная категория, миссия), **`Naïve shot`** (+1 за выбор «Keep it» в карте-решении «The last thread»; иконка-ампула) — четыре разных типа «знания», назначение/расход неясны (§5) |

## 4. Система статусов (базовый примитив №1)

Один тип объекта во всей игре: **статус** = `{ name, value }`, где `name` — неймспейсированное имя (`Категория/Подкатегория`: `Skill/Hacking`, `Mental health/PTSD`, `Propensity/Alcohol`, `w/Accuracy`), а `value` — **число или текст** (`Very masculine`, `Punk`, `Nighthawk`).

### Классы статусов (вкладки Character)
- **Skills** — долгоживущие, растут от практики (~5..41+). Растут даже при неудачных попытках.
- **Moods** — волатильные эмоциональные состояния (0..~20): Bitterness, Buzz, Calm, Caution, Thrill... Могут иметь **условие получения**, описанное текстом («Build your *thrill* to get this» → Confidence), и нести богатый набор эффектов.
- **Menaces** — угрозы: `Life is hard`, `Mental health/Paranoia`, `Target/Street crime` (розыск).
- **Mutations** — постоянные модификаторы с плюсами/минусами + общий счётчик (`Mutations 4`).

### Свойства статусов
- **Delta за период** отображается цветным бейджем: `(+2)` зелёный, `(−3)` красный — игра хранит тренд по каждому статусу.
- **Производные статусы** вычисляются на лету: `Perceived temperature (+5) 37` = Temperature + модификатор.
- Статусы могут быть числовыми или текстовыми (категорийными).

### Эффект (базовый примитив №2)
`effect = { status_name, delta }`. Дельта может быть отрицательной. Один и тот же объект используется везде: бонусы предметов, эффекты мудов, награды действий, итоги дня. Это фундамент всей системы.

## 5. Карточки и колоды

### Колоды (по умолчанию)
1. **DMM** — состав не выявлен (открытый вопрос).
2. **Текущая локация** (Bordertown Life / «Borderland life» в туториале) — бытовые/локальные события: кухня, наблюдение, mercy crew, одежда; атмосферные карты-наблюдения о мире («Looks like summer» / «The seasons»).
3. **Down to Work** — рабочая колода.
4. **Life/Survival** — глобальные выживальские карточки (Going down, Gotta look after your guns...).

### Рука
- Вверху story-экрана — ряд руки: **широкий баннерный тайл** + N карточек (у Bekket: 4, у нового персонажа после онбординга: 3); ниже — ряд **pinned-карт локации** (PINNED CARDS).
- Карточки в руке показаны **лицом**: арт + название («Buried in ash», «Deck clicked», «Got to get through», «Looks like summer», «Ripe for theft»; после пересдачи — «Tall towers», «Old magazines», «Exploring the town…»; после игры исследовательских карт — **«Trash talk/Old wounds»** (двухчастное название), **«The last thread»**, и снова «Exploring the town…» — подтверждает повторный добор из взвешенного пула) и бейдж стоимости времени `| N` внизу слева. В баннерном тайле — название колоды (**«BORDERTOWN LIFE»**); во время онбординга тот же слот занимал красный туториал-баннер «CLICK ME».
- **Pinned-ряд расширяется с прогрессом**: базовый набор на шаге 1 онбординга — «Getting into the city» (иконка со стрелкой), «Back to the border post», «Bordertown bar». После того как Familiar достиг 1 (результат «Walk the streets») в ряд **добавилась новая pinned-карта «The border market»** — рынок у западных ворот из лора «Old magazines» («semi-permanent»). Позже ряд вырос до **пяти карт** в порядке: «Getting into the city», «Back to the border post», «The border market», **«The good doctor»**, «Bordertown bar» (story-кадр с персонажем «zer0 ex»: портрет-плейсхолдер «?», AP `56/50`, время скрыто) — сервисные точки открываются по одной с прогрессом, новые вставляются **перед** «Bordertown bar»; появление «The good doctor» (судя по названию — медицинская служба), вероятно, после Familiar 2 (результат «Going further»). Сервисные точки локации открываются исследованием, а не выдаются с начала (§14).
- **Добор динамический**: после пересдачи/добора в руке — новые карты из той же колоды («Tall towers», «Old magazines» и «Exploring the town…» — наблюдательные/исследовательские карты, см. ниже) — подтверждает взвешенный пул (туториал: на старте в Borderland life «a few cards»), а не статичный набор.
- **Баннерный тайл = сама колода, и по клику из неё добирают.** Первый клик по колоде у нового персонажа открывает окно карточки **«Deck clicked»** (арт со стрелкой, flavor: *«You've clicked on a deck for the first time.»*, действие «A few notes»): *«This is a tutorial about how decks work. Although it no longer says CLICK ME, you can still draw from it.»* + курсивный тег `Tutorial.` Это объясняет назначение баннера «BORDERTOWN LIFE»: клик по нему = добор карт из этой колоды (карта «Deck clicked» в руке — артефакт этого же события).
- **Экономика AP и карт** (прямо сказано в туториале): один добор из колоды стоит 1 действие; **игра опции внутри карточки действия не стоит**: *«One draw costs one action. Playing an option on a card does not cost an action.»*
- **Колоды динамические**: с прогрессом их становится больше и они различаются — от локации, разблокированных историй/способностей, известных персонажей и организаций («you'll get more and different decks, depending on where you are…»). Пока игроку не попасть в город впервые, колода одна — **Borderland life**.
- **Взвешенный случайный добор** (прозрачно объяснено туториалом): некоторые карты «almost guaranteed to appear regularly», другие редкие; число и тип карт в колоде меняются с прогрессом, и этим можно научиться управлять «up to a point»; на старте в Borderland life мало карт, а всего во всех колодах — сотни.
- **Pinned-карты** (PINNED CARDS) — ряд под рукой («Getting into the city», «Back to the border post», «Bordertown bar»): не статичные действия локации, а закреплённые карты, меняющиеся вместе с локацией и прогрессом; продвижение по игре требует использовать **оба типа карт** (добранные из колоды + pinned).

### Туториал колод: страница «Helix override.»
Клик «A few notes» в окне «Deck clicked» открывает полноэкранную страницу **«Helix override.»**: внутри — **аннотированный скриншот UI с красными подписями** (DECKS → баннерный тайл, HAND → рука, PINNED CARDS → ряд под рукой) + двухколоночное объяснение (динамические колоды; взвешенный добор; pinned-карты) и в конце — тайл результата `You've gained 1 Rumour/Cinci Bordertown (new total 1)`: даже туториал даёт слух через стандартный формат отчётности (§6). В этом кадре тайлы руки показаны со «сколотым» (царапанным) паттерном без названий — и тот же паттерн **наблюдается на обычном story-экране**: после добора все три карты в руке показаны рубашкой/царапинами, без атов и имён (AP `56/50`, время скрыто), тогда как кадры с видимыми названиями карт соответствуют уже открытым карточкам → вероятно, **свежие карты показываются рубашкой до первого открытия**.
- У одной из карт **красная рамка** («Got to get through») — вероятно, маркер миссионной карты (подтверждается бейджем «Just once.» у её действия). Сам же бейдж **«Just once.» — общий маркер одноразовых действий**, а не только миссий: он есть и у «Your mission», и у «Approach» в NPC-карте «Ripe for theft» (встреча с персонажем происходит один раз).
- **Размер руки — изменяемый статус с TTL**: «HAND SIZE TEMPORARILY INCREASED» → позже уведомление «Your hand size has dropped / Couldn't keep this rate up forever». Больше карт = больше вариантов; механика модулирует доступность информации.
- Карточку можно **отложить** («Not right now») или **сбросить** (DISCARD).
- **После сдачи руки (`clear hand`) рука мгновенно добирается заново** — снова полный набор, пустых слотов/ожидания не видно. Размер руки поддерживается как статус.
- **Daily-карты**: гарантированно раз в день вне зависимости от колоды («You'll see this card once per day, every day, no matter what»).

### Окно карточки
```
заголовок + flavor text (несколько абзацев)
[опционально] системная заметка курсивом — правила частоты выпадения описаны ПРОЗРАЧНО:
  «This will come up much more often if you have a large crew or if their loyalty is less than their number»
[опционально] CARD REQUIREMENTS — бейджи NPC/статусов как условий появления (иконки +N)
кнопка CLOSE × в шапке; DISCARD не обязателен
действия внутри карточки — блок: арт + имя действия + описание, справа кнопка:
  имя действия — фраза («Picking it out», «Your mission»)
  [опционально] бейдж частоты/условия рядом с текстом (синяя плашка «Just once.») + курсивное пояснение
                (например: «Get this done.») — одноразовые действия маркируются явно, как daily-карты
  кнопка-глагол («Do It», «Help», «Wait», «Pay», «Eat», «Look», «Walk», «Click», «Stash»; бывает и нарративная фраза-реакция: «But...» у «Tall towers») — игра опции в карточке AP не стоит (§5 туториал колод);
  карта может содержать **несколько взаимоисключающих действий** (каждое со своим артом/кнопкой): «Remembering?» («All good» / [ Reset ]), «The last thread» («Burn it» Click / «Keep it» Stash) — карты-решения
  стоимость (см. ниже)
  success chance — либо плоское число на кнопке `[ Success: 8% ]`,
                  либо раскладка компонентов в тултипе (Charisma − 83%, Skill/Persuasion − 100%)
```

**Реальный пример (карта из руки, Cinci Bordertown):** окно **«Buried in ash»** — арт костра + флейвор про «hundreds of people coming and going… stuff left behind»; одно действие **«Picking it out»** с артом кольца-череп и нарративом («You pour a little water onto it, until it stops hissing. It might not be your usual style, but you can't help slipping it on… A perfect fit.»), кнопка `Do It` без видимой стоимости; в шапке только `CLOSE ×`. Это минимальная форма окна: без DISCARD, без курсивной заметки, без success chance — элементы шаблона опциональны.

**Миссионная карта (карта из руки с красной рамкой):** окно **«Got to get through»** — flavor *«You know why. It just isn't quite the time to think about it yet.»*; одно действие **«Your mission»**: «But it's in the back of your mind. Always. Your mission. The reason you crossed the badlands to get here.» + синяя плашка **«Just once.»** и курсив *«Get this done.»*, кнопка `Do It` без стоимости, в шапке только `CLOSE ×`. Выводы: (а) у персонажа есть **персональная миссия**, заданная при создании/прибытии («the reason you crossed the badlands») — вероятно, стержневая цель персональной линии; (б) одноразовые действия помечаются бейджем «Just once.» в отличие от ежедневных daily-карт; (в) красная рамка карты в руке — маркер этого особого типа.

**Результат миссии («Split wide.»):** экран результата в **вариантной структуре без комикс-полосы**: сверху — мини-шапка сыгранной карточки (арт + название «Got to get through» + flavor), затем тот же блок действия «Your mission» с бейджем «Just once.», ниже — **расширенный двухколоночный нарратив** («You're not just a random wanderer. Not just a desperate hopeful. You were sent… Here, in Cincinnati. Greatest of the border cities. Over 24 million people's worth of sprawling slum and glittering towers.» / правая колонка: «Your personal heaven or your personal hell? It doesn't matter. What matters is your mission.») → чёрный заголовок результата **«Split wide.»** (ещё один игра слов в стиле «Heavy ~~light~~.») → сетка тайлов: **`You've gained 1 Rare Insight (new total 1)`** — новый коллекционируемый ресурс типа Rumour, но редкостной категории (`Rare` выделено красным). Кнопка `» forward` внизу — пагинация продолжается. **Подтверждено**: AP до и после сыгранного действия не изменился (`56/50`) — игра опции в карточке действительно бесплатна (туториал §5).

**Погодная карта из Borderland life:** окно **«Looks like summer»** — flavor: *«This place is either too damn hot or too damn cold. A few days of bearable weather while the seasons change. But they change fast. Spring and autumn just don't exist any more.»*; одно действие **«The seasons»**: «Yeah, Cinci's seasons are sharp, abrupt, or so you've heard. Heard? It's more like you can feel it in your bones. Like you just know.», `Do It` без стоимости. Выводы: (а) в Borderland life есть **наблюдательные/атмосферные карточки** — дешёвый способ «прочитать» локацию; (б) **сезоны — мировое состояние**: в Cincinnati только резкие summer/winter («Spring and autumn just don't exist any more»), смена быстрая и влияет на мир (Temperature/Glare/Sunlight в левой панели, §12) — вероятно, гейтят действия/экипировку.

**Карта памяти и механика сброса:** окно **«Remembering?»** — flavor *«You've got ideas about your future in the city already – people and places that'll be useful to you. Where they are. How to find them.»*; **два действия**:
- **«All good»** (`Do It`): «You know you're not the first. People have come before you. You don't know how many. Somehow, it seems like you have a little of their knowledge.» — подтверждение, что в мире уже есть следы других персонажей (предыдущие воплощения / другие игроки?), и часть их знания унаследована.
- **«But you don't remember»** — кнопка **[ Reset ]** серая, глагол в квадратных скобках (паттерн недоступных действий, §5 «Недоступные действия»); под кнопкой иконки стоимости `−2` и `+20`. Текст: «No... there's nothing like that in you. You're a blank slate.» + прозрачное правило сброса: *«Use this to reset and start from scratch. You'll lose routes, suppliers, findable access codes and some other things, but **not** meta stats, persistent credit purchases, event items and some other things. This is only worth doing if you've already accumulated a lot of *persistent* stats and you really want to reset.»* + красный бейдж **«Be very careful. No undo.»** + *«You'll also get 10 credits»*. Выводы: (а) у игры есть **мета-слой/roguelite**: статусы делятся на персистентные («meta stats», «persistent credit purchases», event items — переживают сброс) и нет (routes, suppliers, findable access codes — сгорают); (б) **сброс — действие внутри карточки**, а не системное меню; (в) игра прозрачно объясняет, что теряется и когда сброс вообще имеет смысл («only worth doing if…») + награда credits за само решение; (г) «People have come before you» в связке с мультиплеером (§2) — вероятно, знания/следы предыдущих воплощений или других игроков персистентны в общем мире.

**Результат «All good» («Sink yourself skyards.»):** двухколоночный нарратив: левая колонка — *«It's not magic. They must have fed information back to your controllers, who used it as part of your training. Training you've forgotten, but which is still embedded in you, waiting to be unlocked.»* → новые концепты: **controllers** (кто-то управляет/воспитывает персонажа и собирает данные) и **встроенное обучение**, которое можно «разблокировать» — вероятно, источник персистентных бонусов/PROGRESS. Правая колонка — курсивная системная заметка с правилом персистентности: *«By default, you retain many things between lives, such as nearly all routes, drug dealer contacts, etc.»* → игра оперирует понятием **lives** (воплощений): по умолчанию между жизнями сохраняется многое. Заметное противоречие с правилом [ Reset ] (там routes/suppliers/access codes теряются) — вероятно, «between lives» (естественная смерть/перерождение) сохраняет больше, чем добровольный Reset; уточнить. Заголовок результата **«Sink yourself skyards.»** — продолжение серии каламбурных заголовков («Heavy ~~light~~.», «Split wide.»). Тайл: **`You've gained 2 Rumours/Cinci bordertown (new total 3)`** — кросс-чек с туториалом «Helix override» (там `new total 1`): счётчик слухов накапливается между экранами, награды суммируются. AP не изменился (`49/50`) — ещё одно подтверждение бесплатности игры опции.

**NPC-встреча из Borderland life («Ripe for theft»):** flavor: *«This guy's just slumped over by a wall, plugged in to an old school SensPerience rig. He's completely out of it. Looks like he's been under for days.»*; одно действие **«Approach»** с бейджем «Just once.» (одноразовая встреча): «Even if you're not the type to do it, it seems unreal that he hasn't been robbed or worse by now.», `Do It` без видимой стоимости. Выводы: (а) в локационной колоде есть **карты-события с NPC** — одноразовые встречи, маркируемые «Just once.»; (б) флейвор подтверждает мир сеттинга: **SensPerience** (§8 SOCKET) существует как «old school» технология — отключённый на днях человек, подключённый к ригу, — типичная локальная сцена; (в) AP в этом кадре снова `56/50` без времени — счётчик вырос с `49/50` обратно выше лимита **без перехода «Another day»** (§3).

**Результат «Approach» («Man is meat//Meat and metal.»):** полноразмерный результат с **кинематографической полосой из 3 панелей комикс-арта** (человек в SensPerience-риге / крупный план лица с проводами / девочка-подросток с обрезом за спиной) → двухколоночный нарратив: *«But it makes sense when you notice a young girl, teenaged probably, crouched near him, carrying a sawn-off and keeping a wild look in her eye. Daughter? Girlfriend? Hard to say.»* (правая колонка пуста — системной заметки нет) → заголовок результата **«Man is meat//Meat and metal.»** — новый формат каламбурного заголовка: **две фразы через `//`**, игра на смене акцента (мясо человека / мясо и металл). Тайл: `You've gained 1 Rumour/Cinci Bordertown (new total 4)` — счётчик продолжает нарастать (3 → 4, кросс-чек). AP не изменился (`56/50`, время по-прежнему скрыто) — ещё одно подтверждение бесплатности опций и корреляции «AP > 50 ↔ нет времени» (§3).

**Наблюдательная карта-мироустройство («Tall towers»):** flavor: *«Maybe you could be forgiven for thinking that this place is a post-apocalyptic hellhole – if all you did was look at your feet.»*; одно действие **«Hellhole?»** с артом светящейся **спирали/«геликса» из кругов** (мотив, перекликающийся с названием туториала «Helix override») и нарративом: *«Well, that part is true, maybe. But you know better than to think there's been an apocalypse. You might not have much of a memory, but you know that. And even if you didn't already, the bright, shining corporate towers of Cincinnati would tell you otherwise.»* Кнопка — **«But...»** (не «Do It»): **название кнопки может быть нарративной фразой-реакцией** на flavor карты, а не глаголом действия. Выводы: (а) ещё одна наблюдательная карта Borderland life — она уточняет сеттинг: Cincinnati **не постапокалипсис**, несмотря на облик трущб — «bright, shining corporate towers» (кросс-чек с миссией: «sprawling slum and glittering towers», 24 млн жителей); (б) отсылка к памяти персонажа («You might not have much of a memory») — снова мета-слой; (в) AP не изменился (`48/50`), но время рядом **сдвинулось** (`09:56 → 07:10`) без видимого расхода действий (§3).

**Результат «Tall towers» («The right side of longing.»):** двухколоночный нарратив, продолжающий flavor карты — левая колонка: *«Not to mention the helicopters and aircraft overhead, or the stuff you see for sale in the market. And it's not like Cinci's the last bastion of civilisation either.»* + *«It might be the last if you're heading on this particular route out west. It might be the biggest of the new border cities. It might be what global fashion has decided is the current place to be. But it's still just one city amongst thousands spanning the globe.»*; правая колонка: *«But as for this place, here at your feet? Yeah, the bordertown might be fairly accurately described as a hellhole, at least if you've got to live here full time. The thing to do is to move on, as quick as you can.»* → результат расширяет мироустройство: Cinci — один из тысяч бorder-городов «spanning the globe», возможно крупнейший и текущий выбор «global fashion»; bordertown у ног персонажа при всём том остаётся hellhole. Заголовок **«The right side of longing.»** совпадает с фразой, приведённой в §7 как пример экрана сводки дня — либо пул каламбурных заголовков переиспользуется между экранами, либо у обоих одна и та же шаблонная форма. Тайл: `You've gained 1 Rumour/Cinci Bordertown (new total 5)` → **выявляется паттерн**: каждая наблюдательная/мироустроительная карта при игре выдаёт +1 Rumour (прогрессия счётчика 1 → 3 (+2) → 4 → 5). Счётчики после результата: `49/50 | 09:08` — относительно окна карточки (`48/50 | 07:10`) **сдвинулись оба** (AP +1, время +~2 ч), хотя опция формально бесплатна; в правой панели у нового персонажа виден `current stash = 160`.

**Наблюдательная карта рынка («Old magazines»):** flavor: *«People sell all kinds of shit at the market. Well, markets; one of those places dotted around the bordertown where people gather together to sell. The one by the west gate is semi-permanent. The others come and go.»*; одно действие **«Ancient news»** (арт — стопка старых газет/журналов) с бейджем «Just once.»: «Like this guy, squatting next to a rough wooden box of old paper magazines. Probably decades out of date if they're even clean enough to read.», кнопка **Look** — ещё один глагол (пассивное наблюдение). В шапке только `CLOSE ×`. Выводы: (а) карта раскрывает **рынки bordertown**: у западных ворот — полу-постоянный, остальные «come and go» — деталь мира под будущие покупки/локации; (б) **наблюдательные карты тоже бывают одноразовыми** («Just once.» без курсивной пометки — бейдж работает сам по себе); (в) AP не изменился (`49/50`), время рядом `04:08` (было `09:08`) — ещё один немонотонный сдвиг (§3).

**Результат «Ancient news» («So empty//So real.»):** мини-шапка карты + блок действия → **комикс-полоса из 4 панелей** (улица рынка / лавка торговца в капюшоне / старик, сидящий за коробкой журналов / крупный план обложки журнала **TIME «LOS ANGELES 2075»**) → двухколоночный нарратив с **пустой правой колонкой**: *«The one on top's a Time from two decades ago, headlining conceptual plans to re-populate Los Angeles. Like that's ever going to happen after all these years.»* + курсивное эхо названия действия: *«Ancient news.»*. Заголовок результата **«So empty//So real.»** — второй пример формата `фраза//фраза` (после «Man is meat//Meat and metal.») → формат закрепляется как устойчивый, возможно характерный для наблюдательных карточек. Тайл: `You've gained 1 Rumour/Cinci Bordertown (new total 6)` — паттерн подтверждается и третий раз подряд (5 → 6): **каждая наблюдательная карта даёт ровно +1 Rumour**. Важный lore-якорь: журнал датирован **2075** и назван «two decades ago» → настоящее время мира ≈ **~2095**; также мир знает о планах репопуляции Los Angeles (город, не восстановленный два десятилетия). Счётчики: `49/50 | 02:31` — AP нетронут, время сдвинулось с `04:08` на ~−1.5 ч (§3).

**Исследовательская карта («Exploring the town»):** flavor: *«Dust everywhere. Bigger than at first glance.»* + **курсивная системная заметка**: «Your first priority should be raising your *familiarity*» (слово familiarity выделено как ссылка — вероятно, кликабельный статус). Одно действие **«Walk the streets»** (арт — пыль на ботинках) с бейджем «Just once.»: «Things to learn. More dust on your boots.», кнопка **Walk**. В шапке **обе кнопки: `DISCARD ×` и `CLOSE ×`** — подтверждает, что DISCARD опционален (§5 шаблон), а здесь он есть. Выводы: (а) вводится новый статус **familiarity** (знакомство с локацией) — игра прямо называет его «первым приоритетом» нового персонажа; вероятно, именно им гейтятся действия вроде [ Talk ] в баре («story worth sharing») и другие опции локаций; (б) карточка задаёт **рутинный цикл исследования**: ходить → узнавать → копится familiarity + Rumours; (в) AP не изменился (`49/50`), время `08:19` (было `02:31`) — сдвиг вперёд ~6 ч без расхода (§3).

**Результат «Walk the streets» («Altitude.»):** мини-шапка карты + блок действия → **комикс-полоса из 3 панелей** (alley-улица со граффити / мужчина с пятном крови на футболке у лестницы / группа местных, один с имплантом-глазом) → двухколоночный нарратив с пустой правой колонкой: *«The town is more badlands than city. Intertsticial, temporary, halfway between. Built from needs. The rentacops, the security firms, they don't come out here. Anything goes, anything can happen. But not everything does. Everyone here is here because they can't get in. The town serves needs, and needs are profits; rough, hard earned profits. A certain camaraderie.»* → заголовок **«Altitude.»** — короткий каламбурный титул (возможно, намёк на вертикальность трущб: лестницы, ярусы). **Два тайла**: `You now have Familiar/Cinci bordertown at 1 (you're new here.)` + `You've gained 1 Rumour/Cinci Bordertown (new total 7)`. Выводы: (а) статус familiarity **подтверждён как неймспейсированный статус** `Familiar/<локация>` с числовым значением — первый тайл его получения, скурсивная пометка `(you're new here.)` — индикатор низкого уровня; (б) наблюдательные карты дают **и Rumour, и Familiar** — это и есть обещанный «рутинный цикл исследования» из системной заметки карточки; (в) новый lore-термин: **rentacops / security firms** не заходят в bordertown («anything goes… but not everything does»); (г) AP-счётчик снова **вырос выше лимита без смены дня**: `49/50 → 56/50` (§3), время рядом скрыто — корреляция «AP > 50 ↔ нет времени» сохраняется.

**Карта-встреча со стариками («Trash talk/Old wounds»):** flavor: *«Two old timers, tough as old leather. Minutes from the city but a world and a fence away. Walking and talking.»* (арт — солнце над сухой деревней/пустошь). Одно действие **«Listen in»** (арт — ухо) с бейджем «Just once.»: «Something worth learning?», кнопка **Do It**. В шапке только `CLOSE ×`. Выводы: (а) двухчастное название через `/` («Trash talk/Old wounds») — новый формат заголовков карт, возможно указывает на два аспекта одной сцены; (б) «old timers» — ещё один тип NPC-встреч в bordertown, одноразовые («Just once.»); (в) AP `48/50 | 08:02` — время рядом, AP ≤ 50 (корреляция §3).

**Результат «Listen in» («Driving alone//Beating heart.»):** **без комикс-полосы**, сразу двухколоночный нарратив: левая колонка — *«"I'll tell you why I've got a problem. I'll tell you." Clearly an old sore, picked at over and over. "I'll tell you. I fought for Ohio. You fought for Kentucky. We won. You lost.»*; правая колонка — *«"And that's fair and square, 'cept you just won't leave it alone. You were never even from Kentucky. I just don't get it, is all."*» → заголовок **«Driving alone//Beating heart.»** — третий пример формата `фраза//фраза` (§6). Тайл: **`You've gained 1 Hard fact/Cinci Bordertown (new total 1)`** — новый коллекционируемый счётчик, отдельный вид от Rumour и Rare Insight: пока что **встречи с NPC дают «Hard facts», а наблюдательные карты — «Rumours»** (§3). Lore: старик говорит о конфликте Ohio vs Kentucky («I fought for Ohio. You fought for Kentucky. We won. You lost») — межгосударственный конфликт, объясняющий и название валюты **Ohio Dollars**, и саму границу badlands/Cincinnati (border cities из «Tall towers»). AP не изменился (`48/50`), время `03:08` (было `08:02`) — сдвиг назад ~5 ч без расхода (§3).

**Карта-решение по линии миссии («The last thread»):** flavor: *«Your last connection with what came before. Your training for this mission. Your instructions. Your entire life. They've all been set to fade, like a dream, until they were needed. Triggered memory blocks, carefully constructed.»* + вторая строка: *«But in your pocket, just a scrap of paper: Martha. Your handwriting. That's all it says.»* (арт — сложенный листок). **Первая карта с двумя действиями-выбором** после «Remembering?» — и первое реальное решение с последствиями:
- **«Burn it»** (арт — пламя): «You're guessing that you wanted this to be the one thing you didn't forget. But you've forgotten. So there's only one thing to do.», кнопка **Click**;
- **«Keep it»** (арт — кулак): «Your instinct is to set this thing alight. You shouldn't really have it in the first place. It's too risky. Too dangerous. But you can't let go of this one, last thread.», кнопка **Stash**.
В шапке только `CLOSE ×`. Выводы: (а) вводится персонаж/объект **«Martha»** — имя на клочке бумаги почерком самого персонажа; прямая связь с линией миссии и встроенного обучения («Triggered memory blocks, carefully constructed» ↔ «waiting to be unlocked», §5 результат «All good»); (б) **карты-решения**: два взаимоисключающих действия с разными кнопками/артами — в отличие от одиночных наблюдательных карт; выбор, вероятно, влияет на будущие карты/награды; (в) AP `49/50 | 09:36` — счётчик вырос на 1 (добор), время +~6.5 ч (§3).

**Результат выбора «Keep it» («Ready? Then wake up.»):** мини-шапка карты + блок действия → **комикс-полоса из 3 панелей** (промзона/трущбы / крупный план: рука держит клочок с красной надписью **«Martha»** / персонаж в перчатке убирает бумажку во внутренний карман) → двухколоночный нарратив с пустой правой колонкой: *«You fold it up tight and slide it back into your pocket, pushing it deep. Your hand brushes against something else in there. At least my masters didn't send me completely unprepared.»* → заголовок **«Ready? Then wake up.»** — новый стиль: вопрос + императив (в отличие от каламбуров и `//`-формата). Тайл: **`You've gained 1 Naïve shot (new total 1)`** («Naïve» выделено красным, с ï; иконка — шприц/ампула) — **четвёртый тип коллекционных счётчиков** после Rumour/Hard fact/Rare Insight (§3). Выводы: (а) подтверждение роли **«masters»** (господ, отправивших персонажа) — расширение лора controllers: у персонажа есть те, кто его послал; в кармане **ещё что-то** помимо бумажки с Martha; (б) выбор «Keep it» дал не Rumour/Hard fact, а новый счётчик `Naïve shot` — награды за решения отличаются от наград за наблюдение/встречи; (в) AP не изменился (`49/50`), время `09:36 → 09:09` (§3).

**«Exploring the town» возвращается с новым действием («Going further»):** та же карта (тот же flavor *«Dust everywhere. Bigger than at first glance.»* и системная заметка про *familiarity*) теперь содержит **другое действие**: **«Going further»** (тот же арт ботинок, «Just once.»): *«You've scratched the surface of this dump, but there's more to learn.»*, кнопка `Walk`. Вывод: **карты эволюционируют** — название одно, но набор действий меняется с прогрессом (первый проход: «Walk the streets» → после Familiar 1: «Going further») — колода реагирует на статусы персонажа. При наведении на кнопку открывается **тултип требования**: заголовок **`Familiar/Cinci bordertown`** + зелёный бейдж **«REQUIREMENT MET»** и текст *«You need exactly 1 (you're new here.) – You have 1 (you're new here.)»* + флейвор *«Rough if you don't know it. Rough if you do.»* → **прямое подтверждение гейтинга действий по Familiar** (§4/§14): у действий могут быть явные требования к статусам, и UI показывает «нужно ровно N / есть M» с зелёным бейджем выполнения (противоположность серым недоступным кнопкам). AP `49/50 | 07:06` — время −2 ч без расхода (§3).

**Результат игры «Going further» («Snake hips.»):** мини-шапка карты + блок действия с бейджем «Just once.» → **комикс-полоса из 3 панелей** (alley-улица со граффити / мужчина, поднимающийся по лестнице к свету в конце / группа местных, один с имплантом-глазом) → двухколоночный нарратив: левая колонка — *«You walk further. Deeper, but not too deep. Some of this place is dangerous, but none of it's as dangerous as it appears. First glances. Impressions. People keep to themselves. No gang territory, and the organisations out here like the place because they want to stay hidden.»*; правая колонка — *«Yes... at first you thought that everyone was just waiting to get in, or unable, but it doesn't really work that way. There are people out here working a profit. People filtering in and out of the city, coming and going. People living out here for a reason. Hiding. Plotting. Businesses not well suited to legal oversight...»* → заголовок **«Snake hips.»** — ещё один каламбурный/битый-английский титул (§6). **Два тайла**: `Familiar/Cinci bordertown has increased to 2 (was 1).` + `You've gained 1 Rumour/Cinci Bordertown (new total 8)`. Выводы: (а) новый вариант тайла для роста уже существующего статуса — «has increased to N (was M)» со старым значением, отличается от «You now have Y at N» при первом получении (§6); (б) рутинный цикл исследования подтверждён стабильным: каждое исследовательское действие даёт ровно +1 Familiar и +1 Rumour («Walk the streets»: 0→1, total 7; «Going further»: 1→2, total 8); (в) lore о bordertown: люди живут здесь не только потому, что не могут попасть в город — «working a profit», прячутся, сговариваются («Hiding. Plotting.»), «бизнесы, плохо совместимые с законным надзором»; gang-территорий нет, а организации любят это место именно за возможность оставаться незамеченными.

**Pinned-карта службы («Bordertown bar»):** подтверждает, что **pinned-карты открывают те же полные окна карточек**, что и добраные из колоды. Flavor: *«You've tried a few places. Enough to know which'll serve something that's just rough rather than something that'll kill you… You've been around here long enough.»* — у персонажа есть «история» в локации (знает места). Три действия, **все три серые/недоступны** для нового персонажа:
- **«Got something to talk about»** `[ Talk ]` — «No one's going to care if you don't buy a drink if you've got a story worth sharing.» + курсивная заметка: *«The time of day might move on a little while you're here.»* → разговор **требует истории, которую стоит рассказать** (гейтинг состоянием мира/накопленного — вероятно, слухи/события), и **явно продвигает игровое время** — первое прямое подтверждение, что часть действий тратит не только AP, но и игровые часы; под кнопкой — сетка иконок с `+N` (рука, лицо/NPC, зелёный бейдж).
- **«Buy some beers»** `[ Buy ]` — «Seems like you need a few bottles to take away with you. He's probably got some under the bar.» — под кнопкой иконки: ящик с `−N`, рука с `+4`, бутылка с `+15` (цена/награда).
- **«Buy some jerk»** `[ Buy ]` — «You know the guy, right? This stuff is safe, even if it tastes like a combination of fish food and boot leather.» — иконки: рука `−N`, мясо `+7`, коробка `+4`.
Выводы: (а) бар = **сервисная точка локации** (купить еду/напитки, рассказать историю); (б) паттерн недоступных действий сработал на всех трёх кнопках: серые `[ ... ]` + превью иконок затрат/наград под кнопкой — игрок видит, чего не хватает (у нового персонажа Ohio Dollars = 0 → покупки заблокированы; истории для разговора ещё нет); (в) **разговор продвигает время суток** — возможное объяснение немонотонности `HH:MM` рядом с AP (§3).

### Типы стоимости действий
- **Время** — `| N` рядом с глаголом.
- **Кредиты/предметы** — иконки с `−N` / `+N` под кнопкой (цена может быть не деньгами, а репутацией NPC или предметом).
- **Вероятностное потребление** — «This *might* use some of your basic toiletries» (флаг в тексте).
- Бесплатные действия существуют («Just look»).

### Недоступные действия
Показываются серыми, глагол в квадратных скобках (`[ Wait ]`, `[ Reset ]`, `[ Talk ]`, `[ Buy ]`), под кнопкой — **превью иконок затрат/наград** (иконки с `+N`/`−N`: валюта, предметы, NPC). Игрок видит опцию и понимает, чего не хватает. Примеры: [ Reset ] у «Remembering?» недоступен новому персонажу (нужно накопить persistent-статусы) — паттерн работает даже для мощных системных действий; в «Bordertown bar» все три действия ([ Talk ], два [ Buy ]) серые одновременно — покупки заблокированы нулём Ohio Dollars, разговор требует «истории, которую стоит рассказать». **Обратный паттерн — выполненные требования**: зелёный бейдж **«REQUIREMENT MET»** + тултип «You need exactly N (…) – You have M(…)» у действия с требованием к статусу (наблюдено у «Going further»: `Familiar/Cinci bordertown = 1`) — UI явно показывает и требования, и факт их выполнения.

## 6. Результат действия

- **Вердикт** по броску против порога: шкала исхода (You did bad / You did good). Частичный успех возможен при неудаче.
- **Нарратив** адаптируется под результат (сцены с диалогами, двухколоночный текст).
- Результат = список изменений в **едином тайловом формате**:
  - `Skill/Observation is increasing (current: 35)` — числовой статус + прогресс-бар;
  - `You've gained N item (new total M)` — предмет с общим количеством;
  - `You now have Y at N` — новый статус;
  - `Familiar/Cinci bordertown has increased to 2 (was 1).` — рост уже существующего статуса со старым значением («(was N)»);
  - слухи и инсайты как коллекционируемые ресурсы: `Rumour/Cinci Bordertown new total 7`, `You've gained 1 Rare Insight (new total 1)` — категории с префиксом редкости (`Rare`) выделены красным;
  - **флейвор-тайлы без чисел** (иконка + короткая строка: «Shifting.», «Echoes in dirt.») — чисто нарративные результаты;
  - заголовок результата поддерживает **strikethrough** (`«Heavy ~~light~~.»` в онбординге) и формат **«фраза//фраза»** (смена акцента через `//`: «Man is meat//Meat and metal.», «So empty//So real.», «Driving alone//Beating heart.»); серия каламбурных/битых-английских заголовков: «Split wide.», «Sink yourself skyards.», «Altitude.», «Snake hips.», «Man is meat//Meat and metal.», «So empty//So real.», «Driving alone//Beating heart.»; есть и **вопрос+императив**: «Ready? Then wake up.» (карта-решение) — фирменный стиль экранов результата.
- **Честная асимметрия**: при неудаче растёт навык (опыт за попытку); при успехе есть цена (Psychosis +1, Lethargy).
- Флейвор-строка результата («Neon dreams and...») с набором мелких иконок.
- **Результат — полноэкранный пагинируемый экран** (кнопка `» forward` внизу): тот же паттерн, что в онбординге (§2). Структура варьируется:
  - «Picking it out»: заголовок карточки + сокращённый флейвор сверху → **кинематографическая полоса из 3 панелей комикс-арта** (локация / ботинки на мусоре / кольцо в руке) → двухколоночный нарратив, где правая колонка — курсивная системная заметка («This item has been auto-equipped for you…») → сетка тайлов;
  - «Split wide.» (миссия): мини-шапка сыгранной карточки + повтор блока действия с бейджем → расширенный двухколоночный нарратив **без комикс-полосы** → заголовок результата → тайлы;
  - «Man is meat//Meat and metal.» (NPC): мини-шапка карты + блок действия → **комикс-полоса из 3 панелей** → двухколоночный нарратив с **пустой правой колонкой**; «So empty//So real.» (наблюдательная): та же структура, но **4 панели** и курсивное эхо названия действия в конце текста; «Driving alone//Beating heart.» (встреча со стариками): **без комикс-полосы вообще**, обе колонки заполнены диалогом NPC. Комикс-полоса, системная заметка, правая колонка — опциональные элементы; число панелей не фиксировано.
- **Тайл нового предмета** с hover-тултипом: наведение показывает имя + описание предмета («Skull ring» / «Big, brutal and surprisingly sinister.»); отдельный тайл с оранжевой рамкой — `Your Skull ring has been equipped.` (авто-экипировка).

## 7. Цикл дня/ночи

- AP исчерпан → карточка **«Another day/Another night»**:
  - `Move` — обычный переход;
  - `Do it | 3` — отложить начало нового дня на **полчаса реального времени**, один раз в день («use it to get some stuff done quickly if you need to. Your normal time of day for Another day/Another night will be unaffected»);
  - `Deep` — вариант с иконкой предмета (открытый вопрос: что делает).
- **Сводка дня** — экран вида «The right side of longing»: сетка тайлов изменений статусов за сессию («Just one chance. Make it good or make it bad.») (та же фраза позже наблюдалась как заголовок обычного результата карточки, §5 результат «Tall towers» — пул заголовков переиспользуется или шаблон общий).

## 8. Предметы

### Инвентарь (INVENTORY)
Категории: Sortable, Energy, Medical, Pharmaceuticals, Consumables, Packed and stored, Parts, Junk and general stuff, Ingredients, Supplies. Фильтры *by name* / *by effect*; инструменты `bundles`, `supply packets`.

Свойства предмета:
- бейдж **U** (usable);
- количество в стеке;
- **цвет рамки = тир/редкость** (оранжевый/синий/зелёный/фиолетовый) — единая система на всех экранах (инвентарь, экипировка, сокеты).

### Экипировка (EQUIPMENT) и гардероб (OUTFIT)
Слоты по категориям: Apps // SarPlus 12 (часть слотов под замком), Phone, Equipment & devices / Heavier equipment, Transportation, Implants, Eye makeup. Красный X на группе = сброс. Предмет даёт **пассивные бонусы к скиллам** (типично +2).
- Отдельная вкладка **OUTFIT** — слоты одежды/аксессуаров: по системной заметке в результатах, **Accessories и Rings слоты всегда открыты**, остальные слоты требуют «specific situations to be usable».
- **Авто-экипировка**: найденные предметы могут автоматически надеваться («This item has been auto-equipped for you, but you can take it on and off at will in the Outfit tab») — с явным курсивным пояснением и тайлом `has been equipped`.

### Кибер-интерфейс (SOCKET)
Две независимые сетки слотов: **Neural Interface** и **SensPerience port**. Ключевой класс предметов — **skill spike**: узкоспециализированный имплант с большим бонусом к одному скиллу (+8 к Sleight of hand против +2 у обычной экипировки) → осознанный билд-выбор ограниченных слотов. Мирный флейвор подтверждает существование SensPerience как распространённой технологии: в карте «Ripe for theft» показан человек, днями подключённый к «old school SensPerience rig».

### Модель предмета
```ts
item = {
  slot_category,      // equipment | neural | sensport | phone | ...
  tier,               // цвет рамки
  effects: Effect[],  // именованные модификаторы статусов
  source?,            // «in supply packets»
  tags?               // «BnE gear», «skill spike»
}
```

## 9. Оружие (WEAPONS)

- Статы в неймспейсе `w/`: Accuracy, Alacrity, Ammo capacity, Armour piercing, Damage, **Fear**, Noise, Range, Reliability, Reload time. Fear — самостоятельная ось боя (психологический эффект), не только урон.
- **Пер-оружийное состояние**: `Rounds currently loaded` + `Ammo in stock for this weapon` (запас боеприпасов конкретного ствола; пополняется из stash → отсюда гейтинг «out of stash = нельзя перезарядить»).
- **Состояния ствола**: concealed (угроза, pistol whip, работает Fear) ↔ drawn (стрельба). Перезаряжать можно только **equipped** оружие.
- **Уход**: `Clean | 1 [ Success % ]` с расходниками → влияет на w/Reliability; ствол деградирует без обслуживания.
- **Разборка**: Trash / Parts — детали возвращаются в экономику крафта.
- **Find some basic ammo** — гарантированный минимум «just over one clip» (честная рандомность).

## 10. Локации и хабы

- Карточка локации = сетка статичных действий + окна-хабы с **вкладками-пилюлями** (навигация по группам действий: Kill some time / Your vehicle's stock / Take a shower / The kitchen / Chow down / Get changed / Your weapons).
- Состав действий хаба **собирается из состояния мира**: в кухне при отсутствии еды появляется фолбэк «Actually...», на рынке дубликаты помечаются («You already have One of these»).

### Узлы хранилища (логистика)
`character ↔ home stash ↔ vehicle stock`. Действия Dump/Load переносят предметы между узлами; у каждого узла своя capacity (у машины: 110, «Increase your vehicle's stash by 100»). Риск описывается текстом: всё оставленное на улице может быть украдено.

### Кухня
Цикл `Cook → prepared meals → Chow down`: Leftovers — рандомизированная выдача из накопленного («Cold pizza, mostly... if you're lucky»), альтернативы (ration pack, nutrient pouch) блокируются без предметов.

## 11. Магазины

- Вкладки = **разные продавцы** в одной локационной карточке (The junk dealer / Coffee / Desert duster).
- `Buy | time` + иконки цены; кнопка **Item preview**; динамические заметки о дубликатах.
- **Скрытая механика кражи**: возможность украсть товар вместо покупки описана только текстом с ограничениями («Can't steal this – too large. Not to mention spiky.») — доступность зависит от состояния мира/навыков, UI-флага нет.

## 12. Раскладка интерфейса

**Верх:** навигационные вкладки STORY / WEAPONS / OUTFIT / SOCKET / EQUIPMENT / INFO / INVENTORY / CHARACTER / PEOPLE / PROGRESS / QUESTS / JOBS / WORLD + MENU.

**Левая панель — контекстный дайджест:**
- постоянно: портрет, Actions (`refresh`, `clear hand`[, `binge mode`], `buy credits`) со счётчиком AP (временная часть рядом может отсутствовать: `49/50 | 07:19` или просто `56/50`), кредиты, текущая локация;
- **пересобирается под контекст**: Health & wellbeing (Sustenance / Alertness / Carpe diem) / Threats & hazards (Black shakes / Hardship / Injury) / The city (Temperature, Glare, Sunlight) / Primary weapon / Need + Carpe diem — игра сама решает, какие статусы сейчас релевантны; у нового персонажа секции появляются постепенно (§2 «UI расширяется по шагам»).

**Правая панель — тоже контекстная:** Daytime («Early evening» + иконка), Aggression («Feeling twitchy...»), Comedown/Amphetamines, Vehicle (Flatbed truck), деньги/stash; плюс **предупреждения о текущих проблемах** («You're out of stash: ...won't be able to reload a weapon or change equipment», «Your carrying capacity is also zero»).

## 13. Принципы дизайна (сохранять в форке)

1. **Один примитив статуса + один примитив эффекта** — навыки, муды, предметы, оружие, результаты и сводки дня строятся из них.
2. **Единый формат отчётности** — тайлы изменений статусов используются одинаково для результата действия и итогов дня (один UI-компонент).
3. **Прозрачная механика** — формулы шансов, правила частоты карточек и риски описываются текстом прямо в окнах игроку (включая правила мета-сброса: что сгорит, что переживёт, когда сброс «worth doing», «No undo.»).
4. **Текст несёт механику** — условия и риски не всегда существуют как UI-флаги (кража на рынке, риск сна, «might use basic toiletries»); даже флейвор-текст «печатной машинки» после карточек иногда несёт скрытую механику («maybe you'll see something more than that in it, sometime»).
5. **Гейтинг состоянием мира** — stash/capacity/equipped блокируют действия; недоступные кнопки показывают превью затрат, чтобы игрок понял, чего не хватает.
6. **Честная рандомность** — гарантированные минимумы у «find»-действий, опыт за неудачи, цена за успехи.

## 14. Открытые вопросы (уточнить при разработке)

- Состав колоды DMM и её роль.
- Момент пересадки руки: после каждого действия? раз в день?
- Красный значок «!» в шапке story-карточек (виден у «A beginning»): дневной лимит / тип карты / уведомление?
- Что делает `Deep` на переходе дня/ночи.
- Точные значения AP, пороги вердиктов, формулы success chance. **Подтверждено**: AP превышает номинальный лимит (`56/50` наблюдалось дважды, включая повторное появление `56/50` без смены дня после `49/50 | 07:19`) — что именно пополняет AP сверх 50 и как это связано с `binge mode`? Отличаются ли `credits` (buy credits) от Ohio Dollars?
- **Подтверждено**: широкий баннерный тайл = колода, клик по нему добирает карты (первый клик — туториал «Deck clicked» → страница «Helix override.»); ряд под рукой = PINNED CARDS. Красная рамка в руке — вероятно маркер миссионной одноразовой карты («Got to get through» / «Your mission», бейдж «Just once.») — подтвердить.
- **Подтверждено**: игра опции в карточке не тратит AP (`56/50` до и после). Что даёт прохождение персональной миссии (карта «Got to get through» → «Split wide.»): награда `Rare Insight 1`; как ресурс Rare Insight расходуются и что он открывает? Как миссия соотносится с вкладками QUESTS/JOBS?
- Появление строки Psychosis в Threats & hazards: новый статус, появившийся после миссии, или просто был под скроллом?
- **Подтверждено**: AP тратится (`56/50 → 49/50`, `56/50 → 48/50`) **и пополняется сверх лимита** (`49/50 → 56/50`), без смены дня. Что именно пополняет AP (события? карточки? время?), и что делает `refresh`; корреляция «время рядом с AP видна только при AP ≤ 50» стабильна во всех кадрах, включая свежий добор (`56/50` без времени) — от чего зависит?
- **Показ свежих карт в руке**: после добора карты показаны рубашкой со «сколотым» паттерном и без названий (кадр туториала «Helix override» + обычный story-кадр, AP `56/50`), тогда как другие кадры показывают руку лицом с артами и именами — когда карта становится «лицом» (по клику? автоматически?).
- В свежем кадре (персонаж «zer0 ex», вкладки STORY / OUTFIT / INVENTORY, AP `56/50`) **правая панель не видна** — появляется только в определённых состояниях или кадр обрезан?
- Что даёт наблюдательное действие «The seasons» (карта «Looks like summer») — статусы о погоде, доступ к seasonal-контенту? Как именно сезоны влияют на мир и действия.
- Мета-слой («Remembering?» / [ Reset ]): что конкретно входит в «meta stats», «event items»; что означают иконки `−2`/`+20` у сброса; почему [ Reset ] недоступен новому персонажу. **Контраст правил**: по умолчанию «between lives» сохраняется многое (nearly all routes, drug dealer contacts), а добровольный Reset routes/suppliers/access codes теряет — чем «жизнь» отличается от Reset и что такое **lives** (смерть/перерождение персонажа)?
- Кто такие **controllers** («Remembering?» → результат) и как разблокировать встроенное обучение («waiting to be unlocked») — связь с PROGRESS / meta stats.
- Почему у нового персонажа меньше вкладок верхнего меню (начинает с STORY / INVENTORY, после получения носимых предметов появляется OUTFIT) — по какому именно событию открываются остальные.
- Что за кнопка `binge mode` (у Bekket видна, у нового персонажа скрыта) и зачем нужен `refresh`. Значение времени рядом с AP **не монотонно** (`07:19 → 03:32 → 01:39`, `09:52 → 08:42 → 08:50 → 09:56 → 07:10` — и падает, и растёт, однажды сдвинулось **без расхода AP**); часть действий явно продвигает время суток (заметка в «Bordertown bar»): что это за часы, механизм роста/падения, зависит ли от реального времени?
- Мотив «геликса»: арт действия «Hellhole?» у «Tall towers» — светящаяся спираль; связь с «Helix override», controllers и встроенным обучением («waiting to be unlocked»)?
- Точная дата мира: журнал TIME в результате «Ancient news» датирован 2075 и назван «two decades ago» → ≈ ~2095? Подтвердить другими артефактами. Что с планами re-populate Los Angeles — потенциальная сюжетная нить?
- Статус **Familiar/<локация>** (подтверждён тайлом `You now have Familiar/Cinci bordertown at 1 (you're new here.)`): гейтинг действиями **подтверждён** — у «Going further» явное требование `Familiar = exactly 1`, показанное зелёным бейджем REQUIREMENT MET и тултипом «need N / have M». Где статус отображается в левой панели? Какие ещё пороги (2, 3…) и что они открывают? (Familiar достиг 2 — результат «Going further» / «Snake hips.».) **Подтверждено**: pinned-ряд растёт с прогрессом по одной карте — после Familiar 1 появилась **«The border market»** (базовые «Getting into the city», «Back to the border post» и «Bordertown bar» были видны ещё на шаге 1 онбординга), позже в ряд добавился **«The good doctor»** — полный порядок: «Getting into the city», «Back to the border post», «The border market», «The good doctor», «Bordertown bar» (новые вставляются перед «Bordertown bar»; появление, вероятно, после Familiar 2). Что делает «The good doctor» (медицинская служба?)? Что делает «The border market»? Это ли та самая «story worth sharing» для [ Talk ] в баре?
- Коллекционные счётчики: `Rumour/<локация>` vs **`Hard fact/<локация>`** vs `Rare Insight` — чем отличаются и как расходуются? Пока что наблюдательные карты дают Rumours, встречи с NPC — Hard facts (по одному за действие); это гейтят [ Talk ] в баре или другие действия?
- Lore Ohio vs Kentucky: «I fought for Ohio. You fought for Kentucky. We won. You lost.» — история конфликта, давшая имя валюте Ohio Dollars; есть ли другие последствия войны в мире?
- **«Martha»** (карта «The last thread»): кто это — человек, организация, кодовое имя? Выбран «Keep it» → награда `Naïve shot 1` + упоминание **masters** («didn't send me completely unprepared») и **ещё одного предмета в кармане**; что откроет выбор Burn it? Как результат выбора влияет на дальнейшие карты и линию миссии?
- Что такое **`Naïve shot`** (четвёртый коллекционный счётчик, иконка-ампула): это «доза» чего-то? Связь с «masters», memory blocks или встроенным обучением?
- «Bordertown bar»: что именно требуется для [ Talk ] («story worth sharing») — Rumour? конкретный статус? Почему недоступно при `Rumour total 4`. Точное значение иконок цен в превью (ящик/бутылка/мясо с `+N`/`−N`) — нужны hover-тултипы.
- Роль вкладок PEOPLE / QUESTS / JOBS / WORLD / PROGRESS (не изучены).
- Создание персонажа: первое поле — вероятно, intimate name; как устроена смена street name «at a cost».
- Онбординг: полная последовательность задокументирована по пути Explore (6 шагов до story-экрана + туториал уведомлений); что даёт ветка «Talk to the guards» (Explore — только флейвор, без предметов); что делает `Watch` на инфо-карте Cincinnati.
