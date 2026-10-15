import React from 'react';
import { playSynthesizedSFX } from '../utils/audio';
import { AssetImage } from './AssetImage';

interface BottomMenuProps {
  onOpenGacha: () => void;
  onOpenFeed: () => void;
  onOpenLevel: () => void;
  onOpenGarden: () => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({
  onOpenGacha,
  onOpenFeed,
  onOpenLevel,
  onOpenGarden,
}) => {
  return (
    <div className="w-full max-w-2xl md:max-w-3xl px-3 sm:px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-3xl border-3 border-yellow-300 shadow-2xl flex items-center justify-around gap-2.5 md:gap-3.5 z-20 select-none">
      {/* 1. 扭蛋 (Gacha) */}
      <button
        onClick={() => {
          playSynthesizedSFX('click');
          onOpenGacha();
        }}
        className="flex-1 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-yellow-50 to-amber-100 hover:from-yellow-100 hover:to-amber-200 rounded-2xl border-2 border-yellow-300/80 cursor-pointer transform hover:-translate-y-1 active:translate-y-1 active:scale-95 transition-all flex items-center justify-center focus:outline-none shadow-md hover:shadow-lg active:shadow-inner overflow-visible relative group"
      >
        <AssetImage name="扭蛋按鍵.PNG" alt="扭蛋" className="w-full h-full object-contain filter drop-shadow-md scale-125 sm:scale-135 group-hover:scale-145 translate-y-1 sm:translate-y-1.5 transition-transform duration-200 pointer-events-none" />
      </button>

      {/* 2. 餵食 (Feed) */}
      <button
        onClick={() => {
          playSynthesizedSFX('click');
          onOpenFeed();
        }}
        className="flex-1 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-yellow-50 to-amber-100 hover:from-yellow-100 hover:to-amber-200 rounded-2xl border-2 border-yellow-300/80 cursor-pointer transform hover:-translate-y-1 active:translate-y-1 active:scale-95 transition-all flex items-center justify-center focus:outline-none shadow-md hover:shadow-lg active:shadow-inner overflow-visible relative group"
      >
        <AssetImage name="食物按鍵.PNG" alt="餵食" className="w-full h-full object-contain filter drop-shadow-md scale-125 sm:scale-135 group-hover:scale-145 translate-y-2 sm:translate-y-2.5 transition-transform duration-200 pointer-events-none" />
      </button>

      {/* 3. 升級 (Level) */}
      <button
        onClick={() => {
          playSynthesizedSFX('click');
          onOpenLevel();
        }}
        className="flex-1 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-yellow-50 to-amber-100 hover:from-yellow-100 hover:to-amber-200 rounded-2xl border-2 border-yellow-300/80 cursor-pointer transform hover:-translate-y-1 active:translate-y-1 active:scale-95 transition-all flex items-center justify-center focus:outline-none shadow-md hover:shadow-lg active:shadow-inner overflow-visible relative group"
      >
        <AssetImage name="升級按鍵.PNG" alt="升級" className="w-full h-full object-contain filter drop-shadow-md scale-125 sm:scale-135 group-hover:scale-145 translate-y-3 sm:translate-y-4 transition-transform duration-200 pointer-events-none" />
      </button>

      {/* 4. 花園 (Garden) */}
      <button
        onClick={() => {
          playSynthesizedSFX('click');
          onOpenGarden();
        }}
        className="flex-1 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-yellow-50 to-amber-100 hover:from-yellow-100 hover:to-amber-200 rounded-2xl border-2 border-yellow-300/80 cursor-pointer transform hover:-translate-y-1 active:translate-y-1 active:scale-95 transition-all flex items-center justify-center focus:outline-none shadow-md hover:shadow-lg active:shadow-inner overflow-visible relative group"
      >
        <AssetImage name="花園按鍵.PNG" alt="花園" className="w-full h-full object-contain filter drop-shadow-md scale-125 sm:scale-135 group-hover:scale-145 translate-y-1 sm:translate-y-1.5 transition-transform duration-200 pointer-events-none" />
      </button>
    </div>
  );
};
