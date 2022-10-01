import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ApproveProposalFormFields } from './PassedFormFields';

import { ProposalApprovePayload, ProposalFormProps } from './types';

function ProposalAcceptingForm({ children, onSubmit }: ProposalFormProps) {
  const validationSchema = Yup.object().shape({
    procedures: Yup.string().required('Procedures is required!'),
    supportOutputs: Yup.string().required('Support Output is required!'),
  });

  const defaultValues = {
    procedures: '',
    supportOutputs: '',
  };

  const methods = useForm<ProposalApprovePayload>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: ProposalApprovePayload) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={ApproveProposalFormFields} />
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ProposalAcceptingForm;
