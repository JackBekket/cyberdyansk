// Типы карточной системы (PLAN Phase 4) + zod-схемы валидации YAML-контента (GDD §4).
// Чистый домен: React не импортируется.

import { z } from 'zod';
import type { Effect } from '../core/effect';

/** Эффект действия — тот же примитив GDD §3, что и везде в игре. */
export const CardEffectSchema = z.object({
  statusName: z.string().min(1),
  delta: z.union([z.number(), z.string()]),
});
export type CardEffect = Effect;

/**
 * Действие карты/локации (GDD §4). Стоимость: время (`apCost` + `timeCostHours` — «| N»),
 * кредиты, carpe diem-заряд (idle-действия, GDD §2), вероятностное потребление — текстово.
 */
export const CardActionSchema = z.object({
  verb: z.string().min(1), // «Do It», «Help», «Wait», «Pay», «Eat»
  apCost: z.number().int().min(0).optional(), // undefined/0 — бесплатное действие («Just look»)
  timeCostHours: z.number().min(0).optional(), // временная цена (GDD §2)
  creditsCost: z.number().int().min(0).optional(), // цена в Ohio Dollars
  usesCarpeDiem: z.boolean().optional(), // idle-действие: тратит заряд carpe diem (GDD §2)
  successChance: z.number().min(0).max(100).optional(), // плоский шанс «[ Success: N% ]» (Phase 5)
  effects: z.array(CardEffectSchema).default([]), // эффекты, применяемые при выполнении (Phase 5 расширит исходами)
});
export type CardAction = z.infer<typeof CardActionSchema>;

/** Требования карты к миру (GDD §4 CARD REQUIREMENTS): имена статусов, которые должны существовать. */
export const RequirementsSchema = z.array(z.string().min(1)).optional();

/** Карточка (PLAN Phase 4). `daily: true` — daily-карта: гарантированно раз в день вне зависимости от колоды (GDD §4). */
export const CardSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i, 'id карты — kebab-case'),
  title: z.string().min(1),
  flavor: z.string().optional(),
  requirements: RequirementsSchema,
  daily: z.boolean().optional(),
  actions: z.array(CardActionSchema).min(1),
});
export type Card = z.infer<typeof CardSchema> & { deckId: string };

/** Колода (GDD §4): DMM — заглушка; локация / Life-Survival / Down to Work. */
export const DeckSchema = z.object({
  deckId: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i),
  title: z.string().min(1),
  cards: z.array(CardSchema).min(1),
});
export type DeckBase = z.infer<typeof DeckSchema>;

/** Локация (GDD §9): сетка статичных действий + хабы. Пока — только статичные действия. */
export const LocationActionSchema = CardActionSchema;
export const LocationSchema = z.object({
  locationId: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/i),
  title: z.string().min(1),
  actions: z.array(LocationActionSchema).default([]),
});
export type LocationContent = z.infer<typeof LocationSchema>;

/** Присваивает deckId карточкам колоды (в YAML он не дублируется внутри карт). */
export function withDeckIds(deck: DeckBase): Deck {
  return { ...deck, cards: deck.cards.map((c) => ({ ...c, deckId: deck.deckId })) };
}
