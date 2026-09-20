// Unit-тесты базовых примитивов GDD §3 (PLAN Phase 1).
import { describe, expect, it } from 'vitest';
import { applyEffects } from '../core/effect';
import type { ChangedStatus } from '../core/effect';

describe('applyEffects — применение эффектов к статусам', () => {
  it('числовой дельта прибавляется к числовому статусу (GDD §3)', () => {
    const { values, changed } = applyEffects({ 'Skill/Hacking': 12 }, [{ statusName: 'Skill/Hacking', delta: 3 }]);
    expect(values['Skill/Hacking']).toBe(15);
    expect(changed).toEqual<ChangedStatus[]>([{ name: 'Skill/Hacking', before: 12, after: 15 }]);
  });

  it('отрицательная дельта снижает статус (GDD §3)', () => {
    const { values } = applyEffects({ 'Mental health/Paranoia': 8 }, [{ statusName: 'Mental health/Paranoia', delta: -3 }]);
    expect(values['Mental health/Paranoia']).toBe(5);
  });

  it('текстовый дельта заменяет значение (категорийные статусы, GDD §3)', () => {
    const { values } = applyEffects({ 'Character/Base gender': 'Male' }, [{ statusName: 'Character/Base gender', delta: 'Very masculine' }]);
    expect(values['Character/Base gender']).toBe('Very masculine');
  });

  it('создаёт новый статус, которого не было («You now have Y at N», GDD §5)', () => {
    const { values, changed } = applyEffects({}, [{ statusName: 'Rumour/Cinci Bordertown', delta: 1 }]);
    expect(values['Rumour/Cinci Bordertown']).toBe(1);
    // before === undefined — статус появился впервые
    expect(changed[0].before).toBeUndefined();
  });

  it('несколько эффектов применяются последовательно, каждый даёт свой changed', () => {
    const { values, changed } = applyEffects(
      { 'Skill/Observation': 35 },
      [
        { statusName: 'Skill/Observation', delta: 1 }, // «навык растёт за попытку независимо от исхода» (GDD §5)
        { statusName: 'Mental health/Psychosis', delta: 1 }, // цена успеха (GDD §5)
      ],
    );
    expect(values['Skill/Observation']).toBe(36);
    expect(values['Mental health/Psychosis']).toBe(1);
    expect(changed).toHaveLength(2);
  });

  it('не мутирует входной словарь', () => {
    const input = { 'w/Accuracy': 40 };
    applyEffects(input, [{ statusName: 'w/Accuracy', delta: -5 }]);
    expect(input['w/Accuracy']).toBe(40);
  });

  it('бросает на некорректном имени статуса (без неймспейса)', () => {
    expect(() => applyEffects({}, [{ statusName: 'Hacking', delta: 1 }])).toThrow(/некорректное имя/);
  });
});
