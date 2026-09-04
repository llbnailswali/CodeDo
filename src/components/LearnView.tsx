import React from 'react';
import { AppTheme, UserStats } from '../types';
import { soundFX } from '../utils/audio';

interface LearnViewProps {
  theme: AppTheme;
  userStats: UserStats;
  onStartLesson: () => void;
  onOpenCurriculum: () => void;
  onSelectNode?: (nodeTitle: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  theme,
  userStats,
  onStartLesson,
  onOpenCurriculum,
  onSelectNode,
}) => {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-2 select-none">
      {/* Today's Goal Card */}
      <section className="w-full mt-2 mb-6">
        <div
          className={`w-full rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 ${
            theme === 'dark'
              ? 'dark-glass-card'
              : 'bg-[#f8f9fb] neumorph-raised'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  theme === 'dark'
                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse'
                    : 'bg-[#3748dd] animate-pulse'
                }`}
              />
              <span
                className={`font-['Outfit'] text-[11px] font-bold tracking-wider uppercase ${
                  theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#454655]'
                }`}
              >
                TODAY'S GOAL
              </span>
            </div>
            <div
              className={`h-6 px-2.5 rounded-full flex items-center ${
                theme === 'dark'
                  ? 'bg-[#0d1424] border border-[#2d3b55]'
                  : 'bg-[#f2f4f6] neumorph-active-pill'
              }`}
            >
              <span
                className={`font-['JetBrains_Mono'] text-xs font-bold ${
                  theme === 'dark' ? 'text-[#818cf8]' : 'text-[#3748dd]'
                }`}
              >
                {userStats.todayLessonsCompleted} / {userStats.todayGoal} Lessons
              </span>
            </div>
          </div>

          {/* Luminous / Inset Progress Bar */}
          <div
            className={`w-full h-3 rounded-full overflow-hidden p-0.5 ${
              theme === 'dark'
                ? 'bg-[#0d1424] border border-[#202c44]'
                : 'bg-[#eceef0] neumorph-active-pill'
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 w-2/3 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 shadow-[0_0_14px_rgba(99,102,241,0.8)]'
                  : 'bg-gradient-to-r from-[#3748dd] to-[#613ed2] shadow-[0_0_12px_rgba(55,72,221,0.5)]'
              }`}
            />
          </div>

          <div
            className={`flex items-center justify-between text-xs ${
              theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#454655]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[16px] text-amber-400 icon-filled drop-shadow-[0_0_5px_rgba(252,211,77,0.7)]"
              >
                hotel_class
              </span>
              <span
                className={`font-['Plus_Jakarta_Sans'] font-medium ${
                  theme === 'dark' ? 'text-[#cbd5e1]' : 'text-[#454655]'
                }`}
              >
                +150 XP bonus available today
              </span>
            </div>
            <span
              className={`font-['JetBrains_Mono'] font-bold ${
                theme === 'dark' ? 'text-cyan-300' : 'text-[#454655]'
              }`}
            >
              66%
            </span>
          </div>
        </div>
      </section>

      {/* World 01 Header & Streak Floating Pill */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <span
            className={`font-['Outfit'] text-[11px] font-bold tracking-widest uppercase block ${
              theme === 'dark'
                ? 'text-[#818cf8] drop-shadow-[0_0_8px_rgba(129,140,248,0.4)]'
                : 'text-[#3748dd]'
            }`}
          >
            LEARNING ODYSSEY
          </span>
          <h2 className="font-['Outfit'] text-2xl font-bold tracking-tight text-inherit">
            Kotlin Basics
          </h2>
        </div>
        <div
          className={`h-9 px-3 rounded-full flex items-center gap-1.5 shadow-md ${
            theme === 'dark'
              ? 'bg-[#162036] border border-[#2A374F] shadow-black/40'
              : 'bg-[#f8f9fb] neumorph-raised-soft'
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px] text-orange-500 animate-bounce icon-filled drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]"
          >
            local_fire_department
          </span>
          <span className="font-['Outfit'] text-xs font-bold text-inherit">
            12 Days Fire
          </span>
        </div>
      </div>

      {/* The Interactive Snake Path Canvas */}
      <div className="relative w-full py-4 min-h-[960px] select-none">
        {/* SVG Snake Guide Ribbon */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 380 960"
        >
          {/* Outer Soft Depth Track */}
          <path
            d="M 85 50 
               C 85 110, 190 110, 190 170 
               C 190 230, 295 230, 295 295 
               C 295 365, 205 365, 205 440 
               C 205 500, 85 500, 85 570 
               C 85 640, 190 640, 190 705
               C 190 770, 295 770, 295 845"
            stroke={theme === 'dark' ? '#182338' : '#e0e3e5'}
            strokeLinecap="round"
            strokeWidth="14"
          />

          {/* Inner Active/Glowing River Layer */}
          <path
            d="M 85 50 
               C 85 110, 190 110, 190 170 
               C 190 230, 295 230, 295 295"
            stroke={`url(#completedPathGlow_${theme})`}
            strokeLinecap="round"
            strokeWidth="6"
          />

          {/* Dashed forward line for uncompleted territory */}
          <path
            d="M 295 295 
               C 295 365, 205 365, 205 440 
               C 205 500, 85 500, 85 570 
               C 85 640, 190 640, 190 705
               C 190 770, 295 770, 295 845"
            stroke={theme === 'dark' ? '#334155' : '#c5c5d8'}
            strokeDasharray="6 8"
            strokeLinecap="round"
            strokeWidth="4"
          />

          <defs>
            <linearGradient id={`completedPathGlow_${theme}`} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor={theme === 'dark' ? '#06B6D4' : '#5B6CFF'} />
              <stop offset="100%" stopColor={theme === 'dark' ? '#6366F1' : '#8B6CFF'} />
            </linearGradient>
          </defs>
        </svg>

        {/* NODE 1: COMPLETED (LEFT) */}
        <div className="absolute left-6 top-3 flex flex-col items-center z-10 w-36">
          <button
            aria-label="Variables completed"
            onClick={() => {
              soundFX.playClick();
              onSelectNode?.('Variables');
            }}
            type="button"
            className={`w-16 h-16 rounded-full flex items-center justify-center relative active:scale-95 transition-transform ${
              theme === 'dark'
                ? 'dark-node-completed glow-emerald'
                : 'bg-[#f8f9fb] neumorph-raised'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-emerald-500/20 border border-emerald-400/40'
                  : 'bg-emerald-500/10'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px] font-bold">check</span>
              </div>
            </div>
            <div
              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-[#122324] border border-amber-400/60 shadow'
                  : 'bg-[#f8f9fb] neumorph-raised-soft'
              }`}
            >
              <span className="material-symbols-outlined text-[13px] text-amber-400 icon-filled">
                star
              </span>
            </div>
          </button>
          <div className="mt-2 text-center">
            <h4 className="font-['Outfit'] text-sm font-semibold tracking-wide text-inherit">
              Variables
            </h4>
            <span className="font-['JetBrains_Mono'] text-xs text-emerald-500 block font-medium">
              +20 XP Mastered
            </span>
          </div>
        </div>

        {/* NODE 2: COMPLETED (CENTER) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-32 flex flex-col items-center z-10 w-36">
          <button
            aria-label="Data Types completed"
            onClick={() => {
              soundFX.playClick();
              onSelectNode?.('Data Types');
            }}
            type="button"
            className={`w-16 h-16 rounded-full flex items-center justify-center relative active:scale-95 transition-transform ${
              theme === 'dark'
                ? 'dark-node-completed glow-emerald'
                : 'bg-[#f8f9fb] neumorph-raised'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-emerald-500/20 border border-emerald-400/40'
                  : 'bg-emerald-500/10'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px] font-bold">check</span>
              </div>
            </div>
            <div
              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-[#122324] border border-amber-400/60 shadow'
                  : 'bg-[#f8f9fb] neumorph-raised-soft'
              }`}
            >
              <span className="material-symbols-outlined text-[13px] text-amber-400 icon-filled">
                star
              </span>
            </div>
          </button>
          <div className="mt-2 text-center">
            <h4 className="font-['Outfit'] text-sm font-semibold tracking-wide text-inherit">
              Data Types
            </h4>
            <span className="font-['JetBrains_Mono'] text-xs text-emerald-500 block font-medium">
              +25 XP Mastered
            </span>
          </div>
        </div>

        {/* NODE 3: HERO FOCUS / CURRENT NODE (RIGHT) */}
        <div className="absolute right-4 top-60 flex flex-col items-center z-20 w-44">
          {/* Animated Speech/Status Pill */}
          <div
            className={`mb-2 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm animate-bounce ${
              theme === 'dark'
                ? 'bg-[#162036] text-[#c0c1ff] border border-indigo-400/50 shadow-[0_0_14px_rgba(99,102,241,0.35)]'
                : 'bg-[#f8f9fb] text-[#3748dd] neumorph-raised-soft'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-amber-400 icon-filled">
              bolt
            </span>
            <span className="font-['Outfit'] text-[10px] font-bold tracking-wider">
              START TODAY • 5 MIN
            </span>
          </div>

          {/* Large Hero Touch Node */}
          <button
            aria-label="Start Operators and Math lesson"
            onClick={() => {
              soundFX.playClick();
              onStartLesson();
            }}
            id="heroPlayButton"
            type="button"
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white relative active:scale-95 transition-all ${
              theme === 'dark'
                ? 'bg-gradient-to-tr from-[#4338ca] via-[#6366f1] to-[#38bdf8] glow-primary border-2 border-indigo-200/50'
                : 'bg-gradient-to-br from-[#5B6CFF] to-[#8B6CFF] shadow-[0_12px_28px_rgba(91,108,255,0.45)]'
            }`}
          >
            {/* Concentric ripple halo */}
            <span className="absolute inset-0 rounded-full bg-indigo-500/25 animate-ping pointer-events-none" />
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[32px] text-white ml-1 icon-filled">
                play_arrow
              </span>
            </div>
          </button>

          <div className="mt-2 text-center flex flex-col items-center">
            <h4 className="font-['Outfit'] text-base font-bold tracking-tight text-inherit">
              Operators &amp; Math
            </h4>
            <div
              className={`mt-1 px-2.5 py-0.5 rounded-full font-['Outfit'] text-[10px] font-bold tracking-wider ${
                theme === 'dark'
                  ? 'bg-indigo-500/20 border border-indigo-400/40 text-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                  : 'bg-[#3748dd]/10 text-[#3748dd]'
              }`}
            >
              AVAILABLE NOW
            </div>
          </div>
        </div>

        {/* NODE 4: MYSTERY TREASURE CHEST (CENTER-RIGHT) */}
        <div className="absolute left-1/2 -translate-x-4 top-[395px] flex flex-col items-center z-10 w-44">
          <button
            aria-label="Locked mystery chest"
            onClick={() => {
              soundFX.playClick();
              alert('Mystery chest unlocks after completing Lesson 3: Operators & Math!');
            }}
            type="button"
            className={`w-16 h-16 rounded-full flex items-center justify-center relative active:scale-95 transition-transform ${
              theme === 'dark'
                ? 'dark-node-locked'
                : 'bg-[#f8f9fb] neumorph-raised'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-amber-500/15 border border-amber-400/30'
                  : 'bg-amber-100 neumorph-active-pill'
              }`}
            >
              <span className="material-symbols-outlined text-[24px] text-amber-500 icon-filled">
                inventory_2
              </span>
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-[#101625] border border-[#2d3b55]'
                  : 'bg-[#f8f9fb] neumorph-raised-soft'
              }`}
            >
              <span className="material-symbols-outlined text-[12px] text-slate-400">
                lock
              </span>
            </div>
          </button>
          <div className="mt-2 text-center px-2">
            <h4 className="font-['Outfit'] text-sm font-semibold text-inherit">
              Bonus Chest
            </h4>
            <span className="font-['JetBrains_Mono'] text-xs text-slate-400 block">
              Unlocks after Lesson 3
            </span>
          </div>
        </div>

        {/* NODE 5: LOCKED NODE (LEFT) */}
        <div className="absolute left-6 top-[520px] flex flex-col items-center z-10 w-36 opacity-85">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center relative ${
              theme === 'dark'
                ? 'dark-node-locked'
                : 'bg-[#f8f9fb] neumorph-raised'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#131a2c] border border-[#25324d]' : 'bg-[#eceef0]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] text-slate-400">
                lock
              </span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <h4 className="font-['Outfit'] text-sm font-medium text-inherit">
              String Templates
            </h4>
            <span className="font-['JetBrains_Mono'] text-xs text-slate-400 block">
              +30 XP
            </span>
          </div>
        </div>

        {/* MILESTONE WORLD 01 GATEWAY */}
        <div className="absolute left-4 right-4 top-[640px] z-10">
          <div
            className={`w-full rounded-2xl p-3.5 flex items-center justify-between shadow-md ${
              theme === 'dark'
                ? 'dark-glass-card'
                : 'bg-[#f8f9fb] neumorph-raised'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 text-indigo-300'
                    : 'bg-[#dfe0ff] text-[#000965] neumorph-raised-soft'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
              </div>
              <div>
                <span
                  className={`font-['Outfit'] text-[10px] font-bold tracking-widest block uppercase ${
                    theme === 'dark' ? 'text-[#818cf8]' : 'text-[#3748dd]'
                  }`}
                >
                  MILESTONE GATE
                </span>
                <h4 className="font-['Outfit'] text-base font-bold text-inherit">
                  Kotlin Foundations
                </h4>
              </div>
            </div>
            <div
              className={`h-7 px-3 rounded-full flex items-center ${
                theme === 'dark'
                  ? 'bg-[#0d1424] border border-[#2a374f]'
                  : 'bg-[#eceef0] neumorph-active-pill'
              }`}
            >
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-inherit">
                2 / 4 Completed
              </span>
            </div>
          </div>
        </div>

        {/* NODE 6: LOCKED GATEWAY NODE (CENTER) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[740px] flex flex-col items-center z-10 w-40 opacity-80">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'dark-node-locked' : 'bg-[#f8f9fb] neumorph-raised'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#131a2c] border border-[#25324d]' : 'bg-[#eceef0]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] text-slate-400">
                lock
              </span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <h4 className="font-['Outfit'] text-sm font-medium text-inherit">
              Conditionals
            </h4>
            <span className="font-['JetBrains_Mono'] text-xs text-slate-400 block">
              Boss Level
            </span>
          </div>
        </div>

        {/* NODE 7: LOCKED NODE 2 (RIGHT) */}
        <div className="absolute right-6 top-[860px] flex flex-col items-center z-10 w-40 opacity-80">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'dark-node-locked' : 'bg-[#f8f9fb] neumorph-raised'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#131a2c] border border-[#25324d]' : 'bg-[#eceef0]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] text-slate-400">
                lock
              </span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <h4 className="font-['Outfit'] text-sm font-medium text-inherit">
              Boolean Logic
            </h4>
            <span className="font-['JetBrains_Mono'] text-xs text-slate-400 block">
              +35 XP
            </span>
          </div>
        </div>
      </div>

      {/* WORLD 02 TRANSITION HEADER / BANNER */}
      <section className="w-full mt-10 px-1">
        <div
          className={`w-full rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden transition-all shadow-md ${
            theme === 'dark'
              ? 'dark-glass-card'
              : 'bg-[#f2f4f6] neumorph-raised-soft'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
              theme === 'dark'
                ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                : 'bg-[#613ed2]/10 text-[#613ed2]'
            }`}
          >
            <span className="material-symbols-outlined text-[26px]">psychology</span>
          </div>
          <span
            className={`font-['Outfit'] text-xs font-bold tracking-widest uppercase ${
              theme === 'dark' ? 'text-cyan-300' : 'text-[#613ed2]'
            }`}
          >
            World 02 Preview
          </span>
          <h3 className="font-['Outfit'] text-xl font-bold mt-1 tracking-tight text-inherit">
            Logic &amp; Control Flow
          </h3>
          <p
            className={`font-['Outfit'] text-xs max-w-xs mt-1.5 leading-relaxed ${
              theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#454655]'
            }`}
          >
            Master loops, when expressions, and higher-order smart conditions.
          </p>
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenCurriculum();
            }}
            className={`mt-4 flex items-center gap-1.5 px-4 py-2 rounded-full font-['Outfit'] text-[12px] font-bold transition-all active:scale-95 ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'bg-[#3748dd] hover:bg-[#2e3fc7] text-white shadow-md'
            }`}
          >
            <span>Explore Upcoming Worlds</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};
