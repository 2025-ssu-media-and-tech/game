import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene.ts';
import type { SceneType } from '@/types/status.ts';

const sceneName: SceneType = 'INTRO';

export const drawIntro = (p5: p5) => {
  if (CURRENT_SCENE !== sceneName) {
    changeCurrentScene(sceneName);
  }

  p5.push();

  // 중앙 정렬 추가
  p5.textAlign(p5.CENTER, p5.CENTER);

    // 중심 좌표
  const centerX = p5.width / 2;
  const centerY = p5.height / 2;

  // 요소별 위치 재정의
  const titleY = centerY-200;
  const snakeY = centerY - 40;
  const playBtnY = centerY + 120;
  const settingBtnY = centerY + 200;

  // 배경 그리기
  for (let y = 0; y < p5.height; y++) {
    const inter = p5.map(y, 0, p5.height, 0, 1);
    const c1 = p5.color(5, 10, 8);
    const c2 = p5.color(15, 25, 18);
    const c = p5.lerpColor(c1, c2, inter);
    p5.stroke(c);
    p5.line(0, y, p5.width, y);
  }

  // 격자
  p5.stroke(70, 60);
  p5.strokeWeight(1);
  for (let x = 0; x < p5.width; x += 40) p5.line(x, 0, x, p5.height);
  for (let y = 0; y < p5.height; y += 40) p5.line(0, y, p5.width, y);

  // 제목 색상
  p5.textSize(70);
  let baseC = p5.color('#538a49');
  p5.colorMode(p5.HSB);
  let hVal = p5.hue(baseC);
  let titleShadow = p5.color(hVal, 80, 60);
  p5.colorMode(p5.RGB);

  // 게임 제목
  p5.fill(titleShadow);
  p5.text('BAAAAAAAM', centerX + 4, titleY);
  p5.fill(p5.color(238, 238, 238, 180));
  p5.text('BAAAAAAAM', centerX, titleY - 3);

  // PRESS START
  if (p5.frameCount % 60 < 30) {
    p5.textSize(20);
    p5.fill(230);
    p5.text("PRESS START", centerX, centerY + 350);
  }

  // 뱀 그림
  drawSnakeShape(p5, centerX, snakeY);

  // 버튼
  drawButton(p5, centerX, playBtnY, 200, 60, "PLAY NOW", () => {
    console.log("Play Now clicked!");
  });

  drawButton(p5, centerX, settingBtnY, 200, 60, "SETTING", () => {
    console.log("Setting clicked!");
  });

  p5.pop();
};


// 뱀 그림
function drawSnakeShape(p5: p5, x: number, y: number) {
  p5.push();
  let bounce = p5.sin(p5.frameCount * 0.08) * 4;
  p5.translate(x, y + bounce);
  p5.rectMode(p5.CENTER);
  p5.noStroke();

  let scl = 20;
  let s = scl * 2;
  let spacing = s * 1.4;
  let headH = s * 1.1;
  let bodyH = s * 0.7;

  let headColor = p5.color('#538a49');
  p5.colorMode(p5.HSB);
  let hVal = p5.hue(headColor);
  let sVal = p5.saturation(headColor);
  let bVal = p5.brightness(headColor);
  let bodyColor = p5.color(hVal, sVal, bVal * 0.8);
  let stripeColor = p5.color(hVal, sVal, bVal * 0.55);
  p5.colorMode(p5.RGB);

  let bodyY = headH / 2 - bodyH / 2;

  p5.fill(bodyColor);
  p5.rect(0, bodyY, s * 2.4, bodyH, 5);

  p5.fill(stripeColor);
  p5.rect(s * 0.1, bodyY, s * 0.25, bodyH * 0.8, 2);

  p5.fill(headColor);
  p5.rect(-spacing, 0, s * 1.4, headH, 8);

  p5.fill(stripeColor);
  let eyeSize = s * 0.18;
  p5.rect(-spacing - s * 0.3, -headH * 0.1, eyeSize, eyeSize, 2);
  p5.rect(-spacing - s * 0.05, -headH * 0.1, eyeSize, eyeSize, 2);

  p5.pop();
}

// 버튼
function drawButton(p5: p5, x: number, y: number, w: number, h: number, label: string, callback: () => void) {
  let hovered =
    p5.mouseX > x - w / 2 &&
    p5.mouseX < x + w / 2 &&
    p5.mouseY > y - h / 2 &&
    p5.mouseY < y + h / 2;

    p5.rectMode(p5.CENTER);


  let baseC = p5.color('#538a49');
  p5.colorMode(p5.HSB);
  let hueVal = p5.hue(baseC);
  let borderBase = p5.color(hueVal, 55, 60);
  let borderGlow = p5.color(hueVal, 65, 100);
  p5.colorMode(p5.RGB);

  let bgBase = p5.color(0);
  let bgHover = p5.color('#1a1a1a');
  let t = p5.millis() * 0.005;
  let glowStrength = (hovered ? (p5.sin(t * 5) * 0.5 + 0.5) : 0);
  let borderColor = p5.lerpColor(borderBase, borderGlow, glowStrength);
  let bgColor = hovered ? bgHover : bgBase;

  p5.fill(bgColor);
  p5.stroke(borderColor);
  p5.strokeWeight(hovered ? 4 : 3);
  p5.rect(x, y, w, h, 10);

  p5.noStroke();
  p5.fill(255);
  p5.textSize(16);
  p5.text(label, x, y);

  if (hovered && p5.mouseIsPressed) {
    callback();
  }
}
