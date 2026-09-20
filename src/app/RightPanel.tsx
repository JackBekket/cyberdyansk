// Правая панель — контекстная (GDD §11, PLAN Phase 2):
// Daytime / Aggression / Comedown / Vehicle / деньги-stash + предупреждения о текущих проблемах.

import { useWorldStore } from '../core/world-store';
import { canPickUpItem, canReloadOrSwapEquipment } from '../core/world-store';
import { daytimeLabel, formatClock } from '../core/time-engine';

/** Предупреждения генерируются из условий мира (GDD §11: «You're out of stash...», «Your carrying capacity is also zero»). */
function buildWarnings(): string[] {
  const s = useWorldStore.getState();
  const warnings: string[] = [];
  if (!canReloadOrSwapEquipment({ stashItems: s.stashItems })) {
    warnings.push("You're out of stash: you won't be able to reload a weapon or change equipment.");
  }
  if (!canPickUpItem({ carryingCapacity: s.carryingCapacity })) {
    warnings.push('Your carrying capacity is also zero — you cannot pick up items.');
  }
  return warnings;
}

export function RightPanel() {
  const clockMinutes = useWorldStore((s) => s.clockMinutes);
  const money = useWorldStore((s) => s.money);
  const stashItems = useWorldStore((s) => s.stashItems);
  const stashCapacity = useWorldStore((s) => s.stashCapacity);

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto border-l border-cyber-line bg-cyber-panel p-3">
      {/* Daytime — метка времени суток + часы (GDD §11: «Early evening» + иконка) */}
      <section className="text-sm">
        <h3 className="mb-1 text-[10px] tracking-widest text-cyber-dim">DAYTIME</h3>
        <p>{daytimeLabel(clockMinutes)} · {formatClock(clockMinutes)}</p>
      </section>

      {/* Aggression / Comedown — статусы мира, если есть (GDD §11) */}
      <MoodLine name="Mood/Aggression" label="AGGRESSION" fallback="Feeling twitchy..." />
      <MoodLine name="Mood/Comedown" label="COMEDOWN / AMPHETAMINES" fallback="—" />

      {/* Vehicle — транспорт (GDD §11: «Flatbed truck»); сущность появится в Phase 7 */}
      <section className="text-sm">
        <h3 className="mb-1 text-[10px] tracking-widest text-cyber-dim">VEHICLE</h3>
        <p>Flatbed truck</p>
      </section>

      <section className="text-sm">
        <h3 className="mb-1 text-[10px] tracking-widest text-cyber-dim">MONEY / STASH</h3>
        <p>${money} · stash {stashItems}/{stashCapacity}</p>
      </section>

      {/* Предупреждения о текущих проблемах (GDD §5: гейтинг состоянием мира) */}
      <div className="mt-auto space-y-2">
        {buildWarnings().map((w) => (
          <p key={w} data-testid="warning" className="border border-cyber-red/50 bg-cyber-red/10 p-2 text-xs text-cyber-text">
            {w}
          </p>
        ))}
      </div>
    </aside>
  );
}

/** Строка статуса с fallback, если статус ещё не создан в мире. */
function MoodLine({ name, label, fallback }: { name: string; label: string; fallback: string }) {
  const value = useWorldStore((s) => s.values[name]);
  return (
    <section className="text-sm">
      <h3 className="mb-1 text-[10px] tracking-widest text-cyber-dim">{label}</h3>
      <p>{value !== undefined ? String(value) : fallback}</p>
    </section>
  );
}
