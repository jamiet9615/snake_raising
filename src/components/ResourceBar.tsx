import React from 'react';
import { PlayerStats } from '../types';

interface ResourceBarProps {
  stats: PlayerStats;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({ stats }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-white/90 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-xl border-3 border-yellow-300 select-none z-20">
      {/* 錢 (Coins) */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/90 rounded-xl border border-amber-300 font-extrabold text-amber-900 shadow-sm">
        <span className="text-xl md:text-2xl animate-pulse">🪙</span>
        <span className="text-sm md:text-base font-black tracking-wide">{stats.coins}</span>
      </div>

      {/* 蘋果 (Apples) */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100/90 rounded-xl border border-red-300 font-extrabold text-red-900 shadow-sm">
        <span className="text-xl md:text-2xl">🍎</span>
        <span className="text-sm md:text-base font-black tracking-wide">{stats.apples}</span>
      </div>

      {/* 蛋 (Eggs) */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100/90 rounded-xl border border-yellow-300 font-extrabold text-yellow-900 shadow-sm">
        <span className="text-xl md:text-2xl">🥚</span>
        <span className="text-sm md:text-base font-black tracking-wide">{stats.eggs}</span>
      </div>
    </div>
  );
};
