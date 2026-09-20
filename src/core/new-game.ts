// Стартовое состояние мира для новой игры (PLAN Phase 3):
// локация Cinci Bordertown, кредиты, stash/capacity, транспорт.

import type { WorldSnapshot } from './world-store';
import { DEFAULT_BALANCE } from './balance';

/** Текстовые статусы персонажа по образцу GDD §Character (Phase 3). */
export interface CharacterProfile {
  name: string;
  /** Базовые текстовые статусы — заполняются на экране создания. */
  baseGender: string; // «Base gender» (Very masculine / ...)
  preferredStyle: string; // «Preferred style» (Punk / Nighthawk / ...)
  yourTime: string; // «Your time»
  yourLife: string; // «Your life»
}

/** Стартовые числовые навыки/муды нового персонажа. */
export const STARTING_SKILLS: Record<string, number> = {
  'Skill/Observation': 12,
  'Skill/Hacking': 5,
  'Skill/Persuasion': 8,
};

/**
 * Создаёт стартовый мир новой игры из профиля персонажа.
 * Числовые статусы: стартовые навыки; текстовые — ответы с экрана создания (GDD §3).
 */
export function createNewWorld(profile: CharacterProfile): WorldSnapshot {
  const values: Record<string, string | number> = { ...STARTING_SKILLS };
  values['Character/Base gender'] = profile.baseGender || 'Unset';
  values['Character/Preferred style'] = profile.preferredStyle || 'Punk';
  values['Character/Your time'] = profile.yourTime || 'A long evening ahead';
  values['Character/Your life'] = profile.yourLife || 'Held together by neon and spite';

  return {
    dayNumber: 1,
    apLeft: DEFAULT_BALANCE.apPerDay,
    clockMinutes: DEFAULT_BALANCE.dayStartClockMinutes,
    dayOver: false,
    values,
    money: 50, // стартовые кредиты (Ohio Dollars)
    stashItems: 3,
    stashCapacity: 12,
    carryingCapacity: 4,
    carpeDiem: 2,
    handSizeBase: DEFAULT_BALANCE.handSizeDefault,
    handSizeModifiers: [],
  };
}
