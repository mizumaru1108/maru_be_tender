import { FormSingleProps } from 'components/FormGenerator';
import useLocales from '../../../../hooks/useLocales';

/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const ApproveProposalFormFields = [
  {
    type: 'select',
    name: 'path',
    label: 'المسار',
    xs: 12,
    md: 6,
    placeholder: 'المسار',
    children: (
      <>
        <option value="مشروع يخص المساجد" style={{ backgroundColor: '#fff' }}>
          مشروع يخص المساجد
        </option>
        <option value="مشروع يخص المنح الميسر" style={{ backgroundColor: '#fff' }}>
          مشروع يخص المنح الميسر
        </option>
        <option value="مشروع يخص المبادرات" style={{ backgroundColor: '#fff' }}>
          مشروع يخص المبادرات
        </option>
        <option value="test" style={{ backgroundColor: '#fff' }}>
          مشروع يخص تعميدات
        </option>
      </>
    ),
  },
  {
    type: 'select',
    name: 'supervisors',
    label: 'المشرفين',
    xs: 12,
    md: 6,
    placeholder: 'المشرفين',
    children: (
      <>
        <option value="supervisor1" style={{ backgroundColor: '#fff' }}>
          المشرف 1
        </option>
        <option value="supervisor2" style={{ backgroundColor: '#fff' }}>
          المشرف 2
        </option>
        <option value="supervisor3" style={{ backgroundColor: '#fff' }}>
          المشرف 3
        </option>
      </>
    ),
  },
  {
    type: 'textArea',
    name: 'notes',
    label: 'الملاحظات',
    xs: 12,
    placeholder: 'الرجاء كتابة الملاحظات',
  },
] as Array<FormSingleProps>;

export const RejectProposalFormFields = [
  {
    type: 'textArea',
    name: 'notes',
    label: 'الملاحظات',
    xs: 12,
    placeholder: 'الملاحظات',
  },
] as Array<FormSingleProps>;
