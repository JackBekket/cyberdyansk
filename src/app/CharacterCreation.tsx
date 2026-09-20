// Экран создания персонажа (PLAN Phase 3): имя + базовые текстовые статусы (GDD §Character).
// После «New game» мир создаётся через createNewWorld и попадает в StoryView.

import { useState, type FormEvent } from 'react';
import { useWorldStore } from '../core/world-store';
import { createNewWorld, type CharacterProfile } from '../core/new-game';
import { saveWorld } from '../core/persistence';

export function CharacterCreation() {
  const [name, setName] = useState('');
  const [baseGender, setBaseGender] = useState('Very masculine');
  const [preferredStyle, setPreferredStyle] = useState('Punk');
  const [yourTime, setYourTime] = useState('A long evening ahead');
  const [yourLife, setYourLife] = useState('Held together by neon and spite');

  function startGame(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const profile: CharacterProfile = {
      name: name.trim(),
      baseGender,
      preferredStyle,
      yourTime,
      yourLife,
    };

    // Создаём стартовый мир и загружаем его в world store (Phase 3 → StoryView).
    const world = createNewWorld(profile);
    useWorldStore.setState({ ...world, location: 'cinci-bordertown' });

    // Сохранение мира в localStorage — задел на save/load.
    saveWorld({ ...world, location: 'cinci-bordertown', dayChanges: [] });
  }

  const field = 'w-full border border-cyber-line bg-cyber-panel px-2 py-1 text-sm outline-none focus:border-cyber-blue';

  return (
    <div className="flex h-full items-center justify-center p-6">
      <form onSubmit={startGame} className="w-full max-w-md space-y-4 border border-cyber-line bg-cyber-panel p-6">
        <h1 className="text-lg font-bold tracking-widest text-cyber-orange">NEW GAME</h1>
        <p className="text-xs text-cyber-dim">Cinci Bordertown. The grid hums. Who are you?</p>

        <label className="block text-sm">
          <span className="mb-1 block text-xs text-cyber-dim">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className={field} />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-xs text-cyber-dim">Base gender</span>
          <input value={baseGender} onChange={(e) => setBaseGender(e.target.value)} className={field} />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-xs text-cyber-dim">Preferred style</span>
          <input value={preferredStyle} onChange={(e) => setPreferredStyle(e.target.value)} className={field} />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-xs text-cyber-dim">Your time</span>
          <input value={yourTime} onChange={(e) => setYourTime(e.target.value)} className={field} />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-xs text-cyber-dim">Your life</span>
          <input value={yourLife} onChange={(e) => setYourLife(e.target.value)} className={field} />
        </label>

        <button type="submit" disabled={!name.trim()}
          className="w-full border border-cyber-orange bg-cyber-orange/10 px-3 py-2 text-sm font-bold tracking-widest text-cyber-orange disabled:opacity-40">
          ENTER THE BORDER TOWN
        </button>
      </form>
    </div>
  );
}
