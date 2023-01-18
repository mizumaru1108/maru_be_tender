import { FormSingleProps } from 'components/FormGenerator';

export const REGIONS = [
  'منطقة الرياض',
  'منطقة مكة المكرمة',
  'منطقة المدينة المنورة',
  'منطقة القصيم',
  'المنطقة الشرقية',
  'منطقة عسير',
  'منطقة تبوك',
  'منطقة حائل',
  'منطقة الحدود الشمالية',
  'منطقة جازان',
  'منطقة نجران',
  'منطقة الباحة',
  'منطقة الجوف',
];

export const GOVERNORATES = [
  'الرياض',
  'الدرعية',
  'الخرج',
  'الدوادمي',
  'المجمعة',
  'القويعية',
  'الأفلاج',
  'وادي الدواسر',
  'الزلفي',
  'شقراء',
  'حوطة بني تميم',
  'عفيف',
  'الغاط',
  'السليل',
  'ضرما',
  'المزاحمية',
  'رماح',
  'ثادق',
  'حريملاء',
  'الحريق',
  'مرات',
  'الرين',
  'الدلم',
  'مكة المكرمة',
  'جدة',
  'الطائف',
  'القنفذة',
  'الليث',
  'رابغ',
  'خليص',
  'الخرمة',
  'رنية',
  'تربة',
  'الجموم',
  'الكامل',
  'المويه',
  'ميسان',
  'أضم',
  'العرضيات',
  'بحرة',
  'المدينة المنورة',
  'ينبع',
  'العلا',
  'المهد',
  'الحناكية',
  'بدر',
  'خيبر',
  'العيص',
  'وادي الفرع',
];

export const LIST_OF_BANK = [
  'البنك الأهلي السعودي',
  'بنك الجزيرة',
  'بنك ساب',
  'البنك السعودي الفرنسي',
  'البنك العربي الوطني',
  'البنك السعودي للاستثمار',
  'بنك الرياض',
  'مصرف الإنماء',
  'مصرف الراجحي',
  'بنك البلاد',
];

/**
 * The form which has conditions inside, I write it in the dummy way
 */

export const AdministrativeInfoData = [
  {
    type: 'textField',
    name: 'ceo_name',
    label: 'register_form4.executive_director.label',
    md: 6,
    xs: 12,
    placeholder: 'register_form4.executive_director.placeholder',
  },
  {
    type: 'textField',
    name: 'ceo_mobile',
    label: 'register_form4.executive_director_mobile.label',
    xs: 12,
    md: 6,
    // placeholder: 'register_form4.executive_director_mobile.placeholder',
    placeholder: 'xxx-xxx-xxx',
  },
  {
    type: 'textField',
    name: 'chairman_name',
    label: 'register_form4.chairman_name.label',
    md: 6,
    xs: 12,
    placeholder: 'register_form4.chairman_name.placeholder',
  },
  {
    type: 'textField',
    name: 'chairman_mobile',
    label: 'register_form4.chairman_mobile.label',
    xs: 12,
    md: 6,
    // placeholder: 'register_form4.executive_director_mobile.placeholder',
    placeholder: 'xxx-xxx-xxx',
  },
  {
    type: 'textField',
    name: 'data_entry_name',
    label: 'register_form4.entery_data_name.label',
    xs: 12,
    md: 6,
    placeholder: 'register_form4.entery_data_name.placeholder',
  },
  {
    type: 'textField',
    name: 'data_entry_mobile',
    label: 'register_form4.entery_data_phone.label',
    xs: 12,
    md: 6,
    // placeholder: 'register_form4.entery_data_phone.placeholder',
    placeholder: 'xxx-xxx-xxx',
  },
  {
    type: 'textField',
    name: 'data_entry_mail',
    label: 'register_form4.entery_data_email.label',
    xs: 12,
    placeholder: 'register_form4.entery_data_email.placeholder',
  },
  {
    type: 'checkbox',
    name: 'agree_on',
    label: 'register_form4.agree_on',
    xs: 12,
  },
] as Array<FormSingleProps>;

export const BankingInfoData = [
  {
    type: 'textField',
    name: 'bank_account_number',
    label: 'register_form5.bank_account_number.label',
    md: 6,
    xs: 12,
    placeholder: 'register_form5.bank_account_number.placeholder',
  },
  {
    type: 'textField',
    name: 'bank_account_name',
    label: 'register_form5.bank_account_name.label',
    xs: 12,
    md: 6,
    placeholder: 'register_form5.bank_account_name.placeholder',
  },
  {
    type: 'select',
    name: 'bank_name',
    label: 'register_form5.bank_name.label',
    xs: 12,
    placeholder: 'register_form5.bank_name.placeholder',
  },
  {
    type: 'uploadLabel',
    name: '',
    label: 'register_form5.bank_account_card_image.label',
    xs: 12,
  },
  {
    type: 'upload',
    name: 'card_image',
    label: 'register_form5.entery_data_phone.label',
    xs: 12,
    placeholder: 'register_form5.bank_account_card_image.placeholder',
  },
] as Array<FormSingleProps>;
