import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { BankingInfoData } from '../auth/register/RegisterFormData';
import { BankingValuesProps, FormProps } from './types';

const BankingInfoForm = ({ children, onSubmit }: FormProps) => {
  const RegisterSchema = Yup.object().shape({
    bank_account_number: Yup.number().required('Bank Account Number required'),
    bank_account_name: Yup.string().required('Bank Account name required'),
    bank_name: Yup.string().required('Bank Name is required'),
    bank_account_card_image: Yup.mixed().required('Bank Account Card Image is required'),
  });

  const defaultValues = {
    bank_account_number: undefined,
    bank_account_name: '',
    bank_name: '',
    bank_account_card_image: undefined,
  };

  const methods = useForm<BankingValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: BankingValuesProps) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={BankingInfoData} />
        <Grid item md={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default BankingInfoForm;
