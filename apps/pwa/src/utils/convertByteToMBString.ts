export const convertBytesToMB = (bytes: number): string => {
  const MB = 1024 * 1024;
  return Number(bytes / MB).toFixed(2) + 'MB';
};
