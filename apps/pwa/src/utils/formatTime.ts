import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date: Date | string | number) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date: Date | string | number) {
  return format(new Date(date), 'dd MMM yyyy p');
}

export function fTimestamp(date: Date | string | number) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date: Date | string | number) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date: Date | string | number) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export function convertMinutestoHours(baseMinutes: number) {
  const totalSeconds = Math.round(baseMinutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  let remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds = remainingSeconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSeconds,
  };
  // return hours + 'h ' + minutes + 'm ' + remainingSeconds + 's';
}

export const getNewestDate = (date1: string, date2: string): string => {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);

  if (isNaN(date1Obj.getTime()) || isNaN(date2Obj.getTime())) {
    throw new Error('Invalid date format');
  }

  return date1Obj > date2Obj ? date1 : date2;
};
