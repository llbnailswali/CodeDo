import React from 'react';
import { AppTheme, UserStats } from '../types';
import { soundFX } from '../utils/audio';
import { HOME_WORLDS, WorldTopicNode, WorldTopicSection } from '../data/homeWorldsData';

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
  const isDark = theme === 'dark';

  const handleNodeClick = (world: WorldTopicSection, node: WorldTopicNode) => {
    soundFX.playClick();
    if (node.status === 'active') {
      onStartLesson();
    } else {
      onSelectNode?.(world.topicTitle);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center select-none pb-32 pt-1 px-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0b0f19] text-[#f1f3f8]' : 'bg-[#e8eaf0] text-[#1e2433]'
      }`}
    >
      <div className="w-full max-w-md flex flex-col">
        {/* ================= 3 COMPACT STATUS PILLS (NEUMORPHIC DESIGN) ================= */}
        <section className="w-full mb-2 pt-2 sticky top-1 z-30 backdrop-blur-md pb-1">
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

        {/* ================= ALL WORLDS WITH TOPICS (CONTINUOUS SCROLL) ================= */}
        <div className="w-full flex flex-col">
          {HOME_WORLDS.map((world, worldIdx) => {
            const isFirstWorld = world.worldNumber === 1;

            return (
              <div key={world.worldId} className="w-full flex flex-col">
                {/* Connector from previous world */}
                {worldIdx > 0 && (
                  <div className="w-full flex items-center justify-center py-2">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-0.5 h-6 border-l-2 border-dashed ${
                          isDark ? 'border-slate-700' : 'border-slate-300'
                        }`}
                      />
                      <span className="material-symbols-outlined text-[16px] text-slate-400">
                        arrow_downward
                      </span>
                    </div>
                  </div>
                )}

                {/* ================= TOPIC & TRACKING PROGRESS HEADER ================= */}
                <section className="mb-2 mt-2">
                  <div
                    className={`rounded-2xl px-4 py-3.5 flex items-center justify-between border transition-all ${
                      isDark
                        ? 'bg-[#151b28] border-white/10 shadow-md'
                        : 'bg-white border-slate-200/80 neu-raised-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold border ${
                          world.completedCount > 0
                            ? isDark
                              ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : isDark
                            ? 'bg-[#0e131e] text-slate-400 border-white/5'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        W{world.worldNumber}
                      </span>
                      <h2 className="text-base font-['Outfit'] font-bold tracking-tight text-inherit">
                        {world.topicTitle}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-bold px-2.5 py-1 rounded-xl border ${
                          world.completedCount > 0
                            ? isDark
                              ? 'bg-indigo-950/50 text-indigo-300 border-indigo-500/30'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : isDark
                            ? 'bg-[#0e131e] text-slate-400 border-white/5'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {world.completedCount}/{world.totalCount}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold px-2 py-1 rounded-xl border ${
                          world.percentage > 0
                            ? isDark
                              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isDark
                            ? 'bg-[#0e131e] text-slate-400 border-white/5'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {world.percentage}%
                      </span>
                    </div>
                  </div>
                </section>

                {/* ================= SNAKE RIBBON LEARNING PATH FOR WORLD ================= */}
                <section className="relative w-full pt-1 pb-4 flex flex-col items-center overflow-hidden">
                  {/* SVG Snake Track */}
                  <svg
                    className="absolute top-2 inset-x-0 w-full h-[530px] pointer-events-none stroke-current"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 360 530"
                  >
                    <defs>
                      <linearGradient id={`activeGrad-${world.worldId}`} x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor={isDark ? '#273349' : '#d0d2dc'} />
                      </linearGradient>
                    </defs>

                    {/* Neumorphic highlight track */}
                    <path
                      d="M 80,32 C 80,75 180,75 180,120 C 180,165 280,165 280,210 C 280,255 180,255 180,300 C 180,345 80,345 80,390 C 80,435 180,435 180,480 L 180,530"
                      opacity={isDark ? '0.15' : '0.95'}
                      stroke="#ffffff"
                      strokeLinecap="round"
                      strokeWidth="12"
                    />

                    {/* Recessed base track */}
                    <path
                      d="M 80,32 C 80,75 180,75 180,120 C 180,165 280,165 280,210 C 280,255 180,255 180,300 C 180,345 80,345 80,390 C 80,435 180,435 180,480 L 180,530"
                      stroke={isDark ? '#1a2233' : '#d0d2dc'}
                      strokeLinecap="round"
                      strokeWidth="7"
                    />

                    {/* Active completed gradient ribbon on World 1 */}
                    {isFirstWorld && (
                      <path
                        d="M 80,32 C 80,75 180,75 180,120"
                        stroke={`url(#activeGrad-${world.worldId})`}
                        strokeDasharray="4 5"
                        strokeLinecap="round"
                        strokeWidth="5"
                      />
                    )}
                  </svg>

                  {/* NODE 0: Left */}
                  {world.nodes[0] && (
                    <div className="relative w-full flex items-center justify-start pl-8 pt-1 z-10">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleNodeClick(world, world.nodes[0])}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform active:scale-95 border cursor-pointer ${
                            world.nodes[0].status === 'completed'
                              ? isDark
                                ? 'bg-[#151b28] border-white/10 text-indigo-400 shadow-md'
                                : 'bg-white border-slate-200 text-indigo-600 shadow-sm'
                              : isDark
                              ? 'bg-[#151b28] border-white/5 text-slate-500'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[22px]">
                            {world.nodes[0].status === 'completed' ? 'check_circle' : 'lock'}
                          </span>
                        </button>
                        <div className="flex flex-col">
                          <span className="text-xs font-['Outfit'] font-semibold">
                            {world.nodes[0].title}
                          </span>
                          <span
                            className={`text-[10px] font-semibold ${
                              world.nodes[0].status === 'completed'
                                ? 'text-emerald-500'
                                : 'text-slate-400'
                            }`}
                          >
                            {world.nodes[0].subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NODE 1: Center */}
                  {world.nodes[1] && (
                    <div className="relative w-full flex items-center justify-center pt-8 z-20">
                      <div className="flex flex-col items-center">
                        {world.nodes[1].status === 'active' ? (
                          <button
                            type="button"
                            onClick={() => handleNodeClick(world, world.nodes[1])}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 pulsing-dot transition-transform active:scale-95 hover:brightness-105 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[26px]">play_arrow</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleNodeClick(world, world.nodes[1])}
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center border cursor-pointer ${
                              isDark
                                ? 'bg-[#151b28] border-white/5 text-slate-500'
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">lock</span>
                          </button>
                        )}
                        <span className="text-xs font-['Outfit'] font-bold mt-2 text-inherit text-center">
                          {world.nodes[1].title}
                        </span>
                        <span
                          className={`text-[10px] font-mono ${
                            world.nodes[1].status === 'active'
                              ? 'text-indigo-500 font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          {world.nodes[1].subtitle}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* NODE 2: Right */}
                  {world.nodes[2] && (
                    <div className="relative w-full flex items-center justify-end pr-8 pt-8 z-10">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <button
                          type="button"
                          onClick={() => handleNodeClick(world, world.nodes[2])}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center border cursor-pointer ${
                            isDark
                              ? 'bg-[#151b28] border-white/5 text-slate-500'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">lock</span>
                        </button>
                        <div className="flex flex-col text-right">
                          <span className="text-xs font-['Outfit'] font-semibold text-slate-400">
                            {world.nodes[2].title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {world.nodes[2].subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NODE 3: Center */}
                  {world.nodes[3] && (
                    <div className="relative w-full flex items-center justify-center pt-8 z-10">
                      <div className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => handleNodeClick(world, world.nodes[3])}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center border cursor-pointer ${
                            isDark
                              ? 'bg-[#151b28] border-white/5 text-slate-500'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">lock</span>
                        </button>
                        <span className="text-xs font-['Outfit'] font-semibold text-slate-400 mt-1.5 text-center">
                          {world.nodes[3].title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {world.nodes[3].subtitle}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* NODE 4: Left */}
                  {world.nodes[4] && (
                    <div className="relative w-full flex items-center justify-start pl-9 pt-8 z-10">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleNodeClick(world, world.nodes[4])}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center border cursor-pointer ${
                            isDark
                              ? 'bg-[#151b28] border-white/5 text-slate-500'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">lock</span>
                        </button>
                        <div className="flex flex-col">
                          <span className="text-xs font-['Outfit'] font-semibold text-slate-400">
                            {world.nodes[4].title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {world.nodes[4].subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NODE 5: Boss Challenge Milestone (Center) */}
                  {world.nodes[5] && (
                    <div className="relative w-full max-w-[340px] pt-9 z-20 flex flex-col items-center">
                      <div
                        onClick={() => handleNodeClick(world, world.nodes[5])}
                        className={`rounded-3xl p-4 w-full flex items-center justify-between border transition-all cursor-pointer hover:border-purple-500/40 ${
                          isDark
                            ? 'bg-[#151b28] border-white/10 shadow-lg'
                            : 'bg-white border-slate-200/80 shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center relative ${
                              isDark ? 'bg-[#0f1420] text-purple-400' : 'bg-purple-50 text-purple-600'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[26px]">swords</span>
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-500" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-purple-400">
                                FINAL TRIAL
                              </span>
                              <span className="text-[9px] font-mono text-slate-400">
                                • {world.nodes[5].xpReward} XP
                              </span>
                            </div>
                            <h3 className="text-xs font-['Outfit'] font-bold">
                              {world.nodes[5].bossTitle || world.nodes[5].title}
                            </h3>
                            <span className="text-[10px] text-slate-400">
                              {world.nodes[5].bossSubtitle || world.nodes[5].subtitle}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                            isDark
                              ? 'bg-[#0f1420] border-white/5 text-slate-500'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">lock</span>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            );
          })}
        </div>

        {/* ================= END OF CURRICULUM CAPSTONE CELEBRATION ================= */}
        <section className="w-full mt-6 mb-8 flex flex-col items-center">
          <div
            className={`w-full max-w-[340px] rounded-3xl p-5 border flex flex-col items-center text-center transition-all ${
              isDark
                ? 'bg-gradient-to-b from-[#151b28] to-[#0f1420] border-indigo-500/30 shadow-xl'
                : 'bg-gradient-to-b from-white to-slate-50 border-indigo-200 shadow-md'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 mb-3">
              <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-500 mb-1">
              CURRICULUM HORIZON REACHED
            </span>
            <h3 className="text-base font-['Outfit'] font-bold mb-1.5">
              10 Worlds • All Topics Unlocked
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              From basic variable mutability to advanced Jetpack Compose and production MVVM architecture.
            </p>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onOpenCurriculum();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-['Outfit'] font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Open Global Curriculum Map</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
