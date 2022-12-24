export const generateRandomNumberString = (length: number): string => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateRandomString = (length: number): string => {
  return Array(length)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
};
