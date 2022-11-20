import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useEffect, useMemo } from 'react';
import { FifthFormData } from './form-data';

type FormDataProps = {
  recommended_support: {
    clause: string;
    explanation: string;
    amount: number | undefined;
  }[];
  clause: string;
};

function FifthForm({ children, onSubmit, defaultValues }: any) {
  const validationSchema = Yup.object().shape({
    recommended_support: Yup.array().of(
      Yup.object().shape({
        clause: Yup.string().required(),
        explanation: Yup.string().required(),
        amount: Yup.number().integer().required(),
      })
    ),
    clause: Yup.string().required(),
  });

  const methods = useForm<FormDataProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const onSubmitForm = async (data: any) => {
    onSubmit(data);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={FifthFormData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default FifthForm;
