import { FormSingleProps } from 'components/FormGenerator';

export const MobileSettingsData = [
  {
    type: 'textField',
    name: 'api_key',
    label: '_mobile_settings.api_key.label',
    placeholder: '_mobile_settings.api_key.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'user_sender',
    label: '_mobile_settings.user_sender.label',
    placeholder: '_mobile_settings.user_sender.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'username',
    label: '_mobile_settings.username.label',
    placeholder: '_mobile_settings.username.placeholder',
    md: 12,
    xs: 12,
  },
] as Array<FormSingleProps>;
