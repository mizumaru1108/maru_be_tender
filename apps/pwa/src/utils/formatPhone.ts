export interface IFormatPhone {
  phone: string;
  prefix: string;
}
export default function formatPhone({ phone, prefix }: IFormatPhone) {
  const isPrefix = phone.startsWith(prefix) ? true : false;
  let tmpPhone = phone;
  if (isPrefix) {
    tmpPhone = phone.slice(prefix.length);
  } else {
    // tmpPhone = prefix.concat(phone);
    tmpPhone = `${prefix} ${phone}`;
  }
  // console.log({ tmpPhone, isPrefix, phone, prefix });
  return tmpPhone;
}
