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

export function isDateBetween(dateToCheck: any, startDate: any, endDate: any) {
  const [checkDay, checkMonth, checkYear] = dateToCheck.split('-');
  const [startDay, startMonth, startYear] = startDate.split('-');
  const [endDay, endMonth, endYear] = endDate.split('-');

  const checkDate = new Date(checkYear, checkMonth - 1, checkDay);
  const startDateObj = new Date(startYear, startMonth - 1, startDay);
  const endDateObj = new Date(endYear, endMonth - 1, endDay);

  return checkDate >= startDateObj && checkDate <= endDateObj;
}
