export const removePrefix = (phoneNumber: string): string => {
  const prefix = '+966';
  if (phoneNumber.startsWith(prefix)) {
    phoneNumber = phoneNumber.replace('+', '');
  }
  return phoneNumber;
};
