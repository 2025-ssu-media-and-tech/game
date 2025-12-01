import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene, ensureScene } from '@/utils/scene';
import type { SceneType } from '@/types/status';
import { getHighScore } from '@/utils/storage';
import { type Button, drawButton, isMouseOverButton } from '@/utils/ui';
import { initGame } from '../game';

const sceneName: SceneType = 'READY';

let buttons: Button[] = [];
let highScore = 0;

const initScene = (p: p5) => {
  highScore = getHighScore();

  const centerX = p.width / 2;
  const bottomY = p.height - 80;

  const isSmallScreen = p.width < 600;
  const buttonWidth = isSmallScreen ? Math.min(180, p.width * 0.35) : 200;
  const buttonHeight = isSmallScreen ? 45 : 50;

  buttons = [
    {
      id: 'start-game',
      x: centerX,
      y: bottomY,
      width: buttonWidth,
      height: buttonHeight,
      text: '게임 시작',
    },
  ];
};

export const drawReady = (p: p5) => {
  ensureScene(sceneName);

  initScene(p);

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
    p.text(`이전 최고 기록 : ${highScore}점`, p.width / 2, p.height / 2 + 10);
  }

  buttons.forEach((btn) => drawButton(p, btn));

  p.pop();
};

export const handleReadyClick = (p: p5) => {
  if (CURRENT_SCENE !== sceneName) return;

  buttons.forEach((btn) => {
    if (isMouseOverButton(p, btn)) {
      if (window.playClickSound) {
        window.playClickSound();
      }
      if (btn.id === 'start-game') {
        buttons = [];
        initGame(p);
        changeCurrentScene('GAME');
      }
    }
  });
};
