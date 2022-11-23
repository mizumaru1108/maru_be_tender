import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useEffect, useMemo } from 'react';
import { ForthFormData } from './form-data';

type FormDataProps = {
  detail_project_budgets: {
    clause: string;
    explanation: string;
    amount: number;
  }[];
};

function ForthFrom({ children, onSubmit, defaultValues }: any) {
  console.log(defaultValues);
  const validationSchema = Yup.object().shape({
    proposal_item_budgets: Yup.array().of(
      Yup.object().shape({
        clause: Yup.string().required(),
        explanation: Yup.string().required(),
        amount: Yup.number().integer().required(),
      })
    ),
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
        <FormGenerator data={ForthFormData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ForthFrom;
