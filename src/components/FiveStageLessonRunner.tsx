import React, { useState, useEffect } from 'react';
import { AppTheme, UserStats } from '../types';
import { FiveStageLesson, AVAILABLE_FIVE_STAGE_LESSONS } from '../data/lessonStagesData';
import { soundFX } from '../utils/audio';

interface FiveStageLessonRunnerProps {
  theme: AppTheme;
  initialLessonKey?: string;
  userStats: UserStats;
  onExit: () => void;
  onCompleteLesson: (earnedXP: number) => void;
  onToggleTheme?: () => void;
}

const renderSnippetLine = (line: string, isDark: boolean) => {
  const trimmed = line.trim();
  const indent = line.startsWith('    ') || line.startsWith('\t');
  const indentClass = indent ? 'pl-4' : '';

  if (trimmed.startsWith('//')) {
    return (
      <div className={`${indentClass} ${isDark ? 'text-slate-500 italic' : 'text-slate-400 italic'}`}>
        {line}
      </div>
    );
  }

  if (trimmed.startsWith('fun ')) {
    const afterFun = trimmed.slice(4);
    const parenIdx = afterFun.indexOf('(');
    const fnName = parenIdx !== -1 ? afterFun.slice(0, parenIdx) : afterFun;
    const rest = parenIdx !== -1 ? afterFun.slice(parenIdx) : '';
    return (
      <div className={indentClass}>
        <span className={isDark ? 'text-[#c084fc] font-semibold' : 'text-indigo-600 font-semibold'}>fun</span>{' '}
        <span className={isDark ? 'text-[#93c5fd] font-semibold' : 'text-indigo-900 font-semibold'}>{fnName}</span>
        <span className={isDark ? 'text-[#94a3b8]' : 'text-slate-700'}>{rest}</span>
      </div>
    );
  }

  if (trimmed.startsWith('for ')) {
    return (
      <div className={indentClass}>
        <span className={isDark ? 'text-[#c084fc] font-semibold' : 'text-indigo-600 font-semibold'}>for</span>{' '}
        <span className={isDark ? 'text-[#94a3b8]' : 'text-slate-700'}>(</span>
        <span className={isDark ? 'text-slate-200 font-medium' : 'text-slate-900 font-medium'}>i</span>{' '}
        <span className={isDark ? 'text-[#c084fc] font-semibold' : 'text-indigo-600 font-semibold'}>in</span>{' '}
        <span className={isDark ? 'text-[#fbbf24]' : 'text-amber-600'}>1..3</span>
        <span className={isDark ? 'text-[#94a3b8]' : 'text-slate-700'}>) {'{'}</span>
      </div>
    );
  }

  if (trimmed.startsWith('val ') || trimmed.startsWith('var ')) {
    const kw = trimmed.startsWith('val ') ? 'val' : 'var';
    const rest = trimmed.slice(4);
    const eqIdx = rest.indexOf('=');
    if (eqIdx !== -1) {
      const lhs = rest.slice(0, eqIdx).trim();
      const rhs = rest.slice(eqIdx + 1).trim();
      const isString = rhs.startsWith('"');
      return (
        <div className={indentClass}>
          <span className={isDark ? 'text-[#c084fc] font-semibold' : 'text-indigo-600 font-semibold'}>{kw}</span>{' '}
          <span className={isDark ? 'text-[#93c5fd] font-semibold' : 'text-indigo-900 font-semibold'}>{lhs}</span>{' '}
          <span className={isDark ? 'text-[#94a3b8]' : 'text-slate-700'}>=</span>{' '}
          <span className={isString ? (isDark ? 'text-[#34d399]' : 'text-emerald-600') : (isDark ? 'text-[#fbbf24]' : 'text-amber-600')}>
            {rhs}
          </span>
        </div>
      );
    }
  }

  if (trimmed.includes('println(')) {
    const before = trimmed.slice(0, trimmed.indexOf('println('));
    const inner = trimmed.slice(trimmed.indexOf('println(') + 8, trimmed.lastIndexOf(')'));
    const isString = inner.includes('"');
    return (
      <div className={indentClass}>
        {before}
        <span className={isDark ? 'text-[#38bdf8] font-medium' : 'text-slate-900 font-medium'}>println</span>
        <span className={isDark ? 'text-[#94a3b8]' : 'text-slate-700'}>(</span>
        <span className={isString ? (isDark ? 'text-[#34d399]' : 'text-emerald-600') : (isDark ? 'text-[#93c5fd]' : 'text-indigo-900')}>
          {inner}
        </span>
        <span className={isDark ? 'text-[#94a3b8]' : 'text-slate-700'}>)</span>
      </div>
    );
  }

  if (trimmed === '}') {
    return (
      <div className={indentClass}>
        <span className={isDark ? 'text-[#94a3b8]' : 'text-slate-700'}>{'}'}</span>
      </div>
    );
  }

  return <div className={`${indentClass} ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{line}</div>;
};

const STAGE_TITLES: Record<number, string> = {
  1: 'Learn',
  2: 'Explore',
  3: 'Predict',
  4: 'Write & Run',
  5: 'Mastered',
};

export const FiveStageLessonRunner: React.FC<FiveStageLessonRunnerProps> = ({
  theme,
  initialLessonKey = 'functions',
  userStats,
  onExit,
  onCompleteLesson,
  onToggleTheme,
}) => {
  const [currentLessonKey] = useState<string>(initialLessonKey);
  const [currentStage, setCurrentStage] = useState<number>(1); // 1: Learn, 2: Explore, 3: Predict, 4: WriteRun, 5: Mastered
  const [exploreCardIndex, setExploreCardIndex] = useState<number>(0);

  // Predict state: support all questions, no default selected answer
  const [predictAnswers, setPredictAnswers] = useState<Record<number, string>>({});
  const [activePredictCardIdx, setActivePredictCardIdx] = useState<number>(0);

  // Write & Run state
  const lessonData: FiveStageLesson =
    AVAILABLE_FIVE_STAGE_LESSONS[currentLessonKey] ||
    AVAILABLE_FIVE_STAGE_LESSONS.functions ||
    AVAILABLE_FIVE_STAGE_LESSONS.variables;
  const [userCode, setUserCode] = useState<string>(lessonData.writeRun.initialCode);
  const [hasRunCode, setHasRunCode] = useState<boolean>(false);
  const [actualOutput, setActualOutput] = useState<string>(lessonData.writeRun.expectedOutput);

  // Badge interactive tap animation state
  const [badgePressed, setBadgePressed] = useState<boolean>(false);

  // Sync browser/device back button with screen back button
  useEffect(() => {
    window.history.replaceState({ codedoStage: 1 }, '');

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.codedoStage === 'number') {
        setCurrentStage(e.state.codedoStage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onExit();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onExit]);

  // Sync scroll position with Step 2 (Explore) example chips
  useEffect(() => {
    if (currentStage !== 2) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const cards = lessonData.explore.cards;
          const scrollPos = window.scrollY + 140;
          for (let i = cards.length - 1; i >= 0; i--) {
            const el = document.getElementById(`explore-card-${i}`);
            if (el && el.offsetTop <= scrollPos) {
              setExploreCardIndex((prev) => (prev !== i ? i : prev));
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentStage, lessonData.explore.cards]);

  // Sync scroll position with Step 3 (Predict) question chips
  useEffect(() => {
    if (currentStage !== 3) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const questions = lessonData.predict.questions;
          const scrollPos = window.scrollY + 140;
          for (let i = questions.length - 1; i >= 0; i--) {
            const el = document.getElementById(`predict-q-${i}`);
            if (el && el.offsetTop <= scrollPos) {
              setActivePredictCardIdx((prev) => (prev !== i ? i : prev));
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentStage, lessonData.predict.questions]);

  const handleNextStage = () => {
    soundFX.playClick();
    if (currentStage < 5) {
      const nextStage = currentStage + 1;
      window.history.pushState({ codedoStage: nextStage }, '');
      setCurrentStage(nextStage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      soundFX.playSuccess();
      onCompleteLesson(lessonData.mastered.xpEarned);
    }
  };

  const handlePreviousStage = () => {
    soundFX.playClick();
    if (currentStage > 1) {
      window.history.back();
    } else {
      onExit();
    }
  };

  const handleJumpToStage = (step: number) => {
    soundFX.playClick();
    window.history.pushState({ codedoStage: step }, '');
    setCurrentStage(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunCode = () => {
    soundFX.playClick();
    setHasRunCode(true);
    setActualOutput(lessonData.writeRun.expectedOutput);
    soundFX.playSuccess();
  };

  const handleBadgeTap = () => {
    soundFX.playSuccess();
    setBadgePressed(true);
    setTimeout(() => setBadgePressed(false), 240);
  };

  const handleSelectPredictOption = (qIdx: number, optId: string) => {
    soundFX.playClick();
    setPredictAnswers((prev) => ({ ...prev, [qIdx]: optId }));
    const question = lessonData.predict.questions[qIdx];
    const opt = question?.options.find((o) => o.id === optId);
    if (opt?.isCorrect) {
      soundFX.playSuccess();
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center select-none pb-12 transition-colors duration-300 ${
        isDark ? 'bg-[#0f131d] text-[#dfe2f1]' : 'bg-[#f1f4f9] text-slate-800'
      }`}
    >
      {/* ================= STICKY ELEVATED TOOLBAR (NATIVE ANDROID STYLE) ================= */}
      <header
        className={`sticky top-0 z-50 w-full transition-colors duration-200 border-b ${
          isDark
            ? 'bg-[#0f131d]/95 backdrop-blur-md border-[#262c3d] shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
            : 'bg-white/95 backdrop-blur-md border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="w-full max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          {/* Back button */}
          <button
            aria-label="Go back"
            type="button"
            onClick={handlePreviousStage}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isDark
                ? 'text-slate-200 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>

          {/* Current Step Name in Toolbar (Learn, Explore, Predict, Write & Run, Mastered) */}
          <div className="flex flex-col items-center justify-center">
            <h1
              className={`font-['Outfit'] font-bold text-base tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {STAGE_TITLES[currentStage] || 'Learn'}
            </h1>
          </div>

          {/* Theme Toggle Button (Removed streak and profile icon) */}
          <div className="flex items-center">
            {onToggleTheme ? (
              <button
                aria-label="Toggle theme"
                type="button"
                onClick={onToggleTheme}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  isDark
                    ? 'text-amber-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isDark ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            ) : (
              <div className="w-9" />
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-md px-4 pt-3 flex flex-col">
        {/* ================= PROGRESS STRIP (SHOWS LESSON NAME + STEP PROGRESS) ================= */}
        <section
          className={`mb-4 flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#171b26] border-[#262c3d] shadow-sm'
              : 'bg-white/90 backdrop-blur-sm border-slate-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
            <span
              className={`font-['Outfit'] font-semibold text-xs tracking-wide truncate ${
                isDark ? 'text-indigo-300' : 'text-indigo-900'
              }`}
            >
              {lessonData.topicTitle}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`font-['Outfit'] font-bold text-[11px] tracking-wider uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              STEP {currentStage} OF 5
            </span>
            <div className="flex items-center gap-1.5 ml-0.5">
              {[1, 2, 3, 4, 5].map((step) => {
                const isActive = step === currentStage;
                const isPassed = step < currentStage;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleJumpToStage(step)}
                    className={`rounded-full transition-all ${
                      isActive
                        ? 'w-2.5 h-2.5 bg-indigo-600 ring-2 ring-indigo-300 dark:ring-indigo-500/40'
                        : isPassed
                        ? 'w-2 h-2 bg-indigo-600'
                        : isDark
                        ? 'w-1.5 h-1.5 bg-slate-700'
                        : 'w-1.5 h-1.5 bg-slate-300'
                    }`}
                    title={`Step ${step} of 5: ${STAGE_TITLES[step]}`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= SCREEN 1: LEARN ================= */}
        {currentStage === 1 && (
          <div className="flex flex-col animate-fadeIn">
            {/* Concept Title */}
            <h1
              className={`font-['Outfit'] text-3xl font-bold tracking-tight leading-tight mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {lessonData.learn.title}
            </h1>

            {/* 4. Universal Concept Description matching design */}
            <p
              className={`mt-2 text-[15px] leading-relaxed mb-5 ${
                isDark ? 'text-[#94a3b8]' : 'text-slate-600'
              }`}
            >
              {lessonData.learn.subtitle}
            </p>

            {/* 5. Universal Simple Concept Example Card */}
            <section
              className={`mt-1 mb-5 rounded-2xl p-4 transition-all ${
                isDark
                  ? 'bg-[#171b26] border border-[#262c3d] shadow-sm'
                  : 'silk-surface'
              }`}
            >
              {/* Header with tags removed: clean example title only */}
              <div className="flex items-center justify-between mb-3">
                <h2
                  className={`font-['Outfit'] text-sm font-semibold tracking-tight ${
                    isDark ? 'text-[#f8fafc]' : 'text-slate-800'
                  }`}
                >
                  {lessonData.learn.exampleTitle}
                </h2>
              </div>

              {/* Code Block matching exact Stitch design */}
              <div
                className={`rounded-xl p-3.5 font-mono text-[13px] leading-relaxed overflow-x-auto ${
                  isDark
                    ? 'bg-[#0a0e18] border border-[#1e2438] text-slate-200'
                    : 'silk-inset text-slate-800'
                }`}
              >
                {lessonData.learn.codeSnippet.map((line, idx) => (
                  <div key={idx} className="whitespace-pre">
                    {renderSnippetLine(line, isDark)}
                  </div>
                ))}
              </div>

              {/* Explanation text */}
              <div
                className={`mt-3 flex items-start gap-2 text-xs leading-relaxed ${
                  isDark ? 'text-[#94a3b8]' : 'text-slate-600'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 mt-[-1px] ${
                    isDark ? 'text-[#818cf8]' : 'text-indigo-500'
                  }`}
                >
                  info
                </span>
                <span>{lessonData.learn.explanation}</span>
              </div>
            </section>

            {/* Key Ideas Section */}
            <section className="mb-5">
              <h2
                className={`font-['Outfit'] text-xs font-bold tracking-wider uppercase mb-3 px-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                KEY IDEAS
              </h2>
              <div className="space-y-2.5">
                {lessonData.learn.keyIdeas.map((idea) => (
                  <div
                    key={idea.number}
                    className={`rounded-xl p-3.5 flex items-start gap-3.5 border transition-all ${
                      isDark
                        ? 'bg-[#171b26] border-[#262c3d]'
                        : 'silk-surface'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-['Outfit'] font-bold text-xs shrink-0 mt-0.5 shadow-sm ${
                        isDark
                          ? 'bg-indigo-950/80 border border-indigo-700/50 text-indigo-400'
                          : 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                      }`}
                    >
                      {idea.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-['Outfit'] text-[14px] font-semibold ${
                          isDark ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {idea.title}
                      </h3>
                      <p
                        className={`text-xs mt-0.5 leading-normal ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {idea.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Takeaway Card */}
            <section
              className={`rounded-xl p-3.5 flex items-center gap-3 mb-6 border ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-indigo-950/20 border-indigo-500/30'
                  : 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 border-indigo-200/80'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-indigo-600 shrink-0 ${
                  isDark
                    ? 'bg-[#171b26] border border-indigo-500/30 text-indigo-400'
                    : 'bg-white shadow-sm border border-indigo-100'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-[10px] font-bold font-['Outfit'] uppercase tracking-wider block mb-0.5 ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`}
                >
                  KEY TAKEAWAY
                </span>
                <p
                  className={`text-xs font-semibold leading-snug ${
                    isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}
                >
                  {lessonData.learn.keyTakeaway}
                </p>
              </div>
            </section>

            {/* Bottom Sticky CTA */}
            <div
              className={`sticky bottom-0 left-0 right-0 w-full pt-3 pb-6 ${
                isDark
                  ? 'bg-gradient-to-t from-[#0f131d] via-[#0f131d]/95 to-transparent'
                  : 'bg-gradient-to-t from-[#f1f4f9] via-[#f1f4f9]/95 to-transparent'
              }`}
            >
              <button
                type="button"
                onClick={handleNextStage}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-['Outfit'] font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>Continue to Explore</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: EXPLORE ================= */}
        {currentStage === 2 && (
          <div className="flex flex-col animate-fadeIn">
            {/* Title & Intro */}
            <section className="mb-5">
              <h2
                className={`font-['Outfit'] font-extrabold text-[28px] leading-tight tracking-tight mb-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {lessonData.explore.title}
              </h2>
              <p
                className={`text-[15px] leading-snug font-normal ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {lessonData.explore.subtitle}
              </p>
            </section>

            {/* Sticky Example Navigation Indicator */}
            <section
              className={`sticky top-14 z-30 py-2.5 px-3 mb-5 rounded-2xl flex items-center justify-between border backdrop-blur-md shadow-sm transition-colors duration-200 ${
                isDark
                  ? 'bg-[#171b26]/95 border-[#262c3d] shadow-black/20'
                  : 'bg-white/95 border-slate-200/90 shadow-slate-900/5'
              }`}
            >
              <span
                className={`text-[11px] font-['Outfit'] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {lessonData.explore.cards.length} EXAMPLES
              </span>
              <div className="flex items-center gap-1.5">
                {lessonData.explore.cards.map((card, idx) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setExploreCardIndex(idx);
                      const el = document.getElementById(`explore-card-${idx}`);
                      if (el) {
                        const headerOffset = 120;
                        const elementPosition = el.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }
                    }}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                      exploreCardIndex === idx
                        ? 'bg-indigo-600 text-white shadow-sm scale-105'
                        : isDark
                        ? 'bg-[#0f131d] text-slate-400 border border-[#262c3d] hover:text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {card.number}
                  </button>
                ))}
              </div>
            </section>

            {/* Progressive Example Cards */}
            <div className="space-y-5 mb-6">
              {lessonData.explore.cards.map((card, idx) => (
                <article
                  key={card.id}
                  id={`explore-card-${idx}`}
                  onClick={() => setExploreCardIndex(idx)}
                  className={`w-full rounded-2xl p-5 border transition-all ${
                    exploreCardIndex === idx
                      ? isDark
                        ? 'bg-[#171b26] border-indigo-500/40 shadow-lg'
                        : 'bg-white border-indigo-200/90 shadow-md'
                      : isDark
                      ? 'bg-[#171b26] border-[#262c3d] shadow-sm'
                      : 'bg-white border-slate-200/80 shadow-sm'
                  }`}
                >
                  <header className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                          isDark
                            ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}
                      >
                        {card.number}
                      </span>
                      <h3
                        className={`font-['Outfit'] font-bold text-lg ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {card.title}
                      </h3>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isDark
                          ? 'bg-[#0f131d] text-slate-300 border border-[#262c3d]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {card.language}
                    </span>
                  </header>

                  <p
                    className={`text-sm mb-3 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {card.subtitle}
                  </p>

                  {/* Code Snippet Container */}
                  <div
                    className={`rounded-xl p-4 font-mono text-sm leading-relaxed mb-4 overflow-x-auto ${
                      isDark
                        ? 'bg-[#0f131d] border border-[#262c3d] text-slate-200'
                        : 'bg-slate-50 border border-slate-200/70 text-slate-800'
                    }`}
                  >
                    {card.code.map((line, lIdx) => (
                      <div key={lIdx} className="whitespace-pre">
                        {line.startsWith('fun ') ? (
                          <>
                            <span className="text-indigo-500 font-semibold">fun </span>
                            <span className="text-slate-900 dark:text-white font-medium">
                              {line.substring(4)}
                            </span>
                          </>
                        ) : line.includes('println') ? (
                          <span className="pl-4">
                            <span className="text-slate-900 dark:text-white">println</span>
                            (
                            <span className="text-emerald-500">
                              {line.substring(line.indexOf('(') + 1, line.lastIndexOf(')'))}
                            </span>
                            )
                          </span>
                        ) : (
                          <span>{line}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* What it means breakdown */}
                  <div className="mb-4">
                    <h4
                      className={`text-[11px] font-['Outfit'] font-bold uppercase tracking-wider mb-2 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      WHAT IT MEANS
                    </h4>
                    <ul
                      className={`text-xs space-y-1.5 leading-normal ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {card.whatItMeans.map((item, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>
                            <code
                              className={`font-mono px-1 py-0.5 rounded text-[11px] ${
                                isDark
                                  ? 'bg-[#0f131d] text-slate-200'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {item.label}
                            </code>{' '}
                            → {item.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What changed callout */}
                  <div
                    className={`rounded-xl p-3.5 border ${
                      isDark
                        ? 'bg-indigo-950/40 border-indigo-800/40 text-slate-200'
                        : 'bg-indigo-50/60 border border-indigo-100 text-slate-800'
                    }`}
                  >
                    <h4
                      className={`text-[10px] font-['Outfit'] font-bold uppercase tracking-wider mb-1 ${
                        isDark ? 'text-indigo-300' : 'text-indigo-700'
                      }`}
                    >
                      WHAT CHANGED
                    </h4>
                    <p className="text-xs font-medium">{card.whatChanged}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Primary CTA */}
            <div
              className={`sticky bottom-0 left-0 right-0 w-full pt-3 pb-6 ${
                isDark
                  ? 'bg-gradient-to-t from-[#0f131d] via-[#0f131d]/95 to-transparent'
                  : 'bg-gradient-to-t from-[#f1f4f9] via-[#f1f4f9]/95 to-transparent'
              }`}
            >
              <button
                type="button"
                onClick={handleNextStage}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-['Outfit'] font-bold text-base rounded-2xl shadow-lg shadow-indigo-600/35 flex items-center justify-center gap-2 transition-all"
              >
                <span>Continue to Predict</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: PREDICT ================= */}
        {currentStage === 3 && (
          <div className="flex flex-col animate-fadeIn">
            {/* Step Header & Guidance */}
            <section className="flex flex-col gap-1.5 mb-4">
              <h1
                className={`font-['Outfit'] text-2xl font-semibold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {lessonData.predict.title}
              </h1>
              <p
                className={`text-sm font-medium leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {lessonData.predict.subtitle}
              </p>
            </section>

            {/* Sticky Question Navigation Chips */}
            <section
              className={`sticky top-14 z-30 py-2.5 px-3 mb-5 rounded-2xl flex items-center justify-between border backdrop-blur-md shadow-sm transition-colors duration-200 ${
                isDark
                  ? 'bg-[#171b26]/95 border-[#262c3d] shadow-black/20'
                  : 'bg-white/95 border-slate-200/90 shadow-slate-900/5'
              }`}
            >
              <span
                className={`text-[11px] font-['Outfit'] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {lessonData.predict.questions.length} QUESTIONS
              </span>
              <div className="flex items-center gap-1.5">
                {lessonData.predict.questions.map((q, idx) => {
                  const isAnswered = predictAnswers[idx] !== undefined;
                  const isSelected = activePredictCardIdx === idx;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setActivePredictCardIdx(idx);
                        const el = document.getElementById(`predict-q-${idx}`);
                        if (el) {
                          const headerOffset = 120;
                          const elementPosition = el.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }
                      }}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm scale-105'
                          : isAnswered
                          ? isDark
                            ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-700/50'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : isDark
                          ? 'bg-[#0f131d] text-slate-400 border border-[#262c3d] hover:text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <span>{String(idx + 1).padStart(2, '0')}</span>
                      {isAnswered && (
                        <span className="material-symbols-outlined text-[13px]">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* All 5 Prediction Question Cards */}
            <div className="space-y-6 mb-6">
              {lessonData.predict.questions.map((question, qIdx) => {
                const selectedOptId = predictAnswers[qIdx];
                const hasAnswered = selectedOptId !== undefined;
                const selectedOpt = question.options.find((o) => o.id === selectedOptId);
                const isCorrect = selectedOpt?.isCorrect ?? false;

                return (
                  <article
                    key={question.id}
                    id={`predict-q-${qIdx}`}
                    onClick={() => setActivePredictCardIdx(qIdx)}
                    className={`w-full rounded-2xl p-5 border flex flex-col gap-4 transition-all ${
                      isDark
                        ? 'bg-[#171b26] border-[#262c3d] shadow-lg'
                        : 'bg-white border-slate-200/80 shadow-[6px_6px_14px_rgba(0,0,0,0.06),-6px_-6px_14px_rgba(255,255,255,0.7)]'
                    }`}
                  >
                    {/* Card Meta */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center gap-1.5 text-xs font-medium ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] text-purple-500">
                          psychology
                        </span>
                        <span>
                          Question {question.questionNumber} of {question.totalQuestions} • {question.topicMeta}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          isDark
                            ? 'bg-[#0f131d] text-indigo-400 border border-[#262c3d]'
                            : 'bg-indigo-50 text-indigo-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]'
                        }`}
                      >
                        {question.language}
                      </span>
                    </div>

                    {/* Inset Carved Neomorphic Code Block */}
                    <div
                      className={`w-full rounded-xl p-4 overflow-x-auto ${
                        isDark
                          ? 'bg-[#0f131d] border border-[#262c3d] text-slate-200'
                          : 'bg-slate-50 border border-slate-200/80 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]'
                      }`}
                    >
                      <pre className="font-mono text-xs leading-relaxed">
                        {question.code.map((line, idx) => (
                          <div key={idx} className="whitespace-pre">
                            {line.startsWith('fun ') ? (
                              <>
                                <span className="text-purple-500 font-semibold">fun </span>
                                <span className="text-indigo-500 font-semibold">
                                  {line.substring(4, line.indexOf('(') > -1 ? line.indexOf('(') : undefined)}
                                </span>
                                <span>{line.substring(line.indexOf('(') > -1 ? line.indexOf('(') : 4)}</span>
                              </>
                            ) : line.includes('println') ? (
                              <span className="pl-4">
                                <span className="font-semibold">println</span>(
                                <span className="text-emerald-500">
                                  {line.substring(line.indexOf('(') + 1, line.lastIndexOf(')'))}
                                </span>
                                )
                              </span>
                            ) : (
                              <span>{line}</span>
                            )}
                          </div>
                        ))}
                      </pre>
                    </div>

                    {/* Question Title */}
                    <div>
                      <h2
                        className={`text-base font-semibold tracking-tight ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {question.prompt}
                      </h2>
                    </div>

                    {/* Answer Options Grid */}
                    <div className="flex flex-col gap-2.5" role="radiogroup">
                      {question.options.map((opt) => {
                        const isSelected = selectedOptId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectPredictOption(qIdx, opt.id)}
                            className={`w-full p-3.5 rounded-xl flex items-center justify-between text-left transition-all border ${
                              isSelected
                                ? isDark
                                  ? opt.isCorrect
                                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                                    : 'bg-rose-950/50 border-rose-500 text-rose-200'
                                  : opt.isCorrect
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                  : 'bg-rose-50 border-rose-500 text-rose-900'
                                : isDark
                                ? 'bg-[#0f131d] border-[#262c3d] text-slate-300 hover:border-indigo-500/40'
                                : 'bg-white border-slate-200/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.6)] text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                                  isSelected
                                    ? opt.isCorrect
                                      ? 'bg-emerald-600 text-white font-bold'
                                      : 'bg-rose-600 text-white font-bold'
                                    : isDark
                                    ? 'bg-[#171b26] text-slate-400'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {opt.id}
                              </span>
                              <span
                                className={`text-sm ${
                                  isSelected ? 'font-semibold' : 'font-medium'
                                }`}
                              >
                                {opt.label}
                              </span>
                            </div>

                            {isSelected ? (
                              <div
                                className={`w-6 h-6 rounded-full text-white flex items-center justify-center shadow-sm ${
                                  opt.isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {opt.isCorrect ? 'check' : 'close'}
                                </span>
                              </div>
                            ) : (
                              <span
                                className={`w-4 h-4 rounded-full border ${
                                  isDark
                                    ? 'border-slate-600 bg-[#0f131d]'
                                    : 'border-slate-300 bg-slate-100 shadow-inner'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & Explanation */}
                    {hasAnswered && (
                      <div
                        className={`mt-1 p-3.5 rounded-xl border flex flex-col gap-1.5 animate-fadeIn ${
                          isCorrect
                            ? isDark
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-slate-200'
                              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : isDark
                            ? 'bg-rose-950/40 border-rose-500/40 text-slate-200'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1.5 ${
                            isCorrect
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isCorrect ? 'check_circle' : 'info'}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider font-['Outfit']">
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                          </span>
                        </div>
                        <p
                          className={`text-xs leading-relaxed font-medium ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          <code
                            className={`font-mono text-[11px] ${
                              isCorrect
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {question.explanation.codeRef}
                          </code>{' '}
                          {question.explanation.detail}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div
              className={`sticky bottom-0 left-0 right-0 w-full pt-3 pb-6 ${
                isDark
                  ? 'bg-gradient-to-t from-[#0f131d] via-[#0f131d]/95 to-transparent'
                  : 'bg-gradient-to-t from-[#f1f4f9] via-[#f1f4f9]/95 to-transparent'
              }`}
            >
              <button
                type="button"
                onClick={handleNextStage}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-['Outfit'] font-bold text-base shadow-lg shadow-indigo-600/35 flex items-center justify-center gap-2 transition-all"
              >
                <span>Continue to Write & Run</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 4: WRITE & RUN ================= */}
        {currentStage === 4 && (
          <div className="flex flex-col animate-fadeIn">
            {/* Step Header & Challenge Progress */}
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider font-['Outfit'] ${
                    isDark
                      ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  WRITE &amp; RUN
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {lessonData.topicTitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold tracking-wide uppercase font-['Outfit'] ${
                    isDark ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  CHALLENGE {lessonData.writeRun.challengeNumber} OF {lessonData.writeRun.totalChallenges}
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-500/40"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                </div>
              </div>
            </div>

            {/* Challenge Card */}
            <section
              className={`rounded-3xl p-5 border mb-4 shadow-sm transition-all ${
                isDark
                  ? 'bg-[#171b26] border-[#262c3d]'
                  : 'bg-white border-slate-100 shadow-[0_10px_25px_-3px_rgba(15,23,42,0.04)]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`text-[10px] font-extrabold tracking-wider uppercase font-['Outfit'] ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`}
                >
                  CHALLENGE {lessonData.writeRun.challengeNumber} OF {lessonData.writeRun.totalChallenges}
                </span>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isDark
                      ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] filled text-indigo-500">
                    bolt
                  </span>
                  <span>+{lessonData.writeRun.xpReward} XP</span>
                </div>
              </div>
              <h1
                className={`text-xl font-bold font-['Outfit'] mb-1.5 tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {lessonData.writeRun.title}
              </h1>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {lessonData.writeRun.description}
              </p>
            </section>

            {/* Requirements Card */}
            <section
              className={`rounded-2xl p-4 border mb-4 ${
                isDark
                  ? 'bg-[#171b26] border-[#262c3d]'
                  : 'bg-white border-slate-100 shadow-[0_10px_25px_-3px_rgba(15,23,42,0.04)]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  checklist
                </span>
                <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase font-['Outfit']">
                  REQUIREMENTS
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                <div
                  className={`p-2.5 px-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-[#0f131d] border-[#262c3d]' : 'bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    NAME
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isDark ? 'text-indigo-300 bg-indigo-950/60' : 'text-indigo-700 bg-indigo-50'
                    }`}
                  >
                    {lessonData.writeRun.requirements.name}
                  </span>
                </div>
                <div
                  className={`p-2.5 px-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-[#0f131d] border-[#262c3d]' : 'bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    PARAMS
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md break-all max-w-[70%] text-right ${
                      isDark ? 'text-indigo-300 bg-indigo-950/60' : 'text-indigo-700 bg-indigo-50'
                    }`}
                  >
                    {lessonData.writeRun.requirements.params}
                  </span>
                </div>
                <div
                  className={`p-2.5 px-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-[#0f131d] border-[#262c3d]' : 'bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    RETURNS
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isDark ? 'text-indigo-300 bg-indigo-950/60' : 'text-indigo-700 bg-indigo-50'
                    }`}
                  >
                    {lessonData.writeRun.requirements.returns}
                  </span>
                </div>
              </div>
            </section>

            {/* Mobile-first Code Editor Surface (Expands vertically with code) */}
            <section className="rounded-2xl shadow-xl border border-slate-800 overflow-hidden mb-3 bg-[#0b1120]">
              {/* Editor Chrome Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800/80 bg-[#090e1a]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="ml-2 font-mono text-[11px] text-slate-400 font-medium">
                    {lessonData.writeRun.fileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setUserCode(lessonData.writeRun.initialCode);
                    setHasRunCode(false);
                  }}
                  className="text-slate-400 hover:text-slate-200 p-1 flex items-center transition-colors"
                  title="Reset Code"
                >
                  <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                </button>
              </div>

              {/* Editor Body - Auto-expands vertically */}
              {(() => {
                const lines = userCode.split('\n');
                const lineCount = Math.max(lines.length, 5);
                return (
                  <div className="p-3.5 font-mono text-xs leading-relaxed flex gap-3 text-slate-300">
                    {/* Line Numbers */}
                    <div className="text-slate-600 select-none text-right font-mono flex flex-col text-[11px] pt-0.5 leading-[1.625rem]">
                      {Array.from({ length: lineCount }, (_, i) => (
                        <span key={i + 1}>{i + 1}</span>
                      ))}
                    </div>

                    {/* Code Content & Input */}
                    <div className="flex-1 font-mono text-xs leading-relaxed text-slate-200 min-w-0">
                      <textarea
                        value={userCode}
                        rows={lineCount}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none text-indigo-300 font-mono text-xs leading-[1.625rem] resize-none p-0 focus:ring-0 overflow-hidden block"
                        style={{ height: `${lineCount * 1.625}rem` }}
                        spellCheck={false}
                      />
                      <div className="text-slate-500 italic text-[11px] pt-1">// Ready to execute</div>
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* Run Code Button */}
            <button
              type="button"
              onClick={handleRunCode}
              className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold font-['Outfit'] text-sm shadow-md flex items-center justify-center gap-2 mb-4 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] filled">play_arrow</span>
              <span>RUN CODE</span>
            </button>

            {/* Actual Output Card */}
            {hasRunCode && (
              <section
                className={`rounded-2xl p-4 border mb-4 animate-fadeIn ${
                  isDark
                    ? 'bg-[#171b26] border-[#262c3d]'
                    : 'bg-white border-slate-100 shadow-[0_10px_25px_-3px_rgba(15,23,42,0.04)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-['Outfit']">
                    OUTPUT
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Return value
                  </span>
                </div>
                <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl font-mono text-sm font-semibold tracking-wide border border-slate-800 flex items-center justify-between">
                  <span>{actualOutput}</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">Executed in 12ms</span>
                </div>
              </section>
            )}

            {/* Next Challenge / Stage CTA */}
            <div
              className={`sticky bottom-0 left-0 right-0 w-full pt-3 pb-6 ${
                isDark
                  ? 'bg-gradient-to-t from-[#0f131d] via-[#0f131d]/95 to-transparent'
                  : 'bg-gradient-to-t from-[#f1f4f9] via-[#f1f4f9]/95 to-transparent'
              }`}
            >
              <button
                type="button"
                onClick={handleNextStage}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold font-['Outfit'] text-sm shadow-lg shadow-indigo-600/35 flex items-center justify-center gap-2 transition-all"
              >
                <span>Continue to Mastered</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 5: MASTERED ================= */}
        {currentStage === 5 && (
          <div className="flex flex-col items-center animate-fadeIn">
            {/* Stage Context Bar */}
            <div
              className={`w-full rounded-xl p-3.5 flex items-center justify-between gap-2 mb-4 border transition-all ${
                isDark
                  ? 'bg-[#171b26] border-[#262c3d]'
                  : 'bg-background neo-raised border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-[#0f131d] text-indigo-400' : 'bg-background neo-inset text-indigo-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">layers</span>
                </div>
                <span
                  className={`text-[11px] font-semibold tracking-wider uppercase truncate ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  {lessonData.stageName}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-[10px] font-medium tracking-tight uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Step 5 of 5
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                </div>
              </div>
            </div>

            {/* Mastery Status Row */}
            <div className="w-full flex items-center justify-between gap-3 mb-5 px-1">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                  isDark
                    ? 'bg-[#171b26] border-[#262c3d]'
                    : 'bg-background neo-inset border-transparent'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(124,58,237,0.5)]"></span>
                <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 tracking-wide uppercase">
                  Mastery
                </span>
              </div>
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                  isDark
                    ? 'bg-[#171b26] border-[#262c3d]'
                    : 'bg-background neo-raised border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[14px] filled">
                  verified
                </span>
                <span
                  className={`text-[10px] font-semibold tracking-widest uppercase ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  Completed
                </span>
              </div>
            </div>

            {/* Mastery Celebration Visual with Concentric Soft Neumorphic Rings */}
            <div className="relative w-full flex flex-col items-center justify-center py-5 mb-3">
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-48 h-48 rounded-full flex items-center justify-center ${
                    isDark
                      ? 'bg-[#171b26] border border-[#262c3d] shadow-[0_0_30px_rgba(99,102,241,0.2)]'
                      : 'bg-[#e8eaf0] neo-raised'
                  }`}
                >
                  <div
                    className={`w-36 h-36 rounded-full flex items-center justify-center ${
                      isDark
                        ? 'bg-[#0f131d] border border-[#262c3d]'
                        : 'bg-[#e8eaf0] neo-inset'
                    }`}
                  >
                    <div
                      onClick={handleBadgeTap}
                      role="button"
                      tabIndex={0}
                      className={`w-24 h-24 rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 ${
                        badgePressed ? 'scale-90' : 'hover:scale-105 active:scale-95'
                      } ${
                        isDark
                          ? 'bg-[#171b26] border border-[#262c3d] shadow-[0_0_24px_rgba(99,102,241,0.4)]'
                          : 'bg-[#e8eaf0] neo-raised'
                      }`}
                    >
                      <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[42px] filled">
                        workspace_premium
                      </span>
                      <div
                        className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center border ${
                          isDark
                            ? 'bg-[#171b26] border-[#262c3d] text-purple-400'
                            : 'bg-[#e8eaf0] neo-raised text-purple-600 border-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Concept Mastered Heading */}
            <div className="flex flex-col items-center text-center px-3 mb-6">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2.5 border ${
                  isDark
                    ? 'bg-[#171b26] border-[#262c3d] text-indigo-400'
                    : 'bg-background neo-raised border-transparent text-indigo-600'
                }`}
              >
                <span className="material-symbols-outlined text-[15px] filled">check_circle</span>
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  Concept Mastered!
                </span>
              </div>
              <h1
                className={`text-2xl font-bold tracking-tight leading-snug mb-2 font-['Outfit'] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {lessonData.mastered.topicTitle}
              </h1>
              <p
                className={`text-xs max-w-[320px] leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {lessonData.mastered.summary}
              </p>
            </div>

            {/* Mastery Verification Card */}
            <div
              className={`w-full rounded-xl p-5 mb-5 flex flex-col gap-4 border transition-all ${
                isDark
                  ? 'bg-[#171b26] border-[#262c3d]'
                  : 'bg-background neo-raised border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-500/10">
                <span
                  className={`text-[11px] font-semibold tracking-wider uppercase font-['Outfit'] ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Mastery Verification
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isDark
                      ? 'bg-[#0f131d] text-indigo-400 border border-[#262c3d]'
                      : 'bg-background neo-inset text-indigo-600'
                  }`}
                >
                  {lessonData.mastered.passedCount}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {lessonData.mastered.verificationItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isDark
                          ? 'bg-[#0f131d] text-indigo-400 border border-[#262c3d]'
                          : 'bg-background neo-inset text-indigo-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px] filled">check</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-xs font-semibold ${
                          isDark ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`text-[11px] leading-tight ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Statistics Row */}
            <div className="grid grid-cols-3 gap-3 w-full mb-6">
              <div
                className={`rounded-xl p-3 flex flex-col items-center text-center border ${
                  isDark
                    ? 'bg-[#171b26] border-[#262c3d]'
                    : 'bg-background neo-raised border-slate-200/80'
                }`}
              >
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                  +{lessonData.mastered.xpEarned} XP
                </span>
                <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5 font-['Outfit']">
                  Earned
                </span>
              </div>

              <div
                className={`rounded-xl p-3 flex flex-col items-center text-center border ${
                  isDark
                    ? 'bg-[#171b26] border-[#262c3d]'
                    : 'bg-background neo-raised border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[15px] filled">
                    local_fire_department
                  </span>
                  <span
                    className={`text-base font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {lessonData.mastered.streakDays} Days
                  </span>
                </div>
                <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5 font-['Outfit']">
                  Streak
                </span>
              </div>

              <div
                className={`rounded-xl p-3 flex flex-col items-center text-center border ${
                  isDark
                    ? 'bg-[#171b26] border-[#262c3d]'
                    : 'bg-background neo-raised border-slate-200/80'
                }`}
              >
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                  {lessonData.mastered.accuracy}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5 font-['Outfit']">
                  Accuracy
                </span>
              </div>
            </div>

            {/* Continue Journey CTA */}
            <div className="w-full pt-1 pb-6">
              <button
                type="button"
                onClick={handleNextStage}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-['Outfit'] font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/35 transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">rocket_launch</span>
                <span>Continue Journey</span>
                <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
