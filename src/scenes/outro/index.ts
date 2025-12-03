import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene, ensureScene } from '@/utils/scene';
import type { SceneType } from '@/types/status';
import mediaMbaLogo from '@/assets/branding/media_mba_logo.svg';

const sceneName: SceneType = 'OUTRO';

let mediaMbaImg: p5.Image | null = null;

export const drawOutro = (p: p5) => {
  ensureScene(sceneName);

  if (!mediaMbaImg) {
    mediaMbaImg = p.loadImage(mediaMbaLogo);
  }

  p.push();
  p.background(20);

  // 로고 배치 (상단) - intro scene과 동일한 스타일
  const logoPadding = 30;
  const logoMaxHeight = 60;
  const logoY = logoPadding + logoMaxHeight / 2;

  // 미디어경영학과 로고 (오른쪽)
  if (mediaMbaImg && mediaMbaImg.width > 0 && mediaMbaImg.height > 0) {
    p.push();
    const logoAspectRatio = mediaMbaImg.width / mediaMbaImg.height;
    const logoWidth = logoMaxHeight * logoAspectRatio;
    const logoX = p.width - logoPadding - logoWidth / 2;

    // 로고 주변 밝은 배경 (검은색 로고가 보이도록)
    const bgPadding = 15;
    p.fill(240, 240, 240, 220); // 밝은 회색 배경
    p.noStroke();
    p.rectMode(p.CENTER);
    p.rect(logoX, logoY, logoWidth + bgPadding * 2, logoMaxHeight + bgPadding * 2, 8);

    // 로고 그리기
    p.imageMode(p.CENTER);
    p.noTint(); // tint 제거하여 원본 색상 유지
    p.image(mediaMbaImg, logoX, logoY, logoWidth, logoMaxHeight);
    p.pop();
  }

  // 제목
  p.push();
  p.fill(255);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(48);
  p.textStyle(p.BOLD);
  p.text('게임 종료', p.width / 2, 180);
  p.pop();

  // 정보 섹션 (한 화면에 모두 보이도록 간격 조정)
  const startY = 240;
  const lineHeight = 22;
  const sectionGap = 25;
  let currentY = startY;

  p.push();
  p.fill(200);
  p.textSize(18);
  p.textAlign(p.LEFT, p.TOP);
  p.textStyle(p.NORMAL);

  // AI를 활용한 코드 사용 고지
  p.fill(255);
  p.textSize(20);
  p.textStyle(p.BOLD);
  p.text('AI를 활용한 코드 사용', 50, currentY);
  currentY += lineHeight + 5;
  p.fill(200);
  p.textSize(16);
  p.textStyle(p.NORMAL);
  p.text('• 게임 로직 및 렌더링: 약 20%', 70, currentY);
  currentY += lineHeight;
  p.text('• 씬 관리 및 상태 관리: 약 20%', 70, currentY);
  currentY += lineHeight;
  p.text('• UI 컴포넌트 및 버튼: 약 80%', 70, currentY);
  currentY += sectionGap;

  // AI를 활용한 콘텐츠 고지
  p.fill(255);
  p.textSize(20);
  p.textStyle(p.BOLD);
  p.text('AI를 활용한 콘텐츠', 50, currentY);
  currentY += lineHeight + 5;
  p.fill(200);
  p.textSize(16);
  p.textStyle(p.NORMAL);
  p.text('• 게임 아이디어 및 기획: AI 보조', 70, currentY);
  currentY += lineHeight;
  p.text('• 게임 밸런스 조정: AI 제안 반영', 70, currentY);
  currentY += lineHeight;
  p.text('• UI/UX 디자인: AI 기반 제안 활용 (뱀, 맵, 벽)', 70, currentY);
  currentY += sectionGap;

  // p5.js 기능 고지
  p.fill(255);
  p.textSize(20);
  p.textStyle(p.BOLD);
  p.text('주요 p5.js 기능', 50, currentY);
  currentY += lineHeight + 5;
  p.fill(200);
  p.textSize(16);
  p.textStyle(p.NORMAL);
  p.text('• 이미지 로딩 및 렌더링 (loadImage, image)', 70, currentY);
  currentY += lineHeight;
  p.text('• 사운드 재생 (loadSound, play, loop)', 70, currentY);
  currentY += lineHeight;
  p.text('• 애니메이션 및 파티클 시스템', 70, currentY);
  currentY += lineHeight;
  p.text('• 충돌 감지 및 게임 로직', 70, currentY);
  currentY += lineHeight;
  p.text('• 반응형 캔버스 (windowResized)', 70, currentY);
  currentY += lineHeight;
  p.text('• 사용자 입력 처리 (keyIsDown, mousePressed)', 70, currentY);

  p.pop();

  // 하단 안내 텍스트
  p.push();
  p.fill(100);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
  p.text('화면을 클릭하면 처음으로 돌아갑니다', p.width / 2, p.height - 30);
  p.pop();

  p.pop();
};

export const handleOutroClick = (_p: p5) => {
  if (CURRENT_SCENE !== sceneName) return;

  if (window.playClickSound) {
    window.playClickSound();
  }
  changeCurrentScene('START');
};
