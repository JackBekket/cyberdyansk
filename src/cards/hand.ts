// Система руки (PLAN Phase 4). Механика (решено 2026-09-20, закрывает GDD §13):
// - рука = N слотов; исполнение/сброс карты возвращает её в колоду, слот пустует;
// - добор: клик по баннеру колоды заполняет пустые слоты из ЭТОЙ колоды, каждая карта — AP (drawApCostPerCard);
//   «Refresh» слева — добор из любой колоды с картами;
// - полный reshuffle + новая раздача при новом дне;
// - daily-карты: гарантированно одна раз в день вне зависимости от колоды (GDD §4).
// Чистый домен: React не импортируется.

import type { Card, Deck } from './types';

/** RNG — injectable для детерминированных unit-тестов. */
export type Rng = () => number;

const defaultRng: Rng = Math.random;

/** Fisher–Yates с внешним RNG (чистая функция по входу). */
export function shuffle<T>(items: readonly T[], rng: Rng = defaultRng): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Состояние колод для раздачи: deckId → id оставшихся в колоде карт. */
export type DeckPools = Record<string, string[]>;

/** Полное состояние карточной системы (сериализуемо — попадёт в save/load). */
export interface HandState {
  /** Слоты руки: карта или null (пустой слот после исполнения/сброса). */
  slots: Array<Card | null>;
  pools: DeckPools;
  /** Daily-карта уже выдана сегодня? (GDD §4: «once per day, every day»). */
  dailyDealtToday: boolean;
}

/** Инициализация колодных пулов из колод. */
export function initPools(decks: readonly Deck[]): DeckPools {
  const pools: DeckPools = {};
  for (const d of decks) pools[d.deckId] = [...d.cards.map((c) => c.id)];
  return pools;
}

/** Карта по id из колоды. */
export function findCard(decks: readonly Deck[], cardId: string): Card | null {
  for (const d of decks) {
    const c = d.cards.find((x) => x.id === cardId);
    if (c) return c;
  }
  return null;
}

/**
 * Раздача руки в N слотов из колод + гарантия daily-карты.
 * Возвращает новое состояние: slots + обновлённые pools.
 */
export function dealHand(decks: readonly Deck[], handSize: number, state: HandState | null, rng: Rng = defaultRng): HandState {
  const pools: DeckPools = state ? JSON.parse(JSON.stringify(state.pools)) : initPools(decks);

  // daily-карта: одна из всех колод, гарантированно раз в день (GDD §4)
  let forcedDaily: Card | null = null;
  if (!state?.dailyDealtToday) {
    const dailyCards = decks.flatMap((d) => d.cards.filter((c) => c.daily));
    if (dailyCards.length > 0) {
      forcedDaily = dailyCards[Math.floor(rng() * dailyCards.length)];
      // убираем её из пула колоды, чтобы не выдать дважды
      const poolIdx = pools[forcedDaily.deckId]?.indexOf(forcedDaily.id);
      if (poolIdx !== undefined && poolIdx >= 0) pools[forcedDaily.deckId].splice(poolIdx, 1);
    }
  }

  const slots: Array<Card | null> = new Array(handSize).fill(null);
  // первый слот — daily-карта (если есть)
  if (forcedDaily && handSize > 0) {
    slots[0] = forcedDaily;
  }

  let slotIdx = forcedDaily ? 1 : 0;
  // заполняем оставшиеся слоты случайными картами из всех колод с остатками
  const deckIdsWithCards = () => Object.keys(pools).filter((id) => pools[id].length > 0);
  while (slotIdx < handSize) {
    const ids = deckIdsWithCards();
    if (ids.length === 0) break; // колоды пусты — слоты остаются пустыми
    const deckId = ids[Math.floor(rng() * ids.length)];
    const cardId = pools[deckId].splice(Math.floor(rng() * pools[deckId].length), 1)[0];
    const card = findCard(decks, cardId);
    if (card) slots[slotIdx] = card; // карта не найдена — слот пустой (защита от рассинхрона пулов)
    slotIdx++;
  }

  return { slots, pools, dailyDealtToday: forcedDaily !== null || Boolean(state?.dailyDealtToday) };
}

/** Возврат карты в её колоду (исполнение/сброс → слот пустует). Мутирует переданное состояние. */
export function returnCardToDeck(state: HandState, card: Card): void {
  if (!state.pools[card.deckId]) state.pools[card.deckId] = [];
  state.pools[card.deckId].push(card.id);
}

/** Индекс первого пустого слота; -1 — рука полна. */
export function firstEmptySlot(slots: readonly Array<Card | null>): number {
  return slots.indexOf(null);
}
