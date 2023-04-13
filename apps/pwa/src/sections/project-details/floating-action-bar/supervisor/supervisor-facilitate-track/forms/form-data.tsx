import { FormSingleProps } from 'components/FormGenerator';

export const SecondFormData = [
  {
    type: 'textField',
    label: 'اسم الجهة*',
    name: 'organizationName',
    placeholder: 'اسم الجهة*',
    disabled: true,
    md: 12,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'المنطقة *',
    name: 'region',
    placeholder: 'الرجاء اختيار المنطقة ',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'المحافظة *',
    name: 'governorate',
    placeholder: 'الرجاء اختيار المحافظة ',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'تأريخ تأسيس الجهة*',
    name: 'date_of_esthablistmen',
    placeholder: 'الرجاء تحديد تأريخ تأسيس الجهة',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'رئيس مجلس الإدارة*',
    name: 'chairman_of_board_of_directors',
    placeholder: 'الرجاء كتابة اسم رئيس مجلس الإدارة',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'المدير التنفيذي*',
    name: 'ceo',
    placeholder: 'الرجاء كتابة اسم المدير التنفيذي',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'radioGroup',
    label: 'هل دعمت سابقًا؟',
    name: 'been_supported_before',
    disabled: true,
    options: [
      { label: 'نعم', value: true },
      { label: 'لا', value: false },
    ],
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'most_clents_projects',
    label: 'أبرز أعمال الجهة*',
    placeholder: 'الرجاء كتابة أبرز أعمال الجهة',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'num_of_beneficiaries',
    label: 'العدد المستفيد من الجهة*',
    placeholder: 'الرجاء كتابة العدد المستفيد من الجهة',
    disabled: true,
    md: 6,
    xs: 12,
  },
] as Array<FormSingleProps>;
export const ThirdFormData = [
  {
    type: 'textField',
    label: 'اسم المشروع*',
    name: 'project_name',
    placeholder: 'الرجاء كتابة اسم المشروع',
    disabled: true,
    md: 12,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'فكرة المشروع*',
    name: 'project_idea',
    placeholder: 'الرجاء كتابة فكرة المشروع',
    disabled: true,
    md: 12,
    xs: 12,
  },
  {
    type: 'textArea',
    label: 'أهداف المشروع*',
    name: 'project_goals',
    placeholder: 'الرجاء كتابة أهداف المشروع ',
    disabled: true,
    md: 12,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'التكلفة الإجمالية*',
    name: 'amount_required_fsupport',
    placeholder: 'الرجاء كتابة التكلفة الإجمالية',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'القيمة المضافة على المشروع*',
    name: 'added_value',
    placeholder: 'الرجاء كتابة القيمة المضافة على المشروع',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'مسوغات دعم المشروع*',
    name: 'reasons_to_accept',
    placeholder: 'الرجاء كتابة مسوغات دعم المشروع',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    label: 'الفئة المستهدفة *',
    name: 'project_beneficiaries',
    placeholder: 'الرجاء اختيار الفئة المستهدفة',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'target_group_num',
    label: 'عددهم*',
    placeholder: 'الرجاء كتابة عددهم',
    md: 4,
    xs: 4,
  },
  // {
  //   type: 'textField',
  //   name: 'target_group_type',
  //   label: 'نوعهم *',
  //   placeholder: 'الرجاء اختيار نوعهم ',
  //   md: 4,
  //   xs: 4,
  // },
  {
    type: 'selectWithoutGenerator',
    name: 'target_group_type',
    label: 'نوعهم *',
    placeholder: 'الرجاء اختيار نوعهم ',
    md: 4,
    xs: 4,
    children: (
      <>
        <option value="MEN" style={{ backgroundColor: '#fff' }}>
          رجال
        </option>
        <option value="WOMEN" style={{ backgroundColor: '#fff' }}>
          نساء
        </option>
        <option value="GENERAL" style={{ backgroundColor: '#fff' }}>
          عام
        </option>
      </>
    ),
  },
  // {
  //   type: 'textField',
  //   name: 'target_group_age',
  //   label: 'أعمارهم*',
  //   placeholder: 'الرجاء كتابة أعمارهم',
  //   md: 4,
  //   xs: 4,
  // },
  {
    type: 'selectWithoutGenerator',
    name: 'target_group_age',
    label: 'أعمارهم*',
    placeholder: 'الرجاء كتابة أعمارهم',
    md: 4,
    xs: 4,
    children: (
      <>
        <option value="age_under_10th" style={{ backgroundColor: '#fff' }}>
          {'<10'}
        </option>
        <option value="age_10th_to_20th" style={{ backgroundColor: '#fff' }}>
          {'10-20'}
        </option>
        <option value="age_20th_to_40th" style={{ backgroundColor: '#fff' }}>
          {'20-40'}
        </option>
        <option value="age_over_40th" style={{ backgroundColor: '#fff' }}>
          {'40>'}
        </option>
      </>
    ),
  },
  {
    type: 'textField',
    name: 'project_implement_date',
    label: 'تاريخ بداية المشروع*',
    placeholder: 'الرجاء تحديد تاريخ بداية المشروع',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'execution_time',
    label: 'مدة المشروع*',
    placeholder: 'الرجاء كتابة مدة المشروع',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'project_location',
    label: 'مكان إقامته المشروع؟*',
    placeholder: 'الرجاء كتابة مكان إقامته المشروع؟',
    disabled: true,
    md: 6,
    xs: 12,
  },
  {
    type: 'radioGroup',
    name: 'been_made_before',
    label: 'هل سبق إقامة المشروع؟',
    options: [
      { label: 'نعم', value: true },
      { label: 'لا', value: false },
    ],
    md: 6,
    xs: 12,
  },
  {
    type: 'radioGroup',
    name: 'remote_or_insite',
    label: 'عن بُعد أو حضوري؟',
    options: [
      // { label: 'حضوري', value: false },
      // { label: 'اونلاين', value: true },
      // { label: 'كلاهما', value: true },
      { label: 'حضوري', value: 'remote' },
      { label: 'اونلاين', value: 'insite' },
      { label: 'كلاهما', value: 'both' },
    ],
    md: 6,
    xs: 12,
  },
] as Array<FormSingleProps>;
export const ForthFormData = [
  {
    type: 'repeater',
    name: 'proposal_item_budgets',
    repeaterFields: [
      {
        type: 'textField',
        name: 'clause',
        label: 'funding_project_request_form4.item.label',
        placeholder: 'funding_project_request_form4.item.placeholder',
        md: 3,
        xs: 12,
        disabled: true,
      },
      {
        type: 'textField',
        name: 'explanation',
        label: 'funding_project_request_form4.explanation.label',
        placeholder: 'funding_project_request_form4.explanation.placeholder',
        md: 5,
        xs: 12,
        disabled: true,
      },
      {
        type: 'textField',
        name: 'amount',
        label: 'funding_project_request_form4.amount.label',
        placeholder: 'funding_project_request_form4.amount.placeholder',
        md: 3,
        xs: 12,
        disabled: true,
      },
    ],
    // enableAddButton: true,
    // enableRemoveButton: true,
  },
] as Array<FormSingleProps>;
export const FifthFormData = [
  {
    type: 'repeater',
    name: 'recommended_support',
    repeaterFields: [
      {
        type: 'textField',
        name: 'clause',
        label: 'funding_project_request_form4.item.label',
        placeholder: 'funding_project_request_form4.item.placeholder',
        md: 3,
        xs: 12,
      },
      {
        type: 'textField',
        name: 'explanation',
        label: 'funding_project_request_form4.explanation.label',
        placeholder: 'funding_project_request_form4.explanation.placeholder',
        md: 5,
        xs: 12,
      },
      {
        type: 'textField',
        name: 'amount',
        label: 'funding_project_request_form4.amount.label',
        placeholder: 'funding_project_request_form4.amount.placeholder',
        md: 3,
        xs: 12,
      },
    ],
    enableAddButton: true,
    enableRemoveButton: true,
  },
] as Array<FormSingleProps>;
