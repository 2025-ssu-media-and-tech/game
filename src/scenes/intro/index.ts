import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene.ts';
import type { SceneType } from '@/types/status.ts';

const sceneName: SceneType = 'INTRO';

export const drawIntro = (p5: p5) => {
  if (CURRENT_SCENE !== sceneName) {
    changeCurrentScene(sceneName);
  }

  p5.push();

  // 여기에 p5를 사용해서 코드를 작성해주세요.
  // p5.ellipse();
  // p5.rectMode();
  // p5.CENTER;
  // 형식으로 앞에 p5만 붙고 기존 함수들을 그대로 사용할 수 있습니다.

  p5.pop();
};
