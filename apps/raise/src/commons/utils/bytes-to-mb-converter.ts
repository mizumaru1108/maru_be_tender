export const convertBytesToMB = (bytes: number): string => {
  return Number(bytes / (1024 * 1024)).toFixed(2) + 'MB';
};
