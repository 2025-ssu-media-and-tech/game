export const ROOT_PATH = import.meta.env.BASE_URL;

export const getPath = (subPath: string) => {
  let tempSubPath: string = subPath;

  if (tempSubPath.startsWith('/')) {
    tempSubPath = tempSubPath.substring(1); // 맨 앞 '/' 제거
  }

  return `${ROOT_PATH}/${tempSubPath}`;
};
