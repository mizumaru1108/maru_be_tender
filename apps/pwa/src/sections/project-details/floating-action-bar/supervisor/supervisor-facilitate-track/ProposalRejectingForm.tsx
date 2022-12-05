import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Stack } from '@mui/material';
import FormGenerator, { FormSingleProps } from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ProposalFormProps } from '../../types';

const RejectProposalFormFieldsSupervisor = [
  {
    type: 'textArea',
    name: 'notes',
    label: 'الملاحظات',
    xs: 12,
    placeholder: 'اكتب ملاحظاتك هنا',
  },
] as Array<FormSingleProps>;

type FormInput = {
  notes: string;
};
function ProposalRejectingForm({ children, onSubmit }: ProposalFormProps) {
  const validationSchema = Yup.object().shape({
    notes: Yup.string(),
  });

  const defaultValues = {
    notes: '',
  };

  const methods = useForm<FormInput>({
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
        <FormGenerator data={RejectProposalFormFieldsSupervisor} />
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          <Stack direction="row" justifyContent="space-around">
            <Button
              sx={{ backgroundColor: '#fff', color: '#000', ':hover': { backgroundColor: '#fff' } }}
            >
              إغلاق
            </Button>
            <Button>رفض</Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ProposalRejectingForm;
