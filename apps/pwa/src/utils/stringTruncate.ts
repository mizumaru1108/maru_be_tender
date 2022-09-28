export const stringTruncate = (words: string, length: number) => {
  if (words.length > length) {
    return words.substring(0, length) + ' ...';
  }
  return words;
};
