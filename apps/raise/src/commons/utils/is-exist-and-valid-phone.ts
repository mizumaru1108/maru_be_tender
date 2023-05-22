export const isExistAndValidPhone = (phone: any) => {
  if (
    phone &&
    phone !== '' &&
    typeof phone === 'string' &&
    ['+966'].some((countryCode) => phone.startsWith(countryCode))
  ) {
    return phone;
  }
  return false;
};
