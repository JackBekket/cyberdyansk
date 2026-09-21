// Корневой компонент: управляет потоком игры (PLAN Phase 3).
// Есть сохранение в localStorage → загружаем мир и показываем Shell;
// нет → экран создания персонажа. После создания мира переходим в StoryView/Shell.

import { useEffect, useState } from 'react';
import { useWorldStore } from '../core/world-store';
import type { WorldSnapshot } from '../core/world-store';
import { loadWorld, saveWorld } from '../core/persistence';
import type { PersistedWorld } from '../core/persistence';
import { useCardStore } from '../cards/card-store';
import { loadStarterDecks } from '../cards/starter-content';
import { Shell } from './Shell';
import { CharacterCreation } from './CharacterCreation';

/** Мир «начат», если персонаж создан (есть текстовые статусы Character/*). */
function hasStarted(world: WorldSnapshot): boolean {
  return 'Character/Base gender' in world.values;
}

export function App() {
  const [started, setStarted] = useState<boolean>(() => hasStarted(useWorldStore.getState()));

  // При загрузке приложения читаем сохранение и восстанавливаем мир (включая руку).
  useEffect(() => {
    if (hasStarted(useWorldStore.getState())) return;
    const saved: PersistedWorld | null = loadWorld();
    if (saved) {
      useWorldStore.setState({ ...pickSnapshot(saved), location: saved.location, dayChanges: saved.dayChanges });
      // Рука: восстанавливаем сохранённое состояние или раздаём заново из стартовых колод.
      const decks = loadStarterDecks();
      if (saved.handState) useCardStore.setState({ decks, handState: saved.handState });
      else useCardStore.getState().initDecks(decks);
      setStarted(true);
    }
  }, []);

  // Автосохранение при любом изменении мира (best-effort, задел на save/load).
  useEffect(() => {
    return useWorldStore.subscribe((state) => {
      if (!hasStarted(state)) return;
      const persisted: PersistedWorld = {
        ...pickSnapshot(state),
        location: state.location,
        dayChanges: state.dayChanges,
        handState: useCardStore.getState().handState, // рука переживает перезагрузку (Phase 4)
      };
      saveWorld(persisted);
    });
  }, []);

  // Переход из создания персонажа в игру. Подписка на появление Character/* в мире;
  // раздаём стартовую руку из колод YAML (GDD §4).
  useEffect(() => {
    return useWorldStore.subscribe((state) => {
      if (!hasStarted(state)) return;
      setStarted(true);
      const card = useCardStore.getState();
      if (card.handState === null) card.initDecks(loadStarterDecks()); // идемпотентно: уже раздавали — ничего не делаем
    });
  }, []);

  if (!started) return <CharacterCreation />;
  return <Shell />;
}

/** Вытаскиваем сериализуемое ядро мира из состояния store (или сохранённого PersistedWorld). */
function pickSnapshot(s: WorldSnapshot): WorldSnapshot {
  return {
    dayNumber: s.dayNumber,
    apLeft: s.apLeft,
    clockMinutes: s.clockMinutes,
    dayOver: s.dayOver,
    values: s.values,
    money: s.money,
    stashItems: s.stashItems,
    stashCapacity: s.stashCapacity,
    carryingCapacity: s.carryingCapacity,
    carpeDiem: s.carpeDiem,
    handSizeBase: s.handSizeBase,
    handSizeModifiers: s.handSizeModifiers,
  };
}
