import 'p5';
import 'p5/global';
import type p5Type from 'p5';

declare module 'p5' {
  export interface SoundFile {
    isLoaded(): boolean;
    loop(): void;
    play(): void;
    stop(): void;
    userStartAudio(): void;
    setVolume(volume: number): void;
    isPlaying(): boolean;
  }

  interface p5 {
    loadSound(
      path: string | object,
      successCallback?: () => void,
      errorCallback?: (error?: unknown) => void,
    ): SoundFile;
  }
}

type p5Instance = p5Type;

type P5Constructor = {
  new (sketch: (p: p5Type) => void): p5Type;
};

declare global {
  const p5: P5Constructor;

  interface Window {
    startAudio?: () => void;
    playClickSound?: () => void;
    playOutSound?: () => void;
    playEatSound?: () => void;
    stopGameBgm?: () => void;
    startGameBgm?: () => void;
}
}

export type { p5Instance, P5Constructor };
