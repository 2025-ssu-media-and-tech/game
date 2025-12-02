import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene, ensureScene } from '@/utils/scene';
import type { SceneType } from '@/types/status';
import { drawSnake } from '@/core/snake/snake-renderer';
import type { SnakePosition } from '@/types/snake';
import type { Direction } from '@/types/direction';
import { setHighScore, incrementAttemptCount, addScoreToHistory } from '@/utils/storage';
import { type Button, drawButton, isMouseOverButton } from '@/utils/ui';
import { getRandomMap, drawMapBackground, drawMapDecorations, type MapType } from '@/core/map/map-renderer';

const sceneName: SceneType = 'GAME';

const CELL_SIZE = 40;
const BASE_MOVE_INTERVAL = 150; // 시작 속도를 조금 더 느리게 조정 (난이도가 어짜피 증가할 예정이라)
const MIN_MOVE_INTERVAL = 40; // 최대 속도 제한
const SPEED_STEP = 2; // 점수당 빨라지는 ms
const WALL_SPAWN_SCORE_INTERVAL = 100; // 벽이 생성되는 점수 간격

// 상태
let snake: SnakePosition[] = [];
let food: SnakePosition | null = null;
let goldenFood: SnakePosition | null = null; // 황금 열매
let walls: SnakePosition[] = []; // 장애물 (벽)
let direction: Direction = 'right';
let nextDirection: Direction = 'right';
let lastMoveTime = 0;
let isGameOver = false;
let score = 0;
let fruitCount = 0;
let lives = 2; // 목숨
let currentMap: MapType = 'maze'; // 현재 맵

// 버튼
let gameOverButtons: Button[] = [];

type Particle = {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  size: number;
  color: string;
};

type FloatingText = {
  text: string;
  x: number;
  y: number;
  size: number;
  life: number; // Frames to live
  maxLife: number;
  color: string;
};

let particles: Particle[] = [];
let floatingTexts: FloatingText[] = [];

// 현재 화면 사이즈를 기준으로 Grid 계산하여 반환
const getGridSize = (p: p5) => ({
  cols: Math.floor(p.width / CELL_SIZE),
  rows: Math.floor(p.height / CELL_SIZE),
});

// 현재 점수에 따른 이동 속도 계산
const getMoveInterval = () => {
  const calculatedInterval = BASE_MOVE_INTERVAL - score * SPEED_STEP;
  return Math.max(MIN_MOVE_INTERVAL, calculatedInterval);
};

// 좌표가 유효하고 충돌하지 않는지 확인하는 헬퍼 함수
const isValidSpawnPosition = (
  pos: SnakePosition,
  snakeBody: SnakePosition[],
  otherFood: SnakePosition | null,
  existingWalls: SnakePosition[],
  checkRespawnZone: boolean = false,
  cols: number = 0,
  rows: number = 0,
) => {
  // 뱀 몸통과 충돌 체크
  const onSnake = snakeBody.some((segment) => segment.x === pos.x && segment.y === pos.y);
  // 다른 음식과 충돌 체크
  const onOtherFood = otherFood && otherFood.x === pos.x && otherFood.y === pos.y;
  // 벽과 충돌 체크
  const onWall = existingWalls.some((wall) => wall.x === pos.x && wall.y === pos.y);

  // 리스폰 구역(중앙) 체크 (벽 생성 시 필수)
  let onRespawnZone = false;
  if (checkRespawnZone && cols > 0 && rows > 0) {
    const startX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2);
    // 초기 뱀 길이(3) + 여유 공간 고려하여 중앙 근처에는 벽 생성 금지
    if (Math.abs(pos.x - startX) <= 2 && Math.abs(pos.y - startY) <= 1) {
      onRespawnZone = true;
    }
  }

  return !onSnake && !onOtherFood && !onWall && !onRespawnZone;
};

// 열매(점수 획득 요소) 스폰 기능
const spawnFood = (p: p5) => {
  const { cols, rows } = getGridSize(p);
  let valid = false;
  let newFood: SnakePosition = { x: 0, y: 0 };

  let attempts = 0;
  const maxAttempts = 100;

  while (!valid && attempts < maxAttempts) {
    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };

    if (isValidSpawnPosition(newFood, snake, goldenFood, walls)) {
      valid = true;
    }
    attempts++;
  }

  if (valid) {
    food = newFood;
  }
};

// 황금 열매 스폰 기능
const spawnGoldenFood = (p: p5) => {
  // 이미 존재하거나 목숨이 3개 이상이면 스폰하지 않음
  if (goldenFood || lives >= 3) return;

  const { cols, rows } = getGridSize(p);
  let valid = false;
  let newFood: SnakePosition = { x: 0, y: 0 };

  let attempts = 0;
  const maxAttempts = 100;

  while (!valid && attempts < maxAttempts) {
    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };

    if (isValidSpawnPosition(newFood, snake, food, walls)) {
      valid = true;
    }
    attempts++;
  }

  if (valid) {
    goldenFood = newFood;
  }
};

// 벽(장애물) 스폰 기능
const spawnWall = (p: p5) => {
  const { cols, rows } = getGridSize(p);
  let valid = false;
  let newWall: SnakePosition = { x: 0, y: 0 };

  let attempts = 0;
  const maxAttempts = 100;

  while (!valid && attempts < maxAttempts) {
    newWall = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };

    // 벽 생성 시에는 리스폰 구역도 피해야 함
    if (
      isValidSpawnPosition(newWall, snake, food, walls, true, cols, rows) &&
      (!goldenFood || goldenFood.x !== newWall.x || goldenFood.y !== newWall.y)
    ) {
      valid = true;
    }
    attempts++;
  }

  if (valid) {
    walls.push(newWall);
    // 벽 생성 시 효과
    createExplosionParticles(p, newWall.x, newWall.y);
    addFloatingText('New Wall!', p.width / 2, p.height / 2 - 50, '#9E9E9E');
  }
};

const createExplosionParticles = (p: p5, x: number, y: number) => {
  const centerX = x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = y * CELL_SIZE + CELL_SIZE / 2;
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const angle = (p.TWO_PI / particleCount) * i + p.random(-0.3, 0.3);
    const speed = p.random(2, 6);
    const size = p.random(4, 10);

    const colors = ['#66BB6A', '#FF5252', '#FF9800', '#FFC107'];
    const color = colors[Math.floor(p.random(colors.length))];

    particles.push({
      x: centerX,
      y: centerY,
      vx: p.cos(angle) * speed,
      vy: p.sin(angle) * speed,
      size: size,
      color: color,
    });
  }
};

const addFloatingText = (text: string, x: number, y: number, color: string = '#FFFFFF') => {
  floatingTexts.push({
    text,
    x,
    y,
    size: 40,
    life: 60, // 1 second (approx)
    maxLife: 60,
    color,
  });
};

const updateParticles = () => {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];

    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.95;
    particle.vy *= 0.95;
  }
};

const updateFloatingTexts = () => {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.life--;
    ft.y -= 1; // Move up slowly
    if (ft.life <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
};

const drawParticles = (p: p5) => {
  p.push();
  p.noStroke();

  particles.forEach((particle) => {
    const color = p.color(particle.color);
    p.fill(p.red(color), p.green(color), p.blue(color), 255);
    p.ellipse(particle.x, particle.y, particle.size);
  });

  p.pop();
};

const drawFloatingTexts = (p: p5) => {
  p.push();
  p.textAlign(p.CENTER, p.CENTER);
  p.textStyle(p.BOLD);

  floatingTexts.forEach((ft) => {
    const alpha = p.map(ft.life, 0, ft.maxLife, 0, 255);
    const scale = p.map(ft.life, 0, ft.maxLife, 1.5, 1); // Slight pop effect

    p.push();
    p.translate(ft.x, ft.y);
    p.scale(scale);
    p.fill(p.color(ft.color));
    // p.fill with alpha requires separate alpha handling or color object, simple hack:
    const c = p.color(ft.color);
    c.setAlpha(alpha);
    p.fill(c);
    p.textSize(ft.size);
    p.stroke(0, alpha);
    p.strokeWeight(2);
    p.text(ft.text, 0, 0);
    p.pop();
  });

  p.pop();
};

export const initGame = (p: p5) => {
  const { cols, rows } = getGridSize(p);
  const startX = Math.floor(cols / 2);
  const startY = Math.floor(rows / 2);

  // 랜덤 맵 선택 (배경만 제공, 벽은 생성하지 않음)
  currentMap = getRandomMap();
  walls = []; // 벽 초기화 (기존 랜덤 생성 로직으로 생성됨)

  // 뱀 초기화 (시작할때 사이즈는 머리 포함 3개의 Cell)
  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];

  direction = 'right';
  nextDirection = 'right';
  score = 0;
  fruitCount = 0;
  lives = 2; // 목숨 2개로 시작
  isGameOver = false;
  particles = [];
  floatingTexts = [];
  goldenFood = null;
  spawnFood(p);
  lastMoveTime = p.millis();

  // 게임 배경음악 다시 재생
  if (window.startGameBgm) {
    window.startGameBgm();
  }
};

const respawnSnake = (p: p5) => {
  const { cols, rows } = getGridSize(p);
  const startX = Math.floor(cols / 2);
  const startY = Math.floor(rows / 2);

  // 뱀 위치만 리셋 (점수, 속도, 벽 등은 유지)
  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];
  direction = 'right';
  nextDirection = 'right';
  // 잠시 멈춤 효과를 위해 마지막 움직임 시간을 현재로 리셋하고 약간의 딜레이를 줌
  lastMoveTime = p.millis() + 500;
};

// 게임오버 처리
const handleGameOver = (p: p5) => {
  isGameOver = true;

  // 게임 배경음악 정지
  if (window.stopGameBgm) {
    window.stopGameBgm();
  }
  // 게임오버 효과음 재생
  if (window.playOutSound) {
    window.playOutSound();
  }

  setHighScore(score); // 최고 점수 저장
  incrementAttemptCount(); // 시도 횟수 증가
  addScoreToHistory(score); // 점수 기록 저장

  initGameOverUI(p); // 게임오버 UI 렌더링
};

// 게임오버 UI
const initGameOverUI = (p: p5) => {
  const centerX = p.width / 2;
  const bottomY = p.height - 80;

  const isSmallScreen = p.width < 600;
  const buttonWidth = isSmallScreen ? Math.min(180, p.width * 0.35) : 200;
  const buttonHeight = isSmallScreen ? 45 : 50;
  const buttonGap = isSmallScreen ? 20 : 30;

  const halfGap = buttonGap / 2;
  const firstButtonCenterX = centerX - buttonWidth / 2 - halfGap;
  const secondButtonCenterX = centerX + buttonWidth / 2 + halfGap;

  gameOverButtons = [
    {
      id: 'restart',
      x: firstButtonCenterX,
      y: bottomY,
      width: buttonWidth,
      height: buttonHeight,
      text: '다시 시작',
    },
    {
      id: 'goto-score',
      x: secondButtonCenterX,
      y: bottomY,
      width: buttonWidth,
      height: buttonHeight,
      text: '점수 보기',
    },
  ];
};

export const drawGame = (p: p5) => {
  // Scene 실행 보장.
  ensureScene(sceneName);

  p.push();

  if (snake.length === 0) {
    initGame(p);
  }

  // 맵 배경 및 장식물 렌더링
  const { cols, rows } = getGridSize(p);
  drawMapBackground(p, currentMap, CELL_SIZE, cols, rows);
  drawMapDecorations(p, currentMap, CELL_SIZE, cols, rows);

  // 사용자 입력 핸들링
  if (p.keyIsDown(p.UP_ARROW) && direction !== 'down') {
    nextDirection = 'up';
  } else if (p.keyIsDown(p.DOWN_ARROW) && direction !== 'up') {
    nextDirection = 'down';
  } else if (p.keyIsDown(p.LEFT_ARROW) && direction !== 'right') {
    nextDirection = 'left';
  } else if (p.keyIsDown(p.RIGHT_ARROW) && direction !== 'left') {
    nextDirection = 'right';
  }

  updateParticles();
  updateFloatingTexts();

  // 게임 로직
  if (!isGameOver) {
    const currentTime = p.millis();
    const moveInterval = getMoveInterval();

    if (currentTime - lastMoveTime > moveInterval) {
      // 사용자 입력이 없어도 이전 Direction을 사용하여 움직일 수 있도록 함
      direction = nextDirection;

      // 머리 위치 계산
      const head = snake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'up':
          newHead.y -= 1;
          break;
        case 'down':
          newHead.y += 1;
          break;
        case 'left':
          newHead.x -= 1;
          break;
        case 'right':
          newHead.x += 1;
          break;
      }

      // 충돌 감지 (벽)
      const { cols, rows } = getGridSize(p);
      let collision = false;

      if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
        collision = true;
      } else {
        // 벽이 아닌 충돌을 감지했는데, 열매를 먹고있는 중 일수도 있으니 이를 판단하는 코드
        const isEating = food && newHead.x === food.x && newHead.y === food.y;
        const isEatingGolden = goldenFood && newHead.x === goldenFood.x && newHead.y === goldenFood.y;

        // 충돌 감지 (몸 및 장애물 벽)
        const segmentsToCheck = isEating || isEatingGolden ? snake : snake.slice(0, -1);
        const isSelfCollision = segmentsToCheck.some((seg) => seg.x === newHead.x && seg.y === newHead.y);
        const isWallCollision = walls.some((wall) => wall.x === newHead.x && wall.y === newHead.y);

        if (isSelfCollision || isWallCollision) {
          collision = true;
        } else {
          // 뱀 움직이기
          snake.unshift(newHead); // 머리 생성

          if (isEating) {
            if (window.playEatSound) {
              window.playEatSound();
            }

            // 점수 증가 전 상태 저장 (스피드, 벽 생성용)
            const prevSpeedLevel = Math.floor(score / 50);
            const prevWallLevel = Math.floor(score / WALL_SPAWN_SCORE_INTERVAL);

            score += 10;
            fruitCount += 1;
            spawnFood(p); // 열매 생성

            // 점수 증가 후 스피드 레벨 계산 및 Speed Up 표시
            const newSpeedLevel = Math.floor(score / 50);
            if (newSpeedLevel > prevSpeedLevel) {
              addFloatingText('Speed Up!', p.width / 2, p.height / 2, '#FF4081');
            }

            // 점수 증가 후 벽 생성 체크
            const newWallLevel = Math.floor(score / WALL_SPAWN_SCORE_INTERVAL);
            if (newWallLevel > prevWallLevel) {
              spawnWall(p);
            }

            // 일반 열매 먹었을 때 15% 확률로 황금 열매 생성
            if (Math.random() < 0.15) {
              spawnGoldenFood(p);
            }
          } else if (isEatingGolden) {
            // 황금 열매 섭취
            if (window.playEatSound) {
              window.playEatSound(); // 필요시 다른 사운드로 변경 가능
            }

            // 점수 증가 전 상태 저장
            const prevSpeedLevel = Math.floor(score / 50);
            const prevWallLevel = Math.floor(score / WALL_SPAWN_SCORE_INTERVAL);

            lives += 1; // 목숨 증가
            score += 50; // 보너스 점수

            // 점수 증가 후 스피드 레벨 계산 및 Speed Up 표시
            const newSpeedLevel = Math.floor(score / 50);
            if (newSpeedLevel > prevSpeedLevel) {
              addFloatingText('Speed Up!', p.width / 2, p.height / 2, '#FF4081');
            }

            // 점수 증가 후 벽 생성 체크
            const newWallLevel = Math.floor(score / WALL_SPAWN_SCORE_INTERVAL);
            if (newWallLevel > prevWallLevel) {
              spawnWall(p);
            }

            goldenFood = null; // 황금 열매 제거
            createExplosionParticles(p, newHead.x, newHead.y); // 파티클 효과
          } else {
            snake.pop(); // 꼬리 제거
          }
        }
      }

      if (collision) {
        createExplosionParticles(p, head.x, head.y);

        lives -= 1; // 목숨 감소

        if (lives <= 0) {
          // 목숨 소진 -> 게임 오버
          handleGameOver(p);
        } else {
          // 목숨 남음 -> 리스폰
          if (window.playOutSound) {
            window.playOutSound();
          }
          respawnSnake(p);
        }
      }

      lastMoveTime = currentTime;
    }
  } else {
    // 재시작 (Enter 키 지원 유지)
    if (p.keyIsDown(p.ENTER)) {
      initGame(p);
    }
  }

  // 렌더링

  // 벽(장애물) 렌더링
  p.push();
  p.rectMode(p.CORNER);
  p.fill('#9E9E9E'); // 회색
  p.stroke(0);
  p.strokeWeight(1);
  walls.forEach((wall) => {
    const wx = wall.x * CELL_SIZE;
    const wy = wall.y * CELL_SIZE;
    p.rect(wx, wy, CELL_SIZE, CELL_SIZE, 4);
    // 벽 질감 표현 (X자)
    p.line(wx, wy, wx + CELL_SIZE, wy + CELL_SIZE);
    p.line(wx + CELL_SIZE, wy, wx, wy + CELL_SIZE);
  });
  p.pop();

  // 열매 렌더링
  if (food) {
    const fx = food.x * CELL_SIZE;
    const fy = food.y * CELL_SIZE;
    p.push();
    p.rectMode(p.CORNER);

    p.fill(0, 0, 0, 50);
    p.noStroke();
    p.rect(fx + 4, fy + 4, CELL_SIZE - 8, CELL_SIZE - 8, 8);

    p.fill('#FF5252');
    p.rect(fx + 2, fy + 2, CELL_SIZE - 4, CELL_SIZE - 4, 8);

    p.fill(255, 255, 255, 150);
    p.ellipse(fx + CELL_SIZE * 0.3, fy + CELL_SIZE * 0.3, CELL_SIZE * 0.15);

    p.pop();
  }

  // 황금 열매 렌더링
  if (goldenFood) {
    const gfx = goldenFood.x * CELL_SIZE;
    const gfy = goldenFood.y * CELL_SIZE;
    p.push();
    p.rectMode(p.CORNER);

    // 빛나는 효과
    const glowSize = 5 + p.sin(p.millis() * 0.005) * 2;
    p.fill(255, 215, 0, 100); // 황금 후광
    p.noStroke();
    p.ellipse(gfx + CELL_SIZE / 2, gfy + CELL_SIZE / 2, CELL_SIZE + glowSize);

    p.fill(0, 0, 0, 50);
    p.rect(gfx + 4, gfy + 4, CELL_SIZE - 8, CELL_SIZE - 8, 8);

    p.fill('#FFD700'); // 황금 색
    p.rect(gfx + 2, gfy + 2, CELL_SIZE - 4, CELL_SIZE - 4, 8);

    p.fill(255, 255, 255, 200);
    p.ellipse(gfx + CELL_SIZE * 0.3, gfy + CELL_SIZE * 0.3, CELL_SIZE * 0.15);

    p.pop();
  }

  // 뱀 렌더링
  const pixelSnakePositions = snake.map((pos) => ({
    x: pos.x * CELL_SIZE,
    y: pos.y * CELL_SIZE,
  }));
  drawSnake(p, pixelSnakePositions, CELL_SIZE);

  if (isGameOver && snake.length > 0 && pixelSnakePositions.length > 0) {
    const headPixelPos = pixelSnakePositions[0];
    const headX = headPixelPos.x;
    const headY = headPixelPos.y;
    const centerX = headX + CELL_SIZE / 2;
    const centerY = headY + CELL_SIZE / 2;
    const explosionSize = CELL_SIZE * 1.5;
    const pulseSize = explosionSize * (1 + p.sin(p.millis() * 0.01) * 0.3);

    p.push();
    p.noStroke();

    // 폭발 효과
    for (let i = 0; i < 3; i++) {
      const size = pulseSize * (1 - i * 0.3);
      const alpha = 150 - i * 50;
      const colors = [
        [255, 82, 82, alpha],
        [255, 152, 0, alpha],
        [255, 193, 7, alpha],
      ];
      const color = colors[i] || colors[0];
      p.fill(color[0], color[1], color[2], color[3]);
      p.ellipse(centerX, centerY, size);
    }

    p.fill(255, 82, 82, 180);
    p.rectMode(p.CENTER);
    p.rect(centerX, centerY, CELL_SIZE * 0.9, CELL_SIZE * 0.9);

    p.pop();

    p.push();

    let headDirection: Direction = 'right';
    if (pixelSnakePositions.length === 1) {
      headDirection = 'right';
    } else {
      const from = pixelSnakePositions[0];
      const to = pixelSnakePositions[1];
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        headDirection = dx > 0 ? 'right' : 'left';
      } else {
        headDirection = dy > 0 ? 'down' : 'up';
      }
    }

    const totalLength = snake.length;
    const position = 0;
    const sizeRatio = 1 - (position / totalLength) * 0.15;
    const actualSize = CELL_SIZE * sizeRatio;
    const offsetX = (CELL_SIZE - actualSize) / 2;
    const offsetY = (CELL_SIZE - actualSize) / 2;
    const eyeSize = actualSize * 0.3;
    const eyeOffsetFromEdge = actualSize * 0.15;

    let eyePositions: Array<{ x: number; y: number }> = [];
    switch (headDirection) {
      case 'right':
        eyePositions = [
          { x: actualSize - eyeOffsetFromEdge - eyeSize, y: actualSize * 0.25 - eyeSize / 2 },
          { x: actualSize - eyeOffsetFromEdge - eyeSize, y: actualSize * 0.75 - eyeSize / 2 },
        ];
        break;
      case 'left':
        eyePositions = [
          { x: eyeOffsetFromEdge, y: actualSize * 0.25 - eyeSize / 2 },
          { x: eyeOffsetFromEdge, y: actualSize * 0.75 - eyeSize / 2 },
        ];
        break;
      case 'up':
        eyePositions = [
          { x: actualSize * 0.25 - eyeSize / 2, y: eyeOffsetFromEdge },
          { x: actualSize * 0.75 - eyeSize / 2, y: eyeOffsetFromEdge },
        ];
        break;
      case 'down':
        eyePositions = [
          { x: actualSize * 0.25 - eyeSize / 2, y: actualSize - eyeOffsetFromEdge - eyeSize },
          { x: actualSize * 0.75 - eyeSize / 2, y: actualSize - eyeOffsetFromEdge - eyeSize },
        ];
        break;
    }

    p.stroke(0, 0, 0);
    p.strokeWeight(3);
    p.noFill();

    eyePositions.forEach((eyePos) => {
      const eyeX = headX + offsetX + eyePos.x;
      const eyeY = headY + offsetY + eyePos.y;
      const eyeCenterX = eyeX + eyeSize / 2;
      const eyeCenterY = eyeY + eyeSize / 2;
      const xSize = eyeSize * 0.6;
      p.line(eyeCenterX - xSize / 2, eyeCenterY - xSize / 2, eyeCenterX + xSize / 2, eyeCenterY + xSize / 2);
      p.line(eyeCenterX + xSize / 2, eyeCenterY - xSize / 2, eyeCenterX - xSize / 2, eyeCenterY + xSize / 2);
    });

    p.pop();
  }

  drawParticles(p);
  drawFloatingTexts(p); // Floating Texts 그리기

  // 게임오버 레이어 렌더링
  if (isGameOver) {
    p.push();
    p.fill(0, 0, 0, 180);
    p.rect(0, 0, p.width, p.height);

    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);

    p.textSize(60);
    p.textStyle(p.BOLD);
    p.text('GAME OVER', p.width / 2, p.height / 2 - 50);

    p.textSize(30);
    p.textStyle(p.BOLD);
    p.text(`점수 : ${score}점`, p.width / 2, p.height / 2 + 10);

    initGameOverUI(p);
    gameOverButtons.forEach((btn) => drawButton(p, btn));

    p.pop();
  }

  // 정보 레이어 렌더링 (점수, 목숨 등)
  p.push();
  p.fill(255);
  p.noStroke();
  p.textSize(24);
  p.textStyle(p.BOLD);
  p.textAlign(p.LEFT, p.TOP);

  // 점수 및 먹은 열매 표시
  p.text(`먹은 열매 : ${fruitCount}개   /   현재 점수 : ${score}점`, 20, 20);

  // 목숨 표시
  const heartSymbol = '❤️';
  let livesText = '';
  for (let i = 0; i < lives; i++) {
    livesText += heartSymbol + ' ';
  }
  p.text(`목숨 : ${livesText}`, 20, 50);

  p.pop();

  p.pop();
};

export const handleGameClick = (p: p5) => {
  if (CURRENT_SCENE !== sceneName || !isGameOver) return;

  gameOverButtons.forEach((btn) => {
    if (isMouseOverButton(p, btn)) {
      if (window.playClickSound) {
        window.playClickSound();
      }
      if (btn.id === 'restart') {
        initGame(p);
      } else if (btn.id === 'goto-score') {
        changeCurrentScene('SCORE');
      }
    }
  });
};
