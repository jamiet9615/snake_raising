import React, { useEffect } from 'react';
import { playSynthesizedSFX, playBGM, unlockAudio } from '../utils/audio';
import { AssetImage } from './AssetImage';

interface CoverScreenProps {
  onStartGame: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onStartGame }) => {
  useEffect(() => {
    // Attempt BGM
    playBGM('cover');
  }, []);

  const handleStart = () => {
    // Unlock Web Audio and HTML5 Audio on mobile user gesture
    unlockAudio();
    playSynthesizedSFX('click');
    onStartGame();
  };

  return (
    <div 
      onClick={unlockAudio}
      onTouchStart={unlockAudio}
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-between select-none"
    >
      {/* 封面背景.PNG (滿版背景) */}
      <div className="absolute inset-0 z-0">
        <AssetImage
          name="封面背景.PNG"
          className="w-full h-full object-cover"
        />
        {/* Soft decorative gradient overlay for crisp contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 via-transparent to-black/40" />
      </div>

      {/* 封面開始按鍵.PNG 在下方，有呼吸效果 */}
      <div className="relative z-10 mt-auto mb-16 md:mb-24 w-full max-w-xs md:max-w-sm px-6 flex justify-center">
        <div
          onClick={handleStart}
          className="cursor-pointer transform transition-transform duration-700 hover:scale-105 active:scale-95 animate-[pulse_2s_infinite]"
        >
          <AssetImage
            name="封面開始按鍵.PNG"
            alt="開始遊戲"
            className="w-full h-auto drop-shadow-2xl scale-125 origin-center"
          />
        </div>
      </div>
    </div>
  );
};
