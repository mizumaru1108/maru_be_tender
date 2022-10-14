import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { BankingInfoData } from '../auth/register/RegisterFormData';
import { BankingValuesProps } from './types';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: BankingValuesProps;
};

const BankingInfoForm = ({ children, onSubmit, defaultValues }: FormProps) => {
  const RegisterSchema = Yup.object().shape({
    bank_account_number: Yup.string().required('Bank Account Number required'),
    bank_account_name: Yup.string().required('Bank Account name required'),
    bank_name: Yup.string().required('Bank Name is required'),
    card_image: Yup.mixed().required('Bank Account Card Image is required'),
  });

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
