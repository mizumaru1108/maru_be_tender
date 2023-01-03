export const compareTime = (startTime: string, endTime: string) => {
  // validate the start_time and end_time if the start_time is greater than the end_time throw an error
  // the logic is the time format here is using HH:mm a (12-hour format) like 00:00 AM - 11:59 PM,
  // then the start_time should be less than the end_time
  const start = new Date(`1970-01-01 ${startTime}`);
  const end = new Date(`1970-01-01 ${endTime}`);
  if (start > end) {
    return false;
  }
  return true;
};
