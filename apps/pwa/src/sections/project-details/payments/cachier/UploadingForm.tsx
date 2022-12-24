import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import ModalDialog from 'components/modal-dialog';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { insertChequeByCashier } from 'redux/slices/proposal';
import { useDispatch } from 'redux/store';
import * as Yup from 'yup';
import { UploadReceiptFormFields } from './form-data';
import { UploadReceiptPayload } from './type';

function UploadingForm({ paymentId, onClose }: any) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    transactionReceipt: Yup.object().shape({
      url: Yup.string(),
      size: Yup.number(),
      type: Yup.string(),
    }),
    checkTransferNumber: Yup.string().required('Check Transfer Number is required!'),
    depositDate: Yup.string().required('Deposit Date is required!'),
  });

  const defaultValues = {
    transactionReceipt: { url: '', size: undefined, type: 'image/jpeg' },
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

  const onSubmit = async (data: any) => {
    try {
      await dispatch(
        insertChequeByCashier({
          cheque: {
            id: nanoid(),
            payment_id: paymentId,
            transfer_receipt: data.transactionReceipt.url,
            deposit_date: data.depositDate,
            number: data.checkTransferNumber,
          },
          paymentId: paymentId,
          newState: { status: 'DONE' },
        })
      );
      enqueueSnackbar('تم إرسال الشيك بنجاح, بالإضافة إلى تعديل حالة الدفعة', {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
      onClose();
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
    }
  };

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        isOpen={true}
        title="رفع إيصال الشيك"
        showCloseIcon={true}
        onClose={onClose}
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <FormGenerator data={UploadReceiptFormFields} />
          </Grid>
        }
        actionBtn={
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={onClose}
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
              }}
            >
              رجوع
            </Button>
            <LoadingButton
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'background.paper',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: '#13B2A2' },
              }}
            >
              اضافة
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default UploadingForm;
