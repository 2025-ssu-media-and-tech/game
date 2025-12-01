import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene.ts';
import type { SceneType } from '@/types/status.ts';

const sceneName: SceneType = 'INTRO';

const SNAKE_THEME = {
  dark: '#1B5E20',
  shadow: '#2E7D32',
  shadowLight: '#388E3C',
};

let animationTime = 0;

export const drawIntro = (p5: p5) => {
  if (CURRENT_SCENE !== sceneName) {
    changeCurrentScene(sceneName);
    animationTime = 0;
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

  animationTime += 0.02;

  const centerX = p5.width / 2;
  const centerY = p5.height / 2;

  p5.textAlign(p5.LEFT, p5.CENTER);
  p5.textSize(64);
  p5.textStyle(p5.BOLD);

  const mainText = 'BAAAAAAAAAAM';
  const mainTextBaseY = centerY - 80;
  const mainTextTotalWidth = p5.textWidth(mainText);
  let mainTextCurrentX = centerX - mainTextTotalWidth / 2;

  for (let i = 0; i < mainText.length; i++) {
    const char = mainText[i];
    const charWidth = p5.textWidth(char);

    const charOffset = p5.sin(animationTime * 2 + i * 0.5) * 20;
    const charY = mainTextBaseY + charOffset;

    p5.fill(SNAKE_THEME.shadow);
    p5.text(char, mainTextCurrentX + 3, charY + 3);

    p5.fill(SNAKE_THEME.shadowLight);
    p5.text(char, mainTextCurrentX, charY);

    mainTextCurrentX += charWidth;
  }

  p5.textSize(32);
  const clickText = '모험을 떠나기 위해 화면을 클릭하세요';
  const clickTextBaseY = centerY + 40;
  const clickTextTotalWidth = p5.textWidth(clickText);
  let clickTextCurrentX = centerX - clickTextTotalWidth / 2;

  for (let i = 0; i < clickText.length; i++) {
    const char = clickText[i];
    const charWidth = p5.textWidth(char);

    const charOffset = p5.sin(animationTime * 2 + i * 0.3) * 15;
    const charY = clickTextBaseY + charOffset;

    p5.fill(SNAKE_THEME.shadow);
    p5.text(char, clickTextCurrentX + 2, charY + 2);

    p5.fill(SNAKE_THEME.shadowLight);
    p5.text(char, clickTextCurrentX, charY);

    clickTextCurrentX += charWidth;
  }

  p5.pop();
};

export const handleIntroClick = () => {
  if (window.playClickSound) {
    window.playClickSound();
  }

  setTimeout(() => {
    if (window.startAudio) {
      window.startAudio();
    }
  }, 600);

  changeCurrentScene('START');
};
