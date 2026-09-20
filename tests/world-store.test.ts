// Unit-тесты world store (PLAN Phase 1). Ключевой acceptance:
// «сделать действие → AP упало, часы сдвинулись, эффекты применились» — без UI.
import { describe, expect, it } from 'vitest';
import { createWorldStore, canPickUpItem, canReloadOrSwapEquipment, currentHandSize, valuesWithDerived } from '../core/world-store';

describe('world store — базовое состояние', () => {
  it('стартовый мир: AP = 50/день, часы 08:00 (GDD §2)', () => {
    const useWorld = createWorldStore();
    expect(useWorld.getState().apLeft).toBe(50);
    expect(useWorld.getState().clockMinutes).toBe(8 * 60);
    expect(useWorld.getState().dayOver).toBe(false);
  });
});

describe('spend — действие тратит AP и время (acceptance Phase 1)', () => {
  it('сделать действие → AP упало, часы сдвинулись, эффекты применились', () => {
    const useWorld = createWorldStore();
    useWorld.getState().applyEffects([{ statusName: 'Skill/Observation', delta: 35 }]);

    const changed = useWorld.getState().spend(
      { apCost: 2, timeCostHours: 1 }, // «| 1» — временная цена действия (GDD §2)
      [{ statusName: 'Skill/Observation', delta: 1 }], // опыт за попытку (GDD §5)
    );

    const s = useWorld.getState();
    expect(s.apLeft).toBe(48); // AP упало
    expect(s.clockMinutes).toBe(9 * 60); // часы сдвинулись на час
    expect(s.values['Skill/Observation']).toBe(36); // эффекты применились
    expect(changed).toEqual([{ name: 'Skill/Observation', before: 35, after: 36 }]);
  });

  it('бесплатное действие без временной цены не трогает AP и часы («Just look», GDD §4)', () => {
    const useWorld = createWorldStore();
    useWorld.getState().spend({});
    const s = useWorld.getState();
    expect(s.apLeft).toBe(50);
    expect(s.clockMinutes).toBe(8 * 60);
  });

  it('недостаточно AP — бросает ошибку', () => {
    const useWorld = createWorldStore();
    expect(() => useWorld.getState().spend({ apCost: 51 })).toThrow(/Недостаточно AP/);
  });

  it('исчерпание AP ставит флаг dayOver (переход дня/ночи — Phase 6, GDD §6)', () => {
    const useWorld = createWorldStore();
    useWorld.getState().spend({ apCost: 30 });
    expect(useWorld.getState().dayOver).toBe(false);
    useWorld.getState().spend({ apCost: 20 });
    expect(useWorld.getState().apLeft).toBe(0);
    expect(useWorld.getState().dayOver).toBe(true);
  });

  it('изменения накапливаются в dayChanges для сводки дня (GDD §6, Phase 6)', () => {
    const useWorld = createWorldStore();
    useWorld.getState().applyEffects([{ statusName: 'Mental health/Buzz', delta: 4 }]);
    useWorld.getState().applyEffects([{ statusName: 'Mental health/PTSD', delta: -2 }]);
    expect(useWorld.getState().dayChanges).toHaveLength(2);
  });
});

describe('гейтинг stash/capacity (GDD §2, PLAN Phase 1)', () => {
  it('stash = 0 блокирует перезарядку оружия и смену экипировки', () => {
    expect(canReloadOrSwapEquipment({ stashItems: 3 })).toBe(true);
    expect(canReloadOrSwapEquipment({ stashItems: 0 })).toBe(false);
  });

  it('carrying capacity = 0 блокирует забираемые предметы', () => {
    expect(canPickUpItem({ carryingCapacity: 4 })).toBe(true);
    expect(canPickUpItem({ carryingCapacity: 0 })).toBe(false);
  });
});

describe('размер руки с TTL (GDD §4; механика уточнена 2026-09-20)', () => {
  it('модификатор увеличивает размер руки, пока не истёк TTL', () => {
    const useWorld = createWorldStore();
    expect(currentHandSize(useWorld.getState())).toBe(4); // базовый размер

    useWorld.getState().addHandSizeModifier(2, 1); // «HAND SIZE TEMPORARILY INCREASED»
    expect(currentHandSize(useWorld.getState())).toBe(6);

    // Новый день: модификатор на 1 день истекает → «Your hand size has dropped»
    useWorld.getState().newDay();
    expect(currentHandSize(useWorld.getState())).toBe(4);
  });

  it('модификатор с длительностью > 1 дня переживает новый день', () => {
    const useWorld = createWorldStore();
    useWorld.getState().addHandSizeModifier(-1, 3);
    useWorld.getState().newDay();
    expect(currentHandSize(useWorld.getState())).toBe(3); // 4 − 1 пока активен
  });
});

describe('newDay — сброс дня (GDD §6)', () => {
  it('сбрасывает AP и часы, инкрементирует день, очищает dayChanges', () => {
    const useWorld = createWorldStore();
    useWorld.getState().spend({ apCost: 10, timeCostHours: 3 });
    useWorld.getState().applyEffects([{ statusName: 'Skill/Hacking', delta: 2 }]);

    useWorld.getState().newDay();

    const s = useWorld.getState();
    expect(s.dayNumber).toBe(2);
    expect(s.apLeft).toBe(50); // AP восстановлено
    expect(s.clockMinutes).toBe(8 * 60); // часы сброшены к началу дня
    expect(s.dayOver).toBe(false);
    expect(s.dayChanges).toHaveLength(0); // сводка за день уже «выдана» (Phase 6)
    expect(s.values['Skill/Hacking']).toBe(2); // статусы мира сохраняются между днями
  });
});

describe('производные статусы (GDD §3)', () => {
  it('Perceived temperature = Temperature + модификатор', () => {
    const useWorld = createWorldStore();
    useWorld.setState({
      derivedStatuses: [
        { name: 'Environment/Perceived temperature', formula: (v) => Number(v['Environment/Temperature'] ?? 0) + 5 },
      ],
    });
    useWorld.getState().applyEffects([{ statusName: 'Environment/Temperature', delta: 32 }]);

    const merged = valuesWithDerived(useWorld.getState().values, useWorld.getState().derivedStatuses);
    expect(merged['Environment/Perceived temperature']).toBe(37); // «(+5) 37» со скриншота GDD §3
  });
});
