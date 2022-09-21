import * as Yup from 'yup';
import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ConnectingInfoData } from '../Forms-Data';
import FormGenerator from 'components/FormGenerator';
type FormValuesProps = {
  pm_name: string;
  pm_mobile: string;
  pm_email: string;
  region: string;
  governorate: string;
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
};

const ConnectingInfoForm = ({ onSubmit, children, defaultValues }: Props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const RegisterSchema = Yup.object().shape({
    pm_name: Yup.string().required('Project manager name is required'),
    pm_mobile: Yup.string().required('Mobile number is required'),
    pm_email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    region: Yup.string().required('Region is required'),
    governorate: Yup.string().required('City is required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={ConnectingInfoData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;
