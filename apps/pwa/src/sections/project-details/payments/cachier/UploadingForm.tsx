import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { UploadReceiptFormFields } from './form-data';
import { ProposalApprovePayload, ProposalFormProps, UploadReceiptPayload } from './type';

function UploadingForm({ children, onSubmit }: ProposalFormProps) {
  const validationSchema = Yup.object().shape({
    transactionReceipt: Yup.string().required('Transaction Receipt is required!'),
    checkTransferNumber: Yup.string().required('Check Transfer Number is required!'),
  });

  const defaultValues = {
    transactionReceipt: undefined,
    depositDate: '',
    checkTransferNumber: '',
  };

  const methods = useForm<UploadReceiptPayload>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: UploadReceiptPayload) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={UploadReceiptFormFields} />
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default UploadingForm;
