import { FormSingleProps } from 'components/FormGenerator';

/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const ApproveProposalFormFieldsSupervisor = [
  {
    type: 'select',
    name: 'clause',
    label: 'البند حسب التصنيف*',
    md: 6,
    xs: 12,
    placeholder: 'الرجاء اختيار البند',
    children: (
      <>
        <option value="test" style={{ backgroundColor: '#fff' }}>
          مشروع يخص المساجد
        </option>
        <option value="test" style={{ backgroundColor: '#fff' }}>
          مشروع يخص المنح الميسر
        </option>
        <option value="test" style={{ backgroundColor: '#fff' }}>
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
    name: 'clasification_field',
    label: 'مجال التصنيف*',
    md: 6,
    xs: 12,
    placeholder: 'الرجاء اختيار مجال التصنيف',
    children: (
      <>
        <option value="test" style={{ backgroundColor: '#fff' }}>
          test
        </option>
        <option value="test" style={{ backgroundColor: '#fff' }}>
          test
        </option>
        <option value="test" style={{ backgroundColor: '#fff' }}>
          test
        </option>
        <option value="test" style={{ backgroundColor: '#fff' }}>
          test
        </option>
      </>
    ),
  },
  {
    type: 'radioGroup',
    name: 'support_type',
    label: 'نوع الدعم',
    md: 6,
    xs: 12,
    options: [
      { label: 'دعم جزئي', value: true },
      { label: 'دعم كلي', value: false },
    ],
  },
  {
    type: 'radioGroup',
    name: 'closing_report',
    label: 'تقرير الإغلاق',
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
    label: 'هل يحتاج إلى صور',
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
    label: 'هل يحتاج اتفاقية',
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
    label: 'مبلغ الدعم*',
    md: 6,
    xs: 12,
    placeholder: 'مبلغ الدعم',
  },
  {
    type: 'textField',
    name: 'number_of_payments',
    label: 'عدد الدفعات*',
    md: 6,
    xs: 12,
    placeholder: 'دفعة واحدة',
  },
  {
    type: 'textArea',
    name: 'procedures',
    label: 'الإجراءات*',
    xs: 12,
    placeholder: 'اكتب الاجراءات هنا',
  },
  {
    type: 'textArea',
    name: 'notes',
    label: 'ملاحظات على المشروع*',
    xs: 12,
    placeholder: 'اكتب ملاحظاتك هنا',
  },
  {
    type: 'textArea',
    name: 'support_outputs',
    label: 'مخرجات الدعم (لصالح)*',
    xs: 12,
    placeholder: 'اكتب هنا',
  },
] as Array<FormSingleProps>;

export const RejectProposalFormFieldsSupervisor = [
  {
    type: 'textArea',
    name: 'notes',
    label: 'الملاحظات',
    xs: 12,
    placeholder: 'اكتب ملاحظاتك هنا',
  },
] as Array<FormSingleProps>;
