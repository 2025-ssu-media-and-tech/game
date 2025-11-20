import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene.ts';
import type { SceneType } from '@/types/status.ts';

const sceneName: SceneType = 'INTRO';

//let myFont: p5.Font;  // 폰트 변수 선언

/*export const preload = (p5: p5) => {
  // 폰트 파일이 제대로 로드되는지 확인
  myFont = p5.loadFont(new URL('src/assets/fonts/Galmuri11-Bold.ttf', import.meta.url).href);
};*/

export const drawIntro = (p5: p5) => {
  // 현재 씬이 'INTRO'가 아니면 씬을 'INTRO'로 변경
  if (CURRENT_SCENE !== sceneName) {
    changeCurrentScene(sceneName);  // 'INTRO' 씬으로 변경
  }

  p5.push();

  // 🔳 배경 그리기
  for (let y = 0; y < p5.height; y++) {
    const inter = p5.map(y, 0, p5.height, 0, 1);
    const c1 = p5.color(5, 10, 8);
    const c2 = p5.color(15, 25, 18);
    const c = p5.lerpColor(c1, c2, inter);
    p5.stroke(c);
    p5.line(0, y, p5.width, y);
  }

  // 🔲 격자 그리기
  p5.stroke(70, 60);
  p5.strokeWeight(1);
  for (let x = 0; x < p5.width; x += 40) p5.line(x, 0, x, p5.height);
  for (let y = 0; y < p5.height; y += 40) p5.line(0, y, p5.width, y);

  // 폰트 설정
  //p5.textFont(myFont);
  p5.textSize(70);
  let baseC = p5.color('#5-38a49');
  p5.colorMode(p5.HSB);
  let hVal = p5.hue(baseC);
  let titleShadow = p5.color(hVal, 80, 60);
  p5.colorMode(p5.RGB);

  // 게임 제목
  p5.fill(titleShadow);
  p5.text('BAAAAAAAM', p5.width / 2 + 4, p5.height / 2 - 250);
  p5.fill(p5.color(238, 238, 238, 180));
  p5.text('BAAAAAAAM', p5.width / 2, p5.height / 2 - 253);

  // 깜빡이는 텍스트 (원본 코드에서처럼)
  if (p5.frameCount % 60 < 30) {
    p5.textSize(20);
    p5.fill(230);
    p5.text("PRESS START", p5.width / 2, p5.height / 2 + 350);
  }

  // 뱀 그림 그리기
  drawSnakeShape(p5, p5.width / 2, p5.height / 2 - 40);

  // 버튼 그리기
  drawButton(p5, p5.width / 2, p5.height / 2 + 160, 200, 60, "PLAY NOW", () => {
    // 버튼 클릭 시 화면 전환 없이 콜백 실행
    console.log("Play Now clicked!");
  });

  drawButton(p5, p5.width / 2, p5.height / 2 + 240, 200, 60, "SETTING", () => {
    // 버튼 클릭 시 화면 전환 없이 콜백 실행
    console.log("Setting clicked!");
  });

  p5.pop();
};

// 🐍 뱀 그림 그리기
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

// 버튼 그리기 함수
function drawButton(p5: p5, x: number, y: number, w: number, h: number, label: string, callback: () => void) {
  let hovered =
    p5.mouseX > x - w / 2 &&
    p5.mouseX < x + w / 2 &&
    p5.mouseY > y - h / 2 &&
    p5.mouseY < y + h / 2;

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
    callback(); // 클릭 시 콜백 실행
  }
}
