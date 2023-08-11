import dayjs from 'dayjs';

interface HasExpiredProps {
  expiredTime: string;
  expiredDate: string;
}

interface IsActiveHoursProps {
  startTime: string;
}

interface IsActiveProps {
  expiredDate: string;
}

export function hasExpired({ expiredDate, expiredTime }: HasExpiredProps): boolean {
  const curTime = dayjs().format('YYYY-MM-DD hh:mm A');
  const tmpExpiredDate = dayjs(expiredDate).format('YYYY-MM-DD');
  const tmpExpiredTime = dayjs(`${expiredTime}`, 'hh:mm A').format('hh:mm A');

  const check = dayjs(`${tmpExpiredDate} ${tmpExpiredTime}`, 'YYYY-MM-DD hh:mm A').isBefore(
    dayjs(curTime, 'YYYY-MM-DD hh:mm A')
  )
    ? true
    : false;
  // console.log({ tmpExpiredDate, tmpExpiredTime, check });
  return check;
}

export function hasActive({ startTime }: IsActiveHoursProps): boolean {
  const curTime = dayjs(new Date()).format('hh:mm A');
  // const tmpExpiredDate = dayjs(expiredDate).format('YYYY-MM-DD');
  const tmpActiveTime = dayjs(`${startTime}`, 'hh:mm A').format('hh:mm A');

  const check = dayjs(`${tmpActiveTime}`, 'hh:mm A').isBefore(dayjs(curTime, 'hh:mm A'))
    ? true
    : false;
  // console.log({ check });
  return check;
}

export function isActiveToday({ expiredDate }: IsActiveProps): boolean {
  const curTime = dayjs().format('YYYY-MM-DD hh:mm A');
  // const today = dayjs().format('YYYY-MM-DD');
  const tmpExpiredDate = dayjs(expiredDate).format('YYYY-MM-DD');

  const checkIsToday = dayjs(`${tmpExpiredDate}`, 'YYYY-MM-DD').isSame(
    dayjs(curTime, 'YYYY-MM-DD')
  );
  // console.log({ checkIsToday });
  return checkIsToday;
}
