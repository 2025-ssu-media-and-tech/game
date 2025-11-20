import type { SceneType } from '@/types/status';

export let CURRENT_SCENE: SceneType = 'INTRO';

export const changeCurrentScene = (scene: SceneType, callback?: () => void) => {
  CURRENT_SCENE = scene;

  if (callback) {
    callback();
  }
};

export const isCurrentScene = (sceneName: SceneType) => {
  return CURRENT_SCENE === sceneName;
};

export const ensureScene = (sceneName: SceneType, callback?: () => void) => {
  if (!isCurrentScene(sceneName)) {
    changeCurrentScene(sceneName, callback);
  }
};
