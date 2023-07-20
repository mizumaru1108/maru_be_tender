import { CustomFile } from 'components/upload';

export interface FormInputAdvertisingForm {
  title: string;
  content: string;
  showTime: Date | string;
  image: CustomFile | string | null;
}
export enum TypeAdvertisingForm {
  internal = 'internal',
  external = 'external',
}
