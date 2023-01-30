export const logUtil = (payload: any): string => {
  return JSON.stringify(JSON.parse(JSON.stringify(payload)), null, '\t');
};
