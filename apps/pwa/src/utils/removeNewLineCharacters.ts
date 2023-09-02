export const removeNewLineCharacters = (str: string) => {
  if (str) {
    const word = str.replace(/[\n\r]/g, '');
    return word;
  }
  return null;
};
