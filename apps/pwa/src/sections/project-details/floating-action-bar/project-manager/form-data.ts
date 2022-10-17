import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */

export const ApproveProposalFormFieldsProjectManager = [
  {
    type: 'textArea',
    name: 'procedures',
    label: 'procedures',
    xs: 12,
    placeholder: 'اكتب الاجراءات هنا',
  },
  // {
  //   type: 'textArea',
  //   name: 'notes',
  //   label: 'notes',
  //   xs: 12,
  //   placeholder: 'notes',
  // },
] as Array<FormSingleProps>;

export const RejectProposalFormFieldsProjectManager = [
  {
    type: 'textArea',
    name: 'notes',
    label: 'ملاحظات على المشروع*',
    xs: 12,
    placeholder: 'اكتب ملاحظاتك هنا',
  },
  {
    type: 'textArea',
    name: 'procedures',
    label: 'ملاحظات على المشروع*',
    xs: 12,
    placeholder: 'اكتب ملاحظاتك هنا',
  },
] as Array<FormSingleProps>;
