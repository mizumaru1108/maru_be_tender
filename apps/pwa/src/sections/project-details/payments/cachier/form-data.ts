import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const UploadReceiptFormFields = [
  {
    type: 'upload',
    name: 'transactionReceipt',
    label: 'إيصال التحويل*',
    xs: 12,
    placeholder: 'إيصال التحويل',
  },
  {
    type: 'textField',
    name: 'checkTransferNumber',
    label: 'رقم التحويل*',
    md: 6,
    xs: 12,
    placeholder: 'رقم الشيك/التحويل',
  },

  {
    type: 'datePicker',
    name: 'depositDate',
    label: 'تاريخ الإيداع*',
    md: 6,
    xs: 12,
    placeholder: 'الرجاء اختيار تاريخ الإيداع',
  },
] as Array<FormSingleProps>;
