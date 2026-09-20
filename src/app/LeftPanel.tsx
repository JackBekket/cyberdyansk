// Левая панель — контекстный дайджест (GDD §11, PLAN Phase 2).
// Постоянно: портрет, Actions, кредиты, локация. Динамические секции собираются из store
// (компонент Digest { sections }) — игра сама решает, какие статусы релевантны контексту.
// Панель реактивна: подписывается на world-store через селекторы, пересобирается при изменениях мира.

import type { ReactNode } from 'react';
import { useWorldStore } from '../core/world-store';
import { canPickUpItem, canReloadOrSwapEquipment } from '../core/world-store';

/** Секция дайджеста: заголовок + произвольное содержимое (GDD §11 — панель пересобирается). */
export interface DigestSection {
  title: string;
  content: ReactNode;
}

/** Компонент Digest: рендерит список секций. */
export function Digest({ sections }: { sections: DigestSection[] }) {
  if (sections.length === 0) return null;
  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <section key={s.title}>
          <h3 className="mb-1 text-[10px] tracking-widest text-cyber-dim">{s.title}</h3>
          {s.content}
        </section>
      ))}
    </div>
  );
}

/** Статусная строка «Название: значение» — переиспользуется в динамических секциях. */
function StatusRow({ name }: { name: string }) {
  const value = useWorldStore((s) => s.values[name]);
  if (value === undefined) return null; // статус ещё не создан в мире → строка исчезает
  return (
    <li className="flex justify-between gap-2">
      <span>{name.split('/').pop()}</span>
      <span className="tabular-nums">{String(value)}</span>
    </li>
  );
}

/** Динамические секции слева собираются из состояния мира (GDD §9: «состав хаба собирается из состояния мира»). */
function ContextSections() {
  // Подписка на словарь статусов — панель пересобирается при любом изменении мира.
  const values = useWorldStore((s) => s.values);

  const sections: DigestSection[] = [];

  // The city — погодные статусы, если есть в мире (GDD §11)
  const weather = ['Environment/Temperature', 'Environment/Glare', 'Environment/Sunlight'].filter((n) => n in values);
  if (weather.length > 0) {
    sections.push({ title: 'THE CITY', content: <ul className="space-y-0.5 text-sm">{weather.map((n) => <StatusRow key={n} name={n} />)}</ul> });
  }

  // Threats & hazards — статусы розыска/угроз, если активны (GDD §3 Menaces)
  const threats = Object.keys(values).filter((n) => n.startsWith('Target/') || n.startsWith('Menace/'));
  if (threats.length > 0) {
    sections.push({ title: 'THREATS & HAZARDS', content: <ul className="space-y-0.5 text-sm">{threats.map((n) => <StatusRow key={n} name={n} />)}</ul> });
  }

  // Need + Carpe diem — всегда релевантны (GDD §11)
  const carpeDiem = useWorldStore((s) => s.carpeDiem);
  sections.push({ title: 'NEED / CARPE DIEM', content: <p className="text-sm">Carpe diem charges: {carpeDiem}</p> });

  return <Digest sections={sections} />;
}

export function LeftPanel() {
  const money = useWorldStore((s) => s.money);
  const location = useWorldStore((s) => s.location);
  const stashItems = useWorldStore((s) => s.stashItems);
  const carryingCapacity = useWorldStore((s) => s.carryingCapacity);

  // Действия левой панели (GDD §11): refresh / clear hand / binge mode / buy credits.
  // Логика — в своих фазах; пока заглушки-кнопки (refresh станет добором руки в Phase 4).
  const panelActions = ['Refresh', 'Clear hand', 'Binge mode', 'Buy credits'];

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4 overflow-y-auto border-r border-cyber-line bg-cyber-panel p-3">
      {/* Портрет — заглушка до Phase 3 */}
      <div className="flex h-28 items-center justify-center border border-cyber-line text-xs text-cyber-dim">
        PORTRAIT
      </div>

      <section>
        <h3 className="mb-1 text-[10px] tracking-widest text-cyber-dim">ACTIONS</h3>
        <div className="flex flex-wrap gap-1">
          {panelActions.map((a) => (
            <button key={a} type="button" disabled title="Логика — в соответствующей фазе плана"
              className="border border-cyber-line px-2 py-0.5 text-xs text-cyber-dim">
              {a}
            </button>
          ))}
        </div>
      </section>

      <section className="text-sm">
        <p>Credits: <span className="tabular-nums">${money}</span></p>
        <p>Location: <span className="capitalize">{location.replace(/-/g, ' ')}</span></p>
      </section>

      {/* Контекстный дайджест — секции из состояния мира */}
      <ContextSections />

      {/* Быстрый статус гейтинга (GDD §2) */}
      <div className="mt-auto space-y-1 text-xs">
        <p>Stash: {stashItems}</p>
        <p>Carrying capacity: {carryingCapacity}{canPickUpItem({ carryingCapacity }) ? '' : ' — blocked'}</p>
        {!canReloadOrSwapEquipment({ stashItems }) && (
          <p className="text-cyber-red">Stash empty</p>
        )}
      </div>
    </aside>
  );
}
