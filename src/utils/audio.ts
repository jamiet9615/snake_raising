// Sound and Audio Synthesizer for Snake Ranch Game
// Supports Web Audio API preloaded .m4a audio files and mobile unlock logic.

import { resolveAssetPath } from './assets';

let audioCtx: AudioContext | null = null;
let isAudioUnlocked = false;
let pendingBgmType: 'cover' | 'game' | null = null;

// Cache for decoded Web Audio buffers (.m4a files)
const audioBufferCache: Map<string, AudioBuffer> = new Map();
const audioLoadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();

const ALL_M4A_FILES = [
  '封面背景音樂.m4a',
  '遊戲背景音樂.m4a',
  '扭蛋抽出音樂.m4a',
  '按鍵音效.m4a',
  '蛇幼年聲.m4a',
  '青年蛇聲.m4a',
  '成年蛇聲.m4a',
  '扭蛋抽取聲.m4a',
  '扭蛋掉出音效.m4a',
];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Fetch and decode .m4a into Web Audio AudioBuffer for zero-latency mobile playback
async function loadAudioBuffer(filename: string): Promise<AudioBuffer | null> {
  if (audioBufferCache.has(filename)) {
    return audioBufferCache.get(filename)!;
  }
  if (audioLoadingPromises.has(filename)) {
    return audioLoadingPromises.get(filename)!;
  }

  const promise = (async () => {
    try {
      const resolvedPath = resolveAssetPath(filename);
      if (!resolvedPath) return null;
      const res = await fetch(resolvedPath);
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      const ctx = getAudioContext();
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBufferCache.set(filename, decodedBuffer);
      return decodedBuffer;
    } catch (e) {
      console.warn(`Failed to decode audio buffer for ${filename}:`, e);
      return null;
    } finally {
      audioLoadingPromises.delete(filename);
    }
  })();

  audioLoadingPromises.set(filename, promise);
  return promise;
}

export function preloadAllAudio() {
  ALL_M4A_FILES.forEach((file) => {
    loadAudioBuffer(file);
  });
}

export function unlockAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Play a silent 1-sample buffer to unlock Web Audio on iOS Safari / Mobile Chrome
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);

    // HTML5 Audio unlock on iOS
    if (!isAudioUnlocked) {
      const dummy = new Audio(
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=='
      );
      dummy.volume = 0.01;
      dummy
        .play()
        .then(() => {
          dummy.pause();
          isAudioUnlocked = true;
        })
        .catch(() => {});
    }

    // Start preloading audio files
    preloadAllAudio();

    // If BGM was pending because autoplay was blocked, play it now
    if (pendingBgmType && !isBgmMuted) {
      const bgmToPlay = pendingBgmType;
      pendingBgmType = null;
      playBGM(bgmToPlay);
    }
  } catch (e) {
    console.warn('Audio unlock warning:', e);
  }
}

// Auto setup event listener to unlock audio context on first user interaction
if (typeof window !== 'undefined') {
  const unlockEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'];
  const handleFirstInteraction = () => {
    unlockAudio();
    unlockEvents.forEach((evt) => window.removeEventListener(evt, handleFirstInteraction));
  };
  unlockEvents.forEach((evt) =>
    window.addEventListener(evt, handleFirstInteraction, { once: true, passive: true })
  );

  // Preload on initial script execution
  setTimeout(() => {
    preloadAllAudio();
  }, 100);
}

let currentBgmAudio: HTMLAudioElement | null = null;
let currentBgmNode: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
let currentBgmType: 'cover' | 'game' | null = null;
let isBgmMuted = false;
let isSfxMuted = false;
let bgmVolumeLevel = 0.5;
let sfxVolumeLevel = 0.7;

export function updateAudioSettings(bgmOn: boolean, sfxOn: boolean, bgmVol = 0.5, sfxVol = 0.7) {
  isBgmMuted = !bgmOn;
  isSfxMuted = !sfxOn;
  bgmVolumeLevel = bgmVol;
  sfxVolumeLevel = sfxVol;

  if (currentBgmNode) {
    currentBgmNode.gain.gain.setValueAtTime(bgmVolumeLevel, getAudioContext().currentTime);
  }
  if (currentBgmAudio) {
    currentBgmAudio.volume = bgmVolumeLevel;
  }

  if (isBgmMuted) {
    stopBGM();
  }
}

// Play M4A sound effect with fallback to Web Audio buffer / HTML5 Audio / raw SFX
function playM4A(
  filename: string,
  fallbackType: 'click' | 'pet_baby' | 'pet_youth' | 'pet_adult' | 'gacha_shake' | 'gacha_drop' | 'feed' | 'levelup' | 'graduated'
) {
  if (isSfxMuted) return;

  const ctx = getAudioContext();

  // 1. Prefer Web Audio API buffer if already cached (100% reliable on mobile Safari)
  if (audioBufferCache.has(filename)) {
    try {
      const buffer = audioBufferCache.get(filename)!;
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      gain.gain.setValueAtTime(sfxVolumeLevel, ctx.currentTime);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
      return;
    } catch (e) {
      console.warn(`Web Audio play failed for ${filename}:`, e);
    }
  }

  // If buffer isn't loaded yet, attempt to fetch it for future plays
  loadAudioBuffer(filename);

  // 2. Fallback to HTML5 Audio element
  const resolvedPath = resolveAssetPath(filename);
  if (resolvedPath) {
    const audio = new Audio(resolvedPath);
    audio.volume = sfxVolumeLevel;
    audio.play().catch(() => {
      // If HTML5 Audio fails, use raw synth fallback for SFX only
      playRawSynthSFX(fallbackType);
    });
  } else {
    playRawSynthSFX(fallbackType);
  }
}

export function playAudioSFXByName(sfxName: string) {
  if (isSfxMuted) return;

  if (sfxName.includes('按鍵音效')) {
    playM4A('按鍵音效.m4a', 'click');
  } else if (sfxName.includes('蛇幼年聲')) {
    playM4A('蛇幼年聲.m4a', 'pet_baby');
  } else if (sfxName.includes('扭蛋抽取聲')) {
    playM4A('扭蛋抽取聲.m4a', 'gacha_shake');
  } else if (sfxName.includes('扭蛋掉出音效')) {
    playM4A('扭蛋掉出音效.m4a', 'gacha_drop');
  } else if (sfxName.includes('扭蛋抽出音樂')) {
    playM4A('扭蛋抽出音樂.m4a', 'levelup');
  } else {
    playSynthesizedSFX('click');
  }
}

// Sound generator helper for actions without custom .m4a
export function playSynthesizedSFX(
  type: 'click' | 'pet_baby' | 'pet_youth' | 'pet_adult' | 'gacha_shake' | 'gacha_drop' | 'feed' | 'levelup' | 'graduated'
) {
  if (isSfxMuted) return;

  if (type === 'click') {
    playM4A('按鍵音效.m4a', 'click');
    return;
  } else if (type === 'pet_baby') {
    playM4A('蛇幼年聲.m4a', 'pet_baby');
    return;
  } else if (type === 'pet_youth') {
    playM4A('青年蛇聲.m4a', 'pet_youth');
    return;
  } else if (type === 'pet_adult') {
    playM4A('成年蛇聲.m4a', 'pet_adult');
    return;
  } else if (type === 'gacha_shake') {
    playM4A('扭蛋抽取聲.m4a', 'gacha_shake');
    return;
  } else if (type === 'gacha_drop') {
    playM4A('扭蛋掉出音效.m4a', 'gacha_drop');
    return;
  }

  playRawSynthSFX(type);
}

function playRawSynthSFX(
  type: 'click' | 'pet_baby' | 'pet_youth' | 'pet_adult' | 'gacha_shake' | 'gacha_drop' | 'feed' | 'levelup' | 'graduated'
) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(sfxVolumeLevel, now);
    masterGain.connect(ctx.destination);

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'feed') {
      for (let i = 0; i < 3; i++) {
        const timeOffset = i * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400 - i * 50, now + timeOffset);
        gain.gain.setValueAtTime(0.3, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + 0.07);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.07);
      }
    } else if (type === 'levelup' || type === 'graduated') {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.3, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    }
  } catch (e) {
    console.warn('Web Audio SFX error:', e);
  }
}

// Background Music player (ONLY uses user's .m4a files)
export function playBGM(type: 'cover' | 'game') {
  if (isBgmMuted) {
    stopBGM();
    return;
  }

  // If already playing this exact track, don't restart
  if (currentBgmType === type) {
    if (currentBgmNode || (currentBgmAudio && !currentBgmAudio.paused)) {
      return;
    }
  }

  stopBGM();
  currentBgmType = type;

  const bgmFileName = type === 'cover' ? '封面背景音樂.m4a' : '遊戲背景音樂.m4a';

  // 1. Try Web Audio API playback if buffer is already decoded
  if (audioBufferCache.has(bgmFileName)) {
    try {
      const ctx = getAudioContext();
      const buffer = audioBufferCache.get(bgmFileName)!;
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      source.loop = true;
      gain.gain.setValueAtTime(bgmVolumeLevel, ctx.currentTime);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);

      currentBgmNode = { source, gain };
      return;
    } catch (e) {
      console.warn('Web Audio BGM playback error:', e);
    }
  }

  // Preload buffer for future use
  loadAudioBuffer(bgmFileName).then((buf) => {
    if (buf && currentBgmType === type && !currentBgmNode && !isBgmMuted) {
      playBGM(type);
    }
  });

  // 2. Fallback to HTML5 Audio element
  const resolvedPath = resolveAssetPath(bgmFileName);
  if (resolvedPath) {
    const audio = new Audio(resolvedPath);
    audio.loop = true;
    audio.volume = bgmVolumeLevel;
    currentBgmAudio = audio;

    audio.play().catch(() => {
      // If mobile browser blocks autoplay, save pending type until user gesture unlocks audio
      pendingBgmType = type;
    });
  } else {
    pendingBgmType = type;
  }
}

export function stopBGM() {
  if (currentBgmNode) {
    try {
      currentBgmNode.source.stop();
      currentBgmNode.source.disconnect();
    } catch (e) {
      console.warn('Error stopping Web Audio BGM:', e);
    }
    currentBgmNode = null;
  }

  if (currentBgmAudio) {
    try {
      currentBgmAudio.pause();
      currentBgmAudio.currentTime = 0;
      currentBgmAudio.removeAttribute('src');
      currentBgmAudio.load();
    } catch (e) {
      console.warn('Error stopping HTML5 BGM:', e);
    }
    currentBgmAudio = null;
  }

  currentBgmType = null;
}


