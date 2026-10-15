import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Music, Music2, X } from 'lucide-react';
import { resolveAssetPath } from '../utils/assets';

interface AssetImageProps {
  name: string; // Filename like "封面開始按鍵.PNG" or "扭蛋機.PNG"
  alt?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const AssetImage: React.FC<AssetImageProps> = ({
  name,
  alt = '',
  className = '',
  onClick,
  style,
}) => {
  const [hasError, setHasError] = useState(false);

  // Resolved path to static files
  const srcPath = resolveAssetPath(name);

  if (!hasError) {
    return (
      <img
        src={srcPath}
        alt={alt || name}
        className={className}
        style={style}
        onClick={onClick}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    );
  }

  // Fallback high-quality SVG vector button / background UI representation
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none overflow-hidden transition-all duration-200 ${className}`}
      style={style}
    >
      {renderFallbackGraphic(name)}
    </div>
  );
};

// Render custom graphic when local PNG file isn't found
function renderFallbackGraphic(name: string) {
  // Normalize string for checking
  const lowerName = name.toLowerCase();

  // Cover Start Button
  if (name.includes('封面開始按鍵') || name.includes('開始按鍵')) {
    return (
      <button className="w-full h-full py-4 px-10 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-2xl md:text-3xl rounded-full shadow-2xl border-4 border-yellow-300 flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 transition-all">
        <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" />
        <span>開始遊戲 START</span>
        <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" />
      </button>
    );
  }

  // Cover Background
  if (name.includes('封面背景')) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-sky-400 via-emerald-300 to-green-500 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_70%)] pointer-events-none" />
      </div>
    );
  }

  // Game Background
  if (name.includes('遊戲背景')) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-emerald-200 via-emerald-100 to-green-300" />
    );
  }

  // Garden Background
  if (name.includes('花園背景')) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-amber-100 via-emerald-100 to-green-400 relative overflow-hidden" />
    );
  }

  // Gacha Button
  if (name.includes('扭蛋按鍵')) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold rounded-2xl p-3 shadow-lg border-2 border-purple-200 flex flex-col items-center justify-center gap-1">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-purple-900 shadow-inner font-extrabold">
          🎁
        </div>
        <span className="text-sm font-extrabold tracking-wide">扭蛋 Gacha</span>
      </div>
    );
  }

  // Gacha Machine
  if (name.includes('扭蛋機')) {
    return (
      <div className="w-64 h-80 bg-gradient-to-b from-pink-500 via-red-400 to-purple-600 rounded-3xl p-4 shadow-2xl border-4 border-yellow-300 flex flex-col items-center justify-between relative">
        <div className="w-full bg-white/30 backdrop-blur-md rounded-2xl p-2 text-center text-white font-black text-xl shadow-inner">
          ✨ S N A K E  G A C H A ✨
        </div>
        <div className="w-48 h-36 bg-sky-100/80 rounded-2xl border-4 border-white flex items-center justify-center shadow-inner relative overflow-hidden">
          {/* Glass dome with eggs inside */}
          <div className="absolute inset-0 flex flex-wrap gap-2 p-3 justify-center items-center opacity-90">
            <span className="text-3xl animate-bounce">🔴</span>
            <span className="text-3xl animate-pulse">🟡</span>
            <span className="text-3xl animate-bounce">🔵</span>
            <span className="text-3xl animate-pulse">🟢</span>
            <span className="text-3xl animate-bounce">🟣</span>
          </div>
        </div>
        <div className="w-16 h-16 bg-yellow-400 hover:bg-yellow-300 rounded-full border-4 border-yellow-100 shadow-lg flex items-center justify-center cursor-pointer font-black text-purple-900 text-xl">
          TURN
        </div>
      </div>
    );
  }

  // Gacha Egg Ball
  if (name.includes('扭蛋') && !name.includes('按鍵') && !name.includes('畫面') && !name.includes('機') && !name.includes('背景')) {
    return (
      <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-yellow-300 rounded-full border-2 border-white shadow-xl flex items-center justify-center font-bold text-white text-2xl">
        ✨
      </div>
    );
  }

  // Gacha Result Screen
  if (name.includes('出抽出扭蛋畫面')) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-purple-900/90 to-indigo-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center rounded-3xl border-4 border-yellow-300">
        <Sparkles className="w-16 h-16 text-yellow-300 animate-spin mb-2" />
        <h2 className="text-3xl font-black text-yellow-300 tracking-wider">恭喜獲得！</h2>
      </div>
    );
  }

  // Food Button
  if (name.includes('食物按鍵')) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-2xl p-3 shadow-lg border-2 border-amber-200 flex flex-col items-center justify-center gap-1">
        <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-amber-900 shadow-inner font-extrabold">
          🍎
        </div>
        <span className="text-sm font-extrabold tracking-wide">餵食 Feed</span>
      </div>
    );
  }

  // Apple
  if (name.includes('蘋果')) {
    return (
      <div className="flex items-center gap-1 font-bold text-red-600 text-lg">
        <span className="text-2xl">🍎</span>
        <span>蘋果</span>
      </div>
    );
  }

  // Egg
  if (name.includes('蛋') && !name.includes('扭蛋')) {
    return (
      <div className="flex items-center gap-1 font-bold text-amber-600 text-lg">
        <span className="text-2xl">🥚</span>
        <span>雞蛋</span>
      </div>
    );
  }

  // Upgrade Button
  if (name.includes('升級按鍵')) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl p-3 shadow-lg border-2 border-emerald-200 flex flex-col items-center justify-center gap-1">
        <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-900 shadow-inner font-extrabold">
          ⭐
        </div>
        <span className="text-sm font-extrabold tracking-wide">升級 Level</span>
      </div>
    );
  }

  // Garden Button
  if (name.includes('花園按鍵')) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold rounded-2xl p-3 shadow-lg border-2 border-green-200 flex flex-col items-center justify-center gap-1">
        <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-900 shadow-inner font-extrabold">
          🏡
        </div>
        <span className="text-sm font-extrabold tracking-wide">花園 Garden</span>
      </div>
    );
  }

  // Audio / Music Toggles
  if (name.includes('背景音樂_on')) {
    return <Music className="w-7 h-7 text-emerald-600" />;
  }
  if (name.includes('背景音樂_off')) {
    return <Music2 className="w-7 h-7 text-gray-400 opacity-60" />;
  }
  if (name.includes('音效_on')) {
    return <Volume2 className="w-7 h-7 text-emerald-600" />;
  }
  if (name.includes('音效_off')) {
    return <VolumeX className="w-7 h-7 text-gray-400 opacity-60" />;
  }

  // Exit / Close Buttons
  if (name.includes('退出遊戲按鍵') || name.includes('遊戲退出按鍵') || name.includes('退出')) {
    return (
      <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md border-2 border-white flex items-center justify-center transition-transform hover:scale-110">
        <X className="w-6 h-6 stroke-[3]" />
      </button>
    );
  }

  // Default Fallback
  return (
    <div className="p-2 bg-white/80 rounded-lg text-xs font-semibold text-gray-700 border border-gray-300 shadow-sm flex items-center gap-1">
      <span>{name.replace('.PNG', '').replace('.png', '')}</span>
    </div>
  );
}
