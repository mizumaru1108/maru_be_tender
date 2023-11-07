export function isDateAbove(dateOrigin: any, dateCompare: any, type: 'above' | 'same' | 'before') {
  const [originDay, originMonth, originYear] = dateOrigin.split('-');
  const [compareDay, compareMonth, compareYear] = dateCompare.split('-');

  const originDate = new Date(originYear, originMonth - 1, originDay);
  const compareDate = new Date(compareYear, compareMonth - 1, compareDay);
  // console.log({ originDate, compareDate });
  if (type === 'above') {
    return originDate > compareDate;
  }
  if (type === 'before') {
    return originDate < compareDate;
  }
  return originDate === compareDate;
}
