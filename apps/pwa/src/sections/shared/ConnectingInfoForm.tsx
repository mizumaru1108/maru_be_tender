import * as Yup from 'yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { ConnectingInfoData } from '../auth/register/RegisterFormData';
import { ConnectingValuesProps } from './types';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: ConnectingValuesProps;
};

const ConnectingInfoForm = ({ children, onSubmit, defaultValues }: FormProps) => {
  const RegisterSchema = Yup.object().shape({
    region: Yup.string().required('Region name required'),
    governorate: Yup.string().required('City name required'),
    center_administration: Yup.string().required('Center is required'),
    entity_mobile: Yup.string().required('Mobile Number is required'),
    phone: Yup.string().required('Phone Number required'),
    twitter_acount: Yup.string(),
    website: Yup.string(),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

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
