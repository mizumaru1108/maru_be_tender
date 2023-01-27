export const isExistAndValidPhone = (phone: any) => {
  if (
    phone &&
    phone !== '' &&
    typeof phone === 'string' &&
    ['+62', '+966'].some((countryCode) => phone.startsWith(countryCode))
  ) {
    return phone;
  }
  return false;
};
