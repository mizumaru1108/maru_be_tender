import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { LicenseInfoData } from '../auth/register/RegisterFormData';
import { LicenseValuesProps, FormProps } from './types';

const LicenseInfoForm = ({ children, onSubmit }: FormProps) => {
  const RegisterSchema = Yup.object().shape({
    license_number: Yup.string().required('License Number is required'),
    license_issue_date: Yup.string().required('License Issue Date is required'),
    license_expired: Yup.string().required('License Expiry Date is required'),
    license_file: Yup.mixed().required('License File is required'),
    board_ofdec_file: Yup.mixed().required('Resolution File is required'),
  });

  const defaultValues = {
    license_number: '',
    license_issue_date: '',
    license_expired: '',
    license_file: undefined,
    board_ofdec_file: undefined,
  };

  const methods = useForm<LicenseValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: LicenseValuesProps) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={LicenseInfoData} />
        <Grid item md={12} xs={12} sx={{ mb: '10px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default LicenseInfoForm;
