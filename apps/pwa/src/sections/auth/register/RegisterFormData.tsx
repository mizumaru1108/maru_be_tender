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
/**
 * The form which has conditions inside, I write it in the dummy way
 */
export const ConnectingInfoData = [
  {
    type: 'select',
    name: 'region',
    label: 'register_form2.region.label',
    xs: 12,
    md: 6,
    placeholder: 'register_form2.region.placeholder',
    children: (
      <>
        {REGIONS.map((item, index) => (
          <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
            {item}
          </option>
        ))}
      </>
    ),
  },
  {
    type: 'select',
    name: 'governorate',
    label: 'register_form2.city.label',
    xs: 12,
    md: 6,
    placeholder: 'register_form2.region.placeholder',
    children: (
      <>
        {GOVERNORATES.map((item, index) => (
          <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
            {item}
          </option>
        ))}
      </>
    ),
  },
  {
    type: 'select',
    name: 'center_administration',
    label: 'register_form2.center.label',
    xs: 12,
    md: 6,
    placeholder: 'register_form2.region.placeholder',
    children: (
      <option value="1" style={{ backgroundColor: '#fff' }}>
        test option
      </option>
    ),
  },
  {
    type: 'textField',
    name: 'entity_mobile',
    label: 'register_form2.mobile_number.label',
    placeholder: 'register_form2.mobile_number.placeholder',
    xs: 12,
    md: 6,
  },
  {
    type: 'textField',
    name: 'phone',
    label: 'register_form2.phone.label',
    placeholder: 'register_form2.phone.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'twitter_acount',
    label: 'register_form2.twitter.label',
    placeholder: 'register_form2.twitter.placeholder',
    xs: 12,
    md: 6,
  },
  {
    type: 'textField',
    name: 'website',
    label: 'register_form2.website.label',
    placeholder: 'register_form2.website.placeholder',
    xs: 12,
  },
  {
    type: 'textField',
    name: 'email',
    label: 'register_form2.email.label',
    placeholder: 'register_form2.email.placeholder',
    xs: 12,
  },
  {
    type: 'password',
    name: 'password',
    label: 'register_form2.password.label',
    placeholder: 'register_form2.password.placeholder',
    xs: 12,
  },
] as Array<FormSingleProps>;
export const LicenseInfoData = [
  {
    type: 'textField',
    name: 'license_number',
    label: 'register_form3.license_number.label',
    xs: 12,
    placeholder: 'register_form3.license_number.placeholder',
  },
  {
    type: 'datePicker',
    name: 'license_issue_date',
    label: 'register_form3.license_issue_date.label',
    xs: 12,
    md: 6,
    placeholder: 'register_form3.license_issue_date.placeholder',
  },
  {
    type: 'datePicker',
    name: 'license_expired',
    label: 'register_form3.license_expiry_date.label',
    xs: 12,
    md: 6,
    placeholder: 'register_form3.license_expiry_date.placeholder',
  },
  {
    type: 'uploadLabel',
    label: 'register_form3.license_file.label',
    xs: 12,
  },
  {
    type: 'upload',
    name: 'license_file',
    placeholder: 'register_form3.license_file.placeholder',
    xs: 12,
  },
  {
    type: 'uploadLabel',
    name: '',
    label: 'register_form3.resolution_file.label',
    xs: 12,
  },
  {
    type: 'upload',
    name: 'board_ofdec_file',
    placeholder: 'register_form3.resolution_file.placeholder',
    xs: 12,
  },
] as Array<FormSingleProps>;
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
    placeholder: 'register_form4.executive_director_mobile.placeholder',
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
    placeholder: 'register_form4.entery_data_phone.placeholder',
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
    type: 'textField',
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
