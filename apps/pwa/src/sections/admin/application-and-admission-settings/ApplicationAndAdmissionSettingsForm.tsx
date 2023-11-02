import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { FormProvider, RHFSwitch } from '../../../components/hook-form';
import useLocales from '../../../hooks/useLocales';
import { ApplicationAndAdmissionSettings } from './form-data';

type FormValuesProps = {
  applying_status: boolean;
  starting_date: string;
  ending_date: string;
  number_of_allowing_projects: number;
  hieght_project_budget: number;
  number_of_days_to_meet_business: number;
  indicator_of_project_duration_days: number;
};

export default function ApplicationAndAdmissionSettingsForm() {
  const navigate = useNavigate();
  const { translate } = useLocales();

  const ApplicationAndAdmissionSettingsSchema = Yup.object().shape({
    // applying_status: Yup.boolean().required(
    //   translate('application_and_admission_settings_form.errors.applying_status.required')
    // ),
    starting_date: Yup.string().required(
      translate('application_and_admission_settings_form.errors.starting_date.required')
    ),
    ending_date: Yup.string().required(
      translate('application_and_admission_settings_form.errors.ending_date.required')
    ),
    number_of_allowing_projects: Yup.number().required(
      translate(
        'application_and_admission_settings_form.errors.number_of_allowing_projects.required'
      )
    ),
    hieght_project_budget: Yup.number().required(
      translate('application_and_admission_settings_form.errors.hieght_project_budget.required')
    ),
    number_of_days_to_meet_business: Yup.number().required(
      translate(
        'application_and_admission_settings_form.errors.number_of_days_to_meet_business.required'
      )
    ),
    indicator_of_project_duration_days: Yup.number().required(
      translate(
        'application_and_admission_settings_form.errors.Indicator_of_project_duration_days.required'
      )
    ),
  });
  const defaultValues = {
    applying_status: false,
    starting_date: '',
    ending_date: '',
    number_of_allowing_projects: undefined,
    hieght_project_budget: undefined,
    number_of_days_to_meet_business: undefined,
    indicator_of_project_duration_days: undefined,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ApplicationAndAdmissionSettingsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    console.log({ data });
    // navigate('/admin/dashboard/app');
  };

  const onReturn = () => {
    navigate(-1);
  };

  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" sx={{ mb: '10px' }} gap={1}>
          <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
            {translate('application_and_admission_settings_form.divider.presentation_status')}
          </Typography>
          <Divider sx={{ flex: 2 }} />
        </Stack>
        <RHFSwitch
          name="applying_status"
          label={translate('application_and_admission_settings_form.applying_status.label')}
        />
        <Stack direction="row" sx={{ mb: '30px' }} gap={1}>
          <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
            {translate('application_and_admission_settings_form.divider.public_data')}
          </Typography>
          <Divider sx={{ flex: 2 }} />
        </Stack>
        <Grid container rowSpacing={5} columnSpacing={7}>
          <FormGenerator data={ApplicationAndAdmissionSettings} />
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              <Stack justifyContent="center" direction="row" gap={3}>
                <Button
                  sx={{
                    color: 'text.primary',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                  }}
                  onClick={onReturn}
                >
                  {/* رجوع */}
                  {translate('button.back')}
                </Button>
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{
                    backgroundColor: 'background.paper',
                    color: '#fff',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                  }}
                >
                  {/* حفظ */}
                  {translate('button.save')}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </div>
  );
}
