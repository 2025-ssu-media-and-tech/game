import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene, ensureScene } from '@/utils/scene.ts';
import type { SceneType } from '@/types/status.ts';
import { type Button, isMouseOverButton } from '@/utils/ui';

import mediaMbaLogo from '@/assets/branding/media_mba_logo.svg';

const sceneName: SceneType = 'INTRO';

const SNAKE_THEME = {
  dark: '#1B5E20',
  shadow: '#2E7D32',
  shadowLight: '#388E3C',
};

let buttons: Button[] = [];
let animationTime = 0;
let mediaMbaImg: p5.Image | null = null;

// 배경 파티클
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
};

let particles: Particle[] = [];

const initParticles = (p: p5) => {
  particles = [];
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: p.random(p.width),
      y: p.random(p.height),
      vx: p.random(-0.5, 0.5),
      vy: p.random(-0.5, 0.5),
      size: p.random(2, 5),
      alpha: p.random(50, 150),
    });
  }
};

const updateParticles = (p: p5) => {
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // 경계 처리
    if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;

    // 부드러운 움직임
    particle.alpha = 100 + p.sin(animationTime * 2 + particle.x * 0.01) * 50;
  });
};

const drawParticles = (p: p5) => {
  p.push();
  p.noStroke();
  particles.forEach((particle) => {
    // 초록색 계열 파티클
    const green = 100 + p.sin(animationTime * 2 + particle.x * 0.01) * 30;
    p.fill(50, green, 70, particle.alpha);
    p.ellipse(particle.x, particle.y, particle.size);
  });
  p.pop();
};

const initScene = (p: p5, introTextEndY: number) => {
  const centerX = p.width / 2;
  const copyrightStartY = p.height - 50;

  // 소개글 끝과 카피라이트 시작 사이의 중간에 버튼 배치
  const playBtnY = (introTextEndY + copyrightStartY) / 2;

  const isSmallScreen = p.width < 600;
  // 텍스트 길이에 맞게 버튼 크기 조정
  const buttonWidth = isSmallScreen ? Math.min(280, p.width * 0.5) : 320;
  const buttonHeight = isSmallScreen ? 50 : 55;

  buttons = [
    {
      id: 'play-now',
      x: centerX,
      y: playBtnY,
      width: buttonWidth,
      height: buttonHeight,
      text: '모험을 떠나기 위해 클릭하세요',
    },
  ];
};

export const drawIntro = (p5: p5) => {
  ensureScene(sceneName);

  if (CURRENT_SCENE === sceneName) {
    animationTime += 0.02;
  } else {
    animationTime = 0;
    initParticles(p5); // 씬 변경 시 파티클 초기화
  }

  if (!mediaMbaImg) {
    mediaMbaImg = p5.loadImage(mediaMbaLogo);
  }

  // 파티클 초기화 (첫 실행 시)
  if (particles.length === 0) {
    initParticles(p5);
  }

  // 땅 속 터널 배경 그리기
  const centerX = p5.width / 2;
  const centerY = p5.height / 2;

  // 배경 - 어두운 땅 색상
  p5.background(20, 15, 10);

  // 터널 원형 구조 (원근감)
  p5.push();
  p5.noFill();
  const tunnelLayers = 8;
  const baseRadius = Math.min(p5.width, p5.height) * 0.6;

  for (let i = 0; i < tunnelLayers; i++) {
    const progress = i / tunnelLayers;
    const radius = baseRadius * (1 - progress * 0.3);
    const alpha = 100 - progress * 80;
    const offsetX = p5.sin(animationTime + i * 0.5) * 10 * progress;
    const offsetY = p5.cos(animationTime + i * 0.3) * 10 * progress;

    // 땅 질감 색상
    const brown = p5.color(40 + i * 5, 30 + i * 3, 20 + i * 2, alpha);
    p5.stroke(brown);
    p5.strokeWeight(2 + i * 0.5);
    p5.ellipse(centerX + offsetX, centerY + offsetY, radius * 2);
  }
  p5.pop();

  // 땅 입자/돌멩이 효과
  p5.push();
  p5.noStroke();
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * p5.TWO_PI + animationTime * 0.5;
    const dist = baseRadius * 0.7 + p5.sin(animationTime * 2 + i) * 20;
    const x = centerX + p5.cos(angle) * dist;
    const y = centerY + p5.sin(angle) * dist;
    const size = p5.random(3, 8);
    const gray = p5.random(60, 100);
    p5.fill(gray, gray * 0.8, gray * 0.6, 150);
    p5.ellipse(x, y, size);
  }
  p5.pop();

  // 터널 내부 빛 효과 (깊이감)
  p5.push();
  p5.noStroke();
  const lightRadius = baseRadius * 0.5;
  for (let r = lightRadius; r > 0; r -= 15) {
    const alpha = p5.map(r, 0, lightRadius, 0, 60);
    const glowColor = p5.color(50, 80, 40, alpha);
    p5.fill(glowColor);
    p5.ellipse(centerX, centerY, r * 2);
  }
  p5.pop();

  // 움직이는 배경 입자들
  updateParticles(p5);
  drawParticles(p5);

  // 땅 표면 질감 (위쪽)
  p5.push();
  p5.noStroke();
  for (let x = 0; x < p5.width; x += 5) {
    const noise = p5.noise(x * 0.01, animationTime * 0.5);
    const y = p5.map(noise, 0, 1, 0, p5.height * 0.2);
    const brown = p5.color(50, 40, 30, 100);
    p5.fill(brown);
    p5.rect(x, y, 5, 3);
  }
  p5.pop();

  // 땅 표면 질감 (아래쪽)
  p5.push();
  p5.noStroke();
  for (let x = 0; x < p5.width; x += 5) {
    const noise = p5.noise(x * 0.01, animationTime * 0.5 + 100);
    const y = p5.map(noise, 0, 1, p5.height * 0.8, p5.height);
    const brown = p5.color(50, 40, 30, 100);
    p5.fill(brown);
    p5.rect(x, y, 5, 3);
  }
  p5.pop();

  p5.push();

  // 중앙 정렬 추가
  p5.textAlign(p5.CENTER, p5.CENTER);

  // 중심 좌표
  const centerX2 = p5.width / 2;
  const centerY2 = p5.height / 2;

  // 소개글 끝 위치를 계산하기 위해 임시로 초기화 (나중에 실제로 그릴 때 업데이트)
  let introTextEndY = centerY2 - 80; // 초기값

  // 로고 배치 (상단) - 배경 이후에 그리기
  const logoPadding = 30;
  const logoMaxHeight = 60;
  const logoY = logoPadding + logoMaxHeight / 2;

  // 미디어경영학과 로고 (오른쪽)
  if (mediaMbaImg && mediaMbaImg.width > 0 && mediaMbaImg.height > 0) {
    p5.push();
    const logoAspectRatio = mediaMbaImg.width / mediaMbaImg.height;
    const logoWidth = logoMaxHeight * logoAspectRatio;
    const logoX = p5.width - logoPadding - logoWidth / 2;

    // 로고 주변 밝은 배경 (검은색 로고가 보이도록)
    const bgPadding = 15;
    p5.fill(240, 240, 240, 220); // 밝은 회색 배경
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.rect(logoX, logoY, logoWidth + bgPadding * 2, logoMaxHeight + bgPadding * 2, 8);

    // 로고 그리기
    p5.imageMode(p5.CENTER);
    p5.noTint(); // tint 제거하여 원본 색상 유지
    p5.image(mediaMbaImg, logoX, logoY, logoWidth, logoMaxHeight);
    p5.pop();
  }

  // 게임 제목 - setting scene과 동일한 스타일 및 애니메이션
  p5.textAlign(p5.LEFT, p5.CENTER);
  p5.textSize(64);
  p5.textStyle(p5.BOLD);

  const mainText = 'BAAAAAAAAAAM';
  const mainTextBaseY = centerY2 - 200;
  const mainTextTotalWidth = p5.textWidth(mainText);
  let mainTextCurrentX = centerX2 - mainTextTotalWidth / 2;

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

  // 미디어경영학과 소개 텍스트 (BAAAAAAAAAAM 아래)
  p5.push();
  p5.textAlign(p5.CENTER, p5.TOP);
  p5.textSize(12);
  p5.fill(220, 220, 220, 255); // 밝은 회색, 완전 불투명
  p5.textStyle(p5.NORMAL);

  const introTextX = centerX2; // 화면 중앙
  const introTextY = centerY2 - 80; // BAAAAAAAAAAM 아래 (더 위로)
  const introTextWidth = p5.width * 0.6; // 화면 너비의 60%
  const lineHeight = 18; // 12pt에 맞는 줄 간격

  const introText = [
    'IT 기술의 발달에 따라 4차 산업혁명 시대로 접어들며 일상의 변화가 빠르게 이루어지고 있는 오늘날, 가장 중요한 개념은 바로 융·복합입니다.',
    '',
    '이러한 시대의 흐름에 부합하기 위해 숭실대학교 미디어경영학과는 2015년에 설립되었습니다.',
    '',
    "미디어경영학과는 특성화고 및 마이스터고를 졸업하고 현장에서 다양한 경험을 쌓은 인재들에게 전문적인 교육을 제공하여 '실무 경험과 전문적인 지식을 겸비한 창의적 인재로의 양성을 목표로 하고 있습니다.",
    '',
    "SW공학, 미디어 콘텐츠, 디자인, 마케팅 등 국내 최고의 교수님들로 구성된 미디어경영학과는 전문지식의 체계적 교육을 위해 융합지향의 교과과정을 운영하고 있으며, 이를 기반으로 '차세대 미디어 리더의 육성'을 위해 노력하고 있습니다.",
    '',
    "현재 미디어경영학과에서는 다양한 산업 분야의 학생들이 함께 공부하며, 통찰력을 기를 수 있는 창조적인 경험의 기회를 제공하고 있습니다. '실무적 전문지식 함양과 창의적 문제해결 능력 배양'은 졸업 후 학생들을 더 큰 세상으로 안내 할 것입니다.",
  ];

  let currentY = introTextY;
  introText.forEach((line) => {
    if (line === '') {
      currentY += lineHeight * 0.5; // 빈 줄은 줄 간격만
    } else {
      // 긴 텍스트를 여러 줄로 자동 줄바꿈 (중앙 정렬)
      const words = line.split(' ');
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = p5.textWidth(testLine);

        if (testWidth > introTextWidth && currentLine) {
          p5.text(currentLine, introTextX, currentY);
          currentY += lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        p5.text(currentLine, introTextX, currentY);
        currentY += lineHeight;
      }
    }
  });

  // 소개글 끝 위치 저장
  introTextEndY = currentY + lineHeight; // 마지막 줄 아래 여백 추가

  p5.pop();

  // 버튼 위치 계산 (소개글 끝 위치 기반)
  initScene(p5, introTextEndY);

  // 버튼 (소개글 아래) - 커스텀 디자인
  buttons.forEach((btn) => {
    const isHovered = isMouseOverButton(p5, btn);

    p5.push();

    // 버튼 배경 - 그라데이션 효과 (더 세련되게)
    const baseGreen = isHovered ? 120 : 80;
    const bgColor1 = p5.color(20, baseGreen, 35); // 어두운 초록
    const bgColor2 = p5.color(40, baseGreen + 40, 55); // 밝은 초록

    // 그림자 효과 (더 깊게)
    p5.fill(0, 0, 0, 150);
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.rect(btn.x + 4, btn.y + 4, btn.width, btn.height, 15);

    // 버튼 배경 (그라데이션 효과를 위해 중간 색상 사용)
    const midColor = p5.lerpColor(bgColor1, bgColor2, 0.5);
    p5.fill(midColor);
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.rect(btn.x, btn.y, btn.width, btn.height, 15);

    // 그라데이션 효과를 위한 하이라이트 (위쪽)
    p5.push();
    p5.fill(bgColor2);
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.rect(btn.x, btn.y - btn.height * 0.2, btn.width * 0.98, btn.height * 0.4, 12);
    p5.pop();

    // 그라데이션 효과를 위한 그림자 (아래쪽)
    p5.push();
    p5.fill(bgColor1);
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.rect(btn.x, btn.y + btn.height * 0.2, btn.width * 0.98, btn.height * 0.4, 12);
    p5.pop();

    // 버튼 테두리
    p5.noFill();
    p5.stroke(80, 180, 100);
    p5.strokeWeight(2);
    p5.rect(btn.x, btn.y, btn.width, btn.height, 15);

    // 호버 시 빛나는 효과 (더 부드럽게)
    if (isHovered) {
      p5.fill(100, 200, 120, 80);
      p5.noStroke();
      p5.rect(btn.x, btn.y, btn.width * 0.95, btn.height * 0.95, 12);

      // 상단 하이라이트
      p5.fill(120, 220, 140, 120);
      p5.rect(btn.x, btn.y - btn.height * 0.3, btn.width * 0.8, btn.height * 0.3, 8);
    }

    // 버튼 텍스트 (그림자 효과)
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(17);

    // 텍스트 그림자
    p5.fill(0, 0, 0, 100);
    p5.textStyle(p5.BOLD);
    p5.text(btn.text, btn.x + 2, btn.y + 2);

    // 메인 텍스트
    p5.fill(255, 255, 255);
    p5.text(btn.text, btn.x, btn.y);

    p5.pop();
  });

  // 저작권 정보 (하단)
  p5.push();
  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.textSize(12);
  p5.fill(200, 200, 200, 180); // 연한 회색, 약간 투명
  p5.textStyle(p5.NORMAL);

  const copyrightY = p5.height - 50;
  const copyrightText1 = '© 2025 Team 최강재(미디어경영학과) · 김수현(국제무역학과) · 강명준(미디어경영학과)';
  const copyrightText2 = "숭실대학교 미디어경영학과 '미디어앤테크' 강의 프로젝트.";
  const copyrightText3 = 'All rights reserved. 본 프로젝트의 무단 복제, 배포, 수정은 금지됩니다.';

  p5.text(copyrightText1, centerX2, copyrightY);
  p5.text(copyrightText2, centerX2, copyrightY + 16);
  p5.text(copyrightText3, centerX2, copyrightY + 32);

  p5.pop();

  p5.pop();
};

export const handleIntroClick = (p: p5) => {
  if (CURRENT_SCENE !== sceneName) return;

  buttons.forEach((btn) => {
    if (isMouseOverButton(p, btn)) {
      if (window.playClickSound) {
        window.playClickSound();
      }
      if (btn.id === 'play-now') {
        setTimeout(() => {
          if (window.startAudio) {
            window.startAudio();
          }
        }, 600);
        changeCurrentScene('START');
      }
    }
  });
};
