import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */

export const SearchProject = [
  {
    type: 'textField',
    name: 'project',
    label: 'اسم المشروع',
    xs: 12,
    md: 9,
    placeholder: 'اسم المشروع او رقم المشروع',
  },
] as Array<FormSingleProps>;

export const TheYear = [
  {
    type: 'datePicker',
    name: 'theYear',
    label: 'السنة',
    xs: 12,
    md: 6,
    placeholder: 'السنة',
  },
] as Array<FormSingleProps>;
export const DetailReport = [
  {
    type: 'radioGroup',
    name: 'detailReport',
    label: 'تفصيلي',
    xs: 12,
    md: 6,
    placeholder: 'تفصيلي',
    options: [
      {
        label: 'نعم',
        value: 'yes',
      },
      {
        label: 'لا',
        value: 'no',
      },
    ],
  },
] as Array<FormSingleProps>;

export const TheFieldSearch = [
  {
    type: 'select',
    name: 'theField',
    label: 'المجال',
    xs: 12,
    md: 6,
    placeholder: 'المجال',
    children: [
      <>
        <option value=" المجال 1" style={{ backgroundColor: '#fff' }}>
          المجال 1
        </option>
        <option value=" المجال 2" style={{ backgroundColor: '#fff' }}>
          المجال 2
        </option>
        <option value=" المجال 3" style={{ backgroundColor: '#fff' }}>
          المجال 3
        </option>
      </>,
    ],
  },
] as Array<FormSingleProps>;

export const GeoRange = [
  {
    type: 'select',
    name: 'geoRange',
    label: 'المنطقة الجغرافية',
    xs: 12,
    md: 6,
    placeholder: 'المنطقة الجغرافية',
    children: [
      <>
        <option value="المنطقة الجغرافية 1" style={{ backgroundColor: '#fff' }}>
          المنطقة الجغرافية 1
        </option>
        <option value="المنطقة الجغرافية 2" style={{ backgroundColor: '#fff' }}>
          المنطقة الجغرافية 2
        </option>
        <option value="المنطقة الجغرافية 3" style={{ backgroundColor: '#fff' }}>
          المنطقة الجغرافية 3
        </option>
      </>,
    ],
  },
] as Array<FormSingleProps>;
