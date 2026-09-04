import React from 'react';
import { AppTheme } from '../types';
import { soundFX } from '../utils/audio';

interface CurriculumExplorerProps {
  theme: AppTheme;
  onJumpToToday: () => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  theme,
  onJumpToToday,
}) => {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto space-y-6 pb-28 pt-2 px-4 select-none">
      {/* Sticky Explorer Anchor Bar */}
      <div
        className={`sticky top-2 z-30 flex items-center justify-between gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-md ${
          theme === 'dark'
            ? 'bg-[#131b2e]/95 border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.5)]'
            : 'bg-[#f8f9fb]/90 neumorph-raised-soft'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span className="font-['Outfit'] text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Curriculum Explorer • Future Realms
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onJumpToToday();
          }}
          className={`shrink-0 flex items-center gap-1 h-8 px-3 rounded-full text-white font-['Outfit'] text-xs font-semibold shadow-sm active:scale-95 transition-all ${
            theme === 'dark'
              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] border border-indigo-400/30'
              : 'bg-[#3748dd] hover:bg-[#2f3dbf]'
          }`}
        >
          <span>Jump to Today</span>
          <span className="material-symbols-outlined text-[15px]">bolt</span>
        </button>
      </div>

      {/* Realm Progression Transition Bar */}
      <div
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs ${
          theme === 'dark'
            ? 'bg-[#131b2e]/80 border border-white/5 text-slate-300'
            : 'bg-[#f2f4f6] text-[#454655]'
        }`}
      >
        <span className="material-symbols-outlined text-[18px] text-indigo-400">lock_clock</span>
        <span className="font-['Plus_Jakarta_Sans']">You are viewing upcoming worlds</span>
        <span
          className={`font-['JetBrains_Mono'] text-[11px] px-2 py-0.5 rounded-full font-semibold ${
            theme === 'dark'
              ? 'bg-indigo-950/80 border border-indigo-700/50 text-indigo-300'
              : 'bg-white text-[#3748dd] shadow-sm'
          }`}
        >
          3 LOCKED
        </span>
      </div>

      {/* ================= WORLD 02 ================= */}
      <section className="flex flex-col space-y-4">
        {/* World 02 Header Banner */}
        <div
          className={`relative overflow-hidden rounded-2xl p-5 ${
            theme === 'dark'
              ? 'dark-glass-card'
              : 'bg-white neumorph-raised'
          }`}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`font-['Outfit'] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    theme === 'dark'
                      ? 'bg-cyan-950/80 border border-cyan-500/30 text-cyan-300'
                      : 'bg-[#e7deff] text-[#1e0060]'
                  }`}
                >
                  World 02
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-slate-400 font-medium">
                  Stage 2 of 8
                </span>
              </div>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-[#1c2742] border border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(76,215,246,0.25)]'
                    : 'bg-[#f8f9fb] text-[#613ed2] neumorph-raised-soft'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </div>
            </div>

            <div>
              <h2 className="font-['Outfit'] text-2xl font-bold tracking-tight text-inherit">
                Logic &amp; Decision Making
              </h2>
              <p
                className={`font-['Outfit'] text-sm mt-1 leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-[#454655]'
                }`}
              >
                Master branching, boolean mechanics, and Kotlin's reactive syntax flow.
              </p>
            </div>

            {/* Lock Pre-requisite Meter */}
            <div
              className={`p-3 rounded-xl space-y-1.5 ${
                theme === 'dark' ? 'bg-[#0e1524] border border-white/5' : 'bg-[#f2f4f6]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="material-symbols-outlined text-[16px] text-amber-500">hourglass_top</span>
                  Requires Kotlin Foundations
                </span>
                <span className="font-['JetBrains_Mono'] font-bold text-inherit">
                  11 / 14 Cleared
                </span>
              </div>
              <div
                className={`w-full h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-[#e0e3e5]'
                }`}
              >
                <div
                  className={`h-full rounded-full ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                      : 'bg-[#7a5aed]'
                  }`}
                  style={{ width: '78%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Winding Path: World 2 Nodes */}
        <div className="relative py-4 flex flex-col items-center">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 320 440"
          >
            <path
              d="M 160 20 C 230 60, 230 110, 160 150 C 90 190, 90 240, 160 280 C 220 320, 200 370, 160 410"
              stroke={theme === 'dark' ? '#25324d' : '#c5c5d8'}
              strokeDasharray="7 7"
              strokeLinecap="round"
              strokeWidth="5"
            />
          </svg>

          {/* Node 1: if / else (Right lean) */}
          <div className="relative z-10 flex flex-col items-center translate-x-12 mb-6 group">
            <div
              className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${
                theme === 'dark' ? 'node-orb-locked' : 'bg-[#f8f9fb] neumorph-raised'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'node-orb-inner text-slate-300' : 'bg-[#eceef0] text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div
                className={`absolute -top-1 -right-2 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[11px] font-semibold shadow-sm ${
                  theme === 'dark'
                    ? 'bg-cyan-600 text-white border border-cyan-400/30'
                    : 'bg-[#613ed2] text-white'
                }`}
              >
                +30 XP
              </div>
            </div>
            <div
              className={`mt-2 px-3 py-1.5 rounded-xl text-center shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#131b2e]/90 border border-white/10 text-white'
                  : 'bg-[#f2f4f6] text-[#191c1e]'
              }`}
            >
              <p className="font-['Outfit'] text-[15px] font-semibold text-center">
                if / else Branching
              </p>
              <span className="font-['Outfit'] text-[12px] text-slate-400">
                Control flow gates
              </span>
            </div>
          </div>

          {/* Node 2: when Expressions (Left lean) */}
          <div className="relative z-10 flex flex-col items-center -translate-x-12 mb-6 group">
            <div
              className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${
                theme === 'dark' ? 'node-orb-locked' : 'bg-[#f8f9fb] neumorph-raised'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'node-orb-inner text-cyan-400' : 'bg-[#e6e8ea] text-[#613ed2]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">tune</span>
              </div>
              <div
                className={`absolute -top-1 -right-2 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[11px] font-semibold shadow-sm ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white border border-indigo-400/30'
                    : 'bg-[#3748dd] text-white'
                }`}
              >
                +35 XP
              </div>
            </div>
            <div
              className={`mt-2 px-3 py-1.5 rounded-xl text-center shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#131b2e]/90 border border-white/10 text-white'
                  : 'bg-[#f2f4f6] text-[#191c1e]'
              }`}
            >
              <p className="font-['Outfit'] text-[15px] font-semibold text-center">
                when Expressions
              </p>
              <span className="font-['Outfit'] text-[12px] text-slate-400">
                Kotlin power switch
              </span>
            </div>
          </div>

          {/* Node 3: Logical Operators (Right-center lean) */}
          <div className="relative z-10 flex flex-col items-center translate-x-8 mb-6 group">
            <div
              className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${
                theme === 'dark' ? 'node-orb-locked' : 'bg-[#f8f9fb] neumorph-raised'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'node-orb-inner text-slate-300' : 'bg-[#eceef0] text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div
                className={`absolute -top-1 -right-2 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[11px] font-semibold shadow-sm ${
                  theme === 'dark'
                    ? 'bg-cyan-600 text-white border border-cyan-400/30'
                    : 'bg-[#613ed2] text-white'
                }`}
              >
                +40 XP
              </div>
            </div>
            <div
              className={`mt-2 px-3 py-1.5 rounded-xl text-center shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#131b2e]/90 border border-white/10 text-white'
                  : 'bg-[#f2f4f6] text-[#191c1e]'
              }`}
            >
              <p className="font-['Outfit'] text-[15px] font-semibold text-center">
                &amp;&amp; || ! Operators
              </p>
              <span className="font-['Outfit'] text-[12px] text-slate-400">
                Complex predicates
              </span>
            </div>
          </div>

          {/* World 02 Boss Shield Milestone */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`relative w-20 h-20 rounded-2xl rotate-45 flex items-center justify-center cursor-pointer active:scale-95 transition-transform ${
                theme === 'dark' ? 'boss-orb-glow' : 'bg-[#f8f9fb] neumorph-raised'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center -rotate-45 ${
                  theme === 'dark' ? 'bg-[#1a1408] border border-amber-500/20' : 'bg-[#e0e3e5]'
                }`}
              >
                <span className="material-symbols-outlined text-[32px] text-amber-500">
                  shield
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 -rotate-45 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-['JetBrains_Mono'] text-[11px] font-bold shadow-md">
                BOSS
              </div>
            </div>
            <div
              className={`mt-4 px-4 py-2 rounded-xl text-center shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#131b2e]/90 border border-amber-500/30'
                  : 'bg-[#f2f4f6]'
              }`}
            >
              <p className="font-['Outfit'] text-lg font-bold text-amber-500">
                World 2 Boss Trial
              </p>
              <span className="font-['Outfit'] text-xs text-slate-400">
                Boolean Circuit Engine Challenge
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Divider Ribbon */}
      <div className="flex items-center justify-center gap-3 py-2">
        <div className={`h-px w-14 ${theme === 'dark' ? 'bg-slate-800' : 'bg-[#e0e3e5]'}`} />
        <span className="material-symbols-outlined text-slate-500 text-[20px]">
          keyboard_double_arrow_down
        </span>
        <div className={`h-px w-14 ${theme === 'dark' ? 'bg-slate-800' : 'bg-[#e0e3e5]'}`} />
      </div>

      {/* ================= WORLD 03 ================= */}
      <section className="flex flex-col space-y-4">
        {/* World 03 Header Banner */}
        <div
          className={`relative overflow-hidden rounded-2xl p-5 ${
            theme === 'dark'
              ? 'dark-glass-card'
              : 'bg-white neumorph-raised'
          }`}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`font-['Outfit'] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    theme === 'dark'
                      ? 'bg-indigo-950/80 border border-indigo-500/30 text-indigo-300'
                      : 'bg-[#dfe0ff] text-[#000965]'
                  }`}
                >
                  World 03
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-slate-400 font-medium">
                  Stage 3 of 8
                </span>
              </div>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-[#1c2742] border border-indigo-500/30 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
                    : 'bg-[#f8f9fb] text-[#3748dd] neumorph-raised-soft'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">all_inclusive</span>
              </div>
            </div>

            <div>
              <h2 className="font-['Outfit'] text-2xl font-bold tracking-tight text-inherit">
                Loops &amp; Iteration
              </h2>
              <p
                className={`font-['Outfit'] text-sm mt-1 leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-[#454655]'
                }`}
              >
                Master for-loops, ranges (1..100), and recursion patterns.
              </p>
            </div>

            {/* Visual Code Teaser Pill */}
            <div
              className={`flex items-center gap-2 p-2.5 rounded-xl font-['JetBrains_Mono'] text-xs ${
                theme === 'dark' ? 'bg-[#0e1524] border border-white/5 text-slate-300' : 'bg-[#eceef0] text-slate-700'
              }`}
            >
              <span className={theme === 'dark' ? 'text-indigo-400 font-semibold' : 'text-[#3748dd] font-semibold'}>
                for
              </span>
              <span>(i in 1..100) {'{ iterate() }'}</span>
            </div>
          </div>
        </div>

        {/* Winding Path: World 3 Nodes */}
        <div className="relative py-4 flex flex-col items-center">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 320 340"
          >
            <path
              d="M 160 20 C 80 60, 80 120, 160 160 C 240 200, 240 260, 160 300"
              stroke={theme === 'dark' ? '#25324d' : '#c5c5d8'}
              strokeDasharray="7 7"
              strokeLinecap="round"
              strokeWidth="5"
            />
          </svg>

          {/* Node 1: for Loops & Ranges (Left lean) */}
          <div className="relative z-10 flex flex-col items-center -translate-x-14 mb-6 group">
            <div
              className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${
                theme === 'dark' ? 'node-orb-locked' : 'bg-[#f8f9fb] neumorph-raised'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'node-orb-inner text-slate-300' : 'bg-[#eceef0] text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div
                className={`absolute -top-1 -right-2 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[11px] font-semibold shadow-sm ${
                  theme === 'dark'
                    ? 'bg-[#1c2742] border border-white/10 text-slate-300'
                    : 'bg-[#e0e3e5] text-slate-700'
                }`}
              >
                🔒 +45 XP
              </div>
            </div>
            <div
              className={`mt-2 px-3 py-1.5 rounded-xl text-center shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#131b2e]/90 border border-white/10 text-white'
                  : 'bg-[#f2f4f6] text-[#191c1e]'
              }`}
            >
              <p className="font-['Outfit'] text-[15px] font-semibold text-center">
                for Loops &amp; Ranges
              </p>
              <span className="font-['Outfit'] text-[12px] text-slate-400">
                Range stepping &amp; indices
              </span>
            </div>
          </div>

          {/* Node 2: while & do-while (Center-Right lean) */}
          <div className="relative z-10 flex flex-col items-center translate-x-12 mb-6 group">
            <div
              className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${
                theme === 'dark' ? 'node-orb-locked' : 'bg-[#f8f9fb] neumorph-raised'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'node-orb-inner text-slate-300' : 'bg-[#eceef0] text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div
                className={`absolute -top-1 -right-2 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[11px] font-semibold shadow-sm ${
                  theme === 'dark'
                    ? 'bg-[#1c2742] border border-white/10 text-slate-300'
                    : 'bg-[#e0e3e5] text-slate-700'
                }`}
              >
                🔒 +45 XP
              </div>
            </div>
            <div
              className={`mt-2 px-3 py-1.5 rounded-xl text-center shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#131b2e]/90 border border-white/10 text-white'
                  : 'bg-[#f2f4f6] text-[#191c1e]'
              }`}
            >
              <p className="font-['Outfit'] text-[15px] font-semibold text-center">
                while &amp; do-while
              </p>
              <span className="font-['Outfit'] text-[12px] text-slate-400">
                Guarded loop iterations
              </span>
            </div>
          </div>

          {/* Node 3: Break & Continue (Center lean) */}
          <div className="relative z-10 flex flex-col items-center mb-4 group">
            <div
              className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${
                theme === 'dark' ? 'node-orb-locked' : 'bg-[#f8f9fb] neumorph-raised'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'node-orb-inner text-slate-300' : 'bg-[#eceef0] text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div
                className={`absolute -top-1 -right-2 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[11px] font-semibold shadow-sm ${
                  theme === 'dark'
                    ? 'bg-[#1c2742] border border-white/10 text-slate-300'
                    : 'bg-[#e0e3e5] text-slate-700'
                }`}
              >
                🔒 +50 XP
              </div>
            </div>
            <div
              className={`mt-2 px-3 py-1.5 rounded-xl text-center shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#131b2e]/90 border border-white/10 text-white'
                  : 'bg-[#f2f4f6] text-[#191c1e]'
              }`}
            >
              <p className="font-['Outfit'] text-[15px] font-semibold text-center">
                Break &amp; Continue
              </p>
              <span className="font-['Outfit'] text-[12px] text-slate-400">
                Labeled jump statements
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORLD 04 TEASER ================= */}
      <section className="flex flex-col space-y-2">
        <div
          className={`p-5 rounded-2xl flex flex-col space-y-3 ${
            theme === 'dark'
              ? 'dark-glass-card'
              : 'bg-[#f2f4f6] border border-[#c5c5d8]/30 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-[#101726] border border-white/10 text-slate-400'
                    : 'bg-[#e0e3e5] text-[#454655]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
              </span>
              <span className="font-['Outfit'] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                World 04 • Coming Up
              </span>
            </div>
            <span
              className={`font-['JetBrains_Mono'] text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                theme === 'dark'
                  ? 'bg-[#101726] border border-white/10 text-slate-400'
                  : 'bg-[#eceef0] text-[#454655]'
              }`}
            >
              Stage 4
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                theme === 'dark'
                  ? 'bg-[#101726] border border-white/10 text-indigo-400'
                  : 'bg-[#e0e3e5] text-[#757687]'
              }`}
            >
              <span className="material-symbols-outlined text-[28px]">data_object</span>
            </div>
            <div>
              <h3 className="font-['Outfit'] text-base font-bold text-inherit">
                Functions, Lambdas &amp; High-Order Flow
              </h3>
              <p className="font-['Outfit'] text-xs text-slate-400 mt-1 leading-relaxed">
                Unlock functional programming, inline lambdas, and type contracts.
              </p>
            </div>
          </div>

          <div
            className={`flex items-center justify-between pt-2 text-xs border-t ${
              theme === 'dark' ? 'border-white/5 text-slate-400' : 'border-black/5 text-[#454655]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-500">military_tech</span>
              Mastery badge reward
            </span>
            <span className="font-['JetBrains_Mono'] font-bold text-indigo-400">
              +320 XP Total
            </span>
          </div>
        </div>
      </section>

      {/* Tactile Encouragement Toast / Prompt */}
      <div
        className={`p-4 rounded-2xl flex items-center justify-between shadow-md ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-indigo-950/60 to-slate-900/80 border border-indigo-500/20'
            : 'bg-[#3748dd]/5 text-[#191c1e]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-indigo-600/20 border border-indigo-400/30 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                : 'bg-[#dfe0ff] text-[#000965]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
          </div>
          <div>
            <p className="font-['Outfit'] text-[15px] font-bold text-inherit">Only 3 tasks left!</p>
            <p className="font-['Outfit'] text-xs text-slate-400">
              Finish World 1 to unlock Logic &amp; Decision Making
            </p>
          </div>
        </div>
        <button
          aria-label="Scroll to top"
          onClick={() => {
            soundFX.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          type="button"
          className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-transform ${
            theme === 'dark'
              ? 'bg-[#131b2e] border border-white/10 text-indigo-300 hover:text-white'
              : 'bg-white text-[#3748dd] neumorph-raised-soft'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
        </button>
      </div>
    </div>
  );
};
