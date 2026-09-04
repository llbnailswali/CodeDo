import React from 'react';
import { AppTheme, TabType } from '../types';
import { soundFX } from '../utils/audio';

interface NavigationProps {
  theme: AppTheme;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  theme,
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'learn' as TabType, label: 'Learn', icon: 'school' },
    { id: 'practice' as TabType, label: 'Practice', icon: 'extension' },
    { id: 'leaderboard' as TabType, label: 'Rankings', icon: 'emoji_events' },
    { id: 'profile' as TabType, label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-2">
      <div className="px-4 pb-2 pt-1 max-w-md mx-auto">
        <div
          className={`pointer-events-auto h-16 w-full rounded-full flex items-center justify-between transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-[#101626]/95 border border-white/10 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.8)] px-2'
              : 'bg-[#f8f9fb]/95 backdrop-blur-xl rounded-full neumorph-raised px-1.5'
          }`}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectTab(tab.id);
                }}
                className={`flex-1 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-indigo-500/20 text-white border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                      : 'bg-[#3748dd]/10 text-[#3748dd] font-semibold neumorph-active-pill'
                    : theme === 'dark'
                    ? 'text-[#94a3b8] hover:text-white'
                    : 'text-[#454655] hover:text-[#191c1e]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform ${
                    isActive ? 'scale-110' : ''
                  } ${isActive && theme === 'dark' ? 'text-indigo-300 drop-shadow-[0_0_6px_rgba(165,180,252,0.8)]' : ''}`}
                >
                  {tab.icon}
                </span>
                <span className="font-['Outfit'] text-[10px] font-bold mt-0.5 tracking-wider uppercase">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
