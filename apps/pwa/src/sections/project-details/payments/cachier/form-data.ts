import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const UploadReceiptFormFields = [
  {
    type: 'upload',
    name: 'transactionReceipt',
    label: 'transactionReceipt',
    xs: 12,
    placeholder: 'transactionReceipt',
  },
  {
    type: 'datePicker',
    name: 'depositDate',
    label: 'depositDate',
    md: 6,
    xs: 12,
    placeholder: 'depositeDate',
  },
  {
    type: 'textField',
    name: 'checkTransferNumber',
    label: 'check/transferNumber',
    md: 6,
    xs: 12,
    placeholder: 'check/transferNumber',
  },
] as Array<FormSingleProps>;
