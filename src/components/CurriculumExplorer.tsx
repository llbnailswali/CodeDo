import React, { useState, useEffect, useRef } from 'react';
import { AppTheme, WorldMeta, CurriculumLevel } from '../types';
import { WORLDS_CATALOG } from '../data/curriculumData';
import { CURRICULUM_LEVELS_META } from '../data/curriculum/masterCurriculumCatalog';
import { soundFX } from '../utils/audio';

interface CurriculumExplorerProps {
  theme: AppTheme;
  initialWorldId?: string;
  onJumpToToday: () => void;
  onStartLesson?: (topic?: string) => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  theme,
  initialWorldId,
  onJumpToToday,
  onStartLesson,
}) => {
  // Selected active world in the curriculum journey
  const [selectedWorldId, setSelectedWorldId] = useState<string>(initialWorldId || 'world-1');
  const [viewMode, setViewMode] = useState<'focused' | 'all'>('focused');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<CurriculumLevel | 'all'>('all');

  // Ref to the horizontal scrollable world strip
  const scrollStripRef = useRef<HTMLDivElement>(null);
  const worldButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Function to scroll the world scroller so the active world is centered/visible
  const scrollToActiveWorld = (worldId: string) => {
    const container = scrollStripRef.current;
    const btn = worldButtonRefs.current.get(worldId);
    if (container && btn) {
      const containerWidth = container.clientWidth;
      const btnLeft = btn.offsetLeft;
      const btnWidth = btn.offsetWidth;
      const targetScrollLeft = btnLeft - containerWidth / 2 + btnWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });
    } else if (btn) {
      btn.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  useEffect(() => {
    if (initialWorldId) {
      setSelectedWorldId(initialWorldId);
      const targetWorld = WORLDS_CATALOG.find((w) => w.id === initialWorldId);
      if (targetWorld && targetWorld.level) {
        // keep current level or match
      }

      // Scroll root container to top when entering or switching worlds
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      const timer = setTimeout(() => {
        scrollToActiveWorld(initialWorldId);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [initialWorldId]);

  const isDark = theme === 'dark';
  const selectedWorld: WorldMeta =
    WORLDS_CATALOG.find((w) => w.id === selectedWorldId) || WORLDS_CATALOG[0];

  const handleWorldSelect = (worldId: string) => {
    soundFX.playClick();
    setSelectedWorldId(worldId);
    scrollToActiveWorld(worldId);
  };

  const handleLaunchLesson = (lessonTitle: string) => {
    soundFX.playClick();
    if (onStartLesson) {
      const lower = lessonTitle.toLowerCase();
      if (lower.includes('loop') || lower.includes('for') || lower.includes('while')) {
        onStartLesson('loops');
      } else if (lower.includes('function') || lower.includes('scope') || lower.includes('parameter')) {
        onStartLesson('functions');
      } else {
        onStartLesson('variables');
      }
    } else {
      onJumpToToday();
    }
  };

  const displayedWorlds =
    selectedLevelFilter === 'all'
      ? WORLDS_CATALOG
      : WORLDS_CATALOG.filter((w) => w.level === selectedLevelFilter);

  return (
    <div
      className={`min-h-full min-h-screen w-full flex flex-col items-center select-none pb-28 pt-2 px-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0b0f19] text-[#e2e8f0]' : 'bg-[#f1f4f9] text-[#1e2433]'
      }`}
    >
      <div className="w-full max-w-md flex flex-col">
        {/* ================= TOP LEVEL FILTER & VIEW TOGGLE ================= */}
        <section className="mb-3 pt-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-['Outfit'] font-bold uppercase tracking-wider text-indigo-500">
                22 MASTER WORLDS
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedWorld.levelTitle || 'Beginner'}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setViewMode('focused');
                }}
                className={`px-2.5 py-1 rounded-lg font-['Outfit'] font-bold transition-all ${
                  viewMode === 'focused'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                World Timeline
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setViewMode('all');
                }}
                className={`px-2.5 py-1 rounded-lg font-['Outfit'] font-bold transition-all ${
                  viewMode === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All 22
              </button>
            </div>
          </div>

          {/* Level Filter Tabs */}
          <div
            className={`p-1 rounded-xl flex items-center border transition-all mb-2 ${
              isDark ? 'bg-[#151b28] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {(['all', 'beginner', 'intermediate', 'experienced'] as const).map((lvl) => {
              const isActive = selectedLevelFilter === lvl;
              const label =
                lvl === 'all'
                  ? 'All (22)'
                  : lvl === 'beginner'
                  ? 'Beginner (8)'
                  : lvl === 'intermediate'
                  ? 'Intermediate (7)'
                  : 'Experienced (7)';

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedLevelFilter(lvl);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-center font-['Outfit'] text-[11px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Scrollable World Navigation Strip */}
          <div
            ref={scrollStripRef}
            className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth scrollbar-none overscroll-x-contain touch-pan-x"
          >
            {displayedWorlds.map((w) => {
              const isSelected = w.id === selectedWorldId;
              const levelBadgeColor =
                w.level === 'beginner'
                  ? '#10b981'
                  : w.level === 'intermediate'
                  ? '#06b6d4'
                  : '#8b5cf6';

              return (
                <button
                  key={w.id}
                  id={`curriculum-world-pill-${w.id}`}
                  ref={(el) => {
                    if (el) {
                      worldButtonRefs.current.set(w.id, el);
                    } else {
                      worldButtonRefs.current.delete(w.id);
                    }
                  }}
                  type="button"
                  onClick={() => handleWorldSelect(w.id)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                        : 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-sm'
                      : isDark
                      ? 'bg-[#151b28] border-white/10 text-slate-400 hover:text-white'
                      : 'bg-white border-slate-200/80 text-slate-600 shadow-sm'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-['Outfit'] text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isDark
                        ? 'bg-[#0f1420] text-slate-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {w.order}
                  </span>
                  <div className="flex flex-col min-w-0 pr-1">
                    <div className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: levelBadgeColor }}
                      />
                      <span className="font-['Outfit'] text-xs font-bold truncate max-w-[120px]">
                        {w.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {w.lessons.length} lessons
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= FOCUSED WORLD OR ALL WORLDS VIEW ================= */}
        {viewMode === 'focused' ? (
          /* SINGLE FOCUSED WORLD TIMELINE */
          <div className="flex flex-col">
            {/* World Hero Header */}
            <section
              className={`rounded-3xl p-5 border mb-5 transition-all ${
                isDark
                  ? 'bg-[#151b28] border-white/10 shadow-lg'
                  : 'bg-white border-slate-200/80 shadow-sm'
              }`}
            >
              {/* Level & Kotlin Track Badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                  <svg className="w-3.5 h-3.5 rounded-sm" fill="none" viewBox="0 0 24 24">
                    <path d="M24 24H0V0H24L12 12L24 24Z" fill="url(#kotlin-grad)"></path>
                    <defs>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="kotlin-grad"
                        x1="24"
                        x2="0"
                        y1="0"
                        y2="24"
                      >
                        <stop stopColor="#7F52FF"></stop>
                        <stop offset="0.5" stopColor="#C711E1"></stop>
                        <stop offset="1" stopColor="#E4485D"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                    Kotlin Track
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    selectedWorld.level === 'beginner'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : selectedWorld.level === 'intermediate'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  }`}
                >
                  {selectedWorld.levelTitle || 'Beginner'} Track
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-4">
                <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-500 font-['Outfit']">
                  World {selectedWorld.order} of 22
                </p>
                <h1 className="text-2xl font-extrabold font-['Outfit'] tracking-tight">
                  {selectedWorld.title}
                </h1>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {selectedWorld.subtitle}
                </p>
              </div>

              {/* Mastery Progress Card */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDark
                    ? 'bg-[#0f1420] border-white/5'
                    : 'bg-[#f0f3f8] border-slate-200/60 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-mono font-bold text-indigo-500 tracking-wide uppercase">
                    {selectedWorld.order === 1 ? '40% Mastered' : 'Available to explore'}
                  </span>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${
                      isDark
                        ? 'bg-[#151b28] border-white/10 text-slate-300'
                        : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Steps
                    </span>
                    <span className="text-[11px] font-mono font-bold ml-0.5">
                      {selectedWorld.lessons.length} Modules
                    </span>
                  </div>
                </div>

                {/* Progress Track */}
                <div
                  className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 ${
                    isDark ? 'bg-[#090d16]' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm"
                    style={{ width: selectedWorld.order === 1 ? '40%' : '10%' }}
                  ></div>
                </div>
              </div>
            </section>

            {/* Linear Curriculum Timeline */}
            <section className="relative pl-3 pr-1">
              {/* Central Connecting Stem Line */}
              <div
                aria-hidden="true"
                className="absolute left-7 top-4 bottom-20 w-1 rounded-full bg-gradient-to-b from-indigo-500 via-indigo-500/50 to-slate-400"
              />

              {/* Dynamic Lesson Nodes */}
              <div className="space-y-6">
                {selectedWorld.lessons.map((lesson, idx) => {
                  const isFirstTwo = selectedWorld.order === 1 && idx < 2;
                  const isCurrent = selectedWorld.order === 1 && idx === 2;
                  const isBoss = lesson.isBoss;

                  if (isBoss) {
                    /* Final Trial Boss Card */
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleLaunchLesson(lesson.title)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleLaunchLesson(lesson.title);
                          }
                        }}
                        className="relative z-10 pt-2 cursor-pointer select-none active:scale-[0.99] transition-transform"
                      >
                        <div
                          className={`rounded-3xl p-5 border shadow-xl relative overflow-hidden transition-all group ${
                            isDark
                              ? 'bg-gradient-to-br from-indigo-950/60 via-[#151b28] to-[#0f1420] border-indigo-500/30 hover:border-indigo-400'
                              : 'bg-white border-slate-200/80 shadow-md hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-[24px]">
                                  military_tech
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[10px] font-mono font-bold tracking-wide uppercase text-indigo-400">
                                    Final World Boss
                                  </span>
                                  <span className="text-slate-400 text-xs">•</span>
                                  <span className="text-[10px] font-mono font-bold text-slate-400">
                                    +{lesson.xpReward} XP
                                  </span>
                                </div>
                                <h3 className="text-base font-extrabold font-['Outfit'] leading-tight group-hover:text-indigo-400 transition-colors">
                                  {lesson.title}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {lesson.description}
                                </p>
                              </div>
                            </div>

                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                isDark
                                  ? 'bg-[#090d16] text-slate-400 border border-white/5 group-hover:text-indigo-400 group-hover:border-indigo-500/30'
                                  : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                chevron_right
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleLaunchLesson(lesson.title)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleLaunchLesson(lesson.title);
                        }
                      }}
                      className="relative z-10 flex items-center gap-4 group cursor-pointer select-none active:scale-[0.99] transition-transform"
                    >
                      {/* Node Avatar Icon */}
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center border transition-all shrink-0 ${
                          isFirstTwo
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                            : isCurrent
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30 ring-4 ring-indigo-500/20'
                            : isDark
                            ? 'bg-[#151b28] border-white/10 text-slate-400 group-hover:border-indigo-500/40 group-hover:text-white'
                            : 'bg-white border-slate-200 text-slate-600 group-hover:border-indigo-400 shadow-sm'
                        }`}
                      >
                        {isFirstTwo ? (
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        ) : (
                          <span className="font-['Outfit'] text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>

                      {/* Lesson Content Box */}
                      <div
                        className={`flex-1 rounded-2xl p-4 border transition-all ${
                          isCurrent
                            ? isDark
                              ? 'bg-[#151b28] border-indigo-500/60 shadow-md group-hover:border-indigo-400 group-hover:bg-[#192132]'
                              : 'bg-white border-indigo-300 shadow-md group-hover:border-indigo-500 group-hover:bg-indigo-50/40'
                            : isDark
                            ? 'bg-[#151b28]/60 border-white/5 group-hover:border-indigo-500/40 group-hover:bg-[#171e2e]'
                            : 'bg-white/80 border-slate-200/60 shadow-sm group-hover:border-indigo-300 group-hover:bg-indigo-50/20'
                        }`}
                      >
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-sm font-bold font-['Outfit'] group-hover:text-indigo-500 transition-colors">
                            {lesson.title}
                          </h3>
                          <span className="text-[10px] font-mono font-semibold text-slate-400">
                            Lesson {selectedWorld.order}.{idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs font-semibold ${
                              isFirstTwo
                                ? 'text-emerald-500'
                                : isCurrent
                                ? 'text-indigo-500'
                                : isDark
                                ? 'text-slate-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {isFirstTwo ? 'Completed' : isCurrent ? 'Available Now' : 'Start'}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-xs font-mono text-slate-400">
                            +{lesson.xpReward} XP
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-xs font-bold text-indigo-500 group-hover:text-indigo-400 group-hover:underline decoration-indigo-300">
                            {isFirstTwo ? 'Review' : 'Start'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next World Transition Button */}
              <div className="relative flex justify-center pt-6 pb-4">
                {(() => {
                  const nextOrder = selectedWorld.order + 1;
                  const nextWorld = WORLDS_CATALOG.find((w) => w.order === nextOrder);
                  if (!nextWorld) return null;
                  return (
                    <button
                      type="button"
                      onClick={() => handleWorldSelect(nextWorld.id)}
                      className={`px-4 py-2.5 rounded-full border flex items-center gap-2 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                        isDark
                          ? 'bg-[#151b28] border-white/10 text-slate-300 hover:text-white shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 hover:text-indigo-600 shadow-sm'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-indigo-500">
                        explore
                      </span>
                      <span className="font-['Outfit'] uppercase tracking-wider text-[11px]">
                        WORLD {nextWorld.order} • {nextWorld.title}
                      </span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  );
                })()}
              </div>
            </section>
          </div>
        ) : (
          /* ALL 22 WORLDS EXPANDED BROWSER */
          <div className="flex flex-col space-y-3">
            {displayedWorlds.map((world) => {
              const levelColor =
                world.level === 'beginner'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : world.level === 'intermediate'
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/30';

              return (
                <div
                  key={world.id}
                  className={`rounded-2xl p-4 border transition-all ${
                    world.id === selectedWorldId
                      ? isDark
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                        : 'bg-indigo-50/70 border-indigo-300 shadow-sm'
                      : isDark
                      ? 'bg-[#151b28] border-white/10 shadow-sm hover:border-indigo-500/30'
                      : 'bg-white border-slate-200/80 shadow-sm hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-['Outfit'] font-bold text-xs ${
                          isDark ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {world.order}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${levelColor}`}
                          >
                            {world.levelTitle || 'Track'}
                          </span>
                        </div>
                        <h3 className="font-['Outfit'] font-bold text-base leading-tight">
                          {world.title}
                        </h3>
                        <p className="text-xs text-slate-400">{world.subtitle}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedWorldId(world.id);
                        setViewMode('focused');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-['Outfit'] text-xs font-bold shadow-sm cursor-pointer"
                    >
                      Timeline
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-500/10 flex items-center justify-between text-xs text-slate-400">
                    <span>{world.lessons.length} lessons</span>
                    <span>+{world.lessons.reduce((acc, l) => acc + l.xpReward, 0)} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
