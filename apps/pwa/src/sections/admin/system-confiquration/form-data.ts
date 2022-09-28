import { FormSingleProps } from 'components/FormGenerator';

export const SystemConfiqurationData = [
  {
    type: 'textField',
    name: 'enterprise_name',
    label: 'system_configuration_form.enterprise_name.label',
    placeholder: 'system_configuration_form.enterprise_name.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'enterprise_email',
    label: 'system_configuration_form.enterprise_email.label',
    placeholder: 'system_configuration_form.enterprise_email.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'telephone_fix',
    label: 'system_configuration_form.telephone_fix.label',
    placeholder: 'system_configuration_form.telephone_fix.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'mobile_phone',
    label: 'system_configuration_form.mobile_phone.label',
    placeholder: 'system_configuration_form.mobile_phone.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'uploadLabel',
    label: 'system_configuration_form.enterprise_logo.label',
    md: 12,
    xs: 12,
  },
  {
    type: 'upload',
    name: 'enterprise_logo',
    placeholder: 'system_configuration_form.enterprise_logo.placeholder',
    md: 12,
    xs: 12,
  },
] as Array<FormSingleProps>;
