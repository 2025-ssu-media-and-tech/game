import type { SceneChangeCallback } from '@/types/scene';
import type { SceneType } from '@/types/status';

export let CURRENT_SCENE: SceneType = 'INTRO';
export let PREVIOUS_SCENE: SceneType | null = null;

let sceneChangeCallback: SceneChangeCallback | null = null;

export const setSceneChangeCallback = (callback: SceneChangeCallback) => {
  sceneChangeCallback = callback;
};

export const changeCurrentScene = (scene: SceneType, callback?: () => void) => {
  if (CURRENT_SCENE !== scene) {
    PREVIOUS_SCENE = CURRENT_SCENE;

    if (sceneChangeCallback) {
      sceneChangeCallback(PREVIOUS_SCENE, scene);
    } else {
      CURRENT_SCENE = scene;
    }
  }

  if (callback) {
    callback();
  }
};

export const applySceneChange = (scene: SceneType) => {
  CURRENT_SCENE = scene;
};

export const isCurrentScene = (sceneName: SceneType) => {
  return CURRENT_SCENE === sceneName;
};

export const ensureScene = (sceneName: SceneType, callback?: () => void) => {
  if (!isCurrentScene(sceneName)) {
    changeCurrentScene(sceneName, callback);
  }
};
