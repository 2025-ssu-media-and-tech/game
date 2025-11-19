import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene';
import type { SceneType } from '@/types/status';
import { getHighScore } from '@/utils/storage';
import { type SimpleButton, drawButton, isMouseOverButton } from '@/utils/ui';

const sceneName: SceneType = 'READY';

let buttons: SimpleButton[] = [];
let highScore = 0;

const initScene = (p: p5) => {
  highScore = getHighScore();

  const centerX = p.width / 2;
  const centerY = p.height / 2;

  buttons = [
    {
      id: 'start-game',
      x: centerX,
      y: centerY + 100,
      width: 200,
      height: 50,
      text: '게임 시작',
    },
  ];
};

export const drawReady = (p: p5) => {
  if (CURRENT_SCENE !== sceneName) {
    changeCurrentScene('READY');
  }

  if (buttons.length === 0) {
    initScene(p);
  }

  p.push();
  p.background(0); // 화면 초기화

  p.textAlign(p.CENTER, p.CENTER);
  p.fill(255);

  p.textSize(48);
  p.textStyle(p.BOLD);
  p.text('준비되셨나요?', p.width / 2, p.height / 2 - 50);

  // 이전 최고 기록이 있다면 Show
  if (highScore > 0) {
    p.textSize(24);
    p.fill('#4CAF50'); // Snake Green
    p.text(`이전 최고 기록: ${highScore}`, p.width / 2, p.height / 2 + 10);
  }

  // 버튼 렌더링
  buttons.forEach((btn) => drawButton(p, btn));

  p.pop();
};

export const handleReadyClick = (p: p5) => {
  if (CURRENT_SCENE !== sceneName) return;

  buttons.forEach((btn) => {
    if (isMouseOverButton(p, btn)) {
      if (btn.id === 'start-game') {
        // 버튼 초기화
        buttons = [];
        // 'GAME' Scene으로 이동
        changeCurrentScene('GAME');
      }
    }
  });
};
