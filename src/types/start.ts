import type { SceneType } from '@/types/status';

export type StartSceneButtonType = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  targetScene: SceneType;
};
