// Shell — каркас приложения по раскладке GDD §11 (PLAN Phase 2):
// верхние вкладки + левая/правая панели + содержимое активной вкладки.

import { useState } from 'react';
import { TABS, StubTab, type TabId } from './tabs';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { StoryView } from './StoryView';
import { CharacterView } from './CharacterView';

export function Shell() {
  const [activeTab, setActiveTab] = useState<TabId>('STORY');

  return (
    <div className="flex h-full flex-col">
      {/* Верхние вкладки + MENU (GDD §11) */}
      <nav className="flex items-center gap-1 border-b border-cyber-line bg-cyber-panel px-2 py-1 text-xs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            // Активная вкладка подсвечивается оранжевым (цвет оригинала)
            className={
              activeTab === tab
                ? 'px-2 py-1 font-bold text-cyber-orange'
                : 'px-2 py-1 text-cyber-dim hover:text-cyber-text'
            }
          >
            {tab}
          </button>
        ))}
        <button type="button" className="ml-auto px-2 py-1 text-cyber-dim hover:text-cyber-text">
          MENU
        </button>
      </nav>

      {/* Раскладка: левая панель | контент | правая панель */}
      <div className="flex min-h-0 flex-1">
        <LeftPanel />
        <main className="min-w-0 flex-1 overflow-y-auto bg-cyber-bg">
          {activeTab === 'STORY' && <StoryView />}
          {activeTab === 'CHARACTER' && <CharacterView />}
          {activeTab !== 'STORY' && activeTab !== 'CHARACTER' && <StubTab tab={activeTab} />}
        </main>
        <RightPanel />
      </div>
    </div>
  );
}
