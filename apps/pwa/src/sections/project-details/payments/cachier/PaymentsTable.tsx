import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import { useSelector } from 'redux/store';
import React from 'react';
import UploadingForm from './UploadingForm';
import useAuth from 'hooks/useAuth';

function PaymentsTable() {
  const { proposal } = useSelector((state) => state.proposal);

  const { activeRole } = useAuth();

  const [modalState, setModalState] = React.useState({ isOpen: false, payment_id: '' });

  const handleOpenModal = (payment_id: string) => {
    setModalState({ isOpen: true, payment_id });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, payment_id: '' });
  };

  return (
    <>
      {modalState.isOpen && (
        <UploadingForm paymentId={modalState.payment_id} onClose={handleCloseModal} />
      )}
      {proposal.payments.map((item, index) => (
        <Grid item md={12} key={index} sx={{ mb: '20px' }}>
          <Grid container direction="row" key={index}>
            <Grid item md={2} sx={{ alignSelf: 'center' }}>
              <Typography variant="h6">{`الدفعة رقم ${item.order}`}</Typography>
            </Grid>
            <Grid item md={2}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0' }}>مبلغ الدفعة:</Typography>
                <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                  {item.payment_amount}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={2}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0' }}>تاريخ الدفعة:</Typography>
                <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                  {new Date(item.payment_date).toISOString().substring(0, 10)}
                </Typography>
              </Stack>
            </Grid>
            {item.status !== 'SET_BY_SUPERVISOR' && (
              <Grid item md={3}>
                <Typography
                  sx={{
                    color: '#0E8478',
                  }}
                >
                  تم اصدار إذن الصرف بنجاح
                </Typography>
              </Grid>
            )}
            {item.status === 'ACCEPTED_BY_FINANCE' && activeRole === 'tender_cashier' ? (
              <Grid item md={3} sx={{ textAlign: '-webkit-center' }}>
                <Button
                  sx={{
                    backgroundColor: 'transparent',
                    color: '#000',
                    textDecorationLine: 'underline',
                    height: '100%',
                    ':hover': { backgroundColor: '#b8b7b4', textDecorationLine: 'underline' },
                    width: '100%',
                    border: `1px solid #000`,
                    borderStyle: 'dashed',
                  }}
                  endIcon={<img src="/icons/uploading-field/uploading-cheque-icon.svg" alt="" />}
                  onClick={() => {
                    handleOpenModal(item.id);
                  }}
                >
                  رفع ايصال التحويل
                </Button>
              </Grid>
            ) : item.status === 'DONE' ? (
              <Grid item md={3} sx={{ textAlign: '-webkit-center' }}>
                <Button
                  component={Link}
                  href={item.cheques[0].transfer_receipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="صورة بطاقة الحساب البنكي"
                  sx={{
                    backgroundColor: 'transparent',
                    color: '#000',
                    textDecorationLine: 'underline',
                  }}
                >
                  استعراض ايصال التحويل
                </Button>
              </Grid>
            ) : (
              <Grid item md={3}>
                <Box>{''}</Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
}

export default PaymentsTable;
