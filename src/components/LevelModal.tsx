import React from 'react';
import { PlayerStats } from '../types';
import { playSynthesizedSFX } from '../utils/audio';
import { AssetImage } from './AssetImage';
import { Trophy, Gift, Star, ShieldCheck, X } from 'lucide-react';

interface LevelModalProps {
  stats: PlayerStats;
  onClose: () => void;
}

export const LevelModal: React.FC<LevelModalProps> = ({ stats, onClose }) => {
  const rewardsList = [
    { level: 2, rewards: '5 蘋果 🍎 + 3 雞蛋 🥚' },
    { level: 3, rewards: '8 蘋果 🍎 + 4 雞蛋 🥚' },
    { level: 4, rewards: '10 蘋果 🍎 + 5 雞蛋 🥚' },
    { level: 5, rewards: '12 蘋果 🍎 + 6 雞蛋 🥚 (滿級！)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-fadeIn">
      {/* 升級版面.PNG Container */}
      <div className="relative max-w-md w-full bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-200 rounded-3xl p-6 border-4 border-emerald-400 shadow-2xl flex flex-col gap-5">
        <AssetImage name="升級版面.PNG" className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-emerald-200 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
            <h2 className="text-2xl font-black text-emerald-900 tracking-wide">玩家等級 Player Level</h2>
          </div>
          <button
            onClick={() => {
              playSynthesizedSFX('click');
              onClose();
            }}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md border-2 border-white transition-transform hover:scale-110 flex items-center justify-center focus:outline-none"
            title="關閉"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Current Level Banner */}
        <div className="relative z-10 bg-white/90 p-5 rounded-2xl border-2 border-emerald-300 shadow-lg text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-amber-300 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-emerald-950 font-black text-3xl mb-2">
            Lv. {stats.level}
          </div>
          <div className="text-sm font-extrabold text-emerald-800">
            {stats.level >= 5 ? '🎉 已達到最高等級 Level 5！' : `距離 Lv.${stats.level + 1} 還差 ${100 - stats.exp} 經驗值`}
          </div>

          {/* Level EXP Bar */}
          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mt-3 p-0.5 border border-emerald-300">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-inner"
              style={{ width: `${stats.level >= 5 ? 100 : stats.exp}%` }}
            />
          </div>
          <p className="text-xs font-bold text-gray-500 mt-1">
            經驗值 (EXP): {stats.level >= 5 ? '100 / 100 (MAX)' : `${stats.exp} / 100`}
          </p>
        </div>

        {/* How to gain Player EXP */}
        <div className="relative z-10 bg-white/70 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold space-y-1">
          <p className="font-extrabold text-emerald-950 text-sm flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            經驗值獲得說明:
          </p>
          <p>• 蛇蛇每過一個成長階段 (例如幼年到青年、青年到成蛇、成蛇畢業) 獲得 <span className="font-black text-amber-700">+25 玩家經驗值</span>！</p>
          <p>• 累積 100 經驗值將自動升級，並贈送大量豐富食物獎勵！</p>
        </div>

        {/* Level Rewards Table */}
        <div className="relative z-10">
          <h3 className="font-black text-emerald-950 text-sm mb-2 flex items-center gap-1">
            <Gift className="w-4 h-4 text-amber-600" />
            升級獎勵一覽:
          </h3>
          <div className="space-y-2">
            {rewardsList.map((item) => (
              <div
                key={item.level}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  stats.level >= item.level
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                    : 'bg-white/80 text-emerald-900 border-emerald-200 opacity-80'
                }`}
              >
                <span>Lv.{item.level - 1} 升級成 Lv.{item.level}</span>
                <span className="font-black">{item.rewards}</span>
                {stats.level >= item.level && (
                  <ShieldCheck className="w-4 h-4 text-yellow-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
