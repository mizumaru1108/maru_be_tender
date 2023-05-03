import { formatDistance } from 'date-fns';

export const getDelayProjects = (getDate: any, currentLang: string) => {
  const ignoredUnits = ['second', 'seconds', 'minute', 'minutes', 'hour', 'hours'];
  const createdAt = new Date(getDate);
  const formatter = new Intl.RelativeTimeFormat(currentLang);
  const formattedCreatedAt = formatDistance(createdAt, new Date(), {
    addSuffix: true,
  });

  const [value, unit] = formattedCreatedAt.split(' ');

  if (ignoredUnits.includes(unit)) {
    return null;
  }

  const parsedValue = parseInt(value);

  if (isNaN(parsedValue)) {
    return null;
  }

  const changeLangCreatedAt = formatter.format(-parsedValue, unit as Intl.RelativeTimeFormatUnit);
  const formattedCreatedAtLate = changeLangCreatedAt.replace(' ago', ' late');

  return formattedCreatedAtLate;
};
