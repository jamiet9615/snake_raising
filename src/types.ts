export type SnakeType = 'grass' | 'strawberry' | 'sky' | 'ground' | 'sea' | 'python';

export type SnakeStage = 'baby' | 'youth' | 'adult';

export interface SnakeInfo {
  id: string;
  type: SnakeType;
  stage: SnakeStage;
  exp: number; // 0 to 100
  name: string;
  hatchedAt: number;
  lastAppleTime: number; // timestamp
  lastCoinTime: number; // timestamp
  isPetting?: boolean;
  petTimeout?: any;
  customNickname?: string;
}

export interface GraduatedSnake {
  id: string;
  type: SnakeType;
  graduatedAt: number;
}

export interface PlayerStats {
  coins: number;
  apples: number;
  eggs: number;
  level: number; // 1 to 5
  exp: number; // 0 to 100
}

export interface GameSettings {
  bgmOn: boolean;
  sfxOn: boolean;
  bgmVolume: number; // 0.0 - 1.0
  sfxVolume: number; // 0.0 - 1.0
}

export interface CodexEntry {
  type: SnakeType;
  chineseName: string;
  unlocked: boolean;
  description: string;
}

export const SNAKE_NAMES: Record<SnakeType, string> = {
  grass: '青草蛇',
  strawberry: '草莓蛇',
  sky: '天空蛇',
  ground: '地頭蛇',
  sea: '海蛇',
  python: 'python',
};

export const STAGE_NAMES: Record<SnakeStage, string> = {
  baby: '幼年蛇',
  youth: '青年蛇',
  adult: '成蛇',
};

// Returns filename according to user specification
export function getSnakeImageFileName(type: SnakeType, stage: SnakeStage, isPetting: boolean = false): string {
  const typeName = SNAKE_NAMES[type];
  const stageName = STAGE_NAMES[stage];
  if (isPetting) {
    return `${typeName}${stageName}被摸.PNG`;
  }
  return `${typeName}${stageName}.PNG`;
}

export function getSnakeAdultFileName(type: SnakeType): string {
  const typeName = SNAKE_NAMES[type];
  return `${typeName}成蛇.PNG`;
}

export function getSnakeSilhouetteFileName(type: SnakeType): string {
  const typeName = SNAKE_NAMES[type];
  return `${typeName}剪影.PNG`;
}
