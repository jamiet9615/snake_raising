import React, { useState, useEffect } from 'react';
import {
  SnakeInfo,
  GraduatedSnake,
  PlayerStats,
  GameSettings,
  SnakeType,
  SnakeStage,
} from './types';
import { playBGM, stopBGM, updateAudioSettings, playSynthesizedSFX } from './utils/audio';
import { CoverScreen } from './components/CoverScreen';
import { ResourceBar } from './components/ResourceBar';
import { TopRightMenu } from './components/TopRightMenu';
import { BottomMenu } from './components/BottomMenu';
import { SnakeField } from './components/SnakeField';
import { GachaModal } from './components/GachaModal';
import { FeedModal } from './components/FeedModal';
import { LevelModal } from './components/LevelModal';
import { CodexModal } from './components/CodexModal';
import { GardenModal } from './components/GardenModal';
import { SettingsModal } from './components/SettingsModal';
import { AssetImage } from './components/AssetImage';

const STORAGE_KEY = 'SNAKE_RANCH_SAVE_DATA_V1';

export default function App() {
  const [inGame, setInGame] = useState(false);

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    'gacha' | 'feed' | 'level' | 'codex' | 'garden' | 'settings' | null
  >(null);

  // Player Stats
  const [stats, setStats] = useState<PlayerStats>({
    coins: 120, // Initial coins so player can try gacha right away
    apples: 5,
    eggs: 2,
    level: 1,
    exp: 0,
  });

  // Active Snakes on field
  const [snakes, setSnakes] = useState<SnakeInfo[]>([]);

  // Graduated Snakes in Garden
  const [graduatedSnakes, setGraduatedSnakes] = useState<GraduatedSnake[]>([]);

  // Codex Unlocked Snake Types
  const [unlockedSnakes, setUnlockedSnakes] = useState<Set<SnakeType>>(new Set());

  // Game Settings
  const [settings, setSettings] = useState<GameSettings>({
    bgmOn: true,
    sfxOn: true,
    bgmVolume: 0.5,
    sfxVolume: 0.7,
  });

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.snakes) setSnakes(parsed.snakes);
        if (parsed.graduatedSnakes) setGraduatedSnakes(parsed.graduatedSnakes);
        if (parsed.unlockedSnakes) setUnlockedSnakes(new Set(parsed.unlockedSnakes));
        if (parsed.settings) setSettings(parsed.settings);
      } else {
        // Initial default snake: Grass Baby Snake
        const initialSnake: SnakeInfo = {
          id: 'snake_init_1',
          type: 'grass',
          stage: 'baby',
          exp: 20,
          name: '青草蛇',
          hatchedAt: Date.now(),
          lastAppleTime: Date.now(),
          lastCoinTime: Date.now(),
        };
        setSnakes([initialSnake]);
        setUnlockedSnakes(new Set(['grass']));
      }
    } catch (e) {
      console.warn('Failed to load save data:', e);
    }
  }, []);

  // Save state on updates
  useEffect(() => {
    try {
      const dataToSave = {
        stats,
        snakes,
        graduatedSnakes,
        unlockedSnakes: Array.from(unlockedSnakes),
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Failed to save data:', e);
    }
  }, [stats, snakes, graduatedSnakes, unlockedSnakes, settings]);

  // Handle BGM on screen transition
  useEffect(() => {
    if (inGame) {
      playBGM('game');
    } else {
      playBGM('cover');
    }
  }, [inGame, settings.bgmOn]);

  const handleStartGame = () => {
    stopBGM();
    setInGame(true);
  };

  const handleExitGame = () => {
    stopBGM();
    setActiveModal(null);
    setInGame(false);
  };

  // Add snake drawn from Gacha
  const handleDrawSnake = (type: SnakeType) => {
    const newSnake: SnakeInfo = {
      id: `snake_${Date.now()}_${Math.random()}`,
      type,
      stage: 'baby',
      exp: 0,
      name: type,
      hatchedAt: Date.now(),
      lastAppleTime: Date.now(),
      lastCoinTime: Date.now(),
    };

    setSnakes((prev) => [...prev, newSnake]);

    // Unlock in Codex
    setUnlockedSnakes((prev) => {
      const updated = new Set(prev);
      updated.add(type);
      return updated;
    });
  };

  // Deduct coins for gacha
  const handleDeductCoins = (amount: number): boolean => {
    if (stats.coins < amount) return false;
    setStats((prev) => ({ ...prev, coins: prev.coins - amount }));
    return true;
  };

  // Petting a snake
  const handlePetSnake = (id: string) => {
    setSnakes((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          if (s.petTimeout) clearTimeout(s.petTimeout);

          const timeout = setTimeout(() => {
            setSnakes((currentSnakes) =>
              currentSnakes.map((cs) => (cs.id === id ? { ...cs, isPetting: false } : cs))
            );
          }, 1200);

          return { ...s, isPetting: true, petTimeout: timeout };
        }
        return s;
      })
    );
  };

  // Feed a snake
  const handleFeedSnake = (snakeId: string, foodType: 'apple' | 'egg') => {
    const expGained = foodType === 'apple' ? 20 : 40;

    // Deduct food item
    setStats((prev) => ({
      ...prev,
      apples: foodType === 'apple' ? Math.max(0, prev.apples - 1) : prev.apples,
      eggs: foodType === 'egg' ? Math.max(0, prev.eggs - 1) : prev.eggs,
    }));

    // Add EXP to target snake
    setSnakes((prev) =>
      prev.map((s) => {
        if (s.id === snakeId) {
          const newExp = Math.min(100, s.exp + expGained);
          return { ...s, exp: newExp };
        }
        return s;
      })
    );
  };

  // Evolve or Graduate snake
  const handleSnakeEvolve = (snakeId: string) => {
    const target = snakes.find((s) => s.id === snakeId);
    if (!target) return;

    playSynthesizedSFX('levelup');

    // Add +25 Player EXP upon snake stage transition
    addPlayerExp(25);

    if (target.stage === 'baby') {
      setSnakes((prev) =>
        prev.map((s) => (s.id === snakeId ? { ...s, stage: 'youth', exp: 0 } : s))
      );
    } else if (target.stage === 'youth') {
      setSnakes((prev) =>
        prev.map((s) => (s.id === snakeId ? { ...s, stage: 'adult', exp: 0 } : s))
      );
    } else if (target.stage === 'adult') {
      // Graduate to Garden!
      const graduated: GraduatedSnake = {
        id: target.id,
        type: target.type,
        graduatedAt: Date.now(),
      };
      setGraduatedSnakes((prev) => [...prev, graduated]);
      setSnakes((prev) => prev.filter((s) => s.id !== snakeId));
      playSynthesizedSFX('graduated');
    }
  };

  // Add Player EXP & Level Up Rewards
  const addPlayerExp = (amount: number) => {
    setStats((prev) => {
      let newLevel = prev.level;
      let newExp = prev.exp + amount;
      let addApples = 0;
      let addEggs = 0;

      if (newExp >= 100 && newLevel < 5) {
        newLevel += 1;
        newExp -= 100;

        // Level Up Rewards
        if (newLevel === 2) {
          addApples = 5;
          addEggs = 3;
        } else if (newLevel === 3) {
          addApples = 8;
          addEggs = 4;
        } else if (newLevel === 4) {
          addApples = 10;
          addEggs = 5;
        } else if (newLevel === 5) {
          addApples = 12;
          addEggs = 6;
        }
      }

      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        apples: prev.apples + addApples,
        eggs: prev.eggs + addEggs,
      };
    });
  };

  // Collect Items on floor
  const handleCollectItems = (coins: number, apples: number, eggs: number) => {
    setStats((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      apples: prev.apples + apples,
      eggs: prev.eggs + eggs,
    }));
  };

  // Reset Game Data
  const handleResetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStats({ coins: 120, apples: 5, eggs: 2, level: 1, exp: 0 });
    const initialSnake: SnakeInfo = {
      id: 'snake_init_1',
      type: 'grass',
      stage: 'baby',
      exp: 20,
      name: '青草蛇',
      hatchedAt: Date.now(),
      lastAppleTime: Date.now(),
      lastCoinTime: Date.now(),
    };
    setSnakes([initialSnake]);
    setGraduatedSnakes([]);
    setUnlockedSnakes(new Set(['grass']));
    setActiveModal(null);
  };

  if (!inGame) {
    return <CoverScreen onStartGame={handleStartGame} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between bg-gradient-to-b from-emerald-200 via-emerald-100 to-green-300 select-none">
      {/* 遊戲背景.PNG */}
      <div className="absolute inset-0 z-0">
        <AssetImage name="遊戲背景.PNG" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Top Bar: Resource Bar (Left) & Menu Buttons (Right) */}
      <div className="relative z-20 w-full p-4 flex items-start justify-between">
        <ResourceBar stats={stats} />
        <TopRightMenu
          onOpenSettings={() => setActiveModal('settings')}
          onOpenCodex={() => setActiveModal('codex')}
          onExitGame={handleExitGame}
        />
      </div>

      {/* Center Stage: Snake Ranch Field */}
      <div className="relative z-10 flex-1 w-full h-full overflow-hidden">
        <SnakeField
          snakes={snakes}
          onPetSnake={handlePetSnake}
          onCollectItems={handleCollectItems}
          onSnakeEvolve={handleSnakeEvolve}
        />
      </div>

      {/* Bottom Action Menu */}
      <div className="relative z-20 w-full flex justify-center pb-4 pt-1">
        <BottomMenu
          onOpenGacha={() => setActiveModal('gacha')}
          onOpenFeed={() => setActiveModal('feed')}
          onOpenLevel={() => setActiveModal('level')}
          onOpenGarden={() => setActiveModal('garden')}
        />
      </div>

      {/* Modals & Overlays */}
      {activeModal === 'gacha' && (
        <GachaModal
          stats={stats}
          onDrawSnake={handleDrawSnake}
          onDeductCoins={handleDeductCoins}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'feed' && (
        <FeedModal
          snakes={snakes}
          stats={stats}
          onFeedSnake={handleFeedSnake}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'level' && (
        <LevelModal stats={stats} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'codex' && (
        <CodexModal unlockedSnakes={unlockedSnakes} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'garden' && (
        <GardenModal
          graduatedSnakes={graduatedSnakes}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          onResetGame={handleResetGame}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
