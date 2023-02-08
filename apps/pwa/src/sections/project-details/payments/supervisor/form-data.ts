import { FormSingleProps } from 'components/FormGenerator';

export const PaymentsData = [
  {
    type: 'repeater',
    name: 'payments',

    repeaterFields: [
      {
        type: 'numberField',
        name: 'payment_amount',
        label: 'مبلغ الدفعة*',
        placeholder: 'مبلغ الدعم',
        md: 5,
        xs: 12,
      },
      {
        type: 'datePicker',
        name: 'payment_date',
        label: 'تاريخ الدفعة*',
        placeholder: 'الرجاء اختيار تاريخ الدفعة',
        md: 5,
        xs: 12,
      },
    ],
    enableAddButton: false,
    enableRemoveButton: false,
  },
] as Array<FormSingleProps>;
