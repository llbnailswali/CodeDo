import React from 'react';
import { AppTheme, TabType, UserStats } from '../types';
import { soundFX } from '../utils/audio';

interface HeaderProps {
  theme: AppTheme;
  activeTab: TabType;
  onOpenDrawer: () => void;
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
  onOpenDrawer,
  userStats,
  onProfileClick,
  onToggleTheme,
  title,
  showBack,
  onBack,
}) => {
  return (
    <header
      className={`sticky top-0 w-full z-40 backdrop-blur-xl transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#0b0f19]/90 border-b border-white/[0.06] text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-[#f8f9fb]/90 border-b border-black/[0.04] text-[#191c1e] shadow-[0_1px_8px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto w-full">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              aria-label="Go back"
              onClick={() => {
                soundFX.playClick();
                onBack?.();
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-all ${
                theme === 'dark'
                  ? 'bg-[#162036] border border-[#2a374f] text-slate-200 hover:border-indigo-400/40'
                  : 'bg-[#f8f9fb] neumorph-raised-soft text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          ) : (
            <button
              aria-label="Open drawer navigation"
              onClick={() => {
                soundFX.playClick();
                onOpenDrawer();
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-transform ${
                theme === 'dark'
                  ? 'bg-[#131b2e] border border-white/10 text-[#dfe2f1] shadow-inner'
                  : 'bg-[#f8f9fb] neumorph-raised-soft text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
          )}

          {title ? (
            <h1 className="font-['Outfit'] text-[18px] font-bold text-inherit truncate ml-1">
              {title}
            </h1>
          ) : (
            <div className="flex items-center gap-2 pl-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-['Outfit'] text-[15px] font-bold shadow-md ${
                  theme === 'dark'
                    ? 'bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-indigo-500/30'
                    : 'bg-[#3748dd] text-white'
                }`}
              >
                {`{ }`}
              </div>
              <span className="font-['Outfit'] text-[22px] font-bold tracking-tight text-inherit">
                Code
                <span className={theme === 'dark' ? 'text-[#818cf8]' : 'text-[#3748dd]'}>
                  Do
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Right Side Gamified Stats or User Icon */}
        <div className="flex items-center gap-2">
          {!showBack && (
            <>
              {/* Streak */}
              <div
                className={`h-8 px-2.5 rounded-full flex items-center gap-1.5 transition-all ${
                  theme === 'dark'
                    ? 'bg-[#1a2336] border border-[#2d3b55]'
                    : 'bg-[#f8f9fb] neumorph-raised-soft'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px] text-orange-500 icon-filled drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]"
                >
                  local_fire_department
                </span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-inherit">
                  {userStats.streak}
                </span>
              </div>

              {/* Stars */}
              <div
                className={`h-8 px-2.5 rounded-full flex items-center gap-1.5 transition-all ${
                  theme === 'dark'
                    ? 'bg-[#1a2336] border border-[#2d3b55]'
                    : 'bg-[#f8f9fb] neumorph-raised-soft'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px] text-amber-400 icon-filled drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                >
                  star
                </span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-inherit">
                  {(userStats.stars / 1000).toFixed(1)}k
                </span>
              </div>

              {/* Gems */}
              <div
                className={`h-8 px-2.5 rounded-full flex items-center gap-1.5 transition-all ${
                  theme === 'dark'
                    ? 'bg-[#1a2336] border border-[#2d3b55]'
                    : 'bg-[#f8f9fb] neumorph-raised-soft'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    theme === 'dark' ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]' : 'text-[#3748dd]'
                  }`}
                >
                  diamond
                </span>
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-inherit">
                  {userStats.gems}
                </span>
              </div>
            </>
          )}

          {/* Theme Quick Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              onToggleTheme();
            }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-transform ${
              theme === 'dark'
                ? 'bg-[#162036] border border-[#2d3b55] text-amber-300 hover:text-amber-200 shadow-sm'
                : 'bg-[#f8f9fb] neumorph-raised-soft text-slate-700 hover:text-[#3748dd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Profile / Avatar */}
          <button
            onClick={() => {
              soundFX.playClick();
              onProfileClick();
            }}
            aria-label="View user profile"
            className={`w-9 h-9 rounded-full flex items-center justify-center ml-0.5 active:scale-95 transition-transform ${
              theme === 'dark'
                ? 'bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1.5px] shadow-sm'
                : 'bg-[#3748dd] text-white shadow-md'
            }`}
          >
            <div className={`w-full h-full rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#131b2e]' : 'bg-[#3748dd]'
            }`}>
              <span className={`material-symbols-outlined text-[19px] ${
                theme === 'dark' ? 'text-indigo-200' : 'text-white'
              }`}>
                person
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
