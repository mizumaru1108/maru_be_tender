import { FormSingleProps } from 'components/FormGenerator';

export const ApplicationAndAdmissionSettings = [
  {
    type: 'datePicker',
    name: 'starting_date',
    label: 'application_and_admission_settings_form.starting_date.label',
    placeholder: 'application_and_admission_settings_form.starting_date.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'datePicker',
    name: 'ending_date',
    label: 'application_and_admission_settings_form.ending_date.label',
    placeholder: 'application_and_admission_settings_form.ending_date.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'number_of_allowing_projects',
    label: 'application_and_admission_settings_form.number_of_allowing_projects.label',
    placeholder: 'application_and_admission_settings_form.number_of_allowing_projects.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'hieght_project_budget',
    label: 'application_and_admission_settings_form.hieght_project_budget.label',
    placeholder: 'application_and_admission_settings_form.hieght_project_budget.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'number_of_days_to_meet_business',
    label: 'application_and_admission_settings_form.number_of_days_to_meet_business.label',
    placeholder:
      'application_and_admission_settings_form.number_of_days_to_meet_business.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'Indicator_of_project_duration_days',
    label: 'application_and_admission_settings_form.Indicator_of_project_duration_days.label',
    placeholder:
      'application_and_admission_settings_form.Indicator_of_project_duration_days.placeholder',
    md: 6,
    xs: 12,
  },
] as Array<FormSingleProps>;
