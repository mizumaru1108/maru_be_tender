import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { ConnectingInfoData } from '../auth/register/RegisterFormData';
import { ConnectingValuesProps, FormProps } from './types';

const ConnectingInfoForm = ({ children, onSubmit }: FormProps) => {
  const RegisterSchema = Yup.object().shape({
    region: Yup.string().required('Region name required'),
    city: Yup.string().required('City name required'),
    center: Yup.string().required('Center is required'),
    mobile_number: Yup.string().required('Mobile Number is required'),
    phone: Yup.string().required('Phone Number required'),
    twitter: Yup.string().required('Twitter Account is required'),
    website: Yup.string().required('The Website is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    region: '',
    city: '',
    phone: '',
    twitter: '',
    website: '',
    email: '',
    password: '',
  };

  const methods = useForm<ConnectingValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: ConnectingValuesProps) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={ConnectingInfoData} />
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;
