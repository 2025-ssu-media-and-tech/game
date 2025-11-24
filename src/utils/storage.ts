export const SESSION_KEYS = {
  ATTEMPT_COUNT: 'snake-game-attempt-count',
  SCORE_HISTORY: 'snake-game-score-history',
  HIGH_SCORE: 'snake-game-high-score',
};

export const getHighScore = (): number => {
  try {
    const score = sessionStorage.getItem(SESSION_KEYS.HIGH_SCORE);
    return score ? parseInt(score, 10) : 0;
  } catch (e) {
    console.warn('SessionStorage access failed', e);
    return 0;
  }
};

export const setHighScore = (score: number): boolean => {
  try {
    const currentHigh = getHighScore();
    if (score > currentHigh) {
      sessionStorage.setItem(SESSION_KEYS.HIGH_SCORE, score.toString());
      return true;
    }
    return false;
  } catch (e) {
    console.warn('SessionStorage write failed', e);
    return false;
  }
};

export const incrementAttemptCount = (): number => {
  try {
    const current = sessionStorage.getItem(SESSION_KEYS.ATTEMPT_COUNT);
    const count = current ? parseInt(current, 10) + 1 : 1;
    sessionStorage.setItem(SESSION_KEYS.ATTEMPT_COUNT, count.toString());
    return count;
  } catch (e) {
    console.warn('SessionStorage access failed', e);
    return 1;
  }
};

export const getAttemptCount = (): number => {
  try {
    const count = sessionStorage.getItem(SESSION_KEYS.ATTEMPT_COUNT);
    return count ? parseInt(count, 10) : 0;
  } catch (e) {
    console.warn('SessionStorage access failed', e);
    return 0;
  }
};

export const addScoreToHistory = (score: number): void => {
  try {
    const historyStr = sessionStorage.getItem(SESSION_KEYS.SCORE_HISTORY);
    const history: number[] = historyStr ? JSON.parse(historyStr) : [];
    history.push(score);
    sessionStorage.setItem(SESSION_KEYS.SCORE_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.warn('SessionStorage write failed', e);
  }
};

export const getScoreHistory = (): number[] => {
  try {
    const historyStr = sessionStorage.getItem(SESSION_KEYS.SCORE_HISTORY);
    return historyStr ? JSON.parse(historyStr) : [];
  } catch (e) {
    console.warn('SessionStorage access failed', e);
    return [];
  }
};
