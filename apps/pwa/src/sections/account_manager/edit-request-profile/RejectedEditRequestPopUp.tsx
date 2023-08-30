import { Button, Stack, Typography, Grid } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import useAuth from 'hooks/useAuth';
import { useNavigate, useParams } from 'react-router';
import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import { LoadingButton } from '@mui/lab';
import { addFollowups } from 'redux/slices/proposal';
import { useDispatch } from 'redux/store';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../utils/axios';
import useLocales from 'hooks/useLocales';

type Props = {
  open: boolean;
  handleClose: () => void;
  requestId: string;
};

type FormData = {
  reject_reason: string;
};

function RejectedEditRequestPopUp({ open, handleClose, requestId }: Props) {
  const { user, activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { translate } = useLocales();

  const validationSchema = Yup.object().shape({
    reject_reason: Yup.string().required(translate('errors.notes')),
  });

  const defaultValues = {
    reject_reason: '',
  };

  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    // reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    const payload = {
      requestId,
      reject_reason: data.reject_reason,
    };
    console.log({ payload });
    try {
      const rest = await axiosInstance.patch(
        'tender/client/reject-edit-requests',
        {
          ...payload,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      // console.log({ rest });
      if (rest) {
        // mutate();
        enqueueSnackbar(translate('snackbar.account_manager.edit_request.rejected'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        navigate('/accounts-manager/dashboard/info/update-request');
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(`${statusCode < 500 && message ? message : 'something went wrong!'}`, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
      // console.log(err);
    }
    console.log({ data });
  };
  return (
    <FormProvider methods={methods}>
      <ModalDialog
        maxWidth="md"
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              رفض طلب التحرير
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <BaseField type="textArea" name="reject_reason" placeholder="ملء سبب الرفض" />
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
              onClick={handleClose}
            >
              رجوع
            </Button>
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              sx={{
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                backgroundColor: '#0E8478',
                ':hover': { backgroundColor: '#13B2A2' },
              }}
              loading={isSubmitting}
            >
              اضافة
            </LoadingButton>
          </Stack>
        }
        isOpen={open}
        onClose={handleClose}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </FormProvider>
  );
}

export default RejectedEditRequestPopUp;
