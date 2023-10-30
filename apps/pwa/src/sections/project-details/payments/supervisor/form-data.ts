import { FormSingleProps } from 'components/FormGenerator';

export const PaymentsData = [
  {
    type: 'repeater',
    name: 'payments',

    repeaterFields: [
      {
        type: 'datePicker',
        name: 'payment_date',
        label: 'تاريخ الدفعة*',
        placeholder: 'الرجاء اختيار تاريخ الدفعة',
        md: 4,
        xs: 12,
      },
      {
        type: 'numberField',
        name: 'payment_amount',
        label: 'مبلغ الدفعة*',
        placeholder: 'مبلغ الدعم',
        md: 4,
        xs: 12,
      },
      {
        type: 'textField',
        name: 'payment_reason',
        label: ' مبرر الصرف',
        placeholder: 'يرجى مشاركة السبب الخاص بك',
        md: 4,
        xs: 12,
      },
    ],
    enableAddButton: false,
    enableRemoveButton: false,
  },
] as Array<FormSingleProps>;
