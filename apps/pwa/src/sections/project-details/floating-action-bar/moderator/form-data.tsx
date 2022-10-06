import { FormSingleProps } from 'components/FormGenerator';
import useLocales from '../../../../hooks/useLocales';

/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const ApproveProposalFormFields = [
  {
    type: 'select',
    name: 'المشرفين',
    label: 'المشرفين',
    xs: 12,
    md: 6,
    placeholder: 'المشرفين',
    children: (
      <>
        <option value="supervisor1" style={{ backgroundColor: '#fff' }}>
          supervisors1
        </option>
        <option value="supervisor2" style={{ backgroundColor: '#fff' }}>
          supervisor2
        </option>{' '}
        <option value="supervisor3" style={{ backgroundColor: '#fff' }}>
          supervisors3
        </option>
      </>
    ),
  },
  {
    type: 'select',
    name: 'المسار',
    label: 'المسار',
    xs: 12,
    md: 6,
    placeholder: 'المسار',
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
    name: 'الإجراءات',
    label: 'الإجراءات',
    xs: 12,
    placeholder: 'الإجراءات',
  },
  {
    type: 'textArea',
    name: 'المخرجات الداعمة',
    label: 'المخرجات الداعمة',
    xs: 12,
    placeholder: 'المخرجات الداعمة',
  },
] as Array<FormSingleProps>;

export const RejectProposalFormFields = [
  {
    type: 'textField',
    name: 'الإجراءات',
    label: 'الإجراءات',
    xs: 12,
    placeholder: 'الإجراءات',
  },
] as Array<FormSingleProps>;
