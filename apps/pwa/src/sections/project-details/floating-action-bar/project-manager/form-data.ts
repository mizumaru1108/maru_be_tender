import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */

export const ApproveProposalFormFieldsProjectManager = [
  {
    type: 'textArea',
    name: 'notes',
    label: 'الملاحظات',
    xs: 12,
    placeholder: 'اكتب الملاحظات هنا',
  },
] as Array<FormSingleProps>;

export const RejectProposalFormFieldsProjectManager = [
  {
    type: 'textArea',
    name: 'notes',
    label: 'ملاحظات على المشروع',
    xs: 12,
    placeholder: 'اكتب ملاحظاتك هنا',
  },
] as Array<FormSingleProps>;
