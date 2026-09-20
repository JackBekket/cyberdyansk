// Верхние вкладки (GDD §11): STORY / WEAPONS / OUTFIT / SOCKET / EQUIPMENT / INFO / INVENTORY / CHARACTER / PEOPLE / PROGRESS / QUESTS / JOBS / WORLD + MENU.
export const TABS = [
  'STORY',
  'WEAPONS',
  'OUTFIT',
  'SOCKET',
  'EQUIPMENT',
  'INFO',
  'INVENTORY',
  'CHARACTER',
  'PEOPLE',
  'PROGRESS',
  'QUESTS',
  'JOBS',
  'WORLD',
] as const;

export type TabId = (typeof TABS)[number];

/** Заглушка вкладки: активная подсвечивается, содержимое появится в своих фазах. */
export function StubTab({ tab }: { tab: TabId }) {
  return <div className="p-6 text-cyber-dim">{tab} — coming in a later phase</div>;
}
