import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { RejectProposalFormFields } from './form-data';

import { ProposalFormProps } from './types';

type InputForm = {
  notes: string;
};
function ProposalRejectingForm({ children, onSubmit }: ProposalFormProps) {
  const validationSchema = Yup.object().shape({
    notes: Yup.string(),
  });

  const defaultValues = {
    notes: '',
  };

  const methods = useForm<InputForm>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: any) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={RejectProposalFormFields} />
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ProposalRejectingForm;
