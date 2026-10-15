import React from 'react';
import { playSynthesizedSFX } from '../utils/audio';
import { Settings, BookOpen, LogOut } from 'lucide-react';

interface TopRightMenuProps {
  onOpenSettings: () => void;
  onOpenCodex: () => void;
  onExitGame: () => void;
}

export const TopRightMenu: React.FC<TopRightMenuProps> = ({
  onOpenSettings,
  onOpenCodex,
  onExitGame,
}) => {
  return (
    <div className="flex flex-col items-end gap-2 md:gap-3 z-20 select-none">
      {/* 1. 設定 (Settings) */}
      <button
        onClick={() => {
          playSynthesizedSFX('click');
          onOpenSettings();
        }}
        className="flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white backdrop-blur-md text-emerald-800 font-extrabold rounded-2xl shadow-xl border-2 border-emerald-200 transition-transform hover:scale-105 active:scale-95 text-xs md:text-sm"
      >
        <Settings className="w-5 h-5 text-emerald-600 animate-[spin_10s_linear_infinite]" />
        <span>設定 Settings</span>
      </button>

      {/* 2. 圖鑑 (Codex) */}
      <button
        onClick={() => {
          playSynthesizedSFX('click');
          onOpenCodex();
        }}
        className="flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white backdrop-blur-md text-purple-800 font-extrabold rounded-2xl shadow-xl border-2 border-purple-200 transition-transform hover:scale-105 active:scale-95 text-xs md:text-sm"
      >
        <BookOpen className="w-5 h-5 text-purple-600" />
        <span>圖鑑 Codex</span>
      </button>

      {/* 3. 退出遊戲按鍵 (Exit Game) */}
      <button
        onClick={() => {
          playSynthesizedSFX('click');
          onExitGame();
        }}
        className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-2xl shadow-xl border-2 border-red-300 transition-transform hover:scale-105 active:scale-95 text-xs md:text-sm"
      >
        <LogOut className="w-5 h-5" />
        <span>退出遊戲</span>
      </button>
    </div>
  );
};
