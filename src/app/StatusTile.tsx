// StatusTile — ЕДИНЫЙ формат отчётности (GDD §12.2): один UI-компонент для
// результата действия И сводки дня. Рендерит ChangedStatus из core/effect.ts.
import type { ChangedStatus } from '../core/effect';

/** Форматирует значение статуса: числа — как есть, текст — как строку. */
function formatValue(v: number | string): string {
  return typeof v === 'number' ? String(v) : v;
}

interface StatusTileProps {
  changed: ChangedStatus;
}

/**
 * Тайл изменения статуса: «Skill/Observation is increasing (current: 35)».
 * Числовой статус с дельтой — цветной бейдж (+2 зелёный / −3 красный, GDD §3);
 * новый статус (before === undefined) — «You now have ...»; текстовый — замена значения.
 */
export function StatusTile({ changed }: StatusTileProps) {
  const isNumeric = typeof changed.after === 'number';
  const delta = isNumeric && typeof changed.before === 'number' ? changed.after - changed.before : null;

  let headline: string;
  if (changed.before === undefined) {
    headline = `You now have ${formatValue(changed.after)} at ${shortName(changed.name)}`; // «You now have Y at N» (GDD §5)
  } else if (delta !== null && delta > 0) {
    headline = `${shortName(changed.name)} is increasing`; // «Skill/Observation is increasing (current: 35)»
  } else if (delta !== null && delta < 0) {
    headline = `${shortName(changed.name)} is decreasing`;
  } else {
    headline = shortName(changed.name);
  }

  return (
    <div className="border border-cyber-line bg-cyber-panel p-2">
      <p className="text-xs text-cyber-dim">{shortName(changed.name)}</p>
      <p className="mt-1 flex items-baseline gap-2 text-sm">
        <span>{headline}</span>
        {delta !== null && delta !== 0 && (
          // Дельта за период — цветной бейдж (GDD §3)
          <span className={delta > 0 ? 'text-cyber-green' : 'text-cyber-red'}>
            ({delta > 0 ? `+${delta}` : `${delta}`})
          </span>
        )}
      </p>
      {isNumeric && (
        <p className="mt-1 text-xs text-cyber-dim">current: {formatValue(changed.after)}</p>
      )}
    </div>
  );
}

/** Короткое имя статуса для заголовка: «Skill/Observation» → «Observation». */
function shortName(name: string): string {
  const slash = name.lastIndexOf('/');
  return slash >= 0 ? name.slice(slash + 1) : name;
}
