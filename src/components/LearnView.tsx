import React, { useState } from 'react';
import { AppTheme, UserStats, CurriculumLevel } from '../types';
import { soundFX } from '../utils/audio';
import { HOME_WORLDS, WORLD_CARD_META, WorldTopicSection } from '../data/homeWorldsData';
import { CURRICULUM_LEVELS_META } from '../data/curriculum/masterCurriculumCatalog';

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
  const [activeLevel, setActiveLevel] = useState<CurriculumLevel>('beginner');

  const filteredWorlds = HOME_WORLDS.filter((w) => w.level === activeLevel);
  const currentLevelMeta = CURRICULUM_LEVELS_META[activeLevel];

  const handleWorldClick = (world: WorldTopicSection) => {
    soundFX.playClick();
    if (onSelectWorld) {
      onSelectWorld(world.worldId);
    } else {
      onOpenCurriculum(world.worldId);
    }
  };

  const handleLevelChange = (level: CurriculumLevel) => {
    soundFX.playClick();
    setActiveLevel(level);
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

            {/* Journey Progress */}
            <div
              className={`flex-1 neu-pressed py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                isDark ? 'bg-[#0e131e] text-[#dfe2f1]' : 'bg-[#e8eaf0] text-[#2e3040]'
              }`}
            >
              <span className="text-xs leading-none">📈</span>
              <span className="font-mono text-xs font-semibold text-inherit">
                {activeLevel === 'beginner' ? '28%' : activeLevel === 'intermediate' ? '0%' : '0%'}
              </span>
            </div>

            {/* Gems / XP */}
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

        {/* ================= 3-LEVEL TRACK TABS (BEGINNER, INTERMEDIATE, EXPERIENCED) ================= */}
        <section className="w-full mb-3">
          <div
            className={`p-1 rounded-2xl flex items-center border transition-all ${
              isDark ? 'bg-[#151b28] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {(['beginner', 'intermediate', 'experienced'] as CurriculumLevel[]).map((lvl) => {
              const meta = CURRICULUM_LEVELS_META[lvl];
              const isActive = activeLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleLevelChange(lvl)}
                  className={`flex-1 py-2 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-indigo-600 text-white shadow-sm'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[11px] font-['Outfit'] font-bold leading-tight">
                    {meta.title}
                  </span>
                  <span className="text-[9px] font-mono opacity-80 leading-tight">
                    {lvl === 'beginner'
                      ? 'Worlds 1–8'
                      : lvl === 'intermediate'
                      ? 'Worlds 9–15'
                      : 'Worlds 16–22'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= HERO HEADER ================= */}
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentLevelMeta.color }}
              />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {currentLevelMeta.badge} • {currentLevelMeta.worldsCount} WORLDS
              </span>
            </div>
            <h1 className="text-lg font-['Outfit'] font-extrabold tracking-tight">
              {currentLevelMeta.title} Learning Path
            </h1>
            <p className="text-[11px] text-slate-400 max-w-[260px] line-clamp-1">
              {currentLevelMeta.goal}
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
            <span>All 22 Worlds</span>
          </button>
        </div>

        {/* ================= LEARNING PATH CARDS LIST FOR ACTIVE TRACK ================= */}
        <section className="relative w-full pt-2 pb-4 flex flex-col gap-3.5 z-10">
          {filteredWorlds.map((world, idx) => {
            const meta = WORLD_CARD_META[world.worldId] || {
              tagline: 'Kotlin core concepts',
              icon: 'data_object',
              badge: `W${world.worldNumber}`,
              gradient: 'from-indigo-600 to-blue-600',
              accentColor: '#4f46e5',
              level: world.level,
            };

            const isCapstone =
              world.worldNumber === 8 || world.worldNumber === 15 || world.worldNumber === 22;
            const isStarted = world.completedCount > 0;
            const isCurrent = world.worldNumber === 1;

            return (
              <div
                key={world.worldId}
                id={`world-node-${world.worldNumber}`}
                onClick={() => handleWorldClick(world)}
                className={`w-full rounded-2xl p-4 border transition-all cursor-pointer select-none active:scale-[0.98] ${
                  isCapstone
                    ? isDark
                      ? 'bg-gradient-to-r from-amber-950/40 to-[#151b28] border-amber-500/40 shadow-lg'
                      : 'bg-gradient-to-r from-amber-50/80 to-white border-amber-300 shadow-md'
                    : isCurrent
                    ? isDark
                      ? 'bg-[#151b28] border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-white border-indigo-400 shadow-md ring-1 ring-indigo-400/20'
                    : isDark
                    ? 'bg-[#151b28] border-white/10 hover:border-indigo-500/40 shadow-sm'
                    : 'bg-white border-slate-200/90 hover:border-indigo-400 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Icon & Badge */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border relative ${
                        isCapstone
                          ? isDark
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                            : 'bg-amber-100 border-amber-300 text-amber-700'
                          : isCurrent
                          ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white border-indigo-400'
                          : isDark
                          ? 'bg-[#0f1420] border-white/10 text-slate-400'
                          : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {isCapstone ? 'military_tech' : meta.icon}
                      </span>
                      <span
                        className={`absolute -bottom-1 -right-1 px-1 py-0.2 rounded text-[8px] font-mono font-bold ${
                          isDark ? 'bg-[#0e131e] text-slate-300' : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        W{world.worldNumber}
                      </span>
                    </div>

                    {/* Middle: World Title & Details */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                            isCapstone
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                              : isCurrent
                              ? 'bg-indigo-500/10 text-indigo-500'
                              : 'bg-slate-500/10 text-slate-400'
                          }`}
                        >
                          {meta.badge}
                        </span>
                        {isCapstone && (
                          <span className="text-[9px] font-mono font-semibold text-amber-500">
                            ★ Capstone Boss
                          </span>
                        )}
                      </div>

                      <h2 className="text-sm font-['Outfit'] font-bold text-inherit truncate">
                        World {world.worldNumber}: {world.topicTitle}
                      </h2>

                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {meta.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Right: Progress & Chevron */}
                  <div className="flex flex-col items-end shrink-0 pl-1">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isStarted ? 'text-emerald-500' : 'text-slate-400'
                      }`}
                    >
                      {isStarted ? `${world.completedCount}/${world.totalCount}` : `${world.totalCount} steps`}
                    </span>
                    <div
                      className={`mt-1.5 w-6 h-6 rounded-lg flex items-center justify-center ${
                        isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar for started worlds */}
                {world.percentage > 0 && (
                  <div
                    className={`mt-3 w-full h-1.5 rounded-full overflow-hidden ${
                      isDark ? 'bg-[#090d16]' : 'bg-slate-100'
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${world.percentage}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* ================= TRACK CAPSTONE SUMMARY BANNER ================= */}
        <section className="w-full mt-2 mb-4 flex flex-col items-center">
          <div
            className={`w-full rounded-3xl p-5 border flex flex-col items-center text-center transition-all ${
              isDark
                ? 'bg-gradient-to-b from-[#151b28] to-[#0f1420] border-indigo-500/30 shadow-xl'
                : 'bg-gradient-to-b from-white to-slate-50 border-indigo-200 shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 mb-2.5">
              <span className="material-symbols-outlined text-[28px]">military_tech</span>
            </div>
            <h3 className="text-sm font-['Outfit'] font-bold mb-1">
              {currentLevelMeta.bossTitle}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-3">
              {currentLevelMeta.bossDescription}
            </p>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onOpenCurriculum();
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-['Outfit'] font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">account_tree</span>
              <span>Open Master Curriculum (22 Worlds)</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
