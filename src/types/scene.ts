import type { SceneType } from './status';

export type SceneChangeCallback = (from: SceneType | null, to: SceneType) => void;
