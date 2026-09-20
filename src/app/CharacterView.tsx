// CharacterView — РЕАЛЬНАЯ вёрстка по GDD §3 (PLAN Phase 2):
// секции Skills/Moods/Menaces/Mutations + Character/Body, статусы из store с дельтами, фильтр by name.
import { useMemo, useState } from 'react';
import { useWorldStore } from '../core/world-store';
import type { ChangedStatus } from '../core/effect';
import { groupStatusesForCharacter } from './status-groups';

/** Дельта за период по имени статуса: берём последнее изменение из журнала дня (GDD §3 — игра хранит тренд). */
function deltaByName(dayChanges: ChangedStatus[], name: string): number | null {
  for (let i = dayChanges.length - 1; i >= 0; i--) {
    const c = dayChanges[i];
    if (c.name === name && typeof c.after === 'number' && typeof c.before === 'number') {
      return c.after - c.before;
    }
  }
  return null;
}

export function CharacterView() {
  const values = useWorldStore((s) => s.values);
  const dayChanges = useWorldStore((s) => s.dayChanges);
  const [filter, setFilter] = useState(''); // фильтр by name (GDD §7/§3: «фильтр *by name*»)

  const sections = useMemo(
    () => groupStatusesForCharacter(values),
    [values],
  );

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <input
        data-testid="character-filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by name..."
        className="w-64 border border-cyber-line bg-cyber-panel px-2 py-1 text-sm outline-none focus:border-cyber-blue"
      />

      {sections.map((section) => {
        const names = section.names.filter((n) => n.toLowerCase().includes(filter.trim().toLowerCase()));
        if (names.length === 0) return null;
        return (
          <section key={section.title}>
            <h2 className="mb-2 border-b border-cyber-line pb-1 text-xs tracking-widest text-cyber-dim">{section.title}</h2>
            <ul className="space-y-1">
              {names.map((name) => (
                <li key={name} className="flex items-center justify-between gap-4 border-b border-cyber-line/40 py-0.5 text-sm">
                  <span>{name.split('/').pop()}</span>
                  <span className="flex items-center gap-2">
                    {deltaByName(dayChanges, name) !== null && (
                      <DeltaBadge name={name} dayChanges={dayChanges} />
                    )}
                    <span className="tabular-nums text-cyber-text">{String(values[name])}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {sections.length === 0 && (
        <p className="text-sm text-cyber-dim">No statuses yet — create a character in Phase 3.</p>
      )}
    </div>
  );
}

/** Цветной бейдж дельты: (+2) зелёный, (−3) красный (GDD §3). */
function DeltaBadge({ name, dayChanges }: { name: string; dayChanges: ChangedStatus[] }) {
  const delta = deltaByName(dayChanges, name);
  if (delta === null || delta === 0) return null;
  return <span className={delta > 0 ? 'text-cyber-green' : 'text-cyber-red'}>({delta > 0 ? `+${delta}` : `${delta}`})</span>;
}
