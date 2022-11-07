import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ApproveProposalFormFieldsProjectManager } from './form-data';
import { ProposalApprovePayloadSupervisor, ProposalFormProps } from '../types';

interface ProposalApprovedProhectManager {
  notes: string;
}
function ProposalAcceptingForm({ children, onSubmit }: ProposalFormProps) {
  const validationSchema = Yup.object().shape({
    notes: Yup.string().required('Notes is required!'),
  });

  const defaultValues = {
    notes: '',
  };

  const methods = useForm<ProposalApprovedProhectManager>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: ProposalApprovedProhectManager) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={ApproveProposalFormFieldsProjectManager} />
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ProposalAcceptingForm;
