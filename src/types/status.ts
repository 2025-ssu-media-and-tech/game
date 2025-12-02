export const SCENES = ['INTRO', 'START', 'READY', 'GAME', 'SCORE', 'END', 'OUTRO'] as const;
export type SceneType = (typeof SCENES)[number];

// 현재로서는 각 씬의 이름만 구별할 수 있으면 될 것 같은데,
// 이후 추가적인 데이터는 아래에 추가해서 관리하면 될 것 같아요.
export type Scene = {
  name: SceneType;
  assetsPath: string;
};
