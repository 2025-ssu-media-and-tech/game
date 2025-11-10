import type p5 from 'p5';
import type { Direction } from '../../types/direction';

/**
 * 뱀 위치 정보 (x, y 좌표만)
 */
export interface SnakePosition {
  x: number;
  y: number;
}

/**
 * 뱀 색상
 */
const SNAKE_COLORS = {
  head: '#66BB6A', // 밝은 녹색 (머리)
  body: '#4CAF50', // 진한 녹색 (몸통)
  tail: '#4CAF50', // 진한 녹색 (꼬리)
  eye: '#000000', // 검은색 (눈)
  shadow: '#2E7D32', // 그림자 색상 (더 어두운 녹색)
  highlight: '#81C784', // 하이라이트 색상 (더 밝은 녹색)
};

/**
 * 두 위치 간의 방향 계산
 */
const calculateDirection = (from: SnakePosition, to: SnakePosition): Direction => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
};

/**
 * 방향에 따른 눈 위치 계산 (픽셀 좌표 기준)
 */
const getEyePositions = (direction: Direction, size: number) => {
  const eyeSize = size * 0.3;
  const eyeOffsetFromEdge = size * 0.15;

  switch (direction) {
    case 'right':
      return [
        { x: size - eyeOffsetFromEdge - eyeSize, y: size * 0.25 - eyeSize / 2 },
        { x: size - eyeOffsetFromEdge - eyeSize, y: size * 0.75 - eyeSize / 2 },
      ];
    case 'left':
      return [
        { x: eyeOffsetFromEdge, y: size * 0.25 - eyeSize / 2 },
        { x: eyeOffsetFromEdge, y: size * 0.75 - eyeSize / 2 },
      ];
    case 'up':
      return [
        { x: size * 0.25 - eyeSize / 2, y: eyeOffsetFromEdge },
        { x: size * 0.75 - eyeSize / 2, y: eyeOffsetFromEdge },
      ];
    case 'down':
      return [
        { x: size * 0.25 - eyeSize / 2, y: size - eyeOffsetFromEdge - eyeSize },
        { x: size * 0.75 - eyeSize / 2, y: size - eyeOffsetFromEdge - eyeSize },
      ];
  }
};

/**
 * 위치에 따른 크기 계산 (머리에서 꼬리로 갈수록 작아짐)
 */
const getSizeByPosition = (baseSize: number, position: number, totalLength: number): number => {
  // 머리(0)는 100%, 꼬리로 갈수록 최대 85%까지 작아짐
  const sizeRatio = 1 - (position / totalLength) * 0.15;
  return baseSize * sizeRatio;
};

/**
 * 위치에 따른 투명도 계산 (꼬리로 갈수록 투명해짐)
 */
const getAlphaByPosition = (position: number, totalLength: number): number => {
  // 머리와 가까운 부분은 불투명, 꼬리로 갈수록 투명
  if (position < totalLength * 0.7) return 255; // 앞 70%는 완전 불투명
  // 뒤 30%는 점차 투명해짐
  const fadeStart = totalLength * 0.7;
  const fadeEnd = totalLength;
  const fadeProgress = (position - fadeStart) / (fadeEnd - fadeStart);
  return 255 - fadeProgress * 100; // 최대 100만큼 투명해짐
};

/**
 * 음영 있는 블록 그리기
 */
const drawBlockWithShadow = (p: p5, x: number, y: number, size: number, color: string, alpha: number = 255): void => {
  p.push();

  // 투명도 설정
  const colorObj = p.color(color);
  const r = p.red(colorObj);
  const g = p.green(colorObj);
  const b = p.blue(colorObj);
  p.fill(r, g, b, alpha);

  // 그림자 (오른쪽 아래)
  p.fill(SNAKE_COLORS.shadow);
  p.noStroke();
  p.rectMode(p.CORNER);
  const shadowOffset = size * 0.1;
  p.rect(x + shadowOffset, y + shadowOffset, size * 0.9, size * 0.9);

  // 메인 블록
  p.fill(r, g, b, alpha);
  p.rect(x, y, size * 0.95, size * 0.95);

  // 하이라이트 (왼쪽 위)
  p.fill(SNAKE_COLORS.highlight);
  p.rect(x, y, size * 0.3, size * 0.3);

  p.pop();
};

/**
 * 뱀의 머리 그리기 (픽셀 아트 스타일 + 음영)
 */
const drawSnakeHead = (
  p: p5,
  x: number,
  y: number,
  size: number,
  direction: Direction,
  position: number = 0,
  totalLength: number = 1,
): void => {
  const actualSize = getSizeByPosition(size, position, totalLength);
  const alpha = getAlphaByPosition(position, totalLength);
  const offsetX = (size - actualSize) / 2;
  const offsetY = (size - actualSize) / 2;

  // 머리 몸체 (음영 효과 포함)
  drawBlockWithShadow(p, x + offsetX, y + offsetY, actualSize, SNAKE_COLORS.head, alpha);

  // 눈 그리기
  const eyePositions = getEyePositions(direction, actualSize);
  const eyeSize = actualSize * 0.3;

  p.push();
  const eyeColor = p.color(SNAKE_COLORS.eye);
  p.fill(p.red(eyeColor), p.green(eyeColor), p.blue(eyeColor), alpha);
  p.noStroke();
  eyePositions.forEach((pos) => {
    p.rect(x + offsetX + pos.x, y + offsetY + pos.y, eyeSize, eyeSize);
  });
  p.pop();
};

/**
 * 뱀의 몸 그리기 (픽셀 아트 스타일 + 음영 + 크기 변화)
 */
const drawSnakeBody = (
  p: p5,
  x: number,
  y: number,
  size: number,
  _direction: Direction,
  position: number = 1,
  totalLength: number = 3,
): void => {
  const actualSize = getSizeByPosition(size, position, totalLength);
  const alpha = getAlphaByPosition(position, totalLength);
  const offsetX = (size - actualSize) / 2;
  const offsetY = (size - actualSize) / 2;

  // 몸통 (음영 효과 포함)
  drawBlockWithShadow(p, x + offsetX, y + offsetY, actualSize, SNAKE_COLORS.body, alpha);
};

/**
 * 뱀의 꼬리 그리기 (픽셀 아트 스타일 + 음영 + 크기 변화)
 */
const drawSnakeTail = (
  p: p5,
  x: number,
  y: number,
  size: number,
  _direction: Direction,
  position: number = 2,
  totalLength: number = 3,
): void => {
  const actualSize = getSizeByPosition(size, position, totalLength);
  const alpha = getAlphaByPosition(position, totalLength);
  const offsetX = (size - actualSize) / 2;
  const offsetY = (size - actualSize) / 2;

  // 꼬리 (음영 효과 포함)
  drawBlockWithShadow(p, x + offsetX, y + offsetY, actualSize, SNAKE_COLORS.tail, alpha);
};

/**
 * 뱀 전체 그리기 (위치만 주면 자동으로 방향 계산 및 회전 처리)
 * @param p - p5 인스턴스
 * @param positions - 뱀의 위치 배열 (첫 번째는 머리, 마지막은 꼬리)
 * @param cellSize - 각 세그먼트의 크기
 */
export const drawSnake = (p: p5, positions: SnakePosition[], cellSize: number): void => {
  if (positions.length === 0) return;
  if (positions.length === 1) {
    // 세그먼트가 하나만 있으면 머리로 처리 (기본 방향: right)
    drawSnakeHead(p, positions[0].x, positions[0].y, cellSize, 'right', 0, 1);
    return;
  }

  const totalLength = positions.length;

  positions.forEach((position, index) => {
    if (index === 0) {
      // 머리: 다음 세그먼트 방향
      const direction = calculateDirection(positions[0], positions[1]);
      drawSnakeHead(p, position.x, position.y, cellSize, direction, index, totalLength);
    } else if (index === positions.length - 1) {
      // 꼬리: 이전 세그먼트 방향
      const direction = calculateDirection(positions[index - 1], positions[index]);
      drawSnakeTail(p, position.x, position.y, cellSize, direction, index, totalLength);
    } else {
      // 몸: 이전에서 현재로의 방향 (회전 고려)
      const direction = calculateDirection(positions[index - 1], positions[index]);
      drawSnakeBody(p, position.x, position.y, cellSize, direction, index, totalLength);
    }
  });
};
