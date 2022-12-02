import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const ApproveProposalFormFields = [
  {
    type: 'textArea',
    name: 'procedures',
    label: 'procedures',
    xs: 12,
    placeholder: 'procedures',
  },
  {
    type: 'textArea',
    name: 'supportOutputs',
    label: 'supportOutputs',
    xs: 12,
    placeholder: 'supportOutputs',
  },
] as Array<FormSingleProps>;

export const RejectProposalFormFields = [
  {
    type: 'textArea',
    name: 'notes',
    label: 'ملاحظات على المشروع',
    xs: 12,
    placeholder: 'الرجاء كتابة الملاحظات',
  },
] as Array<FormSingleProps>;
