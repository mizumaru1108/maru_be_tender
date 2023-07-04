export const isExistAndValidPhone = (phone: any) => {
  console.log(`validating ${phone}`);
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
