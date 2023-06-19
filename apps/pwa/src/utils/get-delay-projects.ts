import { formatDistance } from 'date-fns';

export const getDelayProjects = (getDate: any, currentLang: string) => {
  const ignoredUnits = ['second', 'seconds', 'minute', 'minutes', 'hour', 'hours'];
  const accepteddUnits = ['days', 'months', 'years'];
  const createdAt = new Date(getDate);
  const formatter = new Intl.RelativeTimeFormat(currentLang);
  const formattedCreatedAt = formatDistance(createdAt, new Date(), {
    addSuffix: true,
  });
  const [value, unit] = formattedCreatedAt.split(' ');
  const tmpValues = formattedCreatedAt.split(' ');
  const isIgnore = tmpValues.findIndex((v) => ignoredUnits.includes(v)) !== -1 ? true : false;
  if (isIgnore) {
    return null;
  }
  const accUnit = tmpValues.findIndex((v) => accepteddUnits.includes(v));
  const numberValue = tmpValues.find((element) => !isNaN(parseInt(element)));

  if (!numberValue) {
    return null;
  }

  const changeLangCreatedAt = formatter.format(
    -numberValue,
    tmpValues[accUnit] as Intl.RelativeTimeFormatUnit
  );
  const formattedCreatedAtLate = changeLangCreatedAt.replace(' ago', ' late');

  return formattedCreatedAtLate;
};
