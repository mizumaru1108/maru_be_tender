export const formatGrantText = (text: string) => {
  const words = text.toLowerCase().split(/[_+-\s]/);
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
};
