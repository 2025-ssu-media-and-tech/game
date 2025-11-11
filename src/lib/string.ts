export const removeSlash = (string: string, substring?: number) => {
  let str: string = string.split('/').join('');

  if (!substring) {
    return str;
  }

  return str.substring(substring);
};
