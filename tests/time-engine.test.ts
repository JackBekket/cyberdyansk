// Unit-тесты движка времени (GDD §2, PLAN Phase 1).
import { describe, expect, it } from 'vitest';
import { advanceClock, daytimeLabel, formatClock } from '../src/core/time-engine';

describe('advanceClock — продвижение игровых часов', () => {
  it('добавляет временную цену действия к часам (GDD §2: «| 1», «| 3»)', () => {
    // 09:00 = 540 мин; действие с timeCostHours=2 → 11:00 = 660
    expect(advanceClock(9 * 60, 2)).toBe(11 * 60);
  });

  it('оборачивается через полночь', () => {
    // 23:30 = 1410; +2 часа → 01:30 = 90
    expect(advanceClock(23 * 60 + 30, 2)).toBe(90);
  });

  it('поддерживает дробные часы (| 0.5 = 30 минут)', () => {
    expect(advanceClock(8 * 60, 0.5)).toBe(8 * 60 + 30);
  });
});

describe('formatClock — формат HH:MM', () => {
  it('форматирует минуты от полуночи', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(8 * 60 + 5)).toBe('08:05');
    expect(formatClock(23 * 60 + 59)).toBe('23:59');
  });
});

describe('daytimeLabel — метка времени суток для правой панели (GDD §11)', () => {
  it('Early evening на поздний вечер, Night ночью', () => {
    expect(daytimeLabel(18 * 60)).toBe('Evening');
    expect(daytimeLabel(2 * 60)).toBe('Night');
    expect(daytimeLabel(10 * 60)).toBe('Morning');
  });
});
