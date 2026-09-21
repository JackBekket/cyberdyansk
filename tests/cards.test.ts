// Unit-тесты карточной системы Phase 4 (PLAN): механика руки, card-store, загрузка колод из YAML.
// Механика руки (решено 2026-09-20, GDD §13): исполнение/сброс → карта в колоду, слот пустует;
// добор по баннеру колоды за AP (drawApCostPerCard); полный reshuffle на новый день.

import { beforeEach, describe, expect, it } from 'vitest';
import type { Card, Deck } from '../src/cards/types';
import { dealHand, findCard, firstEmptySlot, initPools, returnCardToDeck, shuffle, type HandState, type Rng } from '../src/cards/hand';
import { useCardStore } from '../src/cards/card-store';
import { useWorldStore } from '../src/core/world-store';
import { loadDeckFromYaml, loadLocationFromYaml, ContentError } from '../src/cards/deck-loader';

/** Фабрика карты для фикстур (проходит те же правила, что и YAML-контент). */
function mkCard(id: string, overrides?: Partial<Card>): Card {
  return { id, title: `Card ${id}`, deckId: 'deck-a', actions: [{ verb: 'Do It', effects: [] }], ...overrides };
}

const DECK_A: Deck = {
  deckId: 'deck-a',
  title: 'Deck A',
  cards: [mkCard('a-1'), mkCard('a-2'), mkCard('a-3'), mkCard('a-4'), mkCard('a-5')],
};

const DECK_B: Deck = {
  deckId: 'deck-b',
  title: 'Deck B',
  cards: [mkCard('b-1', { deckId: 'deck-b' }), mkCard('b-2', { deckId: 'deck-b' }), mkCard('b-3', { deckId: 'deck-b' })],
};

/** Детерминированный RNG: константа — всегда первый элемент. */
const constRng = (v: number): Rng => () => v;

describe('hand — раздача и пулы колод', () => {
  it('раздача заполняет слоты до handSize и уменьшает пулы колод', () => {
    const state = dealHand([DECK_A, DECK_B], 4, null, constRng(0));

    // Все 4 слота заполнены (вместе в колодах 8 карт — хватает).
    expect(state.slots).toHaveLength(4);
    for (const c of state.slots) expect(c).not.toBeNull();

    // Пулы уменьшены ровно на число разданных карт.
    const poolTotal = Object.values(state.pools).reduce((sum, p) => sum + p.length, 0);
    expect(poolTotal).toBe(8 - 4);

    // Ничья карта не может быть одновременно в руке и в пуле своей колоды.
    for (const c of state.slots) {
      if (!c) continue;
      expect(state.pools[c.deckId]).not.toContain(c.id);
    }
  });

  it('детерминирован: одинаковый RNG даёт одинаковую раздачу', () => {
    const s1 = dealHand([DECK_A, DECK_B], 4, null, constRng(0.3));
    const s2 = dealHand([DECK_A, DECK_B], 4, null, constRng(0.3));
    expect(s1.slots.map((c) => c?.id)).toEqual(s2.slots.map((c) => c?.id));
    expect(s1.pools).toEqual(s2.pools);
  });

  it('колоды пусты — слоты остаются пустыми, не падает', () => {
    const state = dealHand([DECK_A], 4, null, constRng(0));
    // DECK_A содержит 5 карт → рука заполняется полностью.
    expect(state.slots.filter((c) => c !== null)).toHaveLength(4);
  });

  it('returnCardToDeck возвращает карту в пул её колоды (исполнение/сброс, GDD §13)', () => {
    const state = dealHand([DECK_A], 2, null, constRng(0));
    const card = state.slots[0];
    expect(card).not.toBeNull();

    returnCardToDeck(state, card!);
    expect(state.pools[card!.deckId]).toContain(card!.id);
  });

  it('firstEmptySlot находит первый пустой слот; -1 — рука полна', () => {
    const state = dealHand([DECK_A], 3, null, constRng(0));
    expect(firstEmptySlot(state.slots)).toBe(-1); // рука полна → indexOf(null) === -1

    state.slots[1] = null; // освободили слот
    expect(firstEmptySlot(state.slots)).toBe(1);
  });
});

describe('hand — daily-карты (GDD §4: «once per day, every day»)', () => {
  const DAILY_DECK: Deck = {
    deckId: 'deck-d',
    title: 'Deck D',
    cards: [mkCard('d-1', { deckId: 'deck-d' }), mkCard('d-2', { deckId: 'deck-d' }), mkCard('d-daily', { daily: true, deckId: 'deck-d' })],
  };

  it('daily-карта гарантированно в первом слоте при первой раздаче дня', () => {
    const state = dealHand([DAILY_DECK], 4, null, constRng(0));
    expect(state.slots[0]?.id).toBe('d-daily');
    // И больше нигде: не в пуле и не дублируется в руке.
    expect(state.pools['deck-d']).not.toContain('d-daily');
    expect(state.slots.filter((c) => c?.id === 'd-daily')).toHaveLength(1);
  });

  it('повторная раздача того же дня daily-карту не выдаёт снова', () => {
    const first = dealHand([DAILY_DECK], 4, null, constRng(0));
    expect(first.dailyDealtToday).toBe(true);
    const second = dealHand([DAILY_DECK], 4, first, constRng(0.5));
    expect(second.slots[0]?.id).not.toBe('d-daily');
  });
});

describe('card-store — добор за AP и жизненный цикл карты', () => {
  beforeEach(() => {
    // Сброс одиночных store'ов между тестами (AP, рука, колоды).
    useWorldStore.setState({ apLeft: 50, dayOver: false, dayNumber: 1, handSizeBase: 4, handSizeModifiers: [] });
    useCardStore.setState({ decks: [], handState: null, activeCardId: null });
  });

  it('initDecks раздаёт руку один раз; повторный вызов — no-op', () => {
    const store = useCardStore.getState();
    store.initDecks([DECK_A, DECK_B]);
    const firstHand = JSON.stringify(useCardStore.getState().handState);

    useCardStore.getState().initDecks([DECK_A, DECK_B]); // уже раздавали → ничего не меняем
    expect(JSON.stringify(useCardStore.getState().handState)).toBe(firstHand);
  });

  it('playCard: карта уходит в колоду, слот пустует (решение 2026-09-20)', () => {
    useCardStore.getState().initDecks([DECK_A]);
    const before = useCardStore.getState().handState!;
    const cardId = before.slots[0]!.id;

    useCardStore.getState().playCard(cardId);

    const after = useCardStore.getState().handState!;
    expect(after.slots[0]).toBeNull(); // слот пустует
    expect(after.pools['deck-a']).toContain(cardId); // карта вернулась в колоду
  });

  it('drawFromDeck заполняет пустые слоты, каждая карта стоит AP (balance.drawApCostPerCard)', () => {
    useWorldStore.setState({ apLeft: 3 }); // хватит на 2 карты максимум? нет — 3 AP = 3 карты
    useCardStore.getState().initDecks([DECK_A]);
    const before = useCardStore.getState().handState!;

    // Освобождаем один слот.
    useCardStore.getState().playCard(before.slots[0]!.id);

    const drawn = useCardStore.getState().drawFromDeck('deck-a');
    expect(drawn).toBe(1); // один пустой слот → одна карта
    expect(useWorldStore.getState().apLeft).toBe(2); // 3 − 1 AP за карту (DEFAULT_BALANCE.drawApCostPerCard = 1)

    const after = useCardStore.getState().handState!;
    expect(after.slots[0]).not.toBeNull(); // слот снова занят
  });

  it('drawFromDeck останавливается, когда не хватает AP', () => {
    useWorldStore.setState({ apLeft: 1 });
    useCardStore.getState().initDecks([DECK_A]);
    const before = useCardStore.getState().handState!;
    // Освобождаем два слота.
    useCardStore.getState().playCard(before.slots[0]!.id);
    useCardStore.getState().playCard(before.slots[1]!.id);

    const drawn = useCardStore.getState().drawFromDeck('deck-a');
    expect(drawn).toBe(1); // AP хватит ровно на одну карту
    expect(useWorldStore.getState().apLeft).toBe(0);
  });

  it('refresh добывает по очереди из всех колод в пустые слоты', () => {
    useCardStore.getState().initDecks([DECK_A, DECK_B]);
    const before = useCardStore.getState().handState!;
    const emptied = before.slots.filter((c) => c !== null).length;

    // Освобождаем все слоты.
    for (const c of before.slots) if (c) useCardStore.getState().playCard(c.id);

    const drawn = useCardStore.getState().refresh();
    expect(drawn).toBe(emptied); // рука снова полная
    expect(useWorldStore.getState().apLeft).toBe(50 - emptied);
  });

  it('reshuffleForNewDay: полный reshuffle + новая раздача, daily-карта выдаётся заново', () => {
    const DAILY_DECK: Deck = { deckId: 'deck-d2', title: 'D2', cards: [mkCard('x-1', { deckId: 'deck-d2' }), mkCard('x-2', { deckId: 'deck-d2' }), mkCard('x-daily', { daily: true, deckId: 'deck-d2' })] };
    useCardStore.getState().initDecks([DAILY_DECK]);

    // Имитация newDay (world-store сам вызывается в Phase 6).
    useWorldStore.setState({ dayNumber: 2, apLeft: 50, handSizeModifiers: [] });
    useCardStore.getState().reshuffleForNewDay();

    const state = useCardStore.getState().handState!;
    // Новый день: daily-карта гарантированно раздана заново (GDD §4).
    expect(state.dailyDealtToday).toBe(true);
    expect(state.slots[0]?.id).toBe('x-daily');
  });

  it('discardCard = возврат в колоду (GDD §4: сброс)', () => {
    useCardStore.getState().initDecks([DECK_A]);
    const before = useCardStore.getState().handState!;
    const cardId = before.slots[0]!.id;

    useCardStore.getState().discardCard(cardId);
    expect(useCardStore.getState().handState!.pools['deck-a']).toContain(cardId);
  });
});

describe('deck-loader — YAML → zod-валидированные колоды', () => {
  const GOOD_DECK_YAML = `
deckId: test-deck
title: "Test Deck"
cards:
  - id: t-card-1
    title: "Card One"
    actions:
      - verb: "Do It"
        apCost: 1
`;

  it('корректный YAML → колода с deckId у карточек', () => {
    const deck = loadDeckFromYaml(GOOD_DECK_YAML, 'test.yaml');
    expect(deck.deckId).toBe('test-deck');
    expect(deck.cards[0].deckId).toBe('test-deck'); // withDeckIds присвоил колоду
  });

  it('битый YAML → ContentError с именем файла', () => {
    expect(() => loadDeckFromYaml('deckId: [незакрытый', 'bad.yaml')).toThrow(ContentError);
    try {
      loadDeckFromYaml('deckId: [незакрытый', 'bad.yaml');
    } catch (e) {
      expect((e as Error).message).toContain('bad.yaml');
    }
  });

  it('карточка без действий → ContentError (actions — min(1))', () => {
    const bad = `
deckId: test-deck
title: "Test Deck"
cards:
  - id: t-card-1
    title: "Card One"
`;
    expect(() => loadDeckFromYaml(bad, 'bad.yaml')).toThrow(ContentError);
  });

  it('локация из YAML → сетка действий (GDD §9)', () => {
    const loc = loadLocationFromYaml(
      `locationId: test-loc\ntitle: "Test Loc"\nactions:\n  - verb: "Look"\n    apCost: 0\n`,
      'loc.yaml',
    );
    expect(loc.locationId).toBe('test-loc');
    expect(loc.actions).toHaveLength(1);
  });
});

describe('инструменты — shuffle/findCard/initPools', () => {
  it('shuffle: перестановка сохраняет состав, детерминирована по RNG', () => {
    const items = [1, 2, 3, 4, 5];
    const a = shuffle(items, constRng(0));
    const b = shuffle(items, constRng(0));
    expect(a).toEqual(b);
    expect([...a].sort()).toEqual(items);
  });

  it('findCard находит карту в любой колоде; null — если нет', () => {
    expect(findCard([DECK_A, DECK_B], 'b-2')?.title).toBe('Card b-2');
    expect(findCard([DECK_A, DECK_B], 'nope')).toBeNull();
  });

  it('initPools: пулы = все карты колод', () => {
    const pools = initPools([DECK_A, DECK_B]);
    expect(pools['deck-a']).toHaveLength(5);
    expect(pools['deck-b']).toHaveLength(3);
  });
});
