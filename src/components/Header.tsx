import React from 'react';
import { AppTheme, TabType, UserStats } from '../types';
import { soundFX } from '../utils/audio';

interface HeaderProps {
  theme: AppTheme;
  activeTab: TabType;
  userStats: UserStats;
  onProfileClick: () => void;
  onToggleTheme: () => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  activeTab,
  userStats,
  onProfileClick,
  onToggleTheme,
  title,
  showBack,
  onBack,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 w-full z-40 backdrop-blur-xl transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#0b0f19]/90 border-white/5 text-[#dfe2f1] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-[#e8eaf0]/90 border-white/40 text-[#1e2433] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="h-14 px-4 flex items-center justify-between max-w-md mx-auto w-full">
        {/* Left Side: Brand Logo & Title (No Hamburger Icon) */}
        <div className="flex items-center gap-2.5">
          {showBack ? (
            <button
              aria-label="Go back"
              onClick={() => {
                soundFX.playClick();
                onBack?.();
              }}
              className={`w-9 h-9 rounded-xl neu-raised flex items-center justify-center active:neu-pressed transition-all ${
                isDark ? 'bg-[#151b28] text-slate-200' : 'bg-[#e8eaf0] text-[#1e2433]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          ) : (
            <div
              className={`w-9 h-9 rounded-xl neu-raised flex items-center justify-center p-1.5 overflow-hidden ${
                isDark ? 'bg-[#151b28]' : 'bg-[#e8eaf0]'
              }`}
            >
              <div className="w-full h-full rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {`{ }`}
              </div>
            </div>
          )}

          {title ? (
            <h1 className="font-['Outfit'] text-base font-bold text-inherit truncate">
              {title}
            </h1>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-['Outfit'] text-lg font-bold tracking-tight text-inherit">
                CodeDo
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {activeTab === 'learn'
                  ? 'LEARN'
                  : activeTab === 'practice'
                  ? 'PRACTICE'
                  : activeTab === 'leaderboard'
                  ? 'LEADERBOARD'
                  : 'PROFILE'}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Profile Avatar Button (No Streak, Star, or Gems in Toolbar) */}
        <div className="flex items-center gap-2">
          {/* Quick Theme Toggle */}
          <button
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            onClick={() => {
              soundFX.playClick();
              onToggleTheme();
            }}
            className={`w-9 h-9 rounded-xl neu-raised flex items-center justify-center active:neu-pressed transition-colors ${
              isDark
                ? 'bg-[#151b28] text-amber-400 hover:text-amber-300'
                : 'bg-[#e8eaf0] text-slate-600 hover:text-indigo-600'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Profile Avatar Button */}
          <button
            aria-label="User Profile"
            onClick={() => {
              soundFX.playClick();
              onProfileClick();
            }}
            className={`w-9 h-9 rounded-xl neu-raised flex items-center justify-center active:neu-pressed transition-colors ${
              isDark
                ? 'bg-[#151b28] text-slate-200 hover:text-indigo-400'
                : 'bg-[#e8eaf0] text-slate-700 hover:text-indigo-600'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
