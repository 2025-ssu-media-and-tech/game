import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene, ensureScene } from '@/utils/scene.ts';
import type { SceneType } from '@/types/status.ts';
import type { StartSceneButtonType } from '@/types/start';

const sceneName: SceneType = 'START';

const SNAKE_THEME = {
  dark: '#1B5E20',
  shadow: '#2E7D32',
  shadowLight: '#388E3C',
};

let buttons: StartSceneButtonType[] = [];
let buttonsInitialized = false;

export const drawStart = (p5: p5) => {
  // Scene 실행 보장.
  ensureScene(sceneName);

  if (!buttonsInitialized || buttons.length === 0) {
    initButtons(p5);
    buttonsInitialized = true;
  }

  p5.push();

  p5.background(SNAKE_THEME.dark);

  p5.noStroke();
  for (let i = 0; i < 5; i++) {
    const alpha = 40 - i * 6;
    const size = p5.width * (0.8 - i * 0.1);
    const shadowColor = p5.color(SNAKE_THEME.shadow);
    shadowColor.setAlpha(alpha);
    p5.fill(shadowColor);
    p5.ellipse(p5.width / 2, p5.height / 2, size);
  }

  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.textSize(64);
  p5.fill(SNAKE_THEME.shadowLight);
  p5.textStyle(p5.BOLD);
  p5.text('BAAAAAAAAAAM', p5.width / 2, p5.height / 2 - 120);

  p5.fill(SNAKE_THEME.shadow);
  p5.text('BAAAAAAAAAAM', p5.width / 2 + 3, p5.height / 2 - 117);
  p5.fill(SNAKE_THEME.shadowLight);
  p5.text('BAAAAAAAAAAM', p5.width / 2, p5.height / 2 - 120);

  drawButtons(p5);

  const circleSize = 8;
  const spacing = 20;
  const startY = p5.height / 2 + 150;

  for (let i = 0; i < 15; i++) {
    const x = p5.width / 2 - 7 * spacing + i * spacing;
    const alpha = 100 + (i % 3) * 20;
    const shadowColor = p5.color(SNAKE_THEME.shadow);
    shadowColor.setAlpha(alpha);
    p5.fill(shadowColor);
    p5.ellipse(x, startY, circleSize);
  }

  p5.pop();
};

// 버튼 초기화
const initButtons = (p5: p5) => {
  const buttonWidth = 300;
  const buttonHeight = 60;
  const buttonSpacing = 30;
  const centerX = p5.width / 2;
  const centerY = p5.height / 2 + 40;

  buttons = [
    {
      x: centerX,
      y: centerY - buttonHeight / 2 - buttonSpacing / 2,
      width: buttonWidth,
      height: buttonHeight,
      text: '준비하세요',
      targetScene: 'READY',
    },
    {
      x: centerX,
      y: centerY + buttonHeight / 2 + buttonSpacing / 2,
      width: buttonWidth,
      height: buttonHeight,
      text: '인트로',
      targetScene: 'INTRO',
    },
  ];
};

const drawButtons = (p5: p5) => {
  buttons.forEach((button) => {
    const isHovered = isMouseOverButton(p5, button);
    const buttonColor = isHovered ? SNAKE_THEME.shadowLight : SNAKE_THEME.shadow;

    p5.fill(buttonColor);
    p5.stroke(SNAKE_THEME.dark);
    p5.strokeWeight(3);
    p5.rectMode(p5.CENTER);
    p5.rect(button.x, button.y, button.width, button.height, 8);

    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(24);
    p5.fill('#FFFFFF');
    p5.textStyle(p5.BOLD);
    p5.text(button.text, button.x, button.y);
  });
};

const isMouseOverButton = (p5: p5, button: StartSceneButtonType): boolean => {
  return (
    p5.mouseX >= button.x - button.width / 2 &&
    p5.mouseX <= button.x + button.width / 2 &&
    p5.mouseY >= button.y - button.height / 2 &&
    p5.mouseY <= button.y + button.height / 2
  );
};

export const handleStartClick = (p5: p5) => {
  if (CURRENT_SCENE !== 'START') return;

  buttons.forEach((button) => {
    if (isMouseOverButton(p5, button)) {
      changeCurrentScene(button.targetScene);
    }
  });
};
