import slugify from 'slugify';

export const sanitizeString = (str: string): string => {
  return slugify(str, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });
};
