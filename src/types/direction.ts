/**
 * 뱀의 이동 방향을 나타내는 타입
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * 방향 관련 유틸리티 함수
 */
export const DirectionUtils = {
  /**
   * 방향이 수직인지 확인
   */
  isVertical: (direction: Direction): boolean => {
    return direction === 'up' || direction === 'down';
  },

  /**
   * 방향이 수평인지 확인
   */
  isHorizontal: (direction: Direction): boolean => {
    return direction === 'left' || direction === 'right';
  },

  /**
   * 반대 방향 반환
   */
  opposite: (direction: Direction): Direction => {
    const opposites: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    return opposites[direction];
  },
};
