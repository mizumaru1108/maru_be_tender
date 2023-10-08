export const stringTruncate = (words: string, length: number) => {
  if (words?.length > length) {
    return words.substring(0, length) + ' ...';
  }
  return words;
};

export const stringSplitUppercase = (words: string) => {
  const nameString = words;
  return nameString
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
