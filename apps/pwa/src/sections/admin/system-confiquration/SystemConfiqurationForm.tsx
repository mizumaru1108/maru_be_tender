import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormProvider } from '../../../components/hook-form';
import { Grid, Stack, Button, Typography, Divider } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { yupResolver } from '@hookform/resolvers/yup';
import { SystemConfiqurationData } from './form-data';
import { useNavigate } from 'react-router';
import { FileProp } from 'components/upload';

type FormValuesProps = {
  enterprise_name: string;
  enterprise_email: string;
  telephone_fix: string;
  mobile_phone: string;
  enterprise_logo: FileProp;
};

export default function SystemConfiqurationForm() {
  const navigate = useNavigate();
  const SystemConfiqurationSchema = Yup.object().shape({
    enterprise_name: Yup.string().required('Enterprise Name required'),
    enterprise_email: Yup.string()
      .email('Email must be a valid email address')
      .required('Enterprise Email is required'),
    telephone_fix: Yup.string().required('Telephone is required'),
    mobile_phone: Yup.string().required('Mobile Phone is required'),
    enterprise_logo: Yup.string().required('Enterprise Logo is required'),
  });
  const defaultValues = {
    enterprise_name: '',
    enterprise_email: '',
    mobile_phone: '',
    bank_account_card_image: '',
    enterprise_logo: { url: '', size: undefined, type: 'image/jpeg' },
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(SystemConfiqurationSchema),
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
          <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>معلومات الجمعية</Typography>
          <Divider sx={{ flex: 2 }} />
        </Stack>
        <Grid container rowSpacing={5} columnSpacing={7}>
          <FormGenerator data={SystemConfiqurationData} />
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
