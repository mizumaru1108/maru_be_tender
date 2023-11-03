import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { AdmissionProps } from '../../../@types/commons';
import {
  FormProvider,
  RHFDatePicker,
  RHFSwitch,
  RHFTextField,
} from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
import { useSelector } from '../../../redux/store';

export default function ApplicationAndAdmissionSettingsForm() {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  const {
    application_admission_settings,
    isLoading: isFetchingData,
    error: errorFetchingData,
  } = useSelector((state) => state.applicationAndAdmissionSettings);

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
    number_of_allowing_projects: Yup.number()
      .required(
        translate(
          'application_and_admission_settings_form.errors.number_of_allowing_projects.required'
        )
      )
      .nullable(),
    hieght_project_budget: Yup.number()
      .required(
        translate('application_and_admission_settings_form.errors.hieght_project_budget.required')
      )
      .nullable(),
    number_of_days_to_meet_business: Yup.number()
      .required(
        translate(
          'application_and_admission_settings_form.errors.number_of_days_to_meet_business.required'
        )
      )
      .nullable(),
    indicator_of_project_duration_days: Yup.number()
      .required(
        translate(
          'application_and_admission_settings_form.errors.Indicator_of_project_duration_days.required'
        )
      )
      .nullable(),
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

  const methods = useForm<AdmissionProps>({
    resolver: yupResolver(ApplicationAndAdmissionSettingsSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const watchStartDate = watch('starting_date');

  const onSubmit = async (data: AdmissionProps) => {
    console.log({ data });
  };

  const onReturn = () => {
    navigate(-1);
  };

  // useEffect(() => {
  //   dispatch(getApplicationAdmissionSettings(activeRole!));
  // }, [activeRole]);

  // useEffect(() => {
  //   if (application_admission_settings && !isFetchingData && !errorFetchingData) {
  //     reset(application_admission_settings);
  //   }
  // }, [application_admission_settings, isFetchingData, errorFetchingData]);

  if (isFetchingData) {
    return <>{translate('pages.common.loading')}</>;
  }
  if (errorFetchingData) {
    return <>{translate('pages.common.error')}</>;
  }

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
          <Grid item md={6}>
            <RHFDatePicker
              name="starting_date"
              label={translate('application_and_admission_settings_form.starting_date.label')}
              data-cy="application_and_admission_settings_form.starting_date"
              placeholder={translate(
                'application_and_admission_settings_form.starting_date.placeholder'
              )}
            />
          </Grid>
          <Grid item md={6}>
            <RHFDatePicker
              disabled={watchStartDate === '' || watchStartDate === null}
              name="ending_date"
              label={translate('application_and_admission_settings_form.ending_date.label')}
              data-cy="application_and_admission_settings_form.ending_date"
              placeholder={translate(
                'application_and_admission_settings_form.ending_date.placeholder'
              )}
              minDate={
                watchStartDate
                  ? dayjs(watchStartDate).add(1, 'day').toISOString().split('T')[0]
                  : ''
              }
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              name={'number_of_allowing_projects'}
              label={translate(
                'application_and_admission_settings_form.number_of_allowing_projects.label'
              )}
              placeholder={translate(
                'application_and_admission_settings_form.number_of_allowing_projects.placeholder'
              )}
              type="number"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              name={'hieght_project_budget'}
              label={translate(
                'application_and_admission_settings_form.hieght_project_budget.label'
              )}
              placeholder={translate(
                'application_and_admission_settings_form.hieght_project_budget.placeholder'
              )}
              type="number"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              name={'number_of_days_to_meet_business'}
              label={translate(
                'application_and_admission_settings_form.number_of_days_to_meet_business.label'
              )}
              placeholder={translate(
                'application_and_admission_settings_form.number_of_days_to_meet_business.placeholder'
              )}
              type="number"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              name={'indicator_of_project_duration_days'}
              label={translate(
                'application_and_admission_settings_form.Indicator_of_project_duration_days.label'
              )}
              placeholder={translate(
                'application_and_admission_settings_form.Indicator_of_project_duration_days.placeholder'
              )}
              type="number"
            />
          </Grid>
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
