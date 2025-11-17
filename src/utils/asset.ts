import { getPath } from './path';

export const ASSETS_BASE_PATH = getPath('src/assets');

export const getAssetPath = (subPath: string) => {
  return getPath(`${ASSETS_BASE_PATH}/${subPath}`);
};
