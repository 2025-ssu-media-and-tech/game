// 사용자 LocalStorage 접근 Key
export const STORAGE_KEYS = {
  HIGH_SCORE: 'snake-game-high-score',
};

// GET, HIGH_SCORE
export const getHighScore = (): number => {
  try {
    const score = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return score ? parseInt(score, 10) : 0;
  } catch (e) {
    console.warn('LocalStorage access failed', e);
    return 0;
  }
};

// SET, HIGH_SCORE
export const setHighScore = (score: number): boolean => {
  try {
    const currentHigh = getHighScore();
    if (score > currentHigh) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
      return true;
    }
    return false;
  } catch (e) {
    console.warn('LocalStorage write failed', e);
    return false;
  }
};
