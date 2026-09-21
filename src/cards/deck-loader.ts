// Загрузка колод и локаций из YAML + zod-валидация (PLAN Phase 4).
// Контент отдельно от кода: строки YAML приходят извне (Vite ?raw в приложении, fs/строка в тестах).

import { parse as parseYaml } from 'yaml';
import type { LocationContent } from './types';
import { CardSchema, DeckSchema, LocationSchema, withDeckIds } from './types';

/** Ошибка парсинга контента с указанием файла — показывается в UI при отладке. */
export class ContentError extends Error {
  constructor(public readonly file: string, message: string) {
    super(`${file}: ${message}`);
  }
}

function fail(file: string, err: unknown): never {
  const detail = err instanceof Error ? err.message : String(err);
  throw new ContentError(file, detail);
}

/** YAML-строка колоды → валидированная колода с deckId у карточек. */
export function loadDeckFromYaml(yamlText: string, file: string): ReturnType<typeof withDeckIds> {
  let doc: unknown;
  try {
    doc = parseYaml(yamlText);
  } catch (e) {
    fail(file, e);
  }
  const deck = DeckSchema.safeParse(doc);
  if (!deck.success) return fail(file, deck.error.message);
  // Валидируем карточки отдельно, чтобы присвоить deckId.
  for (const c of (doc as { cards?: unknown[] }).cards ?? []) {
    const parsed = CardSchema.safeParse(c);
    if (!parsed.success) fail(file, `карточка: ${parsed.error.message}`);
  }
  return withDeckIds(deck.data);
}

/** YAML-строка локации → валидированное содержание (сетка статичных действий). */
export function loadLocationFromYaml(yamlText: string, file: string): LocationContent {
  let doc: unknown;
  try {
    doc = parseYaml(yamlText);
  } catch (e) {
    fail(file, e);
  }
  const loc = LocationSchema.safeParse(doc);
  if (!loc.success) return fail(file, loc.error.message);
  return loc.data;
}
