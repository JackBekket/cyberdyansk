// Базовый примитив №1 (GDD §3): статус = { name, value }.
// name — неймспейсированное имя «Категория/Подкатегория»: Skill/Hacking, Mental health/PTSD, w/Accuracy.
// value — число или текст (категорийные значения: Very masculine, Punk, Nighthawk).

export type StatusValue = number | string;

/** Статус мира. Единственный тип объекта для навыков, мудов, угроз, мутаций и т.д. */
export interface Status {
  name: string;
  value: StatusValue;
}

/** Плоский словарь статусов — мир строится из него (принцип GDD §12.1). */
export type StatusValues = Record<string, StatusValue>;

// Сегмент имени: буква/цифра в начале, дальше — буквы, цифры, пробелы и пунктуация без слэша.
const NAME_SEGMENT_RE = /^[A-Za-z0-9][A-Za-z0-9 _'()\-]*$/;

/** Разбирает неймспейсированное имя «Skill/Hacking» → { category, sub }. null — если формат некорректен. */
export function parseStatusName(
  name: string,
): { category: string; sub: string } | null {
  const slash = name.indexOf('/');
  if (slash <= 0 || slash === name.length - 1) return null;
  const category = name.slice(0, slash);
  const sub = name.slice(slash + 1);
  if (!NAME_SEGMENT_RE.test(category) || !NAME_SEGMENT_RE.test(sub)) return null;
  return { category, sub };
}

/** Валидация имени статуса (используется при парсинге контента и в applyEffects). */
export function isValidStatusName(name: string): boolean {
  return parseStatusName(name) !== null;
}

/** Производный статус (GDD §3): вычисляется на лету из базовых. Пример: Perceived temperature = Temperature + модификатор. */
export interface DerivedStatus {
  name: string;
  formula: (values: StatusValues) => number;
}

/** Вычисляет значение производного статуса по текущему состоянию мира. */
export function evaluateDerived(derived: DerivedStatus, values: StatusValues): number {
  return derived.formula(values);
}
