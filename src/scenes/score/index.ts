import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene, ensureScene } from '@/utils/scene';
import type { SceneType } from '@/types/status';
import { getAttemptCount, getScoreHistory, getHighScore } from '@/utils/storage';
import { type Button, drawButton, isMouseOverButton } from '@/utils/ui';
import { initGame } from '../game';

const sceneName: SceneType = 'SCORE';

let scoreButtons: Button[] = [];
let scrollOffset = 0;
const SCROLL_SPEED = 30;
const BUTTON_AREA_HEIGHT = 120;
const TITLE_HEIGHT = 160;

const initScoreUI = (p: p5) => {
  const centerX = p.width / 2;
  const bottomY = p.height - 80;

  // 반응형이 필요해보여서 적용해봤습니다.
  const isSmallScreen = p.width < 600;
  const buttonWidth = isSmallScreen ? Math.min(180, p.width * 0.35) : 200;
  const buttonHeight = isSmallScreen ? 45 : 50;
  const buttonGap = isSmallScreen ? 20 : 30;

  // 버튼이 2개이므로 중심을 화면 중앙 기준으로 계산했습니다.
  const halfGap = buttonGap / 2;
  const firstButtonCenterX = centerX - buttonWidth / 2 - halfGap;
  const secondButtonCenterX = centerX + buttonWidth / 2 + halfGap;

  scoreButtons = [
    {
      id: 'back-to-start',
      x: firstButtonCenterX,
      y: bottomY,
      width: buttonWidth,
      height: buttonHeight,
      text: '처음으로',
    },
    {
      id: 'play-again',
      x: secondButtonCenterX,
      y: bottomY,
      width: buttonWidth,
      height: buttonHeight,
      text: '다시 시작',
    },
  ];
};

// 실제 점수 정보 높이 계산
const calculateContentHeight = (): number => {
  const scoreHistory = getScoreHistory();
  let height = 0;

  // 현재 게임 점수
  if (scoreHistory.length > 0) {
    height += 50;
  }

  // 시도 횟수
  height += 50;

  // 최고 점수
  height += 50;

  // 점수 기록
  if (scoreHistory.length > 0) {
    height += 40; // 제목
    height += Math.min(scoreHistory.length, 10) * 30;
  }
  return height;
};

// 점수 기록 영역에서 최대 스크롤 거리 계산
const calculateMaxScroll = (p: p5): number => {
  const totalContentHeight = calculateContentHeight();
  const availableHeight = p.height - TITLE_HEIGHT - BUTTON_AREA_HEIGHT;

  return Math.max(0, totalContentHeight - availableHeight);
};

// 마우스 휠 이벤트 처리
export const handleScoreWheel = (p: p5, event: { delta: number }) => {
  if (CURRENT_SCENE !== sceneName) return;

  const maxScroll = calculateMaxScroll(p);
  scrollOffset += event.delta > 0 ? SCROLL_SPEED : -SCROLL_SPEED;
  scrollOffset = Math.max(0, Math.min(scrollOffset, maxScroll));
};

export const drawScore = (p: p5) => {
  ensureScene(sceneName);
  initScoreUI(p);

  p.push();

  p.background(20);

  p.fill(255);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(48);
  p.text('SCORE BOARD', p.width / 2, 80);

  // 점수 정보
  const attemptCount = getAttemptCount();
  const scoreHistory = getScoreHistory();
  const allTimeHighScore = getHighScore();
  const currentGameScore = scoreHistory.length > 0 ? scoreHistory[scoreHistory.length - 1] : 0;

  const centerX = p.width / 2;
  const contentStartY = 180;
  const contentAreaTop = contentStartY - 10;
  const contentAreaBottom = p.height - BUTTON_AREA_HEIGHT + 20;

  // 스크롤 가능한 영역 설정
  p.push();
  p.drawingContext.save();
  p.drawingContext.beginPath();
  p.drawingContext.rect(0, contentAreaTop, p.width, contentAreaBottom - contentAreaTop);
  p.drawingContext.clip();

  let startY = contentStartY - scrollOffset;

  p.textSize(24);
  p.textAlign(p.LEFT, p.TOP);

  // 현재 게임 점수
  if (scoreHistory.length > 0) {
    p.fill(200);
    p.text('현재 게임 점수', 100, startY);
    p.fill(255);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(`${currentGameScore}점`, p.width - 100, startY);
    p.textAlign(p.LEFT, p.TOP);
    startY += 50;
  }

  // 시도 횟수
  p.fill(200);
  p.text('시도 횟수', 100, startY);
  p.fill(255);
  p.textAlign(p.RIGHT, p.TOP);
  p.text(`${attemptCount}회`, p.width - 100, startY);
  p.textAlign(p.LEFT, p.TOP);
  startY += 50;

  // 최고 점수
  p.fill(200);
  p.text('최고 점수', 100, startY);
  p.fill(255);
  p.textAlign(p.RIGHT, p.TOP);
  p.text(`${allTimeHighScore}점`, p.width - 100, startY);
  p.textAlign(p.LEFT, p.TOP);
  startY += 50;

  // 점수 기록
  if (scoreHistory.length > 0) {
    p.fill(200);
    p.textSize(20);
    p.textAlign(p.CENTER, p.TOP);
    p.text('점수 기록', centerX, startY);
    startY += 40;

    // 최근 10개만 표시
    const recentScores = scoreHistory.slice(-10).reverse();
    const maxDisplay = Math.min(recentScores.length, 10);

    p.textSize(18);
    p.textAlign(p.LEFT, p.TOP);

    for (let i = 0; i < maxDisplay; i++) {
      const score = recentScores[i];
      const y = startY + i * 30;

      // 순위
      p.fill(150);
      p.text(`#${i + 1}`, 100, y);

      // 점수
      p.fill(255);
      p.textAlign(p.RIGHT, p.TOP);
      p.text(`${score}점`, p.width - 100, y);
      p.textAlign(p.LEFT, p.TOP);
    }
  }

  p.drawingContext.restore();
  p.pop();

  scoreButtons.forEach((btn) => drawButton(p, btn));
};

export const handleScoreClick = (p: p5) => {
  if (CURRENT_SCENE !== sceneName) return;

  scoreButtons.forEach((btn) => {
    if (isMouseOverButton(p, btn)) {
      if (btn.id === 'back-to-start') {
        changeCurrentScene('START');
        scrollOffset = 0;
      } else if (btn.id === 'play-again') {
        initGame(p);
        changeCurrentScene('READY');
        scrollOffset = 0;
      }
    }
  });
};
