// Движок времени (GDD §2, PLAN Phase 1): действие тратит AP и продвигает игровые часы.
// Исчерпание AP → флаг dayOver; сам переход дня — отдельная система (Phase 6).

/** Стоимость действия: AP-очки и/или часов игрового времени (`| 1`, `| 3` в UI оригинала). */
export interface ActionCost {
  /** Цена в AP. undefined = бесплатное действие («Just look»). */
  apCost?: number;
  /** Временная цена в часах игрового времени. undefined = без временной цены. */
  timeCostHours?: number;
}

const MINUTES_PER_DAY = 24 * 60;

/** Продвигает часы на N часов с обёрткой через полночь (GDD §13: открыт вопрос, что после 24:00 — пока зацикливаем). */
export function advanceClock(clockMinutes: number, timeCostHours: number): number {
  return ((clockMinutes + Math.round(timeCostHours * 60)) % MINUTES_PER_DAY + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

/** Форматирует минуты от полуночи как «HH:MM». */
export function formatClock(clockMinutes: number): string {
  const clamped = ((Math.floor(clockMinutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(clamped / 60).toString().padStart(2, '0');
  const m = (clamped % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/** Текстовая метка времени суток для правой панели («Early evening», GDD §11). Строки UI — английский. */
export function daytimeLabel(clockMinutes: number): string {
  const h = Math.floor((((clockMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY) / 60);
  if (h < 5) return 'Night';
  if (h < 8) return 'Early morning';
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  if (h < 20) return 'Evening';
  if (h < 23) return 'Late evening';
  return 'Night';
}
