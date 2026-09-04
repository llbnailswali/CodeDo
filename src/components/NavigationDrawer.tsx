import React from 'react';
import { AppTheme } from '../types';
import { soundFX } from '../utils/audio';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => {
          soundFX.playClick();
          onClose();
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Drawer Body */}
      <div
        className={`relative w-4/5 max-w-xs h-full flex flex-col justify-between p-6 shadow-2xl z-10 animate-in slide-in-from-left duration-300 ${
          theme === 'dark'
            ? 'bg-[#0f1424] border-r border-slate-800 text-white'
            : 'bg-white text-[#191c1e]'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 border-slate-700/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#3748dd] flex items-center justify-center text-white font-bold text-sm">
                {`{ }`}
              </div>
              <span className="font-['Outfit'] text-xl font-bold tracking-tight">
                Code<span className="text-indigo-400">Do</span>
              </span>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-500/10 text-slate-400"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Course Track Selection */}
          <div className="flex flex-col gap-2">
            <span className="font-['Outfit'] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Learning Tracks
            </span>

            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className={`p-3 rounded-xl flex items-center justify-between text-left font-['Outfit'] text-sm font-bold ${
                theme === 'dark' ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40' : 'bg-[#3748dd]/10 text-[#3748dd]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="leading-none">Kotlin Basics</p>
                  <span className="text-[11px] font-normal text-slate-400">World 01 • Active</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </button>

            <div className="p-3 rounded-xl flex items-center justify-between text-left font-['Outfit'] text-sm text-slate-400 opacity-60">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📱</span>
                <div>
                  <p className="leading-none">Jetpack Compose UI</p>
                  <span className="text-[11px] font-normal">Coming Soon</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>

            <div className="p-3 rounded-xl flex items-center justify-between text-left font-['Outfit'] text-sm text-slate-400 opacity-60">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="leading-none">Coroutines &amp; Flows</p>
                  <span className="text-[11px] font-normal">Level 5 required</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/30">
            <span className="font-['Outfit'] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Preferences
            </span>

            <button
              onClick={() => {
                soundFX.playClick();
                onToggleTheme();
              }}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-500/10 font-['Outfit'] text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
                <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onToggleSound();
              }}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-500/10 font-['Outfit'] text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  {soundEnabled ? 'volume_up' : 'volume_off'}
                </span>
                <span>Sound FX: {soundEnabled ? 'Enabled' : 'Muted'}</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-700/30 flex flex-col gap-2 text-xs">
          <button
            onClick={() => {
              soundFX.playClick();
              onResetProgress();
              onClose();
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors py-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset Demo Progress</span>
          </button>
          <span className="text-[11px] text-slate-500 font-['JetBrains_Mono']">
            CodeDo for Android • Build 1.9.4
          </span>
        </div>
      </div>
    </div>
  );
};
