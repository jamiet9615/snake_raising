import React from 'react';
import { GameSettings } from '../types';
import { playSynthesizedSFX, updateAudioSettings } from '../utils/audio';
import { AssetImage } from './AssetImage';
import { Settings, Volume2, Music, RotateCcw, VolumeX, Music2, X } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetGame: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetGame,
  onClose,
}) => {
  const toggleBGM = () => {
    playSynthesizedSFX('click');
    const updated = { ...settings, bgmOn: !settings.bgmOn };
    onUpdateSettings(updated);
    updateAudioSettings(updated.bgmOn, updated.sfxOn, updated.bgmVolume, updated.sfxVolume);
  };

  const toggleSFX = () => {
    playSynthesizedSFX('click');
    const updated = { ...settings, sfxOn: !settings.sfxOn };
    onUpdateSettings(updated);
    updateAudioSettings(updated.bgmOn, updated.sfxOn, updated.bgmVolume, updated.sfxVolume);
  };

  const handleBgmVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...settings, bgmVolume: val };
    onUpdateSettings(updated);
    updateAudioSettings(updated.bgmOn, updated.sfxOn, updated.bgmVolume, updated.sfxVolume);
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...settings, sfxVolume: val };
    onUpdateSettings(updated);
    updateAudioSettings(updated.bgmOn, updated.sfxOn, updated.bgmVolume, updated.sfxVolume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-fadeIn">
      {/* 設定版面.PNG Container in middle */}
      <div className="relative max-w-md w-full bg-gradient-to-b from-slate-100 via-white to-emerald-50 rounded-3xl p-6 border-4 border-emerald-300 shadow-2xl flex flex-col gap-5">
        <AssetImage name="設定版面.PNG" className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-emerald-200 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-7 h-7 text-emerald-600 animate-[spin_10s_linear_infinite]" />
            <h2 className="text-2xl font-black text-gray-800 tracking-wide">系統設定 Settings</h2>
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

        {/* Audio Controls */}
        <div className="relative z-10 space-y-4">
          {/* BGM Toggle with 背景音樂_on.PNG / 背景音樂_off.PNG */}
          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-gray-800">
                <Music className="w-5 h-5 text-emerald-600" />
                <span>背景音樂 (BGM)</span>
              </div>
              <button
                onClick={toggleBGM}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-transform hover:scale-105 active:scale-95"
              >
                <AssetImage
                  name={settings.bgmOn ? '背景音樂_on.PNG' : '背景音樂_off.PNG'}
                  className="w-10 h-10 object-contain"
                />
              </button>
            </div>
            {settings.bgmOn && (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-bold text-gray-500">音量</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.bgmVolume}
                  onChange={handleBgmVolumeChange}
                  className="w-full accent-emerald-600"
                />
              </div>
            )}
          </div>

          {/* SFX Toggle with 音效_on.PNG / 音效_off.PNG */}
          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-gray-800">
                <Volume2 className="w-5 h-5 text-emerald-600" />
                <span>遊戲音效 (SFX)</span>
              </div>
              <button
                onClick={toggleSFX}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-transform hover:scale-105 active:scale-95"
              >
                <AssetImage
                  name={settings.sfxOn ? '音效_on.PNG' : '音效_off.PNG'}
                  className="w-10 h-10 object-contain"
                />
              </button>
            </div>
            {settings.sfxOn && (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-bold text-gray-500">音量</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.sfxVolume}
                  onChange={handleSfxVolumeChange}
                  className="w-full accent-emerald-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* Reset Game Save */}
        <div className="relative z-10 pt-2 border-t border-gray-200">
          <button
            onClick={() => {
              playSynthesizedSFX('click');
              if (window.confirm('確定要重新開始遊戲嗎？這將清除目前所有金幣、蛇蛇與進度。')) {
                onResetGame();
              }
            }}
            className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-700 font-extrabold rounded-2xl border border-red-300 shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-102"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置遊戲進度 (Reset Data)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
