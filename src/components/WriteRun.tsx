import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Stage4WriteRunData } from '../data/lessonStagesData';
import { soundFX } from '../utils/audio';
import { KotlinCodeRunner } from './KotlinCodeRunner';
import { KotlinExecutionResult } from '../utils/kotlinRunner';

interface WriteRunStageProps {
  data: Stage4WriteRunData;
  topicTitle?: string;
  isDark: boolean;
  revealStep: number;
  setRevealStep: React.Dispatch<React.SetStateAction<number>>;
  userCode: string;
  setUserCode: (code: string) => void;
  hasRunCode: boolean;
  setHasRunCode: (hasRun: boolean) => void;
  actualOutput: string;
  setActualOutput?: (output: string) => void;
  onRunCode?: () => void;
  onContinue: () => void;
  tapToRevealEnabled?: boolean;
  onOutputMatch?: (matches: boolean) => void;
}

// Reveal steps:
// 0: Challenge Title only (initial state)
// 1: Challenge Description & details
// 2: Requirements card
// 3: Code Editor & Execution section (Run Code button is interactive)
const MAX_REVEAL_STEP = 3;

export const WriteRun: React.FC<WriteRunStageProps> = ({
  data,
  topicTitle: _topicTitle,
  isDark,
  revealStep,
  setRevealStep,
  userCode,
  setUserCode,
  hasRunCode,
  setHasRunCode,
  actualOutput: _actualOutput,
  setActualOutput,
  onRunCode,
  onContinue,
  tapToRevealEnabled = true,
  onOutputMatch,
}) => {
  const [executionResult, setExecutionResult] = useState<KotlinExecutionResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const normalizeOutput = (str?: string) =>
    (str || '').replace(/\r\n/g, '\n').trim();

  const targetExpected = data.expectedOutput || data.testCase?.expected;

  const isOutputMatching = Boolean(
    targetExpected &&
      executionResult?.success &&
      executionResult.output !== undefined &&
      normalizeOutput(executionResult.output) === normalizeOutput(targetExpected)
  );

  const handleCodeChange = (newCode: string) => {
    setUserCode(newCode);
    setExecutionResult(null);
    if (onOutputMatch) {
      onOutputMatch(false);
    }
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const lines = userCode.split('\n').length;
    // 26px (1.625rem) is the precise line height of text-xs leading-[1.625rem]
    const minHeightBasedOnLines = lines * 26;
    const computedHeight = Math.max(textarea.scrollHeight, minHeightBasedOnLines);
    textarea.style.height = `${computedHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      setUserCode(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        autoResizeTextarea();
      });
    }
  };

  useLayoutEffect(() => {
    autoResizeTextarea();
  }, [userCode, revealStep]);

  useEffect(() => {
    window.addEventListener('resize', autoResizeTextarea);
    const timer = setTimeout(autoResizeTextarea, 50);
    return () => {
      window.removeEventListener('resize', autoResizeTextarea);
      clearTimeout(timer);
    };
  }, []);

  const scrollToOutput = () => {
    setTimeout(() => {
      const outputEl = document.getElementById('write-run-output-section');
      if (outputEl) {
        outputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const rootEl = document.getElementById('root');
        if (rootEl) {
          rootEl.scrollTo({ top: rootEl.scrollHeight, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      }
    }, 80);
  };

  useEffect(() => {
    if (hasRunCode) {
      scrollToOutput();
    }
  }, [hasRunCode]);

  const handleNextReveal = () => {
    soundFX.playClick();
    if (revealStep < MAX_REVEAL_STEP) {
      setRevealStep((prev) => {
        const next = prev + 1;
        setTimeout(() => {
          const rootEl = document.getElementById('root');
          if (rootEl) {
            rootEl.scrollTo({ top: rootEl.scrollHeight, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
        }, 60);
        return next;
      });
    }
  };

  const isFullyRevealed = !tapToRevealEnabled || revealStep >= MAX_REVEAL_STEP;

  return (
    <div
      onClick={!isFullyRevealed ? handleNextReveal : undefined}
      className={`flex flex-col min-h-[78vh] transition-all select-none ${
        !isFullyRevealed ? 'cursor-pointer' : ''
      }`}
    >
      {/* Challenge Card (Title visible initially; description revealed on tap 1) */}
      <section
        className={`rounded-3xl p-5 border mb-4 shadow-sm transition-all ${
          isDark
            ? 'bg-[#171b26] border-[#262c3d]'
            : 'bg-white border-slate-100 shadow-[0_10px_25px_-3px_rgba(15,23,42,0.04)]'
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h1
            className={`font-['Outfit'] text-2xl font-semibold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {data.title}
          </h1>
          {tapToRevealEnabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundFX.playClick();
                setRevealStep(0);
              }}
              title="Reset to step 0 to re-test screen tap"
              className={`shrink-0 text-xs font-['Outfit'] font-semibold px-2.5 py-1 rounded-xl border flex items-center gap-1 transition-all cursor-pointer select-none active:scale-95 ${
                isDark
                  ? 'bg-[#121622] text-slate-300 border-[#262c3d] hover:text-white hover:border-indigo-500/50'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:border-indigo-300'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-indigo-500">
                replay
              </span>
              <span>
                {revealStep < MAX_REVEAL_STEP ? `Tap ${revealStep}/${MAX_REVEAL_STEP}` : 'Reset Tap'}
              </span>
            </button>
          )}
        </div>

        {/* 1: Challenge Description (Revealed on tap 1 or if tapToReveal is disabled) */}
        {(!tapToRevealEnabled || revealStep >= 1) && (
          <p
            className={`text-xs leading-relaxed transition-all duration-300 animate-fadeIn ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {data.description}
          </p>
        )}
      </section>

      {/* 2: Requirements Card (Revealed on tap 2 or if tapToReveal is disabled) */}
      {(!tapToRevealEnabled || revealStep >= 2) && (
        <section
          className={`rounded-2xl p-4 border mb-4 transition-all duration-300 animate-fadeIn ${
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
                {data.requirements.name}
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
                {data.requirements.params}
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
                {data.requirements.returns}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 3: Code Editor & Execution section (Revealed on tap 3 or if tapToReveal is disabled) */}
      {(!tapToRevealEnabled || revealStep >= 3) && (
        <div className="transition-all duration-300 animate-fadeIn">
          {/* Code Editor Container */}
          <section
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl border bg-slate-950 border-slate-800 shadow-xl mb-4 overflow-hidden"
          >
            {/* Window chrome / tabs */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-start justify-between gap-3">
              {/* Left Column: Filename on top, "x lines" below it */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="h-3.5 w-[1px] bg-slate-800 mx-0.5 shrink-0" />
                  <span className="font-mono text-xs text-slate-200 font-medium truncate">
                    {data.fileName || 'Main.kt'}
                  </span>
                </div>
                <div className="pl-8">
                  <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/80 inline-block">
                    {userCode.split('\n').length} lines
                  </span>
                </div>
              </div>

              {/* Right Column: "Kotlin 1.9" on top, "Solution" below it */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                  Kotlin 1.9
                </span>
                <div className="flex items-center gap-1.5">
                  {userCode !== data.initialCode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFX.playClick();
                        handleCodeChange(data.initialCode);
                      }}
                      className="text-[11px] font-mono text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
                      title="Reset to commented instructions"
                    >
                      <span className="material-symbols-outlined text-[13px]">restart_alt</span>
                      <span>Reset</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playClick();
                      handleCodeChange(data.solutionCode);
                    }}
                    className={`text-[11px] font-mono flex items-center gap-1 transition-colors px-2 py-0.5 rounded cursor-pointer ${
                      userCode.trim() === data.solutionCode.trim()
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                        : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                    }`}
                    title="Insert full solution code"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {userCode.trim() === data.solutionCode.trim() ? 'check_circle' : 'lightbulb'}
                    </span>
                    <span>Solution</span>
                  </button>
                </div>
              </div>
            </div>

            {(() => {
              const lines = userCode.split('\n');
              const lineCount = lines.length;
              return (
                <div
                  className="p-4 overflow-x-auto cursor-text bg-slate-950"
                  onClick={() => textareaRef.current?.focus()}
                >
                  <div className="flex gap-3 min-w-full w-max">
                    {/* Line Numbers column, perfectly aligned with content height */}
                    <div
                      className="font-mono text-xs text-slate-600 select-none text-right flex flex-col leading-[1.625rem] shrink-0 min-w-[1.5rem]"
                      aria-hidden="true"
                    >
                      {Array.from({ length: lineCount }).map((_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))}
                    </div>

                    {/* Auto-expanding Code Area - shows full program content at once */}
                    <div className="flex-1 font-mono text-xs leading-[1.625rem] text-slate-200 min-w-0">
                      <textarea
                        ref={textareaRef}
                        wrap="off"
                        value={userCode}
                        onChange={(e) => {
                          handleCodeChange(e.target.value);
                          autoResizeTextarea();
                        }}
                        onKeyDown={handleKeyDown}
                        onInput={autoResizeTextarea}
                        className="w-full bg-transparent border-0 outline-none text-indigo-300 font-mono text-xs leading-[1.625rem] resize-none p-0 focus:ring-0 overflow-y-hidden overflow-x-hidden block whitespace-pre"
                        spellCheck={false}
                      />
                      <div className="text-slate-400 font-sans text-[11px] pt-2 select-none flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-amber-400">edit_note</span>
                        <span>Write your code below each commented instruction &bull; Tap <strong>RUN CODE</strong> to test</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Reusable Common Kotlin Program Runner */}
          <KotlinCodeRunner
            code={userCode}
            expectedOutput={data.expectedOutput}
            testCase={data.testCase}
            isDark={isDark}
            outputSectionId="write-run-output-section"
            onExecutionResult={(res) => {
              setHasRunCode(true);
              setExecutionResult(res);
              if (setActualOutput) {
                setActualOutput(res.output);
              }
              if (onRunCode) {
                onRunCode();
              }
              const matches = Boolean(
                targetExpected &&
                  res.success &&
                  res.output !== undefined &&
                  normalizeOutput(res.output) === normalizeOutput(targetExpected)
              );
              if (onOutputMatch) {
                onOutputMatch(matches);
              }
              scrollToOutput();
            }}
          />
        </div>
      )}

      {/* Spacer to push content up so hint sits cleanly at bottom with breathing space */}
      <div className="flex-1 min-h-[16px]" />

      {/* Next Challenge / Stage CTA or Minimalist Tap Hint */}
      <div
        className={`sticky bottom-0 left-0 right-0 w-full pt-1.5 pb-2 transition-all ${
          isDark
            ? 'bg-gradient-to-t from-[#0f131d] via-[#0f131d]/95 to-transparent'
            : 'bg-gradient-to-t from-[#f1f4f9] via-[#f1f4f9]/95 to-transparent'
        }`}
      >
        {!isFullyRevealed ? (
          /* Subtle Minimalist Tap Hint (Finger icon + short text) positioned nicely above bottom edge */
          <div className="flex justify-center w-full">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextReveal();
              }}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border shadow-md transition-all duration-200 active:scale-95 cursor-pointer select-none ${
                isDark
                  ? 'bg-[#171b26] border-indigo-500/40 text-indigo-300 hover:text-white hover:border-indigo-400'
                  : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-300 shadow-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-indigo-500 animate-bounce">
                touch_app
              </span>
              <span className="text-xs font-semibold font-['Outfit'] tracking-wide">
                Tap to continue ({revealStep + 1}/{MAX_REVEAL_STEP})
              </span>
            </button>
          </div>
        ) : isOutputMatching ? (
          /* ONLY shown once the program prints the expected output! */
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFX.playSuccess();
              onContinue();
            }}
            className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold font-['Outfit'] text-sm shadow-lg shadow-emerald-600/35 flex items-center justify-center gap-2 transition-all cursor-pointer animate-fadeIn"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Continue to Mastered</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        ) : executionResult && !executionResult.success ? (
          /* When there is an active compilation/runtime error, instruct user to fix */
          <div className="w-full h-14 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 font-bold font-['Outfit'] text-xs flex items-center justify-center gap-2 transition-all px-4 text-center">
            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
            <span>Fix compiler diagnostics above and re-run code to continue</span>
          </div>
        ) : executionResult && !isOutputMatching ? (
          /* When executed with exit code 0 but output doesn't match expected */
          <div className="w-full h-14 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-300 font-semibold font-['Outfit'] text-xs flex items-center justify-center gap-2 transition-all px-4 text-center">
            <span className="material-symbols-outlined text-[18px] text-amber-400 shrink-0">warning</span>
            <span>Output does not match expected output yet — check requirements & re-run</span>
          </div>
        ) : (
          /* Fully revealed but code hasn't been run yet */
          <div
            className={`w-full h-14 rounded-2xl border flex items-center justify-center gap-2 text-xs font-['Outfit'] font-semibold transition-all px-4 text-center ${
              isDark
                ? 'bg-[#121622] border-[#262c3d] text-slate-400'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-indigo-400 shrink-0">play_circle</span>
            <span>Run code to print expected output and unlock Mastered</span>
          </div>
        )}
      </div>
    </div>
  );
};
