import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ApproveProposalFormFieldsSupervisor } from './form-data';
import { ProposalApprovePayloadSupervisor, ProposalFormProps } from '../types';

function ProposalAcceptingFormSupervisor({ children, onSubmit }: ProposalFormProps) {
  const validationSchema = Yup.object().shape({
    clause: Yup.string().required('Procedures is required!'),
    clasification_field: Yup.string().required('Procedures is required!'),
    support_type: Yup.boolean().required('Procedures is required!'),
    closing_report: Yup.boolean().required('Procedures is required!'),
    need_picture: Yup.boolean().required('Procedures is required!'),
    does_an_agreement: Yup.boolean().required('Procedures is required!'),
    support_amount: Yup.number().required('Procedures is required!'),
    number_of_payments: Yup.number().required('Procedures is required!'),
    procedures: Yup.string().required('Procedures is required!'),
    notes: Yup.string().required('Procedures is required!'),
    type_of_support: Yup.string().required('Procedures is required!'),
  });

  const defaultValues = {
    procedures: '',
    supportOutputs: '',
  };

  const methods = useForm<ProposalApprovePayloadSupervisor>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: ProposalApprovePayloadSupervisor) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={ApproveProposalFormFieldsSupervisor} />
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ProposalAcceptingFormSupervisor;
