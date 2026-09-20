// Карточный store (PLAN Phase 4): рука, колоды, добор, discard/defer.
// Механика руки (решено 2026-09-20): исполнение/сброс → карта в колоду, слот пустует;
// клик по баннеру колоды / «Refresh» → добор за AP; полный reshuffle на новый день.

import { create } from 'zustand';
import type { Card, Deck } from './types';
import type { HandState } from './hand';
import { dealHand, findCard, firstEmptySlot } from './hand';
import { currentHandSize, useWorldStore } from '../core/world-store';

interface CardStore {
  /** Загруженные колоды (из YAML через deck-loader). */
  decks: Deck[];
  handState: HandState | null;
  /** Открытая в CardWindow карта (id) — null = окно закрыто. */
  activeCardId: string | null;

  /** Инициализация: колоды + стартовая раздача руки. Вызывается один раз при входе в игру. */
  initDecks(decks: Deck[]): void;
  /** Добор из конкретной колоды в пустые слоты, каждая карта — AP (balance.drawApCostPerCard). Возвращает число добранных карт. */
  drawFromDeck(deckId: string): number;
  /** «Refresh» слева: добор в пустые слоты по очереди из всех колод с картами. */
  refresh(): number;
  /** Исполнение карты: карта возвращается в колоду, слот пустует (стоимость/эффекты тратит world.spend). */
  playCard(cardId: string): void;
  /** DISCARD: карта уходит в колоду, слот пустует. */
  discardCard(cardId: string): void;
  /** DEFER («Not right now»)/CLOSE: окно закрывается, карта остаётся в руке. */
  closeCardWindow(): void;
  /** Открыть окно карты из слота руки. */
  openCardWindow(cardId: string): void;
  /** Новый день: полный reshuffle колод + новая раздача (GDD §6/§4). Вызывается world-store.newDay(). */
  reshuffleForNewDay(): void;
}

/** Случайный индекс в пределах длины. */
function randIndex(len: number): number {
  return Math.floor(Math.random() * len);
}

export const useCardStore = create<CardStore>()((set, get) => ({
  decks: [],
  handState: null,
  activeCardId: null,

  initDecks(decks) {
    if (get().handState !== null || decks.length === 0) return; // уже раздавали
    const size = currentHandSize(useWorldStore.getState());
    set({ decks, handState: dealHand(decks, size, null) });
  },

  drawFromDeck(deckId) {
    let { handState } = get();
    if (!handState) return 0;
    const perCard = useWorldStore.getState().balance.drawApCostPerCard;
    const decks = get().decks;

    // Копии — immutable-обновление, публикуем один раз в конце.
    let slots: Array<Card | null> = [...handState.slots];
    let pool = [...(handState.pools[deckId] ?? [])];

    let drawn = 0;
    while (true) {
      const empty = firstEmptySlot(slots);
      if (empty < 0 || pool.length === 0) break; // рука полна или колода пуста
      if (perCard > 0 && useWorldStore.getState().apLeft < perCard) break; // не хватает AP — UI покажет превью затрат

      const idx = randIndex(pool.length);
      const cardId = pool[idx];
      pool.splice(idx, 1); // убираем карту из пула (копия)
      const card = findCard(decks, cardId);
      if (!card) continue; // защита от рассинхрона пулов — слот остаётся пустым

      slots[empty] = card;
      drawn += 1;
      useWorldStore.getState().spend({ apCost: perCard }); // AP за карту (решение 2026-09-20)
    }

    if (drawn > 0) {
      set({ handState: { slots, pools: { ...handState.pools, [deckId]: pool }, dailyDealtToday: handState.dailyDealtToday } });
    }
    return drawn;
  },

  refresh() {
    let total = 0;
    for (const d of get().decks) total += get().drawFromDeck(d.deckId);
    return total;
  },

  playCard(cardId) {
    const { handState } = get();
    if (!handState) return;
    const card = findCard(get().decks, cardId);
    if (!card) return;
    const slotIdx = handState.slots.findIndex((c) => c?.id === cardId);
    if (slotIdx < 0) return; // карта уже не в руке

    const next: HandState = {
      slots: [...handState.slots],
      pools: { ...handState.pools, [card.deckId]: [...(handState.pools[card.deckId] ?? []), card.id] },
      dailyDealtToday: handState.dailyDealtToday,
    };
    next.slots[slotIdx] = null; // слот пустует — добор по баннеру колоды (решение 2026-09-20)
    set({ handState: next, activeCardId: null });
  },

  discardCard(cardId) {
    get().playCard(cardId); // DISCARD = возврат в колоду (GDD §4: сброс)
  },

  closeCardWindow() {
    set({ activeCardId: null }); // DEFER/CLOSE: карта остаётся в слоте
  },

  openCardWindow(cardId) {
    set({ activeCardId: cardId });
  },

  reshuffleForNewDay() {
    const { decks } = get();
    if (decks.length === 0) return;
    const size = currentHandSize(useWorldStore.getState()); // TTL-модификаторы истекли в world-store.newDay
    set({ handState: dealHand(decks, size, null), activeCardId: null });
  },
}));
