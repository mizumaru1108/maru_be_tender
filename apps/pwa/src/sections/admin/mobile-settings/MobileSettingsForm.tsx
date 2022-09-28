import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider } from '../../../components/hook-form';
import { Grid, Stack, Button, Typography, Divider } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { yupResolver } from '@hookform/resolvers/yup';
import { MobileSettingsData } from './form-data';
import { useNavigate } from 'react-router';

type FormValuesProps = {
  field1: string;
  field2: string;
  mobile_number: string;
};

export default function MobileSettingsForm() {
  const navigate = useNavigate();
  const MobileSettingsSchema = Yup.object().shape({
    field1: Yup.string().required('Enterprise Name required'),
    field2: Yup.string().required('Enterprise Email is required'),
    mobile_number: Yup.string().required('Telephone is required'),
  });
  const defaultValues = {
    field1: '',
    field2: '',
    mobile_number: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(MobileSettingsSchema),
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
        <Stack direction="row" sx={{ mb: '30px' }} gap={1}>
          <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>بيانات العامة</Typography>
          <Divider sx={{ flex: 2 }} />
        </Stack>
        <Grid container rowSpacing={5} columnSpacing={7}>
          <FormGenerator data={MobileSettingsData} />
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
