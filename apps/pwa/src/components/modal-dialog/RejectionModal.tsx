import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import useLocales from '../../hooks/useLocales';
import { FormProvider } from '../hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import BaseField from '../hook-form/BaseField';
import RHFTextArea from '../hook-form/RHFTextArea';

type Props = {
  open: boolean;
  handleClose: () => void;
  onReject: (data: any) => void;
  message: string;
};

type FormData = {
  reject_reason: string;
};

function RejectionModal({ open, handleClose, onReject, message }: Props) {
  const { translate } = useLocales();

  const validationSchema = Yup.object().shape({
    reject_reason: Yup.string().required(translate('reject_reason.moderator.required')),
  });

  const defaultValues = {
    reject_reason: '',
  };

  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;
  const onSubmitForm = async (data: any) => {
    onReject(data.reject_reason);
    handleClose();
    reset({
      reject_reason: '',
    });
  };

  const closeModal = () => {
    reset({
      reject_reason: '',
    });
    handleClose();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <ModalDialog
        maxWidth="md"
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {message}
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <RHFTextArea
                name="reject_reason"
                label={translate('appointment_table.form.reject_reason.title')}
                placeholder={translate('appointment_table.form.reject_reason.placeholder')}
              />
            </Grid>
          </Grid>
        }
        showCloseIcon={true}
        actionBtn={
          <Stack direction="row" justifyContent="space-around" gap={4}>
            <Button
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                ':hover': { backgroundColor: '#efefef' },
              }}
              onClick={() => {
                handleClose();
                reset({
                  reject_reason: '',
                });
              }}
            >
              {/* رجوع */}
              {translate('button.cancel')}
            </Button>
            <LoadingButton
              // loading={loading}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#FF170F',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: '#FF4842' },
              }}
            >
              {translate('reject')}
            </LoadingButton>
          </Stack>
        }
        isOpen={open}
        onClose={closeModal}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </FormProvider>
  );
}

export default RejectionModal;
