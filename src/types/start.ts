import type { SceneType } from './status';

export type StartSceneButtonType = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  targetScene: SceneType;
};
