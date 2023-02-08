export const portalReportConvertMinutesToHours = (
  baseMinutes: number,
): string => {
  let totalSeconds = Math.round(baseMinutes * 60);
  let hours = Math.floor(totalSeconds / 3600);
  let remainingSeconds = totalSeconds % 3600;
  let minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds = remainingSeconds % 60;
  return hours + 'h ' + minutes + 'm ' + remainingSeconds + 's';
};
