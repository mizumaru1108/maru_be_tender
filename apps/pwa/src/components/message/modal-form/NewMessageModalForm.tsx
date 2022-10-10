import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { NewMessageModalFormProps, NewMessageModalFormValues } from './types';

export default function NewMessageModalForm({ children, onSubmit }: NewMessageModalFormProps) {
  const validationSchema = Yup.object().shape({
    trackType: Yup.string().required('Procedures is required!'),
    employeeId: Yup.string().required('Support Output is required!'),
  });

  const defaultValues = {
    trackType: '',
    employeeId: '',
  };

  const methods = useForm<NewMessageModalFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: NewMessageModalFormValues) => {
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
