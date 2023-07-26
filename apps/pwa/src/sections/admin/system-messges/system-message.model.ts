import { CustomFile } from 'components/upload';

// export interface FormInputAdvertisingForm {
//   title: string;
//   content: string;
//   showTime: Date | string;
//   image: CustomFile | string | null;
// }
export interface FormInputAdvertisingForm {
  id?: string;
  title?: string;
  content?: string;
  showTime?: Date | string;
  track_id?: string;
  // image: CustomFile | string | null;
  image?: any;
  expired_date?: string;
  expired_time?: string;
  logo?: {
    size?: number;
    url?: string;
    type?: string;
  }[];
}
export enum TypeAdvertisingForm {
  internal = 'internal',
  external = 'external',
}
