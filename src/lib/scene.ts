import type { SceneType } from '../types/status';

export let CURRENT_SCENE: SceneType = 'INTRO';

export const changeCurrentScene = (scene: SceneType, callback?: () => void) => {
  CURRENT_SCENE = scene;

  if (callback) {
    callback();
  }
};
