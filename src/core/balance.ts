// Баланс-константы: единый источник правды для тюнинговых чисел (PLAN.md, раздел «Риски»).
// В Phase 4 файл content/balance.yaml загружается и валидируется этой же zod-схемой;
// до тех пор DEFAULT_BALANCE зеркалирует yaml и используется в unit-тестах.
// Правило: править числа не трогая код — только баланс-конфиг.

import { z } from 'zod';

export const BalanceConfigSchema = z.object({
  /** AP за день (GDD §2: 50). */
  apPerDay: z.number().int().positive(),
  /** Игровые часы начала нового дня, минуты от полуночи. */
  dayStartClockMinutes: z.number().int().min(0).max(1439),
  /** Базовый размер руки (GDD §4: 4 слота; модификаторы с TTL добавляются в Phase 4). */
  handSizeDefault: z.number().int().positive(),
  /** AP за заполненный слот при доборе по баннеру колоды (решение по механике руки, 2026-09-20). */
  drawApCostPerCard: z.number().int().min(0),
});

export type BalanceConfig = z.infer<typeof BalanceConfigSchema>;

/** Значения по умолчанию — зеркалируют content/balance.yaml. */
export const DEFAULT_BALANCE: BalanceConfig = {
  apPerDay: 50,
  dayStartClockMinutes: 8 * 60, // 08:00
  handSizeDefault: 4,
  drawApCostPerCard: 1,
};
