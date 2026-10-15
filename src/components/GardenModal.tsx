import React from 'react';
import { GraduatedSnake, SNAKE_NAMES } from '../types';
import { playSynthesizedSFX } from '../utils/audio';
import { SnakeGraphic } from './SnakeGraphic';
import { AssetImage } from './AssetImage';
import { Sparkles, Flower2, X } from 'lucide-react';

interface GardenModalProps {
  graduatedSnakes: GraduatedSnake[];
  onClose: () => void;
}

export const GardenModal: React.FC<GardenModalProps> = ({ graduatedSnakes, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-fadeIn">
      {/* 花園背景.PNG */}
      <div className="absolute inset-0 z-0">
        <AssetImage name="花園背景.PNG" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/30 via-transparent to-emerald-900/40 pointer-events-none" />
      </div>

      {/* Top Left Exit Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => {
            playSynthesizedSFX('click');
            onClose();
          }}
          className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl border-2 border-white transition-transform hover:scale-110 flex items-center justify-center focus:outline-none"
          title="退出花園"
        >
          <X className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* Header Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl border-4 border-yellow-300 shadow-2xl text-center flex items-center gap-2">
        <Flower2 className="w-6 h-6 text-pink-500 animate-spin" style={{ animationDuration: '8s' }} />
        <h2 className="text-xl md:text-2xl font-black text-emerald-900 tracking-wider">
          🌸 畢業蛇蛇紀念花園 🏡
        </h2>
        <Flower2 className="w-6 h-6 text-pink-500 animate-spin" style={{ animationDuration: '8s' }} />
      </div>

      {/* Garden Grass Pasture */}
      <div className="relative z-10 max-w-4xl w-full h-[75vh] mt-12 bg-white/40 backdrop-blur-md rounded-3xl border-4 border-emerald-300 shadow-2xl p-6 overflow-y-auto flex flex-col items-center justify-start">
        {graduatedSnakes.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center text-center p-8 bg-white/80 rounded-3xl border-2 border-emerald-200 shadow-xl max-w-md">
            <span className="text-6xl mb-3 animate-bounce">🌱</span>
            <h3 className="text-2xl font-black text-emerald-900 mb-2">花園目前空空如也~</h3>
            <p className="text-sm font-bold text-gray-700 leading-relaxed">
              只要把蛇蛇照顧至「成蛇」，並再獲得 100 經驗值達到畢業，牠們就會開心地住進這個美麗的花園花海中喔！
            </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
            {graduatedSnakes.map((snake) => (
              <div
                key={snake.id}
                className="bg-white/80 hover:bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-xl flex flex-col items-center justify-center gap-2 transform hover:scale-105 transition-all group"
              >
                <div className="relative">
                  <SnakeGraphic type={snake.type} stage="adult" size={110} />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-purple-950 px-2 py-0.5 rounded-full font-black text-[10px] shadow border border-white flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 text-purple-900" />
                    <span>畢業展</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-black text-emerald-950 text-base">
                    {SNAKE_NAMES[snake.type]}
                  </div>
                  <p className="text-[10px] font-bold text-emerald-700">
                    畢業時間: {new Date(snake.graduatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
