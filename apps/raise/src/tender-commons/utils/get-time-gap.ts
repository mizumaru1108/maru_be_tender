export const getTimeGap = (
  start_time: string,
  end_time: string,
  interval: number,
): string[] => {
  const startTime = new Date(`1970-01-01 ${start_time}`);
  const endTime = new Date(`1970-01-01 ${end_time}`);
  const timeArray = [];

  while (startTime <= endTime) {
    const time = startTime
      .toLocaleTimeString('en-US', { hour12: true })
      // split the string to an array hh mm ss
      .split(':')
      // remove the seconds
      .slice(0, -1)
      // join the array back to a string hh mm
      .join(':');

    // get only the am pm
    const ampm = startTime
      .toLocaleTimeString('en-US', { hour12: true })
      .slice(-2);
    timeArray.push(`${time} ${ampm}`);
    startTime.setMinutes(startTime.getMinutes() + interval);
  }

  return timeArray;
};
