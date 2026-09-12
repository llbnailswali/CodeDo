import React, { useState } from 'react';
import { AppTheme, AppFontSize, UserStats } from '../types';
import { soundFX } from '../utils/audio';

interface ProfileViewProps {
  theme: AppTheme;
  fontSize?: AppFontSize;
  onSetFontSize?: (size: AppFontSize) => void;
  userStats: UserStats;
  onStartLesson: () => void;
  onOpenCurriculum?: () => void;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  tapToRevealEnabled?: boolean;
  onToggleTapToReveal?: () => void;
  onResetProgress: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  theme,
  fontSize = 'medium',
  onSetFontSize,
  userStats,
  onStartLesson,
  onOpenCurriculum,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  tapToRevealEnabled = true,
  onToggleTapToReveal,
  onResetProgress,
}) => {
  const isDark = theme === 'dark';
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activeDays = [true, true, true, true, true, true, true]; // 12-day streak

  const achievements = [
    { title: 'Type Master', desc: 'Aced type deduction on first try', icon: 'verified', color: 'text-emerald-500' },
    { title: '12 Days Fire', desc: 'Maintained 12-day uninterrupted streak', icon: 'local_fire_department', color: 'text-orange-500' },
    { title: 'Foundations Knight', desc: 'Cleared 2 milestone gates in World 01', icon: 'military_tech', color: 'text-indigo-400' },
    { title: 'Speed Demon', desc: 'Answered a challenge under 2 seconds', icon: 'bolt', color: 'text-amber-400' },
  ];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-3 select-none">
      {/* Profile Card Header */}
      <div
        className={`p-5 rounded-2xl mb-4 flex items-center gap-4 transition-all ${
          isDark
            ? 'bg-[#151b28] border border-white/10 shadow-lg'
            : 'bg-white border border-slate-200/80 neu-raised'
        }`}
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-1 flex items-center justify-center shadow-lg">
            <div
              className={`w-full h-full rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#0f1422]' : 'bg-white'
              }`}
            >
              <span className="text-2xl">🧑‍💻</span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow">
            <span className="material-symbols-outlined text-[14px]">check</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-['Outfit'] text-lg font-bold tracking-tight text-inherit">
              Alex Vance
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/20">
              PRO MEMBER
            </span>
          </div>
          <p className="font-['Outfit'] text-xs text-slate-400">Junior Kotlin Developer</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="font-mono text-orange-500 font-bold flex items-center gap-1">
              <span>🔥</span> {userStats.streak} Days
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-indigo-400 font-bold flex items-center gap-1">
              <span>💎</span> {userStats.stars || 120} Gems
            </span>
          </div>
        </div>
      </div>

      {/* ================= LEARNING TRACKS (MOVED FROM HAMBURGER MENU) ================= */}
      <div
        className={`p-4 rounded-2xl mb-4 flex flex-col gap-3 transition-all ${
          isDark
            ? 'bg-[#151b28] border border-white/10 shadow-md'
            : 'bg-white border border-slate-200/80 neu-raised'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-['Outfit'] text-xs font-bold text-slate-400 uppercase tracking-wider">
            Learning Tracks
          </span>
          {onOpenCurriculum && (
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onOpenCurriculum();
              }}
              className="text-[11px] font-mono font-bold text-indigo-500 hover:underline flex items-center gap-0.5"
            >
              <span>Explore 16 Worlds</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          )}
        </div>

        {/* Active Track */}
        <div
          className={`p-3 rounded-xl flex items-center justify-between transition-all ${
            isDark
              ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300'
              : 'bg-indigo-50 border border-indigo-200/80 text-indigo-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🤖</span>
            <div className="flex flex-col">
              <span className="font-['Outfit'] text-xs font-bold leading-tight">Kotlin Basics</span>
              <span className="font-mono text-[10px] text-indigo-400/80">World 01 • Active Track</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-indigo-500">check_circle</span>
        </div>

        {/* Locked Tracks */}
        <div
          className={`p-3 rounded-xl flex items-center justify-between opacity-60 border ${
            isDark ? 'bg-[#0f1422] border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📱</span>
            <div className="flex flex-col">
              <span className="font-['Outfit'] text-xs font-semibold leading-tight">Jetpack Compose UI</span>
              <span className="font-mono text-[10px]">World 09 • Coming Soon</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px]">lock</span>
        </div>

        <div
          className={`p-3 rounded-xl flex items-center justify-between opacity-60 border ${
            isDark ? 'bg-[#0f1422] border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div className="flex flex-col">
              <span className="font-['Outfit'] text-xs font-semibold leading-tight">Coroutines &amp; Flow</span>
              <span className="font-mono text-[10px]">World 08 • Level 5 Required</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px]">lock</span>
        </div>
      </div>

      {/* ================= PREFERENCES (MOVED FROM HAMBURGER MENU) ================= */}
      <div
        className={`p-4 rounded-2xl mb-4 flex flex-col gap-3 transition-all ${
          isDark
            ? 'bg-[#151b28] border border-white/10 shadow-md'
            : 'bg-white border border-slate-200/80 neu-raised'
        }`}
      >
        <span className="font-['Outfit'] text-xs font-bold text-slate-400 uppercase tracking-wider">
          Preferences &amp; Display
        </span>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onToggleTheme();
          }}
          className={`w-full p-3 rounded-xl flex items-center justify-between transition-all border ${
            isDark
              ? 'bg-[#0f1422] border-white/5 hover:border-white/10'
              : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-amber-400/20 text-amber-400' : 'bg-indigo-100 text-indigo-600'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-['Outfit'] text-xs font-bold leading-tight">Appearance Theme</span>
              <span className="font-mono text-[10px] text-slate-400">
                {isDark ? 'Obsidian Night Mode' : 'Silk Neumorphic Light'}
              </span>
            </div>
          </div>
          <div
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
              isDark ? 'bg-amber-400/10 text-amber-400' : 'bg-indigo-100 text-indigo-600'
            }`}
          >
            {isDark ? 'DARK' : 'LIGHT'}
          </div>
        </button>

        {/* Sound FX Toggle */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onToggleSound();
          }}
          className={`w-full p-3 rounded-xl flex items-center justify-between transition-all border ${
            isDark
              ? 'bg-[#0f1422] border-white/5 hover:border-white/10'
              : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                soundEnabled
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isDark
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-['Outfit'] text-xs font-bold leading-tight">Tactile Sound FX</span>
              <span className="font-mono text-[10px] text-slate-400">
                {soundEnabled ? 'Web Audio synthesized clicks & chimes' : 'Muted audio feedback'}
              </span>
            </div>
          </div>
          <div
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
              soundEnabled
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? 'ON' : 'MUTED'}
          </div>
        </button>

        {/* Tap to View Content Toggle */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onToggleTapToReveal?.();
          }}
          className={`w-full p-3 rounded-xl flex items-center justify-between transition-all border ${
            isDark
              ? 'bg-[#0f1422] border-white/5 hover:border-white/10'
              : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                tapToRevealEnabled
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : isDark
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {tapToRevealEnabled ? 'touch_app' : 'visibility'}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-['Outfit'] text-xs font-bold leading-tight">Tap to View Content</span>
              <span className="font-mono text-[10px] text-slate-400">
                {tapToRevealEnabled ? 'Reveal lesson sections step-by-step on tap' : 'Show all lesson content immediately'}
              </span>
            </div>
          </div>
          <div
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
              tapToRevealEnabled
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {tapToRevealEnabled ? 'ON' : 'OFF'}
          </div>
        </button>
      </div>

      {/* ================= FONT SIZE SETTINGS ================= */}
      <div
        className={`p-4 rounded-2xl mb-4 flex flex-col gap-3.5 transition-all ${
          isDark
            ? 'bg-[#151b28] border border-white/10 shadow-md'
            : 'bg-white border border-slate-200/80 neu-raised'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-indigo-500 dark:text-indigo-400">
              format_size
            </span>
            <span className="font-['Outfit'] text-xs font-bold text-slate-400 uppercase tracking-wider">
              Font Size Settings
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 uppercase">
            {fontSize}
          </span>
        </div>

        <p className="font-['Outfit'] text-xs text-slate-400 leading-snug">
          Adjust the reading size across the whole app, including lesson explanations, Kotlin code snippets, and interface text.
        </p>

        {/* 3-Tier Font Size Selector */}
        <div className="grid grid-cols-3 gap-2">
          {(['small', 'medium', 'large'] as const).map((size) => {
            const isSelected = fontSize === size;
            const labels = {
              small: { title: 'Small', sample: 'Aa', desc: 'Compact' },
              medium: { title: 'Medium', sample: 'Aa', desc: 'Default' },
              large: { title: 'Large', sample: 'Aa', desc: 'Large' },
            };
            const sampleSizeClass = {
              small: 'text-xs',
              medium: 'text-sm font-medium',
              large: 'text-lg font-bold',
            };

            return (
              <button
                key={size}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onSetFontSize?.(size);
                }}
                className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-sm shadow-indigo-500/25 ring-1 ring-indigo-500/50'
                      : 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-sm ring-1 ring-indigo-300'
                    : isDark
                    ? 'bg-[#0f1422] border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <span
                  className={`font-serif tracking-tight leading-none ${sampleSizeClass[size]} ${
                    isSelected ? 'text-indigo-500 dark:text-indigo-400' : ''
                  }`}
                >
                  {labels[size].sample}
                </span>
                <span className="font-['Outfit'] text-xs font-bold capitalize">
                  {labels[size].title}
                </span>
                <span className="font-mono text-[9px] text-slate-400">
                  {labels[size].desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Font Size Code & Text Preview */}
        <div
          className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
            isDark ? 'bg-[#0f1422] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/5 dark:border-white/5 pb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE PREVIEW</span>
            </span>
            <span className="uppercase font-semibold text-indigo-500 dark:text-indigo-400">
              Active: {fontSize}
            </span>
          </div>
          <div className="font-mono text-xs text-indigo-700 dark:text-indigo-300 bg-black/5 dark:bg-black/40 p-2.5 rounded-lg border border-black/5 dark:border-white/5">
            <code>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">val</span> fontSize ={' '}
              <span className="text-emerald-600 dark:text-emerald-400">"{fontSize}"</span>
              <br />
              <span className="text-blue-600 dark:text-blue-400">println</span>(
              <span className="text-amber-600 dark:text-amber-400">"Readable Kotlin everywhere"</span>)
            </code>
          </div>
          <p className="font-['Outfit'] text-xs text-slate-500 dark:text-slate-400 leading-snug">
            {fontSize === 'small' && 'Compact view: More information fits onto your screen at once.'}
            {fontSize === 'medium' && 'Standard view: Balanced typography designed for optimal learning.'}
            {fontSize === 'large' && 'Expanded view: Enhanced legibility for comfortable reading of all content.'}
          </p>
        </div>
      </div>

      {/* Streak Calendar / Weekly Heatmap */}
      <div
        className={`p-4 rounded-2xl mb-4 transition-all ${
          isDark
            ? 'bg-[#151b28] border border-white/10 shadow-md'
            : 'bg-white border border-slate-200/80 neu-raised'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-['Outfit'] text-xs font-bold uppercase tracking-wider text-slate-400">
            Streak Heatmap
          </span>
          <span className="text-orange-500 text-xs font-bold font-mono">12 Days Active 🔥</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day, idx) => (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400">{day}</span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  activeDays[idx]
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                    : isDark
                    ? 'bg-[#0f1422] text-slate-600'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] icon-filled">
                  local_fire_department
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="flex flex-col gap-3 mb-4">
        <h3 className="font-['Outfit'] text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Achievements &amp; Badges
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl flex flex-col gap-2 transition-all ${
                isDark
                  ? 'bg-[#151b28] border border-white/10 shadow-sm'
                  : 'bg-white border border-slate-200/80 neu-raised-sm'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[22px] ${item.color} icon-filled`}>
                  {item.icon}
                </span>
                <h4 className="font-['Outfit'] text-xs font-bold text-inherit leading-tight">
                  {item.title}
                </h4>
              </div>
              <p className="font-['Outfit'] text-[11px] text-slate-400 leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DATA & ACCOUNT ACTIONS (MOVED FROM HAMBURGER MENU) ================= */}
      <div
        className={`p-4 rounded-2xl mb-4 flex flex-col gap-3 transition-all ${
          isDark
            ? 'bg-[#151b28] border border-white/10 shadow-md'
            : 'bg-white border border-slate-200/80 neu-raised'
        }`}
      >
        <span className="font-['Outfit'] text-xs font-bold text-slate-400 uppercase tracking-wider">
          Data &amp; System
        </span>

        {showResetConfirm ? (
          <div
            className={`p-3 rounded-xl border flex flex-col gap-2.5 ${
              isDark ? 'bg-rose-950/30 border-rose-800/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-rose-500">warning</span>
              <span className="text-xs font-bold font-['Outfit']">Reset all local demo progress?</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-80">
              This will clear local storage stats, streak, and reset questions to the beginning.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-['Outfit'] text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Yes, Reset Everything
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setShowResetConfirm(false);
                }}
                className={`px-3 py-1.5 rounded-lg font-['Outfit'] text-xs font-semibold border ${
                  isDark ? 'bg-[#151b28] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setShowResetConfirm(true);
            }}
            className={`w-full p-3 rounded-xl flex items-center justify-between border transition-all text-slate-400 hover:text-rose-400 ${
              isDark ? 'bg-[#0f1422] border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span className="font-['Outfit'] text-xs font-semibold">Reset Demo Progress</span>
            </div>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        )}

        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>CodeDo for Android</span>
          <span>Build 1.9.4 • Kotlin 2.0</span>
        </div>
      </div>
    </div>
  );
};
