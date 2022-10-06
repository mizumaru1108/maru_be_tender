import { Button, Box, Stack, Typography, Grid } from '@mui/material';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { insertChequeUpdatePayment } from 'queries/Cashier/insertChequeUpdatePayment';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useMutation } from 'urql';
import ModalDialog from '../../../../components/modal-dialog';
import Page from '../../../../components/Page';
import { paymentReq } from '../../../../queries/Cashier/supportRequest';
import PaymentsTable from './PaymentsTable';
import FormActionBox from './PopUpActionBar';
import UploadingForm from './UploadingForm';

function CashierPaymentsPage({ data, mutate }: any) {
  const { enqueueSnackbar } = useSnackbar();
  console.log(data);
  const [modalState, setModalState] = useState(false);
  const [_, insChequeUpdatePay] = useMutation(insertChequeUpdatePayment);
  const [paymentSent, setPaymentSent] = useState<{
    payment_date: string;
    payment_amount: number | undefined;
    id: string;
    status:
      | 'SET_BY_SUPERVISOR'
      | 'ISSUED_BY_SUPERVISOR'
      | 'ACCEPTED_BY_PROJECT_MANAGER'
      | 'ACCEPTED_BY_FINANCE'
      | 'DONE'
      | '';
  }>({ payment_date: '', payment_amount: undefined, id: '', status: '' });

  // create handleSubmit function with async await for use mutation cheque
  const handleSubmit = async (data: any) => {
    insChequeUpdatePay({
      cheque: {
        id: nanoid(),
        payment_id: paymentSent.id,
        transfer_receipt: data.transactionReceipt,
        deposit_date: data.depositDate,
        number: data.checkTransferNumber,
      },
      paymentId: paymentSent.id,
      newState: { status: 'DONE' },
    }).then((result) => {
      if (result.error) {
        enqueueSnackbar(result.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        });
      }
      if (!result.error) {
        enqueueSnackbar('تم إرسال الشيك بنجاح, بالإضافة إلى تعديل حالة الدفعة', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        });
        mutate();
      }
    });
  };

  const handleCloseModal = () => {
    setModalState(false);
  };
  const handleOpenModal = (item: any) => {
    setModalState(true);
    setPaymentSent(item);
  };
  return (
    <>
      <Grid container spacing={3} sx={{ mt: '8px' }}>
        <Grid item md={12}>
          <Typography variant="h4">ميزانية المشروع</Typography>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box
            sx={{
              borderRadius: '8px',
              backgroundColor: '#fff',
              py: '30px',
              paddingRight: '40px',
              paddingLeft: '5px',
              height: '120px',
            }}
          >
            <img src={`/icons/rial-currency.svg`} alt="" />
            <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
              الميزانية الكلية للمشروع
            </Typography>
            <Typography
              sx={{ color: 'text.tertiary', fontWeight: 700 }}
            >{`${data.amount_required_fsupport} ريال`}</Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box
            sx={{
              borderRadius: '8px',
              backgroundColor: '#fff',
              py: '30px',
              paddingRight: '40px',
              paddingLeft: '5px',
              height: '120px',
            }}
          >
            <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
              عدد الدفعات المسجلة
            </Typography>
            <Typography
              sx={{ color: 'text.tertiary', fontWeight: 700 }}
            >{`${data.number_of_payments} دفعات`}</Typography>
          </Box>
        </Grid>

        <Grid item md={12}>
          <Typography variant="h4">تقسيم الدفعات</Typography>
        </Grid>
        {data.payments.length !== 0 && (
          <PaymentsTable payments={data.payments} setModalOpen={handleOpenModal} />
        )}
      </Grid>
      <ModalDialog
        maxWidth="md"
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              رفع إيصال التحويل
            </Typography>
          </Stack>
        }
        content={
          <UploadingForm
            onSubmit={(data: any) => {
              handleSubmit(data);
              setModalState(false);
            }}
          >
            <FormActionBox
              isLoading={false}
              onReturn={() => {
                setModalState(false);
              }}
            />
          </UploadingForm>
        }
        isOpen={modalState}
        onClose={handleCloseModal}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </>
  );
}

export default CashierPaymentsPage;
