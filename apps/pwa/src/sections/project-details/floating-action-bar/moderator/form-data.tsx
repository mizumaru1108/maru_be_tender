import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const ApproveProposalFormFields = [
  {
    type: 'select',
    name: 'supervisors',
    label: 'supervisors',
    xs: 12,
    md: 6,
    placeholder: 'supervisors',
    children: (
      <>
        <option value="supervisor1" style={{ backgroundColor: '#fff' }}>
          supervisor1
        </option>
        <option value="supervisor2" style={{ backgroundColor: '#fff' }}>
          supervisor2
        </option>{' '}
        <option value="supervisor3" style={{ backgroundColor: '#fff' }}>
          supervisor3
        </option>
      </>
    ),
  },
  {
    type: 'select',
    name: 'path',
    label: 'path',
    xs: 12,
    md: 6,
    placeholder: 'path',
    children: (
      <>
        <option value="mosques" style={{ backgroundColor: '#fff' }}>
          mosques
        </option>
        <option value="concessionalGrants" style={{ backgroundColor: '#fff' }}>
          concessionalGrants
        </option>{' '}
        <option value="initiatives" style={{ backgroundColor: '#fff' }}>
          initiatives
        </option>
        <option value="baptisms" style={{ backgroundColor: '#fff' }}>
          baptisms
        </option>
      </>
    ),
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
