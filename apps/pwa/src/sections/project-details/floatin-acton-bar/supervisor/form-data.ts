import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const ApproveProposalFormFieldsSupervisor = [
  {
    type: 'select',
    name: 'clause',
    label: 'clause',
    md: 6,
    xs: 12,
    placeholder: 'clause',
  },
  {
    type: 'select',
    name: 'clasification_field',
    label: 'clasification_field',
    md: 6,
    xs: 12,
    placeholder: 'clasification_field',
  },
  {
    type: 'radioGroup',
    name: 'support_type',
    label: 'support_type',
    md: 6,
    xs: 12,
    options: [
      { label: 'دعم جزئي', value: true },
      { label: 'دعم جزئي', value: false },
    ],
  },
  {
    type: 'radioGroup',
    name: 'closing_report',
    label: 'closing_report',
    md: 6,
    xs: 12,
    options: [
      { label: 'نعم', value: true },
      { label: 'لا', value: false },
    ],
  },
  {
    type: 'radioGroup',
    name: 'need_picture',
    label: 'need_picture',
    md: 6,
    xs: 12,
    options: [
      { label: 'نعم', value: true },
      { label: 'لا', value: false },
    ],
  },
  {
    type: 'radioGroup',
    name: 'does_an_agreement',
    label: 'does_an_agreement',
    md: 6,
    xs: 12,
    options: [
      { label: 'نعم', value: true },
      { label: 'لا', value: false },
    ],
  },
  {
    type: 'textField',
    name: 'support_amount',
    label: 'support_amount',
    md: 6,
    xs: 12,
    placeholder: 'support_amount',
  },
  {
    type: 'textField',
    name: 'number_of_payments',
    label: 'number_of_payments',
    md: 6,
    xs: 12,
    placeholder: 'number_of_payments',
  },
  {
    type: 'textArea',
    name: 'procedures',
    label: 'procedures',
    xs: 12,
    placeholder: 'procedures',
  },
  {
    type: 'textArea',
    name: 'notes',
    label: 'notes',
    xs: 12,
    placeholder: 'notes',
  },
  {
    type: 'textArea',
    name: 'type_of_support',
    label: 'type_of_support',
    xs: 12,
    placeholder: 'type_of_support',
  },
] as Array<FormSingleProps>;

export const RejectProposalFormFieldsSupervisor = [
  {
    type: 'textArea',
    name: 'procedures',
    label: 'ملاحظات على المشروع*',
    xs: 12,
    placeholder: 'اكتب ملاحظاتك هنا',
  },
  {
    type: 'textArea',
    name: 'notes',
    label: 'الإجراءات*',
    xs: 12,
    placeholder: 'اكتب الاجراءات هنا',
  },
] as Array<FormSingleProps>;
