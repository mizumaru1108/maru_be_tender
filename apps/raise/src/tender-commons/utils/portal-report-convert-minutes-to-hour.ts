export const portalReportConvertMinutesToHours = (
  baseMinutes: number,
): string => {
  const totalSeconds = Math.round(baseMinutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  let remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds = remainingSeconds % 60;
  return hours + 'h ' + minutes + 'm ' + remainingSeconds + 's';
};
