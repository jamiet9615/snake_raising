import React, { useState } from 'react';
import { SnakeType, SNAKE_NAMES } from '../types';
import { playSynthesizedSFX } from '../utils/audio';
import { SnakeGraphic } from './SnakeGraphic';
import { AssetImage } from './AssetImage';
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, X } from 'lucide-react';

interface CodexModalProps {
  unlockedSnakes: Set<SnakeType>;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ unlockedSnakes, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages: { type: SnakeType; desc: string; habitat: string }[] = [
    { type: 'grass', desc: '活潑開朗的小青草蛇，頭頂長著嫩綠幼芽，非常喜歡溫暖的草地！', habitat: '陽光草原' },
    { type: 'strawberry', desc: '渾身散發甜甜草莓香氣的草莓蛇，帽子像可口的草莓蒂！', habitat: '甜心果園' },
    { type: 'sky', desc: '能自由在雲朵中穿梭的天空蛇，有著羽翼般的輕盈雲朵翅膀！', habitat: '彩虹雲海' },
    { type: 'sea', desc: '優雅浪漫的海蛇，鱗片會反射出珊瑚與珍珠般的美麗光澤！', habitat: '深海珊瑚礁' },
    { type: 'ground', desc: '帥氣威風的地頭蛇，戴著經典黑墨鏡，是農場裡的帥氣老大哥！', habitat: '酷炫街區' },
    { type: 'python', desc: '神秘高科技的 python 蛇，蘊含著強大的程式魔法力，超稀有登場！', habitat: '數位樂園' },
  ];

  const currentPageData = pages[currentPage];
  const isUnlocked = unlockedSnakes.has(currentPageData.type);

  const handleNextPage = () => {
    playSynthesizedSFX('click');
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const handlePrevPage = () => {
    playSynthesizedSFX('click');
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-fadeIn">
      {/* 圖鑑版面.png Container */}
      <div className="relative max-w-lg w-full bg-gradient-to-b from-purple-100 via-indigo-50 to-purple-200 rounded-3xl p-6 border-4 border-purple-400 shadow-2xl flex flex-col gap-4">
        <AssetImage name="圖鑑版面.png" className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-20 pointer-events-none" />

        {/* 退出按鍵 (標準 UI X 圖示) */}
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={() => {
              playSynthesizedSFX('click');
              onClose();
            }}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 flex items-center justify-center focus:outline-none"
            title="退出圖鑑"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Header Title */}
        <div className="relative z-10 text-center pt-2 border-b-2 border-purple-200 pb-2">
          <div className="flex items-center justify-center gap-2 text-purple-950 font-black text-2xl">
            <BookOpen className="w-7 h-7 text-purple-600" />
            <span>蛇蛇全圖鑑 ({currentPage + 1} / {pages.length})</span>
          </div>
        </div>

        {/* Interactive Book Page View */}
        <div
          onClick={handleNextPage}
          className="relative z-10 cursor-pointer bg-white/90 rounded-3xl p-6 border-2 border-purple-200 shadow-xl flex flex-col items-center gap-4 text-center transition-all hover:bg-white"
        >
          {/* Unlocked Badge */}
          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <span className="px-4 py-1 bg-emerald-500 text-white font-extrabold text-sm rounded-full shadow flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-300" /> 已解鎖成蛇！
              </span>
            ) : (
              <span className="px-4 py-1 bg-gray-500 text-white font-bold text-sm rounded-full shadow">
                🔒 未解鎖 (剪影模式)
              </span>
            )}
          </div>

          {/* Snake Image (Adult or Silhouette) */}
          <div className="p-4 my-2">
            <SnakeGraphic
              type={currentPageData.type}
              stage="adult"
              isSilhouette={!isUnlocked}
              size={170}
            />
          </div>

          {/* Snake Details */}
          <div>
            <h3 className="text-3xl font-black text-purple-950 mb-1">
              {isUnlocked ? SNAKE_NAMES[currentPageData.type] : '???????'}
            </h3>
            <p className="text-xs font-bold text-purple-600 mb-2">
              棲息地: {currentPageData.habitat}
            </p>
            <p className="text-sm font-bold text-gray-700 max-w-xs leading-relaxed">
              {isUnlocked ? currentPageData.desc : '快去扭蛋機抽出這隻蛇蛇，解鎖完整的圖鑑資料吧！'}
            </p>
          </div>

          <p className="text-[11px] font-bold text-purple-400 animate-pulse mt-2">
            👉 點擊螢幕任意處翻至下一頁
          </p>
        </div>

        {/* Page Controls */}
        <div className="relative z-10 flex items-center justify-between px-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPage();
            }}
            className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-md border-2 border-white transition-transform hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>上一頁</span>
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-1.5">
            {pages.map((_, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  playSynthesizedSFX('click');
                  setCurrentPage(idx);
                }}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  currentPage === idx ? 'bg-purple-600 scale-125' : 'bg-purple-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextPage();
            }}
            className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-md border-2 border-white transition-transform hover:scale-105 active:scale-95"
          >
            <span>下一頁</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
