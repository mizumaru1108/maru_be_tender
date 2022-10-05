import { Button, Box, Stack, Typography, Grid } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useMutation } from 'urql';
import ModalDialog from '../../../../components/modal-dialog';
import Page from '../../../../components/Page';
import { paymentReq } from '../../../../queries/Cashier/supportRequest';
import PaymentsTable from './PaymentsTable';
import FormActionBox from './PopUpActionBar';
import UploadingForm from './UploadingForm';

function CashierPaymentsPage({ data }: any) {
  const [modalState, setModalState] = useState(false);
  const [chequeInsert, cheque] = useMutation(paymentReq);
  const location = useLocation();
  const paymentId = location.pathname.split('/').at(4);

  console.log('split :', paymentId);
  // create handleSubmit function with async await for use mutation cheque
  const handleSubmit = async (data: any) => {
    await cheque({
      objects: {
        id: nanoid(),
        payment_id: paymentId,
        transfer_receipt: data.transactionReceipt,
        deposit_date: data.depositDate,
        number: data.checkTransferNumber,
      },
    });
  };

  const handleCloseModal = () => {
    setModalState(false);
  };
  return (
    <Page title="CashierPaymentsPage">
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
        {data.payments.length !== 0 && <PaymentsTable payments={data.payments} />}
      </Grid>
      <ModalDialog
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {'Upload Receipt Form'}
            </Typography>
          </Stack>
        }
        content={
          <UploadingForm
            onSubmit={(data: any) => {
              console.log('form callback', data);
              console.log('just a dummy not create log yet');
              // handleSubmit(data);
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
    </Page>
  );
}

export default CashierPaymentsPage;
