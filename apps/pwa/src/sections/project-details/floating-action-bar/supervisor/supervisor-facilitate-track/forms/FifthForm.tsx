import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useMemo } from 'react';
import { FifthFormData } from './form-data';
import { SupervisorStep5 } from '../../../../../../@types/supervisor-accepting-form';
import { useSelector } from 'redux/store';

function FifthForm({ children, onSubmit }: any) {
  const { step5 } = useSelector((state) => state.supervisorAcceptingForm);

  const validationSchema = Yup.object().shape({
    recommended_support: Yup.array().of(
      Yup.object().shape({
        clause: Yup.string().required(),
        explanation: Yup.string().required(),
        amount: Yup.number().integer().required(),
      })
    ),
  });

  const methods = useForm<SupervisorStep5>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step5, [step5]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: SupervisorStep5) => {
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
