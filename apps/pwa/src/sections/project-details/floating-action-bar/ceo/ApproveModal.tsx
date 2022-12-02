import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { RejectProposalFormFields } from './form-data';

type Props = {
  action: 'accept' | 'reject';
  isLoading?: boolean;
  onReturn?: () => void;
  onSubmited: (data: any) => void;
};

type InputForm = {
  notes: string;
};

const ApproveModal = ({ isLoading, onReturn, onSubmited }: Props) => {
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
    onSubmited(data);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={RejectProposalFormFields} />
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={() => {
                if (onReturn !== undefined) onReturn();
              }}
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                ':hover': { backgroundColor: '#efefef' },
              }}
            >
              إغلاق
            </Button>
            <LoadingButton
              loading={isLoading}
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                backgroundColor: 'background.paper',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: '#13B2A2' },
              }}
            >
              رفض
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ApproveModal;
