// Card window (GDD §4): flavor, частота, CARD REQUIREMENTS бейджи, [ Verb ] с затратами.
import { useWorldStore } from '../core/world-store';
import { valuesWithDerived } from '../core/world-store';
import type { CardAction, Requirements } from '../cards/types';
import { findCard } from '../cards/hand';
import { useCardStore } from '../cards/card-store';

/** Требования карты (массив имён статусов): какие отсутствуют в мире как числа. */
function missingRequirements(reqs: Requirements | undefined): string[] {
  if (!reqs || reqs.length === 0) return [];
  const w = useWorldStore.getState();
  const all = valuesWithDerived(w.values, w.derivedStatuses);
  return reqs.filter((name) => typeof all[name] !== 'number');
}

/** Строка затрат действия: −N AP · +2h · −10cr. */
function costText(a: CardAction): string {
  const parts: string[] = [];
  if (a.apCost) parts.push(`−${a.apCost} AP`);
  if (a.timeCostHours) parts.push(`+${a.timeCostHours}h`);
  if (a.creditsCost) parts.push(`−${a.creditsCost}cr`);
  return parts.join(' · ');
}

export function CardWindow({ cardId }: { cardId: string }) {
  const decks = useCardStore((s) => s.decks);
  const playCard = useCardStore((s) => s.playCard);
  const discardCard = useCardStore((s) => s.discardCard);
  const closeCardWindow = useCardStore((s) => s.closeCardWindow);

  // Реактивные значения для гейтинга (AP/credits/dayOver меняются от действий).
  const apLeft = useWorldStore((s) => s.apLeft);
  const money = useWorldStore((s) => s.money);
  const dayOver = useWorldStore((s) => s.dayOver);

  const card = findCard(decks, cardId);
  if (!card) return null;

  // Стрелочные функции (не hoisted): TS видит суженный тип `card` после раннего возврата.
  const canAfford = (a: CardAction): boolean => {
    return (a.apCost ?? 0) <= apLeft && (a.creditsCost ?? 0) <= money;
  };

  /** Исполнение действия: траты + эффекты в world, затем карта уходит в колоду. */
  const perform = (a: CardAction): void => {
    const ws = useWorldStore.getState();
    try {
      ws.spend({ apCost: a.apCost, timeCostHours: a.timeCostHours }, a.effects);
      if (a.creditsCost) ws.spendCredits(a.creditsCost);
    } catch {
      return; // не хватило AP/кредитов — окно остаётся открытым
    }
    playCard(card.id);
  }

  const missing = missingRequirements(card.requirements);
  const reqsMet = missing.length === 0;
  const reqList = (card.requirements ?? []).join(' · ');

  return (
    <div data-testid="card-window" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-mono">
      <div className="w-full max-w-lg border border-cyber-line bg-cyber-panel shadow-xl">
        {/* Заголовок + CARD REQUIREMENTS бейдж (GDD §4) */}
        <div className="flex items-start justify-between gap-2 border-b border-cyber-line px-4 py-3">
          <h3 className="text-sm uppercase tracking-widest text-cyber-orange">{card.title}</h3>
          {reqList && (
            <span data-testid="card-requirements" className={`whitespace-nowrap px-2 py-1 text-[10px] uppercase ${reqsMet ? 'bg-cyber-purple/20 text-cyber-purple' : 'bg-cyber-red/20 text-cyber-red'}`}>
              Requires: {reqList}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 px-4 py-3">
          {/* Flavor */}
          {card.flavor && <p className="text-xs italic text-cyber-dim">{card.flavor}</p>}
          {/* Частота (GDD §4: ежедневные карты помечаются) */}
          {card.daily && (
            <p data-testid="daily-note" className="text-[10px] uppercase tracking-widest text-cyber-purple">
              This card comes to you once a day.
            </p>
          )}

          {/* Список действий: [ Verb ] + затраты; недоступные — серые с превью затрат */}
          <div className="flex flex-col gap-1">
            {card.actions.map((a, i) => {
              const enabled = !dayOver && reqsMet && canAfford(a);
              return (
                <button
                  key={i}
                  type="button"
                  data-testid={`card-action-${i}`}
                  disabled={!enabled}
                  onClick={() => perform(a)}
                  className="flex items-center justify-between gap-2 border border-cyber-line px-3 py-2 text-left text-xs hover:border-cyber-orange disabled:opacity-50"
                >
                  <span>
                    [ {a.verb} ]{' '}
                    {a.successChance !== undefined && (
                      <span data-testid={`success-chance-${i}`} className="text-cyber-blue">[ Success: {Math.round(a.successChance)}% ]</span>
                    )}
                  </span>
                  <span className="whitespace-nowrap text-cyber-dim">{costText(a)}</span>
                </button>
              );
            })}
          </div>

          {/* Гейтинг: день закончился / не хватает статусов */}
          {dayOver && (
            <p data-testid="card-gated-dayover" className="text-[10px] uppercase tracking-widest text-cyber-dim">
              The day is over — actions wait for the next one.
            </p>
          )}
          {!reqsMet && !dayOver && (
            <p data-testid="card-gated-requirements" className="text-[10px] uppercase tracking-widest text-cyber-red">
              Missing: {missing.join(' · ')}
            </p>
          )}

          {/* DISCARD / CLOSE («Not right now» — defer, карта остаётся в руке) */}
          <div className="flex items-center justify-end gap-2 border-t border-cyber-line pt-3">
            <button type="button" data-testid="card-discard" onClick={() => discardCard(card.id)} className="border border-cyber-red/50 px-3 py-1 text-xs uppercase hover:border-cyber-red">
              Discard
            </button>
            <button type="button" data-testid="card-close" onClick={closeCardWindow} className="border border-cyber-line px-3 py-1 text-xs uppercase hover:border-cyber-orange">
              Close / Not right now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
