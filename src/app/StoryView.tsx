// Story view (GDD §4): баннеры колод + рука фиксированных слотов + действия локации.
import { useMemo } from 'react';
import { useWorldStore } from '../core/world-store';
import type { Card, Deck } from '../cards/types';
import type { LocationContent } from '../cards/types';
import { loadLocation } from '../cards/starter-content';
import { useCardStore } from '../cards/card-store';
import { CardWindow } from './CardWindow';

/** Строка затрат действия: −N AP · +2h (GDD §4: иконки −N/+N). */
function costText(a: { apCost?: number; timeCostHours?: number }): string {
  const parts: string[] = [];
  if (a.apCost) parts.push(`−${a.apCost} AP`);
  if (a.timeCostHours) parts.push(`+${a.timeCostHours}h`);
  return parts.join(' · ');
}

/** Сетка статичных действий локации из YAML (GDD §4: «ниже — статичная сетка действий локации»). */
function LocationActions({ location }: { location: LocationContent }) {
  const apLeft = useWorldStore((s) => s.apLeft);
  const dayOver = useWorldStore((s) => s.dayOver);

  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-mono text-xs uppercase tracking-widest text-cyber-dim">{location.title} — actions</h2>
      {location.actions.map((a, i) => {
        const affordable = (a.apCost ?? 0) <= apLeft;
        return (
          <button
            key={i}
            type="button"
            data-testid={`location-action-${i}`}
            disabled={dayOver || !affordable}
            onClick={() => {
              useWorldStore.getState().spend({ apCost: a.apCost, timeCostHours: a.timeCostHours }, a.effects);
            }}
            className="flex items-center justify-between gap-2 border border-cyber-line px-3 py-2 text-left font-mono text-xs hover:border-cyber-orange disabled:opacity-50"
          >
            <span>
              [ {a.verb} ]{' '}
              {a.successChance !== undefined && (
                <span className="text-cyber-blue">[ Success: {Math.round(a.successChance)}% ]</span>
              )}
            </span>
            <span className="whitespace-nowrap text-cyber-dim">{costText(a)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function StoryView() {
  const decks = useCardStore((s) => s.decks);
  const handState = useCardStore((s) => s.handState);
  const activeCardId = useCardStore((s) => s.activeCardId);
  const dayOver = useWorldStore((s) => s.dayOver);
  const location = useWorldStore((s) => s.location);
  // Уведомление о размере руки (GDD §4: «HAND SIZE TEMPORARILY INCREASED» / «has dropped»).
  const handSizeNotice = useWorldStore((s) => s.handSizeNotice);

  // Сетевое чтение YAML — один раз на локацию; при смене локации пересчитается.
  const locationContent = useMemo(() => loadLocation(location), [location]);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
      {/* Уведомление о размере руки — поверх контента; закрывается кликом (GDD §4) */}
      {handSizeNotice && (
        <button type="button" data-testid="hand-size-notice" onClick={() => useWorldStore.getState().dismissHandSizeNotice()}
          className="self-start border border-cyber-purple/50 bg-cyber-purple/10 px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-cyber-purple hover:border-cyber-purple">
          {handSizeNotice} ✕
        </button>
      )}

      {/* Баннеры колод */}
      {decks.length > 0 && handState ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {decks.map((d) => (
            <DeckBanner key={d.deckId} deck={d} />
          ))}
        </div>
      ) : (
        <p data-testid="story-placeholder" className="font-mono text-sm text-cyber-dim">
          Decks are being prepared — placeholder until the starter card list lands.
        </p>
      )}

      {/* Рука: фиксированные слоты, пустые места видны */}
      {handState && (
        <div className="flex flex-col gap-1">
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyber-dim">Hand</h2>
          <div data-testid="hand" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {handState.slots.map((card, i) => (
              <HandSlot key={i} card={card} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Действия локации из YAML (GDD §4/§9); при dayOver скрыты */}
      {locationContent && !dayOver && <LocationActions location={locationContent} />}

      {/* Окно карты поверх контента */}
      {activeCardId && <CardWindow cardId={activeCardId} />}
    </div>
  );
}

/** Баннер колоды: название + счётчик карт; клик = добор в пустые слоты за AP. */
function DeckBanner({ deck }: { deck: Deck }) {
  const poolCount = useCardStore((s) => (s.handState?.pools[deck.deckId] ?? []).length);
  const drawnCards = useCardStore((s) => {
    if (!s.handState || !s.decks.length) return 0;
    // карты руки, принадлежащие этой колоде (через decks)
    let n = 0;
    for (const c of s.handState.slots) {
      if (c && s.decks.find((d) => d.deckId === deck.deckId)?.cards.some((dc) => dc.id === c.id)) n += 1;
    }
    return n;
  });
  const apLeft = useWorldStore((s) => s.apLeft);
  const perCard = useWorldStore((s) => s.balance.drawApCostPerCard);
  const dayOver = useWorldStore((s) => s.dayOver);
  const drawFromDeck = useCardStore((s) => s.drawFromDeck);

  return (
    <button
      type="button"
      data-testid={`deck-banner-${deck.deckId}`}
      disabled={dayOver || poolCount === 0 || (perCard > 0 && apLeft < perCard)}
      onClick={() => drawFromDeck(deck.deckId)}
      title={poolCount === 0 ? 'Deck is empty' : `Draw a card into an empty hand slot (${perCard} AP)`}
      className="flex items-center justify-between gap-2 border border-cyber-line bg-cyber-panel px-3 py-2 text-left font-mono text-xs hover:border-cyber-orange disabled:opacity-50"
    >
      <span>
        {deck.title.toUpperCase()}{' '}
        <span className="text-cyber-dim">({drawnCards} in hand / {poolCount} left)</span>
      </span>
      <span className="whitespace-nowrap text-cyber-orange">{perCard > 0 && apLeft >= perCard ? `−${perCard} AP` : 'no AP'}</span>
    </button>
  );
}

/** Слот руки: карта (клик → CardWindow) или пустое место. */
function HandSlot({ card, index }: { card: Card | null; index: number }) {
  const openCardWindow = useCardStore((s) => s.openCardWindow);
  if (!card) {
    return <div data-testid={`hand-slot-${index}`} className="h-12 border border-dashed border-cyber-line" title="Empty slot — draw from a deck banner" />;
  }
  const isDaily = card.daily === true;
  return (
    <button
      type="button"
      data-testid={`hand-slot-${index}`}
      onClick={() => openCardWindow(card.id)}
      className="h-12 truncate border border-cyber-line bg-cyber-panel px-3 font-mono text-xs hover:border-cyber-orange"
    >
      {isDaily && <span className="text-cyber-purple">[DAILY] </span>}
      {card.title}
    </button>
  );
}
