// World store (PLAN Phase 1): мир игры = один большой zustand+immer store.
// Мир = плоский словарь статусов + ресурсы/время (принцип GDD §12.1).
// Чистый домен: React не импортируется, только типы и фабрики.

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ActionCost } from './time-engine';
import { advanceClock } from './time-engine';
import type { Effect } from './effect';
import { applyEffects as pureApplyEffects, type ChangedStatus } from './effect';
import type { DerivedStatus, StatusValue, StatusValues } from './status';
import { DEFAULT_BALANCE, type BalanceConfig } from './balance';

/** Модификатор размера руки с TTL (GDD §4: «размер руки — изменяемый статус с TTL»). */
export interface HandSizeModifier {
  delta: number;
  /** День, в который модификатор истекает (не включительно). */
  expiresOnDay: number;
}

/** Сериализуемое ядро мира — то, что сохраняется в localStorage (Phase 3). */
export interface WorldSnapshot {
  dayNumber: number;
  /** Оставшееся AP за день. */
  apLeft: number;
  /** Игровые часы, минуты от полуночи. */
  clockMinutes: number;
  /** AP исчерпано → ожидается переход «Another day/Another night» (Phase 6). */
  dayOver: boolean;
  /** Плоский словарь статусов персонажа/мира (Skill/*, Moods, Menaces, Mutations...). */
  values: StatusValues;
  money: number; // Ohio Dollars
  stashItems: number; // предметы в текущем stash (Phase 7 заменит на узлы хранилища)
  stashCapacity: number;
  carryingCapacity: number; // переноска; zero = нельзя забирать предметы (GDD §2)
  carpeDiem: number; // заряды на idle-действия (GDD §2)
  handSizeBase: number;
  handSizeModifiers: HandSizeModifier[];
}

/** Позиция в мире — пока строкой; сущности локаций появятся вместе с контентом. */
export type LocationId = string;

interface WorldStore extends WorldSnapshot {
  location: LocationId;
  /** Производные статусы — декларативный список (GDD §3), подгружается из контента. Не сериализуется. */
  derivedStatuses: DerivedStatus[];
  /** Баланс-конфиг. Не сериализуется. */
  balance: BalanceConfig;
  /** Накопленные изменения за текущий день — данные для сводки дня (Phase 6). */
  dayChanges: ChangedStatus[];
  /** Мгновенное уведомление о размере руки (GDD §4: «HAND SIZE TEMPORARILY INCREASED» / «has dropped»). Не сериализуется. */
  handSizeNotice: string | null;

  // --- Действия мира ---
  /**
   * Основное действие игры (GDD §1): тратит AP и/или время, применяет эффекты.
   * Возвращает список изменений для UI-тайлов результата.
   */
  spend(cost: ActionCost, effects?: Effect[]): ChangedStatus[];
  /** Применяет эффекты без стоимости (награды, пассивные бонусы). */
  applyEffects(effects: Effect[]): ChangedStatus[];
  /** Тратит кредиты (Ohio Dollars); не уходит ниже нуля. */
  spendCredits(amount: number): void;
  /** Добавляет модификатор размера руки с TTL в днях. */
  addHandSizeModifier(delta: number, durationDays: number): void;
  /** Скрывает уведомление о размере руки (ушло по таймеру/клику). */
  dismissHandSizeNotice(): void;
  /** Новый день: сброс AP/часов, истечение TTL-модификаторов, перенос dayChanges в журнал (Phase 6 расширит). */
  newDay(): void;
}

/** Текущий размер руки = base + активные модификаторы с TTL. Чистая функция — тестируется отдельно. */
export function currentHandSize(snapshot: Pick<WorldSnapshot, 'dayNumber' | 'handSizeBase' | 'handSizeModifiers'>): number {
  const active = snapshot.handSizeModifiers.filter((m) => m.expiresOnDay > snapshot.dayNumber);
  return snapshot.handSizeBase + active.reduce((sum, m) => sum + m.delta, 0);
}

/** GDD §2: пустой stash блокирует перезарядку оружия и смену экипировки. */
export function canReloadOrSwapEquipment(snapshot: Pick<WorldSnapshot, 'stashItems'>): boolean {
  return snapshot.stashItems > 0;
}

/** GDD §2: carrying capacity zero — нельзя забирать предметы. */
export function canPickUpItem(snapshot: Pick<WorldSnapshot, 'carryingCapacity'>): boolean {
  return snapshot.carryingCapacity > 0;
}

/** Производные статусы поверх базовых значений (для UI и формул chance). */
export function valuesWithDerived(values: StatusValues, derivedStatuses: DerivedStatus[]): Record<string, StatusValue> {
  const merged: Record<string, StatusValue> = { ...values };
  for (const d of derivedStatuses) merged[d.name] = d.formula(values);
  return merged;
}

/** Начальное состояние мира — заготовка для Phase 3 (создание персонажа). */
export function createInitialWorld(overrides?: Partial<WorldSnapshot>): WorldSnapshot {
  const base: WorldSnapshot = {
    dayNumber: 1,
    apLeft: DEFAULT_BALANCE.apPerDay,
    clockMinutes: DEFAULT_BALANCE.dayStartClockMinutes,
    dayOver: false,
    values: {},
    money: 0,
    stashItems: 3, // не пустой: стартовый мир позволяет перезаряжать/менять экипировку (Phase 7 уточнит)
    stashCapacity: 12,
    carryingCapacity: 4,
    carpeDiem: 2,
    handSizeBase: DEFAULT_BALANCE.handSizeDefault,
    handSizeModifiers: [],
  };
  return { ...base, ...overrides };
}

/** Фабрика store: приложение использует один инстанс (useWorldStore), тесты создают свежие. */
export function createWorldStore(initial?: WorldSnapshot) {
  const snapshot = initial ?? createInitialWorld();
  return create<WorldStore>()(
    immer((set, get) => ({
      ...snapshot,
      location: 'cinci-bordertown',
      derivedStatuses: [],
      balance: DEFAULT_BALANCE,
      dayChanges: [],
      handSizeNotice: null,

      spend(cost, effects = []) {
        const state = get();
        const apCost = cost.apCost ?? 0;
        if (apCost > state.apLeft) throw new Error(`Недостаточно AP: нужно ${apCost}, доступно ${state.apLeft}`);
        set((s) => {
          s.apLeft -= apCost;
          if (cost.timeCostHours !== undefined) s.clockMinutes = advanceClock(s.clockMinutes, cost.timeCostHours);
        });
        const changed = get().applyEffects(effects);
        set((s) => {
          if (s.apLeft <= 0 && !s.dayOver) s.dayOver = true; // исчерпание AP → переход дня/ночи (Phase 6)
        });
        return changed;
      },

      applyEffects(effects) {
        const state = get();
        if (effects.length === 0) return [];
        const result = pureApplyEffects(state.values, effects);
        set((s) => {
          s.values = result.values; // immer: замена словаря ок (immutable-результат чистой функции)
          s.dayChanges.push(...result.changed);
        });
        return result.changed;
      },

      addHandSizeModifier(delta, durationDays) {
        set((s) => {
          s.handSizeModifiers.push({ delta, expiresOnDay: s.dayNumber + Math.max(1, durationDays) });
          // Уведомление о смене размера руки (GDD §4): рост — «TEMPORARILY INCREASED», падение — «has dropped».
          if (delta > 0) s.handSizeNotice = `HAND SIZE TEMPORARILY INCREASED (+${delta})`;
          else if (delta < 0) s.handSizeNotice = `Your hand size has dropped (${delta}). Couldn't keep this rate up forever.`;
        });
      },

      dismissHandSizeNotice() {
        set((s) => {
          s.handSizeNotice = null;
        });
      },

      spendCredits(amount) {
        if (amount <= 0) return;
        const state = get();
        if (amount > state.money) throw new Error(`Недостаточно кредитов: нужно ${amount}, доступно ${state.money}`);
        set((s) => {
          s.money -= amount;
        });
      },

      newDay() {
        const state = get();
        set((s) => {
          s.dayNumber += 1;
          s.apLeft = s.balance.apPerDay;
          s.clockMinutes = s.balance.dayStartClockMinutes;
          s.dayOver = false;
          // Истечение TTL-модификаторов руки (GDD §4: «Your hand size has dropped»).
          const expired = s.handSizeModifiers.filter((m) => m.expiresOnDay <= s.dayNumber);
          if (expired.length > 0 && expired.some((m) => m.delta !== 0)) {
            s.handSizeNotice = "Your hand size has dropped. Couldn't keep this rate up forever.";
          }
          s.handSizeModifiers = s.handSizeModifiers.filter((m) => m.expiresOnDay > s.dayNumber);
          s.dayChanges = [];
        });
        return state; // возвращаем состояние до сброса — для тестов и сводки дня
      },
    })),
  );
}

/** Единственный инстанс для приложения (Phase 2+). */
export const useWorldStore = createWorldStore();
