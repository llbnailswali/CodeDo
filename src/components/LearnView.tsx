import React from 'react';
import { AppTheme, UserStats } from '../types';
import { soundFX } from '../utils/audio';
import { HOME_WORLDS, WORLD_CARD_META, WorldTopicSection } from '../data/homeWorldsData';

interface LearnViewProps {
  theme: AppTheme;
  userStats: UserStats;
  onOpenCurriculum: (worldId?: string) => void;
  onSelectWorld?: (worldId: string) => void;
  onStartLesson?: () => void;
  onSelectNode?: (nodeTitle: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  theme,
  userStats,
  onOpenCurriculum,
  onSelectWorld,
}) => {
  const isDark = theme === 'dark';

  const handleWorldClick = (world: WorldTopicSection) => {
    soundFX.playClick();
    if (onSelectWorld) {
      onSelectWorld(world.worldId);
    } else {
      onOpenCurriculum(world.worldId);
    }
  };

  return (
    <div
      className={`min-h-full min-h-screen w-full flex flex-col items-center select-none pb-32 pt-1 px-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0b0f19] text-[#f1f3f8]' : 'bg-[#e8eaf0] text-[#1e2433]'
      }`}
    >
      <div className="w-full max-w-md flex flex-col">
        {/* ================= 3 COMPACT STATUS PILLS (NEUMORPHIC DESIGN) ================= */}
        <section className="w-full mb-3 pt-2 sticky top-1 z-30 backdrop-blur-md pb-1">
          <div className="flex items-center justify-between gap-2.5">
            {/* Streak */}
            <div
              className={`flex-1 neu-pressed py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                isDark ? 'bg-[#0e131e] text-[#dfe2f1]' : 'bg-[#e8eaf0] text-[#2e3040]'
              }`}
            >
              <span className="text-sm leading-none">🔥</span>
              <span className="font-mono text-xs font-semibold text-inherit">
                {userStats.streak || 12}
              </span>
            </div>

            {/* Journey Completion % (Progress) */}
            <div
              className={`flex-1 neu-pressed py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                isDark ? 'bg-[#0e131e] text-[#dfe2f1]' : 'bg-[#e8eaf0] text-[#2e3040]'
              }`}
            >
              <span className="text-xs leading-none">📈</span>
              <span className="font-mono text-xs font-semibold text-inherit">68%</span>
            </div>

            {/* Gems */}
            <div
              className={`flex-1 neu-pressed py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                isDark ? 'bg-[#0e131e] text-[#dfe2f1]' : 'bg-[#e8eaf0] text-[#2e3040]'
              }`}
            >
              <span className="text-xs leading-none">💎</span>
              <span className="font-mono text-xs font-semibold text-inherit">
                {userStats.stars || 120}
              </span>
            </div>
          </div>
        </section>

        {/* ================= HERO HEADER ================= */}
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div className="flex flex-col">
            <h1 className="text-lg font-['Outfit'] font-extrabold tracking-tight">
              Kotlin Core Worlds
            </h1>
            <p className="text-[11px] font-mono text-slate-400">
              10 Mastery Worlds • Tap a world along the path
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onOpenCurriculum();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-['Outfit'] text-xs font-bold shadow-sm shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">map</span>
            <span>All Worlds</span>
          </button>
        </div>

        {/* ================= SNAKE RIBBON LEARNING PATH (10 WORLDS) ================= */}
        <section className="relative w-full pt-1 pb-4 flex flex-col items-center overflow-hidden">
          {/* SVG Snake Track */}
          <svg
            className="absolute top-0 inset-x-0 w-full h-[1180px] pointer-events-none stroke-current"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 360 1180"
          >
            <defs>
              <linearGradient id="activeGrad-worlds" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor={isDark ? '#273349' : '#d0d2dc'} />
              </linearGradient>
            </defs>

            {/* Neumorphic highlight track */}
            <path
              d="M 80,58 C 80,115.5 180,115.5 180,173 C 180,230.5 280,230.5 280,288 C 280,345.5 180,345.5 180,403 C 180,460.5 80,460.5 80,518 C 80,575.5 180,575.5 180,633 C 180,690.5 280,690.5 280,748 C 280,805.5 180,805.5 180,863 C 180,920.5 80,920.5 80,978 C 80,1024 180,1024 180,1070 L 180,1090"
              opacity={isDark ? '0.15' : '0.95'}
              stroke="#ffffff"
              strokeLinecap="round"
              strokeWidth="14"
            />

            {/* Recessed base track */}
            <path
              d="M 80,58 C 80,115.5 180,115.5 180,173 C 180,230.5 280,230.5 280,288 C 280,345.5 180,345.5 180,403 C 180,460.5 80,460.5 80,518 C 80,575.5 180,575.5 180,633 C 180,690.5 280,690.5 280,748 C 280,805.5 180,805.5 180,863 C 180,920.5 80,920.5 80,978 C 80,1024 180,1024 180,1070 L 180,1090"
              stroke={isDark ? '#1a2233' : '#d0d2dc'}
              strokeLinecap="round"
              strokeWidth="8"
            />

            {/* Active completed gradient ribbon on started worlds */}
            <path
              d="M 80,58 C 80,115.5 180,115.5 180,173"
              stroke="url(#activeGrad-worlds)"
              strokeDasharray="4 5"
              strokeLinecap="round"
              strokeWidth="6"
            />
          </svg>

          {/* ================= 10 WORLD NODES ================= */}
          <div className="w-full flex flex-col z-10">
            {HOME_WORLDS.map((world, idx) => {
              const meta = WORLD_CARD_META[world.worldId] || {
                tagline: 'Kotlin core concepts',
                icon: 'data_object',
                badge: `WORLD ${world.worldNumber}`,
                gradient: 'from-indigo-600 to-blue-600',
                accentColor: '#4f46e5',
              };

              const isFirstWorld = world.worldNumber === 1;
              const isLastWorld = world.worldNumber === 10;
              const isStarted = world.completedCount > 0;

              // Node Position Pattern: Left (0, 4, 8), Right (2, 6), Center (1, 3, 5, 7, 9)
              const isLeft = idx === 0 || idx === 4 || idx === 8;
              const isRight = idx === 2 || idx === 6;
              const isCenter = !isLeft && !isRight;

              // Final Boss Milestone (World 10)
              if (isLastWorld) {
                return (
                  <div
                    key={world.worldId}
                    id={`world-node-${world.worldNumber}`}
                    className="relative w-full h-[150px] flex items-center justify-center z-20 px-3 pt-2"
                  >
                    <div
                      onClick={() => handleWorldClick(world)}
                      className={`rounded-3xl p-4 w-full max-w-[340px] flex items-center justify-between border transition-all cursor-pointer hover:border-amber-500/60 hover:scale-[1.02] active:scale-[0.98] ${
                        isDark
                          ? 'bg-[#151b28] border-amber-500/30 shadow-lg shadow-amber-950/20'
                          : 'bg-white border-amber-300 neu-raised-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center relative shrink-0 ${
                            isDark ? 'bg-amber-950/60 text-amber-400' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[26px]">military_tech</span>
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-[#151b28]" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-amber-500">
                              WORLD 10 • CAPSTONE
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              • +250 XP
                            </span>
                          </div>
                          <h3 className="text-xs font-['Outfit'] font-bold">
                            World 10: {world.topicTitle}
                          </h3>
                          <span className="text-[10px] text-slate-400">
                            MVVM, StateFlow & Production App
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                          isDark
                            ? 'bg-[#0f1420] border-white/5 text-amber-400'
                            : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </div>
                    </div>
                  </div>
                );
              }

              // Left Aligned World Node
              if (isLeft) {
                return (
                  <div
                    key={world.worldId}
                    id={`world-node-${world.worldNumber}`}
                    className="relative w-full h-[115px] flex items-center justify-start pl-6 z-10"
                  >
                    <div
                      onClick={() => handleWorldClick(world)}
                      className="group flex items-center gap-3.5 cursor-pointer select-none active:scale-95 transition-transform"
                    >
                      {/* World Node Button */}
                      <div
                        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shrink-0 ${
                          isFirstWorld
                            ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/40 pulsing-dot'
                            : isDark
                            ? 'bg-[#151b28] border-white/10 text-slate-400 group-hover:text-white group-hover:border-indigo-500/40 shadow-md'
                            : 'bg-white border-slate-200 text-slate-600 group-hover:border-indigo-400 shadow-sm'
                        }`}
                      >
                        <span
                          className={`absolute -top-1.5 -left-1.5 px-1.5 py-0.2 rounded-md text-[9px] font-mono font-bold border ${
                            isFirstWorld
                              ? 'bg-indigo-950 text-indigo-200 border-indigo-400/50'
                              : isDark
                              ? 'bg-[#0e131e] text-slate-400 border-white/10'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          W{world.worldNumber}
                        </span>
                        <span className="material-symbols-outlined text-[24px]">
                          {meta.icon}
                        </span>
                      </div>

                      {/* World Label */}
                      <div className="flex flex-col max-w-[210px]">
                        <span className="text-[10px] font-mono font-bold tracking-wide uppercase text-indigo-500">
                          World {world.worldNumber}
                        </span>
                        <span className="text-xs font-['Outfit'] font-bold text-inherit group-hover:text-indigo-400 transition-colors leading-snug">
                          {world.topicTitle}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-mono font-semibold ${
                              isStarted ? 'text-emerald-500' : 'text-slate-400'
                            }`}
                          >
                            {isStarted ? `${world.completedCount}/${world.totalCount} completed` : `${world.totalCount} Lessons`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Right Aligned World Node
              if (isRight) {
                return (
                  <div
                    key={world.worldId}
                    id={`world-node-${world.worldNumber}`}
                    className="relative w-full h-[115px] flex items-center justify-end pr-6 z-10"
                  >
                    <div
                      onClick={() => handleWorldClick(world)}
                      className="group flex items-center gap-3.5 flex-row-reverse cursor-pointer select-none active:scale-95 transition-transform text-right"
                    >
                      {/* World Node Button */}
                      <div
                        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shrink-0 ${
                          isDark
                            ? 'bg-[#151b28] border-white/10 text-slate-400 group-hover:text-white group-hover:border-indigo-500/40 shadow-md'
                            : 'bg-white border-slate-200 text-slate-600 group-hover:border-indigo-400 shadow-sm'
                        }`}
                      >
                        <span
                          className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-md text-[9px] font-mono font-bold border ${
                            isDark
                              ? 'bg-[#0e131e] text-slate-400 border-white/10'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          W{world.worldNumber}
                        </span>
                        <span className="material-symbols-outlined text-[24px]">
                          {meta.icon}
                        </span>
                      </div>

                      {/* World Label */}
                      <div className="flex flex-col items-end max-w-[210px]">
                        <span className="text-[10px] font-mono font-bold tracking-wide uppercase text-indigo-500">
                          World {world.worldNumber}
                        </span>
                        <span className="text-xs font-['Outfit'] font-bold text-inherit group-hover:text-indigo-400 transition-colors leading-snug">
                          {world.topicTitle}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-mono font-semibold ${
                              isStarted ? 'text-emerald-500' : 'text-slate-400'
                            }`}
                          >
                            {isStarted ? `${world.completedCount}/${world.totalCount} completed` : `${world.totalCount} Lessons`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Center Aligned World Node
              return (
                <div
                  key={world.worldId}
                  id={`world-node-${world.worldNumber}`}
                  className="relative w-full h-[115px] flex items-center justify-center z-10"
                >
                  <div
                    onClick={() => handleWorldClick(world)}
                    className="group flex flex-col items-center cursor-pointer select-none active:scale-95 transition-transform text-center"
                  >
                    {/* World Node Button */}
                    <div
                      className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                        isDark
                          ? 'bg-[#151b28] border-white/10 text-slate-400 group-hover:text-white group-hover:border-indigo-500/40 shadow-md'
                          : 'bg-white border-slate-200 text-slate-600 group-hover:border-indigo-400 shadow-sm'
                      }`}
                    >
                      <span
                        className={`absolute -top-1.5 -left-1.5 px-1.5 py-0.2 rounded-md text-[9px] font-mono font-bold border ${
                          isDark
                            ? 'bg-[#0e131e] text-slate-400 border-white/10'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        W{world.worldNumber}
                      </span>
                      <span className="material-symbols-outlined text-[24px]">
                        {meta.icon}
                      </span>
                    </div>

                    {/* World Label Below */}
                    <span className="text-[10px] font-mono font-bold tracking-wide uppercase text-indigo-500 mt-1">
                      World {world.worldNumber}
                    </span>
                    <span className="text-xs font-['Outfit'] font-bold text-inherit group-hover:text-indigo-400 transition-colors leading-snug">
                      {world.topicTitle}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold ${
                        isStarted ? 'text-emerald-500' : 'text-slate-400'
                      }`}
                    >
                      {isStarted ? `${world.completedCount}/${world.totalCount}` : `${world.totalCount} Lessons`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= END OF WORLDS CAPSTONE BANNER ================= */}
        <section className="w-full mt-6 mb-4 flex flex-col items-center">
          <div
            className={`w-full rounded-3xl p-5 border flex flex-col items-center text-center transition-all ${
              isDark
                ? 'bg-gradient-to-b from-[#151b28] to-[#0f1420] border-indigo-500/30 shadow-xl'
                : 'bg-gradient-to-b from-white to-slate-50 border-indigo-200 shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 mb-2.5">
              <span className="material-symbols-outlined text-[28px]">account_tree</span>
            </div>
            <h3 className="text-sm font-['Outfit'] font-bold mb-1">
              Global Curriculum Map
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-3">
              View all 60 interactive lessons, branch trees, and trials across the complete 10 worlds.
            </p>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onOpenCurriculum();
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-['Outfit'] font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">map</span>
              <span>Open Global Curriculum Map</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
