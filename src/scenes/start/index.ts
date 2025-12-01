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
let animationTime = 0;

export const drawStart = (p5: p5) => {
  // Scene 실행 보장.
  ensureScene(sceneName);

  if (!buttonsInitialized || buttons.length === 0) {
    initButtons(p5);
    buttonsInitialized = true;
  }

  // 애니메이션 시간 업데이트
  animationTime += 0.02;

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

  p5.textAlign(p5.LEFT, p5.CENTER);
  p5.textSize(64);
  p5.textStyle(p5.BOLD);

  // 텍스트를 문자별로 그리기
  const text = 'BAAAAAAAAAAM';
  const baseY = p5.height / 2 - 120;
  const baseX = p5.width / 2;

  // 전체 텍스트 너비 계산
  const totalWidth = p5.textWidth(text);
  let currentX = baseX - totalWidth / 2;

  // 각 문자를 개별적으로 그리기
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charWidth = p5.textWidth(char);

    // 각 문자마다 다른 애니메이션 오프셋 (위상 차이)
    const charOffset = p5.sin(animationTime * 2 + i * 0.5) * 20;
    const charY = baseY + charOffset;

    // 그림자 효과
    p5.fill(SNAKE_THEME.shadow);
    p5.text(char, currentX + 3, charY + 3);

    // 메인 텍스트
    p5.fill(SNAKE_THEME.shadowLight);
    p5.text(char, currentX, charY);

    // 다음 문자 위치로 이동
    currentX += charWidth;
  }

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
