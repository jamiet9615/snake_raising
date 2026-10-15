import React, { useState } from 'react';
import { SnakeType, SNAKE_NAMES, PlayerStats } from '../types';
import { playSynthesizedSFX } from '../utils/audio';
import { SnakeGraphic } from './SnakeGraphic';
import { AssetImage } from './AssetImage';
import { Sparkles, X } from 'lucide-react';

interface GachaModalProps {
  stats: PlayerStats;
  onDrawSnake: (type: SnakeType) => void;
  onClose: () => void;
  onDeductCoins: (amount: number) => boolean;
}

export const GachaModal: React.FC<GachaModalProps> = ({
  stats,
  onDrawSnake,
  onClose,
  onDeductCoins,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMachineShaking, setIsMachineShaking] = useState(false);
  const [isEggShaking, setIsEggShaking] = useState(false);
  const [drawnSnake, setDrawnSnake] = useState<SnakeType | null>(null);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Draw Gacha according to specified probabilities
  const getRandomSnakeType = (): SnakeType => {
    const rand = Math.random() * 100;
    if (rand < 50) {
      // 50% divided among Grass, Strawberry, Sky (~16.66% each)
      const subRand = Math.random();
      if (subRand < 0.333) return 'grass';
      if (subRand < 0.666) return 'strawberry';
      return 'sky';
    } else if (rand < 80) {
      // 30% divided between Ground & Sea (15% each)
      return Math.random() < 0.5 ? 'ground' : 'sea';
    } else {
      // 20% Python!
      return 'python';
    }
  };

  const handleStartDraw = () => {
    if (isDrawing) return;
    setErrorMessage('');

    // Deduct 60 coins
    const success = onDeductCoins(60);
    if (!success) {
      setErrorMessage('金幣不足！一次扭蛋需要 60 金幣 🪙');
      return;
    }

    setIsDrawing(true);
    setShowResultScreen(false);
    setDrawnSnake(null);

    // 1. Play gacha pull sound
    playSynthesizedSFX('gacha_shake');

    // 2. Gacha machine shakes left & right
    setIsMachineShaking(true);

    // 3. Gacha egg delays 0.3s then shakes
    setTimeout(() => {
      setIsEggShaking(true);
    }, 300);

    // 4. After 1.5s, drop egg out and play drop sound
    setTimeout(() => {
      setIsMachineShaking(false);
      setIsEggShaking(false);
      playSynthesizedSFX('gacha_drop');

      const drawnType = getRandomSnakeType();
      setDrawnSnake(drawnType);
      setShowResultScreen(true);
      onDrawSnake(drawnType);
      setIsDrawing(false);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-fadeIn">
      {/* 扭蛋背景.PNG */}
      <div className="absolute inset-0 z-0 opacity-40">
        <AssetImage name="扭蛋背景.PNG" className="w-full h-full object-cover" />
      </div>

      {/* 退出按鍵 (預設樣式) */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => {
            playSynthesizedSFX('click');
            onClose();
          }}
          className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl border-2 border-white transition-transform hover:scale-110 flex items-center justify-center focus:outline-none"
          title="退出"
        >
          <X className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* Center Gacha Machine Container */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 max-w-lg w-full">
        {/* Title & Coins display */}
        <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl border-4 border-yellow-300 shadow-2xl text-center">
          <h2 className="text-2xl font-black text-purple-900 tracking-wider">✨ 歡樂蛇蛇扭蛋機 ✨</h2>
          <p className="text-sm font-extrabold text-amber-700 mt-1">
            扭蛋一次: <span className="text-amber-900 font-black">60 金幣</span> (目前擁有: {stats.coins} 🪙)
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-500 text-white font-black px-4 py-2 rounded-xl shadow-lg text-sm animate-bounce">
            {errorMessage}
          </div>
        )}

        {/* Gacha Machine Graphics Area (1.3~1.5x Scaled) */}
        <div className="relative flex flex-col items-center">
          <div
            onClick={handleStartDraw}
            className={`relative inline-block cursor-pointer transform transition-transform duration-200 hover:scale-105 active:scale-95 ${
              isMachineShaking ? 'animate-[bounce_0.2s_infinite_alternate] rotate-3' : ''
            }`}
          >
            {/* 扭蛋機.PNG (Enlarged 1.4x) */}
            <AssetImage name="扭蛋機.PNG" className="w-88 md:w-96 h-[26rem] md:h-[28rem] object-contain drop-shadow-2xl pointer-events-none" />

            {/* 扭蛋.PNG (Enlarged 2x, placed inside glass dome) */}
            <div
              className={`absolute top-20 md:top-24 left-1/2 -translate-x-1/2 transition-transform pointer-events-none ${
                isEggShaking ? 'animate-ping' : ''
              }`}
            >
              <AssetImage name="扭蛋.PNG" className="w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-xl" />
            </div>
          </div>

          {/* Action Button */}
          <button
            disabled={isDrawing}
            onClick={handleStartDraw}
            className={`mt-4 px-8 py-3 rounded-2xl font-black text-xl shadow-2xl border-4 transition-all ${
              isDrawing
                ? 'bg-gray-400 text-gray-200 border-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-purple-950 border-white hover:scale-105 active:scale-95'
            }`}
          >
            {isDrawing ? '扭蛋轉動中...' : '🎲 開始扭蛋 (60元)'}
          </button>
        </div>
      </div>

      {/* 出抽出扭蛋畫面.PNG Popup Result */}
      {showResultScreen && drawnSnake && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          {/* Result Box */}
          <div className="relative max-w-sm w-full bg-gradient-to-b from-purple-800 via-indigo-800 to-purple-900 rounded-3xl p-6 border-4 border-yellow-300 shadow-2xl flex flex-col items-center gap-4 text-white">
            <AssetImage name="出抽出扭蛋畫面.PNG" className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-30 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-2 text-yellow-300 text-3xl font-black tracking-wider animate-bounce">
              <Sparkles className="w-8 h-8" />
              <span>抽中了幼蛇！</span>
              <Sparkles className="w-8 h-8" />
            </div>

            {/* Show Drawn Snake Graphic */}
            <div className="relative z-10 my-4 bg-white/10 rounded-3xl p-4 border-2 border-yellow-200/50 flex items-center justify-center">
              <SnakeGraphic type={drawnSnake} stage="baby" size={160} />
            </div>

            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-black text-yellow-300">{SNAKE_NAMES[drawnSnake]}</h3>
              <p className="text-sm font-semibold text-purple-200 mt-1">
                可愛的 {SNAKE_NAMES[drawnSnake]} 幼蛇加入你的牧場囉！
              </p>
            </div>

            {/* Confirm Button */}
            <button
              onClick={() => {
                playSynthesizedSFX('click');
                setShowResultScreen(false);
              }}
              className="relative z-10 mt-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-lg rounded-2xl border-2 border-white shadow-xl transform hover:scale-105 active:scale-95"
            >
              太棒了！放入牧場
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
