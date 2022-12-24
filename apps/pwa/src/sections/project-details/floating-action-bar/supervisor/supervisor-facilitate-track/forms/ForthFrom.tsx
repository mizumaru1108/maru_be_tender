import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useMemo } from 'react';
import { ForthFormData } from './form-data';
import { useSelector } from 'redux/store';
import { SupervisorStep4 } from '../../../../../../@types/supervisor-accepting-form';

function ForthFrom({ children, onSubmit }: any) {
  const { step4 } = useSelector((state) => state.supervisorAcceptingForm);

  const validationSchema = Yup.object().shape({
    proposal_item_budgets: Yup.array().of(
      Yup.object().shape({
        clause: Yup.string().required(),
        explanation: Yup.string().required(),
        amount: Yup.number().integer().required(),
      })
    ),
  });

  const methods = useForm<SupervisorStep4>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step4, [step4]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: SupervisorStep4) => {
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
