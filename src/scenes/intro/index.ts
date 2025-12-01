import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene.ts';
import type { SceneType } from '@/types/status.ts';

const sceneName: SceneType = 'INTRO';

const SNAKE_THEME = {
  dark: '#1B5E20',
  shadow: '#2E7D32',
  shadowLight: '#388E3C',
};

// 애니메이션 상태
let animationTime = 0;

export const drawIntro = (p5: p5) => {
  if (CURRENT_SCENE !== sceneName) {
    changeCurrentScene(sceneName);
    animationTime = 0;
  }

  p5.push();

  // 배경 (start scene과 동일)
  p5.background(SNAKE_THEME.dark);

  // 원형 그림자 효과 (start scene과 동일)
  p5.noStroke();
  for (let i = 0; i < 5; i++) {
    const alpha = 40 - i * 6;
    const size = p5.width * (0.8 - i * 0.1);
    const shadowColor = p5.color(SNAKE_THEME.shadow);
    shadowColor.setAlpha(alpha);
    p5.fill(shadowColor);
    p5.ellipse(p5.width / 2, p5.height / 2, size);
  }

  // 애니메이션 시간 업데이트
  animationTime += 0.02;

  const centerX = p5.width / 2;
  const centerY = p5.height / 2;

  // 텍스트 스타일 설정 (start scene과 동일)
  p5.textAlign(p5.LEFT, p5.CENTER);
  p5.textSize(64);
  p5.textStyle(p5.BOLD);

  // 메인 텍스트: "BAAAAAAAAAAM" - 문자별로 그리기
  const mainText = 'BAAAAAAAAAAM';
  const mainTextBaseY = centerY - 80;
  const mainTextTotalWidth = p5.textWidth(mainText);
  let mainTextCurrentX = centerX - mainTextTotalWidth / 2;

  for (let i = 0; i < mainText.length; i++) {
    const char = mainText[i];
    const charWidth = p5.textWidth(char);

    // 각 문자마다 다른 애니메이션 오프셋 (위상 차이)
    const charOffset = p5.sin(animationTime * 2 + i * 0.5) * 20;
    const charY = mainTextBaseY + charOffset;

    // 그림자 효과
    p5.fill(SNAKE_THEME.shadow);
    p5.text(char, mainTextCurrentX + 3, charY + 3);

    // 메인 텍스트
    p5.fill(SNAKE_THEME.shadowLight);
    p5.text(char, mainTextCurrentX, charY);

    // 다음 문자 위치로 이동
    mainTextCurrentX += charWidth;
  }

  // 클릭 안내 텍스트: "모험을 떠나기 위해 화면을 클릭하세요" - 문자별로 그리기
  p5.textSize(32); // 작은 텍스트는 크기 조정
  const clickText = '모험을 떠나기 위해 화면을 클릭하세요';
  const clickTextBaseY = centerY + 40;
  const clickTextTotalWidth = p5.textWidth(clickText);
  let clickTextCurrentX = centerX - clickTextTotalWidth / 2;

  for (let i = 0; i < clickText.length; i++) {
    const char = clickText[i];
    const charWidth = p5.textWidth(char);

    // 각 문자마다 다른 애니메이션 오프셋 (위상 차이)
    const charOffset = p5.sin(animationTime * 2 + i * 0.3) * 15;
    const charY = clickTextBaseY + charOffset;

    // 그림자 효과
    p5.fill(SNAKE_THEME.shadow);
    p5.text(char, clickTextCurrentX + 2, charY + 2);

    // 메인 텍스트
    p5.fill(SNAKE_THEME.shadowLight);
    p5.text(char, clickTextCurrentX, charY);

    // 다음 문자 위치로 이동
    clickTextCurrentX += charWidth;
  }

  p5.pop();
};

export const handleIntroClick = (p5: p5) => {
  // 오디오 시작 (main.ts에서 전역 함수로 노출)
  if (window.startAudio) {
    window.startAudio();
  }

  // START 씬으로 이동
  changeCurrentScene('START');
};
