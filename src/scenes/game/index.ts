import type p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene, ensureScene } from '@/utils/scene';
import type { SceneType } from '@/types/status';
import { drawSnake } from '@/core/snake/snake-renderer';
import type { SnakePosition } from '@/types/snake';
import type { Direction } from '@/types/direction';
import { setHighScore, incrementAttemptCount, addScoreToHistory } from '@/utils/storage';
import { type Button, drawButton, isMouseOverButton } from '@/utils/ui';

const sceneName: SceneType = 'GAME';

const CELL_SIZE = 40;
const MOVE_INTERVAL = 100; // ms

// 상태
let snake: SnakePosition[] = [];
let food: SnakePosition | null = null;
let direction: Direction = 'right';
let nextDirection: Direction = 'right';
let lastMoveTime = 0;
let isGameOver = false;
let score = 0;

// 버튼
let gameOverButtons: Button[] = [];

// 현재 화면 사이즈를 기준으로 Grid 계산하여 반환
const getGridSize = (p: p5) => ({
  cols: Math.floor(p.width / CELL_SIZE),
  rows: Math.floor(p.height / CELL_SIZE),
});

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

    const onSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);

    if (!onSnake) {
      valid = true;
    }
    attempts++;
  }

  if (valid) {
    food = newFood;
  }
};

export const initGame = (p: p5) => {
  const { cols, rows } = getGridSize(p);
  const startX = Math.floor(cols / 2);
  const startY = Math.floor(rows / 2);

  // 뱀 초기화 (시작할때 사이즈는 머리 포함 3개의 Cell)
  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];

  direction = 'right';
  nextDirection = 'right';
  score = 0;
  isGameOver = false;
  spawnFood(p);
  lastMoveTime = p.millis();
};

// 게임오버 UI
const initGameOverUI = (p: p5) => {
  const centerX = p.width / 2;
  const centerY = p.height / 2;

  gameOverButtons = [
    {
      id: 'restart',
      x: centerX - 110,
      y: centerY + 100,
      width: 200,
      height: 50,
      text: '다시 시작',
    },
    {
      id: 'goto-score',
      x: centerX + 110,
      y: centerY + 100,
      width: 200,
      height: 50,
      text: '점수 보기',
    },
  ];
};

export const drawGame = (p: p5) => {
  // Scene 실행 보장.
  ensureScene(sceneName);

  p.push();

  p.background(0);

  if (snake.length === 0) {
    initGame(p);
  }

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

  // 게임 로직
  if (!isGameOver) {
    const currentTime = p.millis();
    if (currentTime - lastMoveTime > MOVE_INTERVAL) {
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
      if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
        isGameOver = true;
        setHighScore(score); // 최고 점수 저장
        incrementAttemptCount(); // 시도 횟수 증가
        addScoreToHistory(score); // 점수 기록 저장
        initGameOverUI(p); // 게임오버 UI 렌더링
      } else {
        // 벽이 아닌 충돌을 감지했는데, 열매를 먹고있는 중 일수도 있으니 이를 판단하는 코드
        const isEating = food && newHead.x === food.x && newHead.y === food.y;

        // 충돌 감지 (몸)
        const segmentsToCheck = isEating ? snake : snake.slice(0, -1);
        const isSelfCollision = segmentsToCheck.some((seg) => seg.x === newHead.x && seg.y === newHead.y);

        if (isSelfCollision) {
          isGameOver = true;
          setHighScore(score); // 최고 점수 저장
          incrementAttemptCount(); // 시도 횟수 증가
          addScoreToHistory(score); // 점수 기록 저장
          initGameOverUI(p); // 게임오버 UI 렌더링
        } else {
          // 뱀 움직이기
          snake.unshift(newHead); // 머리 생성

          if (isEating) {
            score += 10;
            spawnFood(p); // 열매 생성
          } else {
            snake.pop(); // 꼬리 제거
          }
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

  // 뱀 렌더링
  const pixelSnakePositions = snake.map((pos) => ({
    x: pos.x * CELL_SIZE,
    y: pos.y * CELL_SIZE,
  }));
  drawSnake(p, pixelSnakePositions, CELL_SIZE);

  // 게임오버 레이어 렌더링
  if (isGameOver) {
    p.push();
    p.fill(0, 0, 0, 180);
    p.rect(0, 0, p.width, p.height);

    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);

    p.textSize(60);
    p.text('GAME OVER', p.width / 2, p.height / 2 - 50);

    p.textSize(30);
    p.text(`Final Score: ${score}`, p.width / 2, p.height / 2 + 10);

    // Buttons
    if (gameOverButtons.length === 0) initGameOverUI(p); // Safety
    gameOverButtons.forEach((btn) => drawButton(p, btn));

    p.pop();
  }

  // 점수 레이어 렌더링
  p.push();
  p.fill(255);
  p.noStroke();
  p.textSize(24);
  p.textAlign(p.LEFT, p.TOP);
  p.text(`SCORE: ${score}`, 20, 20);
  p.pop();

  p.pop();
};

export const handleGameClick = (p: p5) => {
  if (CURRENT_SCENE !== sceneName || !isGameOver) return;

  gameOverButtons.forEach((btn) => {
    if (isMouseOverButton(p, btn)) {
      if (btn.id === 'restart') {
        initGame(p);
      } else if (btn.id === 'goto-score') {
        changeCurrentScene('SCORE');
      }
    }
  });
};
