/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SquareDashed, Sun, Moon, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  return (
    <div
      id="empty-screen-root"
      className={`min-h-screen w-full transition-colors duration-500 relative flex flex-col items-center justify-center p-6 select-none overflow-hidden ${
        isDark ? 'bg-[#0e1013] text-neutral-300' : 'bg-[#fbfbfb] text-neutral-700'
      }`}
    >
      {/* Subtle top-right minimal controls */}
      <header
        id="empty-screen-controls"
        className="absolute top-6 right-6 flex items-center gap-2 z-10"
      >
        <button
          id="btn-toggle-guide"
          onClick={() => setShowGuide(!showGuide)}
          aria-label={showGuide ? 'Hide placeholder guidance' : 'Show placeholder guidance'}
          title={showGuide ? 'Hide placeholder' : 'Show placeholder'}
          className={`p-2 rounded-lg transition-all duration-200 border cursor-pointer ${
            isDark
              ? 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80'
              : 'border-neutral-200/80 bg-white/70 text-neutral-500 hover:text-neutral-900 hover:bg-white shadow-xs'
          }`}
        >
          {showGuide ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>

        <button
          id="btn-toggle-theme"
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
          className={`p-2 rounded-lg transition-all duration-200 border cursor-pointer ${
            isDark
              ? 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80'
              : 'border-neutral-200/80 bg-white/70 text-neutral-500 hover:text-neutral-900 hover:bg-white shadow-xs'
          }`}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Main minimal empty slate display */}
      <main id="empty-screen-main" className="flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {showGuide && (
            <motion.div
              id="empty-screen-content"
              key="guide-content"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center text-center max-w-sm px-6 py-8"
            >
              <div
                id="empty-screen-icon-container"
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 border ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900/40 text-neutral-500'
                    : 'border-neutral-200/90 bg-neutral-100/60 text-neutral-400'
                }`}
              >
                <SquareDashed size={24} strokeWidth={1.5} className="animate-pulse" />
              </div>

              <h1
                id="empty-screen-title"
                className={`text-lg font-medium tracking-tight mb-2 transition-colors duration-300 ${
                  isDark ? 'text-neutral-200' : 'text-neutral-900'
                }`}
              >
                Empty Screen
              </h1>

              <p
                id="empty-screen-description"
                className={`text-sm leading-relaxed transition-colors duration-300 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-500'
                }`}
              >
                A distraction-free, blank canvas ready for your ideas.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
