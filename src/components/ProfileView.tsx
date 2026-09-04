import React from 'react';
import { AppTheme, UserStats } from '../types';
import { soundFX } from '../utils/audio';

interface ProfileViewProps {
  theme: AppTheme;
  userStats: UserStats;
  onStartLesson: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ theme, userStats, onStartLesson }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activeDays = [true, true, true, true, true, true, true]; // 12-day streak!

  const achievements = [
    { title: 'Type Master', desc: 'Aced type deduction on first try', icon: 'verified', color: 'text-emerald-500' },
    { title: '12 Days Fire', desc: 'Maintained 12-day uninterrupted streak', icon: 'local_fire_department', color: 'text-orange-500' },
    { title: 'Foundations Knight', desc: 'Cleared 2 milestone gates in World 01', icon: 'military_tech', color: 'text-indigo-400' },
    { title: 'Speed Demon', desc: 'Answered a question under 2 seconds', icon: 'bolt', color: 'text-amber-400' },
  ];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-2 select-none">
      {/* Profile Card Header */}
      <div
        className={`p-5 rounded-2xl mb-5 flex items-center gap-4 transition-all ${
          theme === 'dark' ? 'dark-glass-card' : 'bg-white neumorph-raised'
        }`}
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-1 flex items-center justify-center shadow-lg">
            <div className={`w-full h-full rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#0f1422]' : 'bg-white'}`}>
              <span className="text-2xl">🧑‍💻</span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow">
            <span className="material-symbols-outlined text-[14px]">check</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-['Outfit'] text-xl font-bold tracking-tight text-inherit">
              Alex Vance
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-['Outfit'] text-[10px] font-bold">
              PRO MEMBER
            </span>
          </div>
          <p className="font-['Outfit'] text-xs text-slate-400">Junior Kotlin Developer</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="font-['JetBrains_Mono'] text-orange-500 font-bold">
              🔥 {userStats.streak} Day Streak
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-['JetBrains_Mono'] text-amber-400 font-bold">
              ⭐ {userStats.stars} XP
            </span>
          </div>
        </div>
      </div>

      {/* Streak Calendar / Weekly Heatmap */}
      <div
        className={`p-4 rounded-2xl mb-5 ${
          theme === 'dark' ? 'dark-glass-card' : 'bg-white neumorph-raised'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-['Outfit'] text-xs font-bold uppercase tracking-wider text-slate-400">
            Streak Heatmap
          </span>
          <span className="text-orange-500 text-xs font-bold font-['Outfit']">12 Days Active</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day, idx) => (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-['Outfit'] text-slate-400">{day}</span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  activeDays[idx]
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                    : 'bg-slate-700/20 text-slate-500'
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
      <div className="flex flex-col gap-3">
        <h3 className="font-['Outfit'] text-base font-bold text-inherit px-1">
          Achievements &amp; Badges
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl flex flex-col gap-2 ${
                theme === 'dark' ? 'bg-[#151c2c] border border-slate-800' : 'bg-white neumorph-raised-soft'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[24px] ${item.color} icon-filled`}>
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
    </div>
  );
};
