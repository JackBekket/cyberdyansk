// Story view (GDD §4): баннеры колод + рука фиксированных слотов + действия локации.
import { useWorldStore } from '../core/world-store';
import { currentHandSize } from '../core/world-store';
import type { Card, Deck } from '../cards/types';
import { useCardStore } from '../cards/card-store';
import { CardWindow } from './CardWindow';

/** Баннер колоды: название + счётчик карт; клик = добор в пустые слоты за AP. */
function DeckBanner({ deck }: { deck: Deck }) {
  const poolCount = useCardStore((s) => (s.handState?.pools[deck.deckId] ?? []).length);
  const handSlots = useCardStore((s) => s.handState?.slots.length ?? currentHandSize(useWorldStore.getState()));
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

export function StoryView() {
  const decks = useCardStore((s) => s.decks);
  const handState = useCardStore((s) => s.handState);
  const activeCardId = useCardStore((s) => s.activeCardId);
  const dayOver = useWorldStore((s) => s.dayOver);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
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

      {/* Действия локации (пока заглушка — приедут с контентом GDD §10) */}
      {dayOver ? null : (
        <p className="font-mono text-xs text-cyber-dim">Location actions will appear here once location content is in.</p>
      )}

      {/* Окно карты поверх контента */}
      {activeCardId && <CardWindow cardId={activeCardId} />}
    </div>
  );
}
