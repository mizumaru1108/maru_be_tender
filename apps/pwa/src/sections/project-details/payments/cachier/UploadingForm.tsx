import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import ModalDialog from 'components/modal-dialog';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { getProposalCount, insertChequeByCashier } from 'redux/slices/proposal';
import { useDispatch } from 'redux/store';
import * as Yup from 'yup';
import { UploadReceiptFormFields } from './form-data';
import { UploadReceiptPayload } from './type';
import useAuth from 'hooks/useAuth';
import { errorExchange } from 'urql';
import { FEATURE_PROPOSAL_COUNTING } from 'config';

function UploadingForm({ paymentId, onClose }: any) {
  const { activeRole } = useAuth();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    transactionReceipt: Yup.object().shape({
      url: Yup.string(),
      size: Yup.number(),
      type: Yup.string(),
      base64Data: Yup.string(),
      fullName: Yup.string(),
      fileExtension: Yup.string(),
    }),
    checkTransferNumber: Yup.string().required('Check Transfer Number is required!'),
    depositDate: Yup.string().required('Deposit Date is required!'),
  });

  const defaultValues = {
    transactionReceipt: {
      url: '',
      size: undefined,
      type: '',
      base64Data: undefined,
      fullName: '',
      fileExtension: '',
    },
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
          id: paymentId,
          role: activeRole!,
          action: 'upload_receipt',
          cheque: {
            transfer_receipt: data.transactionReceipt,
            deposit_date: data.depositDate,
            number: data.checkTransferNumber,
          },
        })
      ).then(() => {
        enqueueSnackbar('تم إرسال الشيك بنجاح, بالإضافة إلى تعديل حالة الدفعة', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        });
        // dispatch(getProposalCount(activeRole ?? 'test'));
        if (FEATURE_PROPOSAL_COUNTING) {
          dispatch(getProposalCount(activeRole ?? 'test'));
        }
        onClose();
        // window.location.reload();
      });
    } catch (error) {
      if (typeof error.message === 'object') {
        error.message.forEach((el: any) => {
          enqueueSnackbar(el, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
          });
        });
      } else {
        // enqueueSnackbar(error.message, {
        //   variant: 'error',
        //   preventDuplicate: true,
        //   autoHideDuration: 3000,
        //   anchorOrigin: {
        //     vertical: 'bottom',
        //     horizontal: 'right',
        //   },
        // });
        const statusCode = (error && error.statusCode) || 0;
        const message = (error && error.message) || null;
        enqueueSnackbar(
          `${
            statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
          }`,
          {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          }
        );
      }
    }
  };

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        isOpen={true}
        title={translate('finance_pages.modal.heading.upload_receipt')}
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
              {translate('finance_pages.button.back')}
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
              {translate('finance_pages.button.add')}
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default UploadingForm;
