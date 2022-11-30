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
  onSubmited: () => void;
};

type InputForm = {
  notes: string;
};

const ApproveModal = ({ action, isLoading, onReturn, onSubmited }: Props) => {
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
    onSubmited();
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
              }}
            >
              إغلاق
            </Button>
            <LoadingButton
              loading={isLoading}
              loadingIndicator={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} thickness={4} />
                  <Typography sx={{ color: 'white', fontSize: '1em', ml: 1 }}>Saving...</Typography>
                </Box>
              }
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: action === 'accept' ? 'background.paper' : '#FF0000',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                // when button is disabled, reduce opacity to 0.5
                '&.Mui-disabled': {
                  backgroundColor: action === 'accept' ? 'background.paper' : '#FF0000',
                  color: '#fff',
                  opacity: 0.48,
                },
                '&:hover': { backgroundColor: action === 'reject' ? '#FF170' : '#13B2A2' },
              }}
              disabled={isLoading}
              onClick={() => {
                onSubmited();
              }}
            >
              {isLoading && <CircularProgress size={23} sx={{ color: 'white' }} thickness={10} />}
              {action === 'accept' ? 'قبول' : 'رفض'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ApproveModal;
