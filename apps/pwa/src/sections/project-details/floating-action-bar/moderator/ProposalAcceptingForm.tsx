import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ApproveProposalFormFields } from './form-data';

import { ProposalFormProps, ProposalModeratorApprovePayload } from './types';

function ProposalAcceptingForm({ children, onSubmit }: ProposalFormProps) {
  const validationSchema = Yup.object().shape({
    path: Yup.string().required('Path is required!'),
    supervisors: Yup.string().required('Supervisors is required!'),
  });

  const defaultValues = {
    path: '',
    supervisors: '',
  };

  const methods = useForm<ProposalModeratorApprovePayload>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: ProposalModeratorApprovePayload) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={3} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={ApproveProposalFormFields} />
        <Grid item md={12} xs={12} sx={{ mb: 2 }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ProposalAcceptingForm;
