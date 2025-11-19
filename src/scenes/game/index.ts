import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene';
import type { SceneType } from '@/types/status';

const sceneName: SceneType = 'GAME';

export const drawGame = (p5: p5) => {
  if (CURRENT_SCENE !== sceneName) {
    changeCurrentScene(sceneName);
  }

  p5.push();

  p5.pop();
};
