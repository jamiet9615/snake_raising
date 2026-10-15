import React, { useState, useEffect } from 'react';
import { SnakeInfo, SNAKE_NAMES, STAGE_NAMES } from '../types';
import { playSynthesizedSFX } from '../utils/audio';
import { SnakeGraphic } from './SnakeGraphic';
import { Sparkles, Heart } from 'lucide-react';

interface SnakeFieldProps {
  snakes: SnakeInfo[];
  onPetSnake: (id: string) => void;
  onCollectItems: (coins: number, apples: number, eggs: number) => void;
  onSnakeEvolve: (snakeId: string) => void;
}

export const SnakeField: React.FC<SnakeFieldProps> = ({
  snakes,
  onPetSnake,
  onCollectItems,
  onSnakeEvolve,
}) => {
  // Collectible items on the floor
  const [groundCollectibles, setGroundCollectibles] = useState<
    { id: string; type: 'coin' | 'apple' | 'egg'; amount: number; x: number; y: number }[]
  >([]);

  const [floatText, setFloatText] = useState<{ id: string; text: string; x: number; y: number }[]>([]);

  // Timer loop for item and coin production
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      snakes.forEach((snake) => {
        // Check Apple & Egg Production
        // 幼蛇: 30s -> 1 Apple
        // 青年: 60s -> 3 Apples
        // 成蛇: 180s -> 3 Apples + 1 Egg
        const appleInterval = snake.stage === 'baby' ? 30000 : snake.stage === 'youth' ? 60000 : 180000;
        if (now - snake.lastAppleTime >= appleInterval) {
          snake.lastAppleTime = now;
          if (snake.stage === 'baby') {
            spawnCollectible('apple', 1);
          } else if (snake.stage === 'youth') {
            spawnCollectible('apple', 3);
          } else {
            spawnCollectible('apple', 3);
            spawnCollectible('egg', 1);
          }
        }

        // Check Coin Production
        // 幼蛇: 30s -> 1 Coin
        // 青年: 15s -> 1 Coin
        // 成蛇: 5s -> 2 Coins
        const coinInterval = snake.stage === 'baby' ? 30000 : snake.stage === 'youth' ? 15000 : 5000;
        const coinAmount = snake.stage === 'adult' ? 2 : 1;
        if (now - snake.lastCoinTime >= coinInterval) {
          snake.lastCoinTime = now;
          spawnCollectible('coin', coinAmount);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [snakes]);

  const spawnCollectible = (type: 'coin' | 'apple' | 'egg', amount: number) => {
    const id = Math.random().toString();
    const x = 15 + Math.random() * 70; // 15% to 85%
    const y = 30 + Math.random() * 50; // 30% to 80%

    setGroundCollectibles((prev) => [...prev.slice(-15), { id, type, amount, x, y }]);
  };

  const handlePickUp = (id: string, type: 'coin' | 'apple' | 'egg', amount: number, x: number, y: number) => {
    playSynthesizedSFX('click');
    setGroundCollectibles((prev) => prev.filter((item) => item.id !== id));

    let text = '';
    if (type === 'coin') {
      onCollectItems(amount, 0, 0);
      text = `+${amount} 🪙`;
    } else if (type === 'apple') {
      onCollectItems(0, amount, 0);
      text = `+${amount} 🍎`;
    } else {
      onCollectItems(0, 0, amount);
      text = `+${amount} 🥚`;
    }

    // Add float text feedback
    const floatId = Math.random().toString();
    setFloatText((prev) => [...prev, { id: floatId, text, x, y }]);
    setTimeout(() => {
      setFloatText((prev) => prev.filter((item) => item.id !== floatId));
    }, 1000);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Empty Field Hint */}
      {snakes.length === 0 && (
        <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl border-4 border-yellow-300 shadow-2xl text-center max-w-sm animate-bounce">
          <span className="text-6xl mb-2 inline-block">🐍</span>
          <h2 className="text-2xl font-black text-emerald-950">牧場目前沒有蛇蛇~</h2>
          <p className="text-sm font-bold text-emerald-800 mt-2">
            點擊下方「扭蛋」按鍵抽出第一隻可愛的幼蛇吧！
          </p>
        </div>
      )}

      {/* Active Snakes Stage Area */}
      <div className="w-full max-w-4xl h-full flex flex-wrap items-center justify-center gap-6 md:gap-12 p-4 overflow-y-auto">
        {snakes.map((snake) => {
          // Calculate time till next apple/coin production
          const appleTotal = snake.stage === 'baby' ? 30 : snake.stage === 'youth' ? 60 : 180;
          const appleProgress = Math.min(100, Math.floor(((Date.now() - snake.lastAppleTime) / 1000 / appleTotal) * 100));

          return (
            <div
              key={snake.id}
              className="relative flex flex-col items-center justify-center p-3.5 bg-white/60 hover:bg-white/85 backdrop-blur-md rounded-3xl border-2 border-emerald-200 shadow-xl transition-all duration-300 group overflow-visible min-w-[12rem]"
            >
              {/* Petting Sound Trigger */}
              <div
                onClick={() => {
                  // Play stage-specific petting sound
                  if (snake.stage === 'baby') playSynthesizedSFX('pet_baby');
                  else if (snake.stage === 'youth') playSynthesizedSFX('pet_youth');
                  else playSynthesizedSFX('pet_adult');

                  onPetSnake(snake.id);
                }}
                className="cursor-pointer overflow-visible"
              >
                <SnakeGraphic
                  type={snake.type}
                  stage={snake.stage}
                  isPetting={snake.isPetting}
                  size={snake.stage === 'baby' ? 140 : snake.stage === 'youth' ? 165 : 190}
                />
              </div>

              {/* Snake Name & Growth Stage Info */}
              <div className="mt-2 text-center bg-white/90 px-4 py-1.5 rounded-2xl border border-emerald-300 shadow-sm w-38">
                <div className="font-black text-gray-800 text-sm flex items-center justify-center gap-1">
                  <span>{SNAKE_NAMES[snake.type]}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {STAGE_NAMES[snake.stage]}
                  </span>
                </div>

                {/* EXP progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1 relative">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                    style={{ width: `${snake.exp}%` }}
                  />
                </div>
                <div className="text-[10px] font-bold text-gray-500 mt-0.5">
                  EXP: {snake.exp} / 100
                </div>

                {/* Evolve or Graduate Button when 100 EXP reached */}
                {snake.exp >= 100 && (
                  <button
                    onClick={() => onSnakeEvolve(snake.id)}
                    className="mt-1 w-full py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-950 font-black text-xs rounded-xl shadow border border-white animate-bounce"
                  >
                    {snake.stage === 'adult' ? '🎉 畢業前往花園' : '⭐ 點擊進化！'}
                  </button>
                )}
              </div>

              {/* Production Progress Bar Indicator */}
              <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                <span>產出中: {appleProgress}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collectible Drops on the Ground */}
      {groundCollectibles.map((item) => (
        <div
          key={item.id}
          onClick={() => handlePickUp(item.id, item.type, item.amount, item.x, item.y)}
          className="absolute z-20 cursor-pointer transform hover:scale-125 transition-transform animate-bounce select-none"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          <div className="p-2 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-yellow-300 shadow-2xl flex items-center gap-1 font-black text-sm">
            <span className="text-2xl">
              {item.type === 'coin' ? '🪙' : item.type === 'apple' ? '🍎' : '🥚'}
            </span>
            <span className="text-xs text-amber-900">+{item.amount}</span>
          </div>
        </div>
      ))}

      {/* Floating Pickup Text */}
      {floatText.map((item) => (
        <div
          key={item.id}
          className="absolute z-30 font-black text-yellow-300 text-lg md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-floatUp pointer-events-none"
          style={{ left: `${item.x}%`, top: `${item.y - 5}%` }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};
