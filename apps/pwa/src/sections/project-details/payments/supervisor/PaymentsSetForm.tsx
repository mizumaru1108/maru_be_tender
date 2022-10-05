import React from 'react';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaymentsData } from './form-data';
import FormGenerator from 'components/FormGenerator';

type FormValuesProps = {
  payments: {
    payment_amount: number;
    payment_date: string;
  }[];
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
};

// the payment setting page
function PaymentsSetForm({ onSubmit, children, defaultValues }: Props) {
  const PaymentsSchema = Yup.object().shape({
    payments: Yup.array().of(
      Yup.object().shape({
        payment_amount: Yup.number().required(),
        payment_date: Yup.string().required(),
      })
    ),
  });
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PaymentsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={2} sx={{ mt: '10px' }}>
        <Grid container item md={8} rowSpacing={4} columnSpacing={2}>
          <FormGenerator data={PaymentsData} />
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default PaymentsSetForm;
