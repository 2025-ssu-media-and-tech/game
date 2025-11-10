/**
 * 뱀 부분 타입
 */
export type SnakePartType = 'head' | 'body' | 'tail';

/**
 * 뱀 스타일 설정
 */
export interface SnakeStyle {
  /**
   * 뱀의 색상 (기본값: '#4CAF50')
   */
  color?: string;

  /**
   * 뱀의 테두리 색상 (기본값: '#2E7D32')
   */
  strokeColor?: string;

  /**
   * 테두리 두께 (기본값: 2)
   */
  strokeWeight?: number;

  /**
   * 머리 스타일 커스터마이징
   */
  headStyle?: {
    /**
     * 눈 색상 (기본값: '#FFFFFF')
     */
    eyeColor?: string;

    /**
     * 눈 크기 (기본값: 크기의 15%)
     */
    eyeSize?: number;
  };

  /**
   * 몸 스타일 커스터마이징
   */
  bodyStyle?: {
    /**
     * 몸에 패턴 표시 여부 (기본값: true)
     */
    showPattern?: boolean;

    /**
     * 패턴 색상 (기본값: 메인 색상보다 약간 어두운 색)
     */
    patternColor?: string;
  };

  /**
   * 꼬리 스타일 커스터마이징
   */
  tailStyle?: {
    /**
     * 꼬리 끝 모양 (기본값: 'round')
     */
    endShape?: 'round' | 'pointed' | 'square';
  };
}
