import { FormSingleProps } from 'components/FormGenerator';

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
] as Array<FormSingleProps>;
