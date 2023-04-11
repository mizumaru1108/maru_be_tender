export const logUtil = (payload: any): string => {
  const tmpPayload = payload;
  return JSON.stringify(JSON.parse(JSON.stringify(tmpPayload)), null, '\t');
};
