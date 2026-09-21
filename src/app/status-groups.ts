// Группировка статусов по вкладкам Character (GDD §3): Skills / Moods / Menaces / Mutations + Character/Body.
import type { StatusValues } from '../core/status';

export interface StatusSection {
  title: string;
  /** Имена категорий, попадающих в секцию (без подкатегории). */
  categories: string[];
}

/** Конвенция неймспейсов (документируем здесь — контент YAML следует ей):
 * Skill/* → Skills; Mood/* → Moods; Menace|Target|Mental health/* → Menaces; Mutation/* → Mutations; остальное → Character/Body. */
export const CHARACTER_SECTIONS: StatusSection[] = [
  { title: 'Skills', categories: ['Skill'] },
  { title: 'Moods', categories: ['Mood'] },
  { title: 'Menaces', categories: ['Menace', 'Target', 'Mental health'] },
  { title: 'Mutations', categories: ['Mutation'] },
];

/** Все статусы мира, сгруппированные по секциям Character; «Character/Body» — всё остальное. */
export function groupStatusesForCharacter(values: StatusValues): Array<{ title: string; names: string[] }> {
  // categories сохраняем в рабочем массиве — по ним ищем секцию для каждого статуса.
  const sections = CHARACTER_SECTIONS.map((s) => ({ title: s.title, categories: s.categories, names: [] as string[] }));
  const other: { title: string; names: string[] } = { title: 'Character / Body', names: [] };

  for (const name of Object.keys(values).sort()) {
    const category = name.split('/')[0];
    const section = sections.find((s) => s.categories.includes(category));
    (section ?? other).names.push(name);
  }
  return [...sections, other].filter((s) => s.names.length > 0);
}
