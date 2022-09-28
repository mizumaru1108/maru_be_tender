import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFSwitch } from '../../../components/hook-form';
import { Grid, Stack, Button, Typography, Divider } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApplicationAndAdmissionSettings } from './form-data';
import { useNavigate } from 'react-router';

type FormValuesProps = {
  applying_status: boolean;
  starting_date: string;
  ending_date: string;
  number_of_allowing_projects: number;
  hieght_project_budget: number;
  number_of_days_to_meet_business: number;
  Indicator_of_project_duration_days: string;
};

export default function ApplicationAndAdmissionSettingsForm() {
  const navigate = useNavigate();
  const ApplicationAndAdmissionSettingsSchema = Yup.object().shape({
    applying_status: Yup.boolean().required('Enterprise Name required'),
    starting_date: Yup.string().required('Enterprise Email is required'),
    ending_date: Yup.string().required('Telephone is required'),
    number_of_allowing_projects: Yup.number().required('Mobile Phone is required'),
    hieght_project_budget: Yup.number().required('Enterprise Logo is required'),
    number_of_days_to_meet_business: Yup.number().required('Enterprise Logo is required'),
    Indicator_of_project_duration_days: Yup.string().required('Enterprise Logo is required'),
  });
  const defaultValues = {
    applying_status: false,
    starting_date: '',
    ending_date: '',
    number_of_allowing_projects: undefined,
    hieght_project_budget: undefined,
    number_of_days_to_meet_business: undefined,
    Indicator_of_project_duration_days: '',
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
    navigate('/admin/dashboard/app');
  };
  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" sx={{ mb: '10px' }} gap={1}>
          <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>حالة التقديم</Typography>
          <Divider sx={{ flex: 2 }} />
        </Stack>
        <RHFSwitch name="applying_status" label="التقديم مفعل للمستخدمين" />
        <Stack direction="row" sx={{ mb: '30px' }} gap={1}>
          <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>بيانات العامة</Typography>
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
                >
                  رجوع
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
                  حفظ
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </div>
  );
}
