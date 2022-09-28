import { FormSingleProps } from 'components/FormGenerator';

export const MobileSettingsData = [
  {
    type: 'textField',
    name: 'field1',
    label: 'mobile_settings_form.field1.label',
    placeholder: 'mobile_settings_form.field1.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'field2',
    label: 'mobile_settings_form.field2.label',
    placeholder: 'mobile_settings_form.field2.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'mobile_number',
    label: 'mobile_settings_form.mobile_number.label',
    placeholder: 'mobile_settings_form.mobile_number.placeholder',
    md: 12,
    xs: 12,
  },
] as Array<FormSingleProps>;
