// Базовый примитив №2 (GDD §3): эффект = { statusName, delta }.
// Один и тот же объект везде: бонусы предметов, эффекты мудов, награды действий, итоги дня.

import type { StatusValue, StatusValues } from './status';
import { isValidStatusName } from './status';

/** Эффект: изменение статуса мира. */
export interface Effect {
  /** Неймспейсированное имя целевого статуса («Skill/Hacking»). */
  statusName: string;
  /** number — прибавка к числовому статусу (может быть отрицательной); string — замена значения (текстовые статусы). */
  delta: number | string;
}

/** Изменённый статус — единый формат отчётности для тайлов результата и сводки дня (GDD §12.2). */
export interface ChangedStatus {
  name: string;
  /** Значение до применения; undefined, если эффект создал новый статус («You now have Y at N»). */
  before?: StatusValue;
  after: StatusValue;
}

/**
 * Чистая функция: не мутирует вход. Возвращает новое значение словаря и список изменений.
 * Правила (GDD §3): числовое значение + числовой дельта → сложение;
 * во всех остальных случаях — замена значения (текстовые статусы, создание нового).
 */
export function applyEffects(
  values: StatusValues,
  effects: Effect[],
): { values: StatusValues; changed: ChangedStatus[] } {
  const next: StatusValues = { ...values };
  const changed: ChangedStatus[] = [];

  for (const effect of effects) {
    if (!isValidStatusName(effect.statusName)) {
      throw new Error(`applyEffects: некорректное имя статуса «${effect.statusName}»`);
    }
    const before = next[effect.statusName];
    let after: StatusValue;
    if (typeof effect.delta === 'number' && typeof before === 'number') {
      after = before + effect.delta; // числовой статус: прибавка дельты
    } else {
      after = effect.delta as StatusValue; // замена: текстовый дельта или создание нового статуса
    }
    next[effect.statusName] = after;
    changed.push({ name: effect.statusName, before, after });
  }

  return { values: next, changed };
}
