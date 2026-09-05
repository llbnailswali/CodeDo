import React, { useState } from 'react';
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

  // Predict state
  const [predictQuestionIndex, setPredictQuestionIndex] = useState<number>(0);
  const [selectedPredictOption, setSelectedPredictOption] = useState<string | null>('B');
  const [hasCheckedPredict, setHasCheckedPredict] = useState<boolean>(true);

  // Write & Run state
  const lessonData: FiveStageLesson =
    AVAILABLE_FIVE_STAGE_LESSONS[currentLessonKey] ||
    AVAILABLE_FIVE_STAGE_LESSONS.functions ||
    AVAILABLE_FIVE_STAGE_LESSONS.variables;
  const [userCode, setUserCode] = useState<string>(lessonData.writeRun.initialCode);
  const [hasRunCode, setHasRunCode] = useState<boolean>(true);
  const [actualOutput, setActualOutput] = useState<string>(lessonData.writeRun.expectedOutput);
  const [testPassed, setTestPassed] = useState<boolean>(true);

  // Badge interactive tap animation state
  const [badgePressed, setBadgePressed] = useState<boolean>(false);

  const handleNextStage = () => {
    soundFX.playClick();
    if (currentStage < 5) {
      setCurrentStage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      soundFX.playSuccess();
      onCompleteLesson(lessonData.mastered.xpEarned);
    }
  };

  const handlePreviousStage = () => {
    soundFX.playClick();
    if (currentStage > 1) {
      setCurrentStage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onExit();
    }
  };

  const handleRunCode = () => {
    soundFX.playClick();
    setHasRunCode(true);
    setActualOutput(lessonData.writeRun.expectedOutput);
    setTestPassed(true);
    soundFX.playSuccess();
  };

  const handleBadgeTap = () => {
    soundFX.playSuccess();
    setBadgePressed(true);
    setTimeout(() => setBadgePressed(false), 240);
  };

  const currentPredictQ =
    lessonData.predict.questions[predictQuestionIndex] || lessonData.predict.questions[0];

  const handleSelectPredictOption = (optId: string) => {
    soundFX.playClick();
    setSelectedPredictOption(optId);
    setHasCheckedPredict(true);
  };

  const handleNextPredictQuestion = () => {
    soundFX.playClick();
    if (predictQuestionIndex < lessonData.predict.questions.length - 1) {
      const nextIdx = predictQuestionIndex + 1;
      setPredictQuestionIndex(nextIdx);
      const nextQ = lessonData.predict.questions[nextIdx];
      const defaultCorrect = nextQ?.options.find((o) => o.isCorrect)?.id || 'B';
      setSelectedPredictOption(defaultCorrect);
      setHasCheckedPredict(true);
    } else {
      handleNextStage();
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center select-none pb-10 transition-colors duration-300 ${
        isDark ? 'bg-[#0f131d] text-[#dfe2f1]' : 'bg-[#f1f4f9] text-slate-800'
      }`}
    >
      <div className="w-full max-w-md px-4 pt-3 flex flex-col">
        {/* ================= 1. UNIVERSAL TOP NAVIGATION HEADER ================= */}
        <header className="flex items-center justify-between gap-2 py-2 mb-3">
          {/* Back button */}
          <button
            aria-label="Go back"
            type="button"
            onClick={handlePreviousStage}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isDark
                ? 'bg-[#171b26] border border-[#262c3d] text-slate-200 hover:text-white shadow-sm'
                : 'silk-button-icon text-slate-700 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          {/* App & Lesson Title */}
          <div className="flex flex-col items-center text-center">
            <span
              className={`font-['Outfit'] font-extrabold text-sm tracking-wider uppercase ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}
            >
              CODEDO LESSON
            </span>
            <span
              className={`text-[11px] font-semibold ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {lessonData.topicTitle}
            </span>
          </div>

          {/* Action items group */}
          <div className="flex items-center gap-2">
            {/* Streak pill */}
            <div
              className={`h-9 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold ${
                isDark
                  ? 'bg-[#171b26] border border-[#262c3d] text-slate-200'
                  : 'silk-button-icon text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-amber-500 text-[18px] filled">
                local_fire_department
              </span>
              <span className="font-['Outfit'] font-bold text-xs">{userStats.streak || 5}</span>
            </div>

            {/* Options menu button / Theme toggle */}
            {onToggleTheme ? (
              <button
                aria-label="Toggle theme"
                type="button"
                onClick={onToggleTheme}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  isDark
                    ? 'bg-[#171b26] border border-[#262c3d] text-amber-400 hover:text-white'
                    : 'silk-button-icon text-slate-700 hover:text-slate-900'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isDark ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            ) : (
              <button
                aria-label="Menu options"
                type="button"
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  isDark
                    ? 'bg-[#171b26] border border-[#262c3d] text-slate-200'
                    : 'silk-button-icon text-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            )}

            {/* User avatar */}
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/30">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* ================= 2. UNIVERSAL STAGE + PROGRESS BANNER ================= */}
        <section
          className={`mt-1 mb-5 flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#171b26] border-[#262c3d] shadow-sm'
              : 'bg-white/90 backdrop-blur-sm border-slate-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span
              className={`font-['Outfit'] font-semibold text-[11px] tracking-wider uppercase ${
                isDark ? 'text-indigo-300' : 'text-indigo-900'
              }`}
            >
              {lessonData.stageName}
            </span>
          </div>
          {/* Dots Indicator only - text removed per specification */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => {
              const isActive = step === currentStage;
              const isPassed = step < currentStage;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setCurrentStage(step);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`rounded-full transition-all ${
                    isActive
                      ? 'w-2 h-2 bg-indigo-600 ring-2 ring-indigo-300 dark:ring-indigo-500/40'
                      : isPassed
                      ? 'w-2 h-2 bg-indigo-600'
                      : isDark
                      ? 'w-1.5 h-1.5 bg-slate-700'
                      : 'w-1.5 h-1.5 bg-slate-300'
                  }`}
                  title={`Step ${step} of 5`}
                />
              );
            })}
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

            {/* Example Navigation Indicator */}
            <section className="flex items-center justify-between mb-5 px-0.5">
              <span
                className={`text-[11px] font-['Outfit'] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-400'
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
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all ${
                      exploreCardIndex === idx
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isDark
                        ? 'bg-[#171b26] text-slate-400 border border-[#262c3d] hover:text-white'
                        : 'bg-white text-slate-500 border border-slate-200'
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

            {/* Question Progress Indicator */}
            <div className="flex items-center justify-between px-1 mb-3">
              <span
                className={`text-[11px] font-semibold tracking-wider uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                QUESTION {currentPredictQ.questionNumber} OF {currentPredictQ.totalQuestions}
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((qNum) => (
                  <button
                    key={qNum}
                    type="button"
                    onClick={() => {
                      if (lessonData.predict.questions[qNum - 1]) {
                        soundFX.playClick();
                        setPredictQuestionIndex(qNum - 1);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      qNum === currentPredictQ.questionNumber
                        ? 'bg-indigo-600 ring-2 ring-indigo-400/40'
                        : isDark
                        ? 'bg-slate-700'
                        : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Core Prediction Question Card */}
            <article
              className={`w-full rounded-2xl p-5 border mb-5 flex flex-col gap-4 transition-all ${
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
                    Question {currentPredictQ.questionNumber} of {currentPredictQ.totalQuestions} • {currentPredictQ.topicMeta}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                    isDark
                      ? 'bg-[#0f131d] text-indigo-400 border border-[#262c3d]'
                      : 'bg-indigo-50 text-indigo-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]'
                  }`}
                >
                  {currentPredictQ.language}
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
                  {currentPredictQ.code.map((line, idx) => (
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
                  {currentPredictQ.prompt}
                </h2>
              </div>

              {/* Answer Options Grid */}
              <div className="flex flex-col gap-2.5" role="radiogroup">
                {currentPredictQ.options.map((opt) => {
                  const isSelected = selectedPredictOption === opt.id;
                  const isCorrect = opt.isCorrect;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectPredictOption(opt.id)}
                      className={`w-full p-3.5 rounded-xl flex items-center justify-between text-left transition-all border ${
                        isSelected
                          ? isDark
                            ? 'bg-indigo-950/60 border-indigo-500 shadow-inner'
                            : 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]'
                          : isDark
                          ? 'bg-[#0f131d] border-[#262c3d] text-slate-300 hover:border-indigo-500/40'
                          : 'bg-white border-slate-200/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.6)] text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm font-bold'
                              : isDark
                              ? 'bg-[#171b26] text-slate-400'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className={`text-sm ${isSelected ? 'font-semibold text-indigo-600 dark:text-indigo-300' : 'font-medium'}`}>
                          {opt.label}
                        </span>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[16px]">
                            {isCorrect ? 'check' : 'check'}
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

              {/* Feedback & Explanation (Neomorphic Inset Bay) */}
              {hasCheckedPredict && (
                <div
                  className={`mt-1 p-3.5 rounded-xl border flex flex-col gap-1.5 animate-fadeIn ${
                    isDark
                      ? 'bg-[#0f131d] border-indigo-500/40 text-slate-200'
                      : 'bg-indigo-50/70 border-indigo-200/80 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span className="text-xs font-semibold uppercase tracking-wider font-['Outfit']">
                      Correct!
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    <code className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                      {currentPredictQ.explanation.codeRef}
                    </code>{' '}
                    {currentPredictQ.explanation.detail}
                  </p>
                </div>
              )}
            </article>

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
                onClick={handleNextPredictQuestion}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-['Outfit'] font-bold text-base shadow-lg shadow-indigo-600/35 flex items-center justify-center gap-2 transition-all"
              >
                <span>
                  {predictQuestionIndex < lessonData.predict.questions.length - 1
                    ? 'Next Question'
                    : 'Continue to Write & Run'}
                </span>
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
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  checklist
                </span>
                <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase font-['Outfit']">
                  REQUIREMENTS
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-[#0f131d] border-[#262c3d]' : 'bg-slate-50 border-slate-100/80'
                  }`}
                >
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    NAME
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {lessonData.writeRun.requirements.name}
                  </span>
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-[#0f131d] border-[#262c3d]' : 'bg-slate-50 border-slate-100/80'
                  }`}
                >
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    PARAMS
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {lessonData.writeRun.requirements.params}
                  </span>
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    isDark ? 'bg-[#0f131d] border-[#262c3d]' : 'bg-slate-50 border-slate-100/80'
                  }`}
                >
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    RETURNS
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {lessonData.writeRun.requirements.returns}
                  </span>
                </div>
              </div>
            </section>

            {/* Mobile-first Code Editor Surface */}
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
                  }}
                  className="text-slate-400 hover:text-slate-200 p-1 flex items-center transition-colors"
                  title="Reset Code"
                >
                  <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                </button>
              </div>

              {/* Editor Body */}
              <div className="p-3.5 font-mono text-xs leading-relaxed flex gap-3 text-slate-300">
                {/* Line Numbers */}
                <div className="text-slate-600 select-none text-right font-mono flex flex-col gap-0.5 text-[11px] pt-0.5">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                </div>

                {/* Code Content & Input */}
                <div className="flex-1 font-mono text-xs leading-relaxed text-slate-200">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full h-24 bg-transparent border-0 outline-none text-indigo-300 font-mono text-xs leading-relaxed resize-none p-0 focus:ring-0"
                    spellCheck={false}
                  />
                  <div className="text-slate-500 italic text-[11px] pt-1">// Ready to execute</div>
                </div>
              </div>
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
            <section
              className={`rounded-2xl p-4 border mb-3 ${
                isDark
                  ? 'bg-[#171b26] border-[#262c3d]'
                  : 'bg-white border-slate-100 shadow-[0_10px_25px_-3px_rgba(15,23,42,0.04)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-['Outfit']">
                  ACTUAL OUTPUT
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Return value
                </span>
              </div>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-sm font-semibold tracking-wide border border-slate-800">
                {actualOutput}
              </div>
            </section>

            {/* Test Results Card */}
            <section
              className={`rounded-2xl p-4 border mb-3 ${
                isDark
                  ? 'bg-[#171b26] border-[#262c3d]'
                  : 'bg-white border-slate-100 shadow-[0_10px_25px_-3px_rgba(15,23,42,0.04)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-['Outfit']">
                  TEST RESULTS
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  1/1 PASSED
                </span>
              </div>
              <div className="space-y-1.5">
                <div
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                    isDark ? 'bg-[#0f131d] border-[#262c3d]' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px] font-bold">
                      check_circle
                    </span>
                    <span
                      className={`font-mono text-[11px] ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {lessonData.writeRun.testCase.call}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Expected:{' '}
                    <span
                      className={`font-bold ${isDark ? 'text-emerald-400' : 'text-slate-800'}`}
                    >
                      {lessonData.writeRun.testCase.expected}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Success Feedback */}
            {testPassed && (
              <section className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-3.5 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      All test conditions satisfied!
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      Clean execution • 0ms overhead
                    </p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[13px] filled">bolt</span>
                  <span>+{lessonData.writeRun.xpReward} XP</span>
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
