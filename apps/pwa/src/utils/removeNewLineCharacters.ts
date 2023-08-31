export const removeNewLineCharacters = (str: string) => {
  const word = str.replace(/[\n\r]/g, '');
  return word;
};
