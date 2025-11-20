import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene.ts';
import type { SceneType } from '@/types/status.ts';

const sceneName: SceneType = 'OUTRO';

// 🎮 게임 상태 (예시용)
let currentScore = 0;
let scoreHistory: number[] = [400, 200, 600, 150, 500, 120];
let snakeColor = '#538a49';

// ✅ 주의: 전역 색상모드 혼동 방지용 - 매번 RGB 복귀
export const drawOutro = (p5: p5) => {
  if (CURRENT_SCENE !== sceneName) {
    changeCurrentScene(sceneName);
  }

  p5.push();

  // 배경
  drawBackground(p5);

  // 기본 폰트 / 정렬 설정
  p5.textFont('sans-serif');

  // 🐍 snakeColor 기반 메인 색
  let baseC = p5.color(snakeColor);
  p5.colorMode(p5.HSB);
  let hVal = p5.hue(baseC);
  let titleBright = p5.color(hVal, 60, 100);
  let titleShadow = p5.color(hVal, 90, 60);
  p5.colorMode(p5.RGB);

  // 🎇 "GAME OVER" 제목
  p5.textSize(70);
  p5.fill(titleShadow);
  p5.text('GAME OVER', p5.width / 2 + 3, p5.height / 2 - 250);
  p5.fill(230);
  p5.text('GAME OVER', p5.width / 2, p5.height / 2 - 253);

  // 🧮 현재 점수
  p5.textSize(60);
  p5.fill(255);
  p5.text(currentScore.toString(), p5.width / 2, p5.height / 2 - 125);

  // 📊 점수 박스
  p5.fill(20, 100);
  p5.stroke(titleBright);
  p5.strokeWeight(3);
  p5.rectMode(p5.CENTER);
  p5.rect(p5.width / 2, p5.height / 2 + 80, 280, 260, 12);
  p5.noStroke();

  // 🏅 상위 점수 표시
  let sorted = [...scoreHistory].sort((a, b) => b - a).slice(0, 6);
  p5.textSize(22);
  for (let i = 0; i < sorted.length; i++) {
    let y = p5.height / 2 + i * 40 - 20;
    let t = p5.millis() * 0.005;
    let glow = p5.sin(t * 3) * 0.5 + 0.5;

    let rankColor = p5.color(titleBright);
    let scoreColor = p5.color(titleBright);
    p5.colorMode(p5.HSB);
    if (i === 0) {
      rankColor = p5.color(50, 100, 80 + glow * 20);
      scoreColor = p5.color(50, 100, 80 + glow * 20);
    } else if (i === 1) {
      rankColor = p5.color(0, 0, 70 + glow * 25);
      scoreColor = p5.color(0, 0, 70 + glow * 25);
    } else if (i === 2) {
      rankColor = p5.color(25, 80, 70 + glow * 25);
      scoreColor = p5.color(25, 80, 70 + glow * 25);
    }
    p5.colorMode(p5.RGB);

    p5.fill(rankColor);
    p5.text(`${i + 1}.`, p5.width / 2 - 50, y);

    p5.fill(scoreColor);
    p5.text(sorted[i].toString(), p5.width / 2 + 35, y);
  }

  // 🔘 버튼: Retry
  drawButton(p5, p5.width / 2, p5.height / 2 + 285, 200, 55, 'RETRY', () => {
    currentScore = 0;
    console.log('Retry clicked!');
  });

  // 🔘 버튼: Exit
  drawButton(p5, p5.width / 2, p5.height / 2 + 360, 200, 55, 'EXIT', () => {
    console.log('Exit clicked!');
  });

  p5.pop();
};

// 🌌 배경 (격자 그라데이션)
function drawBackground(p5: p5) {
  p5.noFill();
  for (let y = 0; y < p5.height; y++) {
    const inter = p5.map(y, 0, p5.height, 0, 1);
    const c1 = p5.color(5, 10, 8);
    const c2 = p5.color(15, 25, 18);
    const c = p5.lerpColor(c1, c2, inter);
    p5.stroke(c);
    p5.line(0, y, p5.width, y);
  }

  p5.stroke(70, 60);
  p5.strokeWeight(1);
  const spacing = 40;
  for (let x = 0; x < p5.width; x += spacing) p5.line(x, 0, x, p5.height);
  for (let y = 0; y < p5.height; y += spacing) p5.line(0, y, p5.width, y);
}

// 🧿 버튼 그리기
function drawButton(
  p5: p5,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  callback: () => void
) {
  const hovered =
    p5.mouseX > x - w / 2 &&
    p5.mouseX < x + w / 2 &&
    p5.mouseY > y - h / 2 &&
    p5.mouseY < y + h / 2;

  const baseC = p5.color('#538a49');
  p5.colorMode(p5.HSB);
  const hueVal = p5.hue(baseC);
  const borderBase = p5.color(hueVal, 55, 60);
  const borderGlow = p5.color(hueVal, 65, 100);
  p5.colorMode(p5.RGB);

  const bgBase = p5.color(0);
  const bgHover = p5.color('#1a1a1a');
  const t = p5.millis() * 0.005;
  const glowStrength = hovered ? p5.sin(t * 5) * 0.5 + 0.5 : 0;
  const borderColor = p5.lerpColor(borderBase, borderGlow, glowStrength);
  const bgColor = hovered ? bgHover : bgBase;

  p5.fill(bgColor);
  p5.stroke(borderColor);
  p5.strokeWeight(hovered ? 4 : 3);
  p5.rectMode(p5.CENTER);
  p5.rect(x, y, w, h, 10);

  p5.noStroke();
  p5.fill(255);
  p5.textSize(16);
  p5.text(label, x, y);

  if (hovered && p5.mouseIsPressed) {
    callback();
  }
}
