// Сохранение мира в localStorage (PLAN Phase 3: «задел на save/load»).
// Сериализуется только сериализуемое ядро мира; производные статусы и баланс восстанавливаются по умолчанию.

import type { WorldSnapshot } from './world-store';
import type { ChangedStatus } from './effect';

/** Всё, что переживает перезагрузку: ядро мира + локация + журнал дня (дельты в CharacterView). */
export interface PersistedWorld extends WorldSnapshot {
  location: string;
  dayChanges: ChangedStatus[];
}

const SAVE_KEY = 'cyberdyansk.save.v1';

/** Минимальная проверка формы сохранения — защита от мусора/чужих ключей в localStorage. */
function isPersistedWorld(v: unknown): v is PersistedWorld {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.dayNumber === 'number' && typeof o.apLeft === 'number' && typeof o.values === 'object';
}

export function saveWorld(world: PersistedWorld): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(world));
  } catch {
    // Квота/приватный режим — не критично для игры (сохранение best-effort).
  }
}

export function loadWorld(): PersistedWorld | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPersistedWorld(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}
