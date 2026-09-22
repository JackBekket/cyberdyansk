# Cyberdyansk — Реестр карточек (выделено из CARD_DESIGN.md)

Сборник всех описаний и примеров карточек из `CARD_DESIGN.md`: карты руки, pinned-карты, туториал/колода. Для каждой карточки: flavor text, системные заметки, действия с кнопками/бейджами/стоимостью, детали окна и (если есть) наблюдаемый экран результата. Обозначения:

- **«Just once.»** — синий бейдж одноразового действия;
- **`[ Глагол ]`** — серая недоступная кнопка с превью иконок затрат/наград под ней;
- **REQUIREMENT MET** — зелёный бейдж выполненного требования к статусу (тултип: «You need exactly N (…) – You have M(…)»);
- AP/время в разделе «Наблюдаемое состояние» — значения счётчиков на кадре, из которого взято описание.

---

## 1. Карты руки (Borderland life / Cinci Bordertown)

### «Buried in ash»
- **Тип**: карта из руки (Cinci Bordertown); арт — костёр.
- **Flavor text**: про «hundreds of people coming and going… stuff left behind».
- **Действие** — **«Picking it out»** (арт — кольцо-череп): *«You pour a little water onto it, until it stops hissing. It might not be your usual style, but you can't help slipping it on… A perfect fit.»* Кнопка `Do It`, без видимой стоимости.
- **Окно**: в шапке только `CLOSE ×` — минимальная форма окна (без DISCARD, без курсивной заметки, без success chance).

**Результат «Picking it out»:** заголовок карточки + сокращённый флейвор сверху → кинематографическая полоса из 3 панелей комикс-арта (локация / ботинки на мусоре / кольцо в руке) → двухколоночный нарратив, где правая колонка — курсивная системная заметка (*«This item has been auto-equipped for you…»*) → сетка тайлов. Тайл нового предмета с hover-тултипом: «Skull ring» / *«Big, brutal and surprisingly sinister.»*; отдельный тайл с оранжевой рамкой — `Your Skull ring has been equipped.` (авто-экипировка).

---

### «Got to get through»
- **Тип**: миссионная карта из руки; в руке показана **с красной рамкой** (маркер миссионного типа).
- **Flavor text**: *«You know why. It just isn't quite the time to think about it yet.»*
- **Действие** — **«Your mission»**: «But it's in the back of your mind. Always. Your mission. The reason you crossed the badlands to get here.» + синяя плашка **«Just once.»** и курсив *«Get this done.»*. Кнопка `Do It`, без стоимости.
- **Окно**: в шапке только `CLOSE ×`.

**Результат «Split wide.»:** экран результата в вариантной структуре **без комикс-полосы**: сверху — мини-шапка сыгранной карточки (арт + название + flavor), затем тот же блок действия с бейджем «Just once.», ниже — расширенный двухколоночный нарратив: левая колонка *«You're not just a random wanderer. Not just a desperate hopeful. You were sent… Here, in Cincinnati. Greatest of the border cities. Over 24 million people's worth of sprawling slum and glittering towers.»* / правая колонка *«Your personal heaven or your personal hell? It doesn't matter. What matters is your mission.»* → чёрный заголовок **«Split wide.»** (игра слов в стиле «Heavy ~~light~~.») → сетка тайлов: `You've gained 1 Rare Insight (new total 1)` — коллекционируемый ресурс редкостной категории (`Rare` выделено красным). Кнопка `» forward`. **Наблюдаемое состояние**: AP до и после не изменился (`56/50`) — игра опции бесплатна.

**Выводы из описания:** у персонажа есть персональная миссия, заданная при создании/прибытии («the reason you crossed the badlands») — вероятно, стержневая цель персональной линии; одноразовые действия помечаются бейджем «Just once.» в отличие от ежедневных daily-карт.

---

### «Looks like summer»
- **Тип**: погодная/наблюдательная карта из Borderland life.
- **Flavor text**: *«This place is either too damn hot or too damn cold. A few days of bearable weather while the seasons change. But they change fast. Spring and autumn just don't exist any more.»*
- **Действие** — **«The seasons»**: «Yeah, Cinci's seasons are sharp, abrupt, or so you've heard. Heard? It's more like you can feel it in your bones. Like you just know.», `Do It` без стоимости.

**Выводы из описания:** в Borderland life есть наблюдательные/атмосферные карточки — дешёвый способ «прочитать» локацию; **сезоны — мировое состояние**: в Cincinnati только резкие summer/winter («Spring and autumn just don't exist any more»), смена быстрая и влияет на мир (Temperature/Glare/Sunlight в левой панели, GDD §12) — вероятно, гейтят действия/экипировку.

---

### «Remembering?»
- **Тип**: карта памяти / мета-слой (roguelite).
- **Flavor text**: *«You've got ideas about your future in the city already – people and places that'll be useful to you. Where they are. How to find them.»*
- **Два действия** (карта-решение):
  - **«All good»** (`Do It`): «You know you're not the first. People have come before you. You don't know how many. Somehow, it seems like you have a little of their knowledge.» — подтверждение, что в мире уже есть следы других персонажей (предыдущие воплощения / другие игроки?), и часть их знания унаследована.
  - **«But you don't remember»** — кнопка **[ Reset ]** серая, глагол в квадратных скобках; под кнопкой иконки стоимости `−2` и `+20`. Текст: «No... there's nothing like that in you. You're a blank slate.» + прозрачное правило сброса: *«Use this to reset and start from scratch. You'll lose routes, suppliers, findable access codes and some other things, but **not** meta stats, persistent credit purchases, event items and some other things. This is only worth doing if you've already accumulated a lot of *persistent* stats and you really want to reset.»* + красный бейдж **«Be very careful. No undo.»** + *«You'll also get 10 credits»*.

**Выводы из описания:** (а) у игры есть мета-слой/roguelite: статусы делятся на персистентные («meta stats», «persistent credit purchases», event items — переживают сброс) и нет (routes, suppliers, findable access codes — сгорают); (б) сброс — действие внутри карточки, а не системное меню; (в) игра прозрачно объясняет, что теряется и когда сброс имеет смысл + награда credits за само решение; (г) «People have come before you» в связке с мультиплеером (GDD §2) — вероятно, знания/следы предыдущих воплощений или других игроков персистентны в общем мире. [ Reset ] недоступен новому персонажу (нужно накопить persistent-статусы) — паттерн серых кнопок работает даже для мощных системных действий.

**Результат «All good» («Sink yourself skyards.»):** двухколоночный нарратив: левая колонка — *«It's not magic. They must have fed information back to your controllers, who used it as part of your training. Training you've forgotten, but which is still embedded in you, waiting to be unlocked.»* → новые концепты: **controllers** (кто-то управляет/воспитывает персонажа и собирает данные) и встроенное обучение, которое можно «разблокировать» — вероятно, источник персистентных бонусов/PROGRESS. Правая колонка — курсивная системная заметка с правилом персистентности: *«By default, you retain many things between lives, such as nearly all routes, drug dealer contacts, etc.»* → игра оперирует понятием **lives** (воплощений): по умолчанию между жизнями сохраняется многое. Заметное противоречие с правилом [ Reset ] (там routes/suppliers/access codes теряются) — вероятно, «between lives» (естественная смерть/перерождение) сохраняет больше, чем добровольный Reset; уточнить. Заголовок **«Sink yourself skyards.»** — продолжение серии каламбурных заголовков («Heavy ~~light~~.», «Split wide.»). Тайл: `You've gained 2 Rumours/Cinci bordertown (new total 3)` — кросс-чек с туториалом «Helix override» (там `new total 1`): счётчик слухов накапливается между экранами, награды суммируются. **Наблюдаемое состояние**: AP не изменился (`49/50`) — ещё одно подтверждение бесплатности игры опции.

---

### «Ripe for theft»
- **Тип**: карта-событие с NPC из Borderland life (одноразовая встреча).
- **Flavor text**: *«This guy's just slumped over by a wall, plugged in to an old school SensPerience rig. He's completely out of it. Looks like he's been under for days.»*
- **Действие** — **«Approach»**, бейдж «Just once.» (одноразовая встреча): «Even if you're not the type to do it, it seems unreal that he hasn't been robbed or worse by now.», `Do It` без видимой стоимости.
- **Окно**: в шапке только `CLOSE ×`.

**Выводы из описания:** (а) в локационной колоде есть карты-события с NPC — одноразовые встречи, маркируемые «Just once.»; (б) флейвор подтверждает мир сеттинга: **SensPerience** (GDD §8, SOCKET) существует как «old school» технология — отключённый на днях человек, подключённый к ригу, типичная локальная сцена.

**Результат «Approach» («Man is meat//Meat and metal.»):** полноразмерный результат с **кинематографической полосой из 3 панелей комикс-арта** (человек в SensPerience-риге / крупный план лица с проводами / девочка-подросток с обрезом за спиной) → двухколоночный нарратив: *«But it makes sense when you notice a young girl, teenaged probably, crouched near him, carrying a sawn-off and keeping a wild look in her eye. Daughter? Girlfriend? Hard to say.»* (правая колонка пуста — системной заметки нет) → заголовок **«Man is meat//Meat and metal.»** — формат каламбурного заголовка: две фразы через `//`, игра на смене акцента. Тайл: `You've gained 1 Rumour/Cinci Bordertown (new total 4)` — счётчик продолжает нарастать (3 → 4, кросс-чек). **Наблюдаемое состояние**: AP не изменился (`56/50`, время по-прежнему скрыто) — подтверждение бесплатности опций и корреляции «AP > 50 ↔ нет времени» (GDD §3).

---

### «Tall towers»
- **Тип**: наблюдательная карта-мироустройство (Borderland life); появляется в руке после пересдачи.
- **Flavor text**: *«Maybe you could be forgiven for thinking that this place is a post-apocalyptic hellhole – if all you did was look at your feet.»*
- **Действие** — **«Hellhole?»** (арт — светящаяся спираль/«геликс» из кругов, мотив перекликается с названием туториала «Helix override»): *«Well, that part is true, maybe. But you know better than to think there's been an apocalypse. You might not have much of a memory, but you know that. And even if you didn't already, the bright, shining corporate towers of Cincinnati would tell you otherwise.»* Кнопка — **«But...»** (не «Do It»): название кнопки может быть нарративной фразой-реакцией на flavor карты, а не глаголом действия.

**Выводы из описания:** (а) уточнение сеттинга: Cincinnati **не постапокалипсис**, несмотря на облик трущб — «bright, shining corporate towers» (кросс-чек с миссией: «sprawling slum and glittering towers», 24 млн жителей); (б) отсылка к памяти персонажа («You might not have much of a memory») — снова мета-слой.

**Результат «The right side of longing.»:** двухколоночный нарратив, продолжающий flavor карты: левая колонка — *«Not to mention the helicopters and aircraft overhead, or the stuff you see for sale in the market. And it's not like Cinci's the last bastion of civilisation either.»* + *«It might be the last if you're heading on this particular route out west. It might be the biggest of the new border cities. It might be what global fashion has decided is the current place to be. But it's still just one city amongst thousands spanning the globe.»*; правая колонка — *«But as for this place, here at your feet? Yeah, the bordertown might be fairly accurately described as a hellhole, at least if you've got to live here full time. The thing to do is to move on, as quick as you can.»* → результат расширяет мироустройство: Cinci — один из тысяч border-городов «spanning the globe», возможно крупнейший и текущий выбор «global fashion»; bordertown у ног персонажа остаётся hellhole. Заголовок **«The right side of longing.»** совпадает с фразой, приведённой в GDD §7 как пример экрана сводки дня — либо пул каламбурных заголовков переиспользуется между экранами, либо у обоих одна и та же шаблонная форма. Тайл: `You've gained 1 Rumour/Cinci Bordertown (new total 5)` → **паттерн**: каждая наблюдательная/мироустроительная карта при игре выдаёт +1 Rumour (прогрессия счётчика 1 → 3 (+2) → 4 → 5). **Наблюдаемое состояние**: в окне карты AP не изменился (`48/50`), но время рядом сдвинулось (`09:56 → 07:10`) без видимого расхода действий (GDD §3); счётчики после результата — `49/50 | 09:08` (AP +1, время +~2 ч относительно окна), хотя опция формально бесплатна; в правой панели у нового персонажа виден `current stash = 160`.

---

### «Old magazines»
- **Тип**: наблюдательная карта рынка (Borderland life); появляется в руке после пересдачи.
- **Flavor text**: *«People sell all kinds of shit at the market. Well, markets; one of those places dotted around the bordertown where people gather together to sell. The one by the west gate is semi-permanent. The others come and go.»*
- **Действие** — **«Ancient news»** (арт — стопка старых газет/журналов), бейдж «Just once.»: «Like this guy, squatting next to a rough wooden box of old paper magazines. Probably decades out of date if they're even clean enough to read.», кнопка **Look** — глагол пассивного наблюдения.
- **Окно**: в шапке только `CLOSE ×`.

**Выводы из описания:** (а) карта раскрывает рынки bordertown: у западных ворот — полу-постоянный, остальные «come and go» — деталь мира под будущие покупки/локации; (б) наблюдательные карты тоже бывают одноразовыми («Just once.» без курсивной пометки — бейдж работает сам по себе).

**Результат «Ancient news» («So empty//So real.»):** мини-шапка карты + блок действия → **комикс-полоса из 4 панелей** (улица рынка / лавка торговца в капюшоне / старик, сидящий за коробкой журналов / крупный план обложки журнала **TIME «LOS ANGELES 2075»**) → двухколоночный нарратив с пустой правой колонкой: *«The one on top's a Time from two decades ago, headlining conceptual plans to re-populate Los Angeles. Like that's ever going to happen after all these years.»* + курсивное эхо названия действия: *«Ancient news.»*. Заголовок **«So empty//So real.»** — второй пример формата `фраза//фраза` (после «Man is meat//Meat and metal.») → формат закрепляется как устойчивый, возможно характерный для наблюдательных карточек. Тайл: `You've gained 1 Rumour/Cinci Bordertown (new total 6)` — паттерн подтверждается третий раз подряд (5 → 6): каждая наблюдательная карта даёт ровно +1 Rumour. Важный lore-якорь: журнал датирован **2075** и назван «two decades ago» → настоящее время мира ≈ **~2095**; мир знает о планах репопуляции Los Angeles (город, не восстановленный два десятилетия). **Наблюдаемое состояние**: AP не изменился (`49/50`), время рядом `04:08` (было `09:08`) — ещё один немонотонный сдвиг (GDD §3); счётчики после результата — `49/50 | 02:31`, AP нетронут, время сдвинулось на ~−1.5 ч.

---

### «Exploring the town»
- **Тип**: исследовательская карта; появляется в руке после пересдачи. **Карта эволюционирует** — название одно, но набор действий меняется с прогрессом (колода реагирует на статусы персонажа). Первый проход: «Walk the streets» → после Familiar 1: «Going further».
- **Flavor text**: *«Dust everywhere. Bigger than at first glance.»* + курсивная системная заметка: «Your first priority should be raising your *familiarity*» (слово familiarity выделено как ссылка — вероятно, кликабельный статус).

**Вариант 1 (первый проход) — действие «Walk the streets»** (арт — пыль на ботинках), бейдж «Just once.»: «Things to learn. More dust on your boots.», кнопка **Walk**. В шапке обе кнопки: `DISCARD ×` и `CLOSE ×` — подтверждает, что DISCARD опционален, а здесь он есть.

Выводы из описания варианта 1: (а) вводится статус **familiarity** (знакомство с локацией) — игра прямо называет его «первым приоритетом» нового персонажа; вероятно, именно им гейтятся действия вроде [ Talk ] в баре («story worth sharing») и другие опции локаций; (б) карточка задаёт рутинный цикл исследования: ходить → узнавать → копится familiarity + Rumours.

**Результат «Walk the streets» («Altitude.»):** мини-шапка карты + блок действия → **комикс-полоса из 3 панелей** (alley-улица со граффити / мужчина с пятном крови на футболке у лестницы / группа местных, один с имплантом-глазом) → двухколоночный нарратив с пустой правой колонкой: *«The town is more badlands than city. Intertsticial, temporary, halfway between. Built from needs. The rentacops, the security firms, they don't come out here. Anything goes, anything can happen. But not everything does. Everyone here is here because they can't get in. The town serves needs, and needs are profits; rough, hard earned profits. A certain camaraderie.»* → заголовок **«Altitude.»** — короткий каламбурный титул (возможно, намёк на вертикальность трущб: лестницы, ярусы). **Два тайла**: `You now have Familiar/Cinci bordertown at 1 (you're new here.)` + `You've gained 1 Rumour/Cinci Bordertown (new total 7)`. Выводы: (а) статус familiarity подтверждён как неймспейсированный статус `Familiar/<локация>` с числовым значением — первый тайл его получения, курсивная пометка `(you're new here.)` — индикатор низкого уровня; (б) наблюдательные карты дают и Rumour, и Familiar — это обещанный «рутинный цикл исследования»; (в) новый lore-термин: **rentacops / security firms** не заходят в bordertown («anything goes… but not everything does»). **Наблюдаемое состояние**: AP не изменился (`49/50`), время `08:19` (было `02:31`) — сдвиг вперёд ~6 ч без расхода; после результата AP-счётчик вырос выше лимита без смены дня: `49/50 → 56/50`, время рядом скрыто.

**Вариант 2 (после Familiar 1) — действие «Going further»** (тот же арт ботинок), бейдж «Just once.»: *«You've scratched the surface of this dump, but there's more to learn.»*, кнопка `Walk`. При наведении на кнопку открывается **тултип требования**: заголовок `Familiar/Cinci bordertown` + зелёный бейдж **«REQUIREMENT MET»** и текст *«You need exactly 1 (you're new here.) – You have 1 (you're new here.)»* + флейвор *«Rough if you don't know it. Rough if you do.»* → прямое подтверждение гейтинга действий по Familiar: у действий могут быть явные требования к статусам, и UI показывает «нужно ровно N / есть M» с зелёным бейджем выполнения (противоположность серым недоступным кнопкам). **Наблюдаемое состояние**: AP `49/50 | 07:06` — время −2 ч без расхода (GDD §3).

**Результат «Going further» («Snake hips.»):** мини-шапка карты + блок действия с бейджем «Just once.» → **комикс-полоса из 3 панелей** (alley-улица со граффити / мужчина, поднимающийся по лестнице к свету в конце / группа местных, один с имплантом-глазом) → двухколоночный нарратив: левая колонка — *«You walk further. Deeper, but not too deep. Some of this place is dangerous, but none of it's as dangerous as it appears. First glances. Impressions. People keep to themselves. No gang territory, and the organisations out here like the place because they want to stay hidden.»*; правая колонка — *«Yes... at first you thought that everyone was just waiting to get in, or unable, but it doesn't really work that way. There are people out here working a profit. People filtering in and out of the city, coming and going. People living out here for a reason. Hiding. Plotting. Businesses not well suited to legal oversight...»* → заголовок **«Snake hips.»** — ещё один каламбурный/битый-английский титул (GDD §6). **Два тайла**: `Familiar/Cinci bordertown has increased to 2 (was 1).` + `You've gained 1 Rumour/Cinci Bordertown (new total 8)`. Выводы: (а) новый вариант тайла для роста уже существующего статуса — «has increased to N (was M)» со старым значением, отличается от «You now have Y at N» при первом получении; (б) рутинный цикл исследования подтверждён стабильным: каждое исследовательское действие даёт ровно +1 Familiar и +1 Rumour («Walk the streets»: 0→1, total 7; «Going further»: 1→2, total 8); (в) lore о bordertown: люди живут здесь не только потому, что не могут попасть в город — «working a profit», прячутся, сговариваются («Hiding. Plotting.»), «бизнесы, плохо совместимые с законным надзором»; gang-территорий нет, а организации любят это место именно за возможность оставаться незамеченными.

---

### «Trash talk/Old wounds»
- **Тип**: карта-встреча со стариками (одноразовая); арт — солнце над сухой деревней/пустошь. Двухчастное название через `/` — возможно, указывает на два аспекта одной сцены.
- **Flavor text**: *«Two old timers, tough as old leather. Minutes from the city but a world and a fence away. Walking and talking.»*
- **Действие** — **«Listen in»** (арт — ухо), бейдж «Just once.»: «Something worth learning?», кнопка **Do It**.
- **Окно**: в шапке только `CLOSE ×`.

**Результат «Listen in» («Driving alone//Beating heart.»):** без комикс-полосы, сразу двухколоночный нарратив: левая колонка — *«"I'll tell you why I've got a problem. I'll tell you." Clearly an old sore, picked at over and over. "I'll tell you. I fought for Ohio. You fought for Kentucky. We won. You lost.»*; правая колонка — *«"And that's fair and square, 'cept you just won't leave it alone. You were never even from Kentucky. I just don't get it, is all."*» → заголовок **«Driving alone//Beating heart.»** — третий пример формата `фраза//фраза` (GDD §6). Тайл: `You've gained 1 Hard fact/Cinci Bordertown (new total 1)` — новый коллекционируемый счётчик, отдельный вид от Rumour и Rare Insight: пока что встречи с NPC дают «Hard facts», а наблюдательные карты — «Rumours» (GDD §3). Lore: старик говорит о конфликте Ohio vs Kentucky («I fought for Ohio. You fought for Kentucky. We won. You lost») — межгосударственный конфликт, объясняющий и название валюты **Ohio Dollars**, и саму границу badlands/Cincinnati (border cities из «Tall towers»). **Наблюдаемое состояние**: AP `48/50 | 08:02` в окне карты; после результата AP не изменился (`48/50`), время `03:08` (было `08:02`) — сдвиг назад ~5 ч без расхода.

---

### «The last thread»
- **Тип**: карта-решение по линии миссии; арт — сложенный листок. Первая карта с двумя действиями-выбором после «Remembering?» и первое реальное решение с последствиями: выбор, вероятно, влияет на будущие карты/награды.
- **Flavor text**: *«Your last connection with what came before. Your training for this mission. Your instructions. Your entire life. They've all been set to fade, like a dream, until they were needed. Triggered memory blocks, carefully constructed.»* + вторая строка: *«But in your pocket, just a scrap of paper: Martha. Your handwriting. That's all it says.»*
- **Два взаимоисключающих действия** (разные кнопки/арты):
  - **«Burn it»** (арт — пламя): «You're guessing that you wanted this to be the one thing you didn't forget. But you've forgotten. So there's only one thing to do.», кнопка **Click**;
  - **«Keep it»** (арт — кулак): «Your instinct is to set this thing alight. You shouldn't really have it in the first place. It's too risky. Too dangerous. But you can't let go of this one, last thread.», кнопка **Stash**.
- **Окно**: в шапке только `CLOSE ×`.

**Выводы из описания:** (а) вводится персонаж/объект **«Martha»** — имя на клочке бумаги почерком самого персонажа; прямая связь с линией миссии и встроенного обучения («Triggered memory blocks, carefully constructed» ↔ «waiting to be unlocked» — см. результат «All good» у «Remembering?»); (б) карты-решения отличаются от одиночных наблюдательных карт.

**Результат выбора «Keep it» («Ready? Then wake up.»):** мини-шапка карты + блок действия → **комикс-полоса из 3 панелей** (промзона/трущбы / крупный план: рука держит клочок с красной надписью **«Martha»** / персонаж в перчатке убирает бумажку во внутренний карман) → двухколоночный нарратив с пустой правой колонкой: *«You fold it up tight and slide it back into your pocket, pushing it deep. Your hand brushes against something else in there. At least my masters didn't send me completely unprepared.»* → заголовок **«Ready? Then wake up.»** — новый стиль: вопрос + императив (в отличие от каламбуров и `//`-формата). Тайл: `You've gained 1 Naïve shot (new total 1)` («Naïve» выделено красным, с ï; иконка — шприц/ампула) — четвёртый тип коллекционных счётчиков после Rumour/Hard fact/Rare Insight. Выводы: (а) подтверждение роли **«masters»** (господ, отправивших персонажа) — расширение лора controllers: у персонажа есть те, кто его послал; в кармане ещё что-то помимо бумажки с Martha; (б) выбор «Keep it» дал не Rumour/Hard fact, а новый счётчик `Naïve shot` — награды за решения отличаются от наград за наблюдение/встречи. **Наблюдаемое состояние**: AP `49/50 | 09:36` в окне карты (счётчик вырос на 1 — добор); после результата AP не изменился (`49/50`), время `09:36 → 09:09`.

---

## 2. Pinned-карты (PINNED CARDS)

Pinned-ряд — ряд под рукой; не статичные действия локации, а закреплённые карты, меняющиеся вместе с локацией и прогрессом; продвижение по игре требует использовать оба типа карт (добранные из колоды + pinned). Ряд расширяется с прогрессом: базовый набор на шаге 1 онбординга — «Getting into the city», «Back to the border post», «Bordertown bar»; после Familiar 1 добавился «The border market»; позже ряд вырос до пяти карт в порядке: «Getting into the city», «Back to the border post», «The border market», «The good doctor», «Bordertown bar». Сервисные точки открываются по одной с прогрессом, новые вставляются **перед** «Bordertown bar» (GDD §14).

### «Getting into the city»
- **Тип**: базовая pinned-карта (набор шага 1 онбординга); иконка со стрелкой. Других деталей не зафиксировано.

### «Back to the border post»
- **Тип**: базовая pinned-карта (набор шага 1 онбординга). Других деталей не зафиксировано.

### «The border market»
- **Тип**: сервисная точка, добавлена в pinned-ряд после того, как Familiar достиг 1 (результат «Walk the streets»). Рынок у западных ворот из лора «Old magazines» («semi-permanent»). Других деталей окна не зафиксировано.

### «The good doctor»
- **Тип**: сервисная точка (судя по названию — медицинская служба); вероятно, появилась после Familiar 2 (результат «Going further»). Story-кадр с персонажем «zer0 ex»: портрет-плейсхолдер «?», AP `56/50`, время скрыто. Других деталей окна не зафиксировано.

### «Bordertown bar»
- **Тип**: pinned-карта службы (бар = сервисная точка локации: купить еду/напитки, рассказать историю). Подтверждает, что pinned-карты открывают те же полные окна карточек, что и добраные из колоды.
- **Flavor text**: *«You've tried a few places. Enough to know which'll serve something that's just rough rather than something that'll kill you… You've been around here long enough.»* — у персонажа есть «история» в локации (знает места).
- **Три действия, все три серые/недоступны** для нового персонажа:
  - **«Got something to talk about»** `[ Talk ]` — «No one's going to care if you don't buy a drink if you've got a story worth sharing.» + курсивная заметка: *«The time of day might move on a little while you're here.»* → разговор требует истории, которую стоит рассказать (гейтинг состоянием мира/накопленного — вероятно, слухи/события), и явно продвигает игровое время — первое прямое подтверждение, что часть действий тратит не только AP, но и игровые часы; под кнопкой — сетка иконок с `+N` (рука, лицо/NPC, зелёный бейдж).
  - **«Buy some beers»** `[ Buy ]` — «Seems like you need a few bottles to take away with you. He's probably got some under the bar.» — под кнопкой иконки: ящик с `−N`, рука с `+4`, бутылка с `+15` (цена/награда).
  - **«Buy some jerk»** `[ Buy ]` — «You know the guy, right? This stuff is safe, even if it tastes like a combination of fish food and boot leather.» — иконки: рука `−N`, мясо `+7`, коробка `+4`.

**Выводы из описания:** (а) паттерн недоступных действий сработал на всех трёх кнопках: серые `[ ... ]` + превью иконок затрат/наград под кнопкой — игрок видит опцию и понимает, чего не хватает (у нового персонажа Ohio Dollars = 0 → покупки заблокированы; истории для разговора ещё нет); (б) разговор продвигает время суток — возможное объяснение немонотонности `HH:MM` рядом с AP (GDD §3).

---

## 3. Туториал / колода

### «Deck clicked»
- **Тип**: карта окна баннерного тайла колоды; арт со стрелкой. Первый клик по баннеру колоды у нового персонажа открывает это окно: клик по баннеру = добор карт из этой колоды (карта «Deck clicked» в руке — артефакт этого же события).
- **Flavor text**: *«You've clicked on a deck for the first time.»*
- **Действие** — **«A few notes»**: *«This is a tutorial about how decks work. Although it no longer says CLICK ME, you can still draw from it.»* + курсивный тег `Tutorial.`

**Результат (страница «Helix override.»):** клик «A few notes» открывает полноэкранную страницу **«Helix override.»**: внутри — аннотированный скриншот UI с красными подписями (DECKS → баннерный тайл, HAND → рука, PINNED CARDS → ряд под рукой) + двухколоночное объяснение (динамические колоды; взвешенный добор; pinned-карты) и в конце — тайл результата `You've gained 1 Rumour/Cinci Bordertown (new total 1)`: даже туториал даёт слух через стандартный формат отчётности (GDD §6). В этом кадре тайлы руки показаны со «сколотым» (царапанным) паттерном без названий — и тот же паттерн наблюдается на обычном story-экране: после добора все три карты в руке показаны рубашкой/царапинами, без атов и имён (AP `56/50`, время скрыто), тогда как кадры с видимыми названиями карт соответствуют уже открытым карточкам → вероятно, свежие карты показываются рубашкой до первого открытия.

---

## 4. Упоминания карт без полного описания

- **«Buried in ash», «Deck clicked», «Got to get through», «Looks like summer», «Ripe for theft»** — состав руки у Bekket (раздел «Рука»); после пересдачи/добора в руке — новые карты из той же колоды: **«Tall towers», «Old magazines», «Exploring the town…»** (наблюдательные/исследовательские, см. раздел 1) — подтверждение взвешенного пула, а не статичного набора.
- **Daily-карты** (тип, конкретная карта не названа): гарантированно раз в день вне зависимости от колоды (*«You'll see this card once per day, every day, no matter what»*).
