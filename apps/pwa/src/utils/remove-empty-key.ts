export const removeEmptyKey = (obj: any) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
};
