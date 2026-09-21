// Стартовый контент Phase 4: колоды + текущая локация из YAML через Vite ?raw.
// Контент живёт в content/ отдельно от кода; здесь только «что загружать при старте».

import bordertownLifeYaml from '../../content/decks/bordertown-life.yaml?raw';
import lifeSurvivalYaml from '../../content/decks/life-survival.yaml?raw';
import downToWorkYaml from '../../content/decks/down-to-work.yaml?raw';
import cinciBordertownYaml from '../../content/locations/cinci-bordertown.yaml?raw';

import { loadDeckFromYaml, loadLocationFromYaml } from './deck-loader';
import type { Deck, LocationContent } from './types';

/** Стартовая локация новой игры (GDD §9: Cinci Bordertown). */
export const STARTER_LOCATION_ID = 'cinci-bordertown';

/** Стартовые колоды в порядке GDD §4: локация, Life/Survival, Down to Work. DMM — заглушка до уточнения (§13). */
const STARTER_DECK_FILES: Array<[string, string]> = [
  ['decks/bordertown-life.yaml', bordertownLifeYaml],
  ['decks/life-survival.yaml', lifeSurvivalYaml],
  ['decks/down-to-work.yaml', downToWorkYaml],
];

/** Загружает и валидирует стартовые колоды (zod-схемы deck-loader). */
export function loadStarterDecks(): Deck[] {
  return STARTER_DECK_FILES.map(([file, yamlText]) => loadDeckFromYaml(yamlText, file));
}

/** Загружает локацию по id; пока в контенте только Cinci Bordertown. */
const LOCATION_FILES: Record<string, string> = {
  [STARTER_LOCATION_ID]: cinciBordertownYaml,
};

export function loadLocation(locationId: string): LocationContent | null {
  const yamlText = LOCATION_FILES[locationId];
  if (!yamlText) return null; // других локаций в контенте ещё нет (GDD §10 — позже)
  return loadLocationFromYaml(yamlText, `locations/${locationId}.yaml`);
}
