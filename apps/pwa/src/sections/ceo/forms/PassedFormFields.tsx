import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const ApproveProposalFormFields = [
  {
    type: 'textField',
    name: 'procedures',
    label: 'procedures',
    xs: 12,
    placeholder: 'procedures',
  },
  {
    type: 'textField',
    name: 'supportOutputs',
    label: 'supportOutputs',
    xs: 12,
    placeholder: 'supportOutputs',
  },
] as Array<FormSingleProps>;

export const RejectProposalFormFields = [
  {
    type: 'textField',
    name: 'procedures',
    label: 'procedures',
    xs: 12,
    placeholder: 'procedures',
  },
] as Array<FormSingleProps>;
