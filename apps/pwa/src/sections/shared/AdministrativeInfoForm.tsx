import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { AdministrativeInfoData } from '../auth/register/RegisterFormData';
import { AdministrativeValuesProps, FormProps } from './types';

const AdministrativeInfoForm = ({ children, onSubmit }: FormProps) => {
  const RegisterSchema = Yup.object().shape({
    executive_director: Yup.string().required('Executive Director is required'),
    executive_director_mobile: Yup.string().required('Executive Director Mobile is required'),
    entery_data_name: Yup.string().required('Entery Data Name is required'),
    entery_data_phone: Yup.string().required('Entery Data Phone is required'),
    entery_data_email: Yup.string().required('Entery Data Email is required'),
    agree_on: Yup.boolean().required('Agreeing_On is required'),
  });

  const defaultValues = {
    executive_director: '',
    executive_director_mobile: '',
    entery_data_name: '',
    entery_data_phone: '',
    entery_data_email: '',
    agree_on: false,
  };

  const methods = useForm<AdministrativeValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: AdministrativeValuesProps) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={AdministrativeInfoData} />
        <Grid item md={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AdministrativeInfoForm;
