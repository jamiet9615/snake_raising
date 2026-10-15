import React, { useState } from 'react';
import { SnakeInfo, SNAKE_NAMES, STAGE_NAMES, PlayerStats } from '../types';
import { playSynthesizedSFX } from '../utils/audio';
import { SnakeGraphic } from './SnakeGraphic';
import { AssetImage } from './AssetImage';
import { X, CheckCircle2 } from 'lucide-react';

interface FeedModalProps {
  snakes: SnakeInfo[];
  stats: PlayerStats;
  onFeedSnake: (snakeId: string, foodType: 'apple' | 'egg') => void;
  onClose: () => void;
}

export const FeedModal: React.FC<FeedModalProps> = ({
  snakes,
  stats,
  onFeedSnake,
  onClose,
}) => {
  const [selectedFood, setSelectedFood] = useState<'apple' | 'egg'>('apple');
  const [message, setMessage] = useState('');

  const handleFeed = (snake: SnakeInfo) => {
    if (selectedFood === 'apple' && stats.apples <= 0) {
      setMessage('蘋果數量不足！');
      return;
    }
    if (selectedFood === 'egg' && stats.eggs <= 0) {
      setMessage('雞蛋數量不足！');
      return;
    }

    onFeedSnake(snake.id, selectedFood);
    playSynthesizedSFX('feed');
    setMessage(`成功餵食 ${SNAKE_NAMES[snake.type]}！+${selectedFood === 'apple' ? '20' : '40'} 經驗值`);

    setTimeout(() => {
      setMessage('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-fadeIn">
      {/* 食物版面.PNG Container */}
      <div className="relative max-w-lg w-full bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 rounded-3xl p-6 border-4 border-amber-300 shadow-2xl flex flex-col gap-5">
        <AssetImage name="食物版面.PNG" className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-20 pointer-events-none" />

        {/* Header & Close Button */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-amber-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍎</span>
            <h2 className="text-2xl font-black text-amber-900 tracking-wide">餵食餐盒 Feed Board</h2>
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

        {/* Food Selection Tabs */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {/* Apple option */}
          <div
            onClick={() => {
              playSynthesizedSFX('click');
              setSelectedFood('apple');
            }}
            className={`cursor-pointer p-4 rounded-2xl border-4 transition-all flex items-center gap-3 ${
              selectedFood === 'apple'
                ? 'bg-red-500 text-white border-yellow-300 shadow-xl scale-105'
                : 'bg-white/80 hover:bg-white text-red-900 border-red-200'
            }`}
          >
            <AssetImage name="蘋果.PNG" className="w-12 h-12 object-contain" />
            <div>
              <div className="font-black text-lg flex items-center gap-1">
                <span>蘋果 (+20 EXP)</span>
                {selectedFood === 'apple' && <CheckCircle2 className="w-5 h-5 text-yellow-300" />}
              </div>
              <p className="text-sm font-bold opacity-90">剩餘: {stats.apples} 個</p>
            </div>
          </div>

          {/* Egg option */}
          <div
            onClick={() => {
              playSynthesizedSFX('click');
              setSelectedFood('egg');
            }}
            className={`cursor-pointer p-4 rounded-2xl border-4 transition-all flex items-center gap-3 ${
              selectedFood === 'egg'
                ? 'bg-amber-500 text-white border-yellow-300 shadow-xl scale-105'
                : 'bg-white/80 hover:bg-white text-amber-900 border-amber-200'
            }`}
          >
            <AssetImage name="蛋.PNG" className="w-12 h-12 object-contain" />
            <div>
              <div className="font-black text-lg flex items-center gap-1">
                <span>雞蛋 (+40 EXP)</span>
                {selectedFood === 'egg' && <CheckCircle2 className="w-5 h-5 text-yellow-300" />}
              </div>
              <p className="text-sm font-bold opacity-90">剩餘: {stats.eggs} 個</p>
            </div>
          </div>
        </div>

        {message && (
          <div className="relative z-10 text-center font-black text-emerald-800 bg-emerald-100 p-2 rounded-xl border border-emerald-300 text-sm animate-pulse">
            {message}
          </div>
        )}

        {/* Snake List to Feed */}
        <div className="relative z-10">
          <h3 className="font-black text-amber-900 mb-2 text-sm">選擇要餵食的蛇蛇:</h3>

          {snakes.length === 0 ? (
            <div className="p-8 text-center bg-white/60 rounded-2xl text-amber-800 font-bold">
              牧場裡目前沒有蛇蛇，快去扭蛋吧！🐍
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
              {snakes.map((snake) => (
                <div
                  key={snake.id}
                  onClick={() => handleFeed(snake)}
                  className="bg-white/90 hover:bg-white p-3 rounded-2xl border-2 border-amber-200 hover:border-amber-400 shadow-md flex items-center gap-3 cursor-pointer transform hover:scale-102 transition-all"
                >
                  <SnakeGraphic type={snake.type} stage={snake.stage} size={50} />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-gray-800 text-sm truncate">
                      {SNAKE_NAMES[snake.type]} ({STAGE_NAMES[snake.stage]})
                    </div>
                    {/* EXP bar */}
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${snake.exp}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold mt-0.5">
                      EXP: {snake.exp} / 100
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-black text-xs rounded-xl shadow">
                    餵食
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
