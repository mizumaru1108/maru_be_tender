import { Button, Grid, Link, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'redux/store';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import { updatePaymentBySupervisorAndManagerAndFinance } from 'redux/slices/proposal';
import React from 'react';
import useLocales from 'hooks/useLocales';
import { fCurrencyNumber } from 'utils/formatNumber';
import useAuth from 'hooks/useAuth';

function PaymentsTable() {
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { proposal } = useSelector((state) => state.proposal);

  const { translate } = useLocales();

  const handleApprovalPayment = async (id: string) => {
    try {
      await dispatch(
        updatePaymentBySupervisorAndManagerAndFinance({
          id,
          role: activeRole!,
          action: 'accept',
        })
      ).then((res) => {
        if (res.statusCode === 200) {
          enqueueSnackbar('تم قبول أذن الصرف بنجاح', {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
          });
        }
      });
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

  const handleRejectPayment = async (id: string) => {
    try {
      await dispatch(
        updatePaymentBySupervisorAndManagerAndFinance({ id, role: activeRole!, action: 'reject' })
      ).then((res) => {
        if (res.data.statusCode === 200) {
          enqueueSnackbar('تم رفض أذن الصرف بنجاح', {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
          });
        }
      });
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

  React.useEffect(() => {}, [proposal]);

  return (
    <>
      {proposal.payments.map((item, index) => (
        <Grid item md={12} key={index} sx={{ mb: '20px' }}>
          <Grid container direction="row" key={item.order} spacing={2} alignItems="center">
            <Grid item md={2}>
              <Typography variant="h6">
                <Typography component="span">
                  {translate('content.administrative.project_details.payment.table.td.batch_no')}
                </Typography>
                <Typography component="span">&nbsp;{item.order}</Typography>
              </Typography>
            </Grid>
            <Grid item md={2}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0' }}>
                  {translate('content.administrative.project_details.payment.table.td.payment_no')}:
                </Typography>
                <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                  {fCurrencyNumber(item.payment_amount)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={2}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0' }}>
                  {translate('content.administrative.project_details.payment.table.td.batch_date')}:
                </Typography>
                <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                  {new Date(item.payment_date).toISOString().substring(0, 10)}
                </Typography>
              </Stack>
            </Grid>
            {item.status === 'accepted_by_project_manager' ? (
              <Grid item md={2}>
                <Typography
                  sx={{
                    color: '#0E8478',
                  }}
                >
                  {translate(
                    'content.administrative.project_details.payment.table.btn.exchange_permit_success'
                  )}
                </Typography>
              </Grid>
            ) : null}
            {item.status === 'done' ? (
              <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                {item.cheques.length ? (
                  <Button
                    component={Link}
                    href={
                      typeof item.cheques[0].transfer_receipt === 'string'
                        ? item.cheques[0].transfer_receipt
                        : item.cheques[0].transfer_receipt.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    download="صورة الشيك"
                    sx={{
                      backgroundColor: 'transparent',
                      color: '#000',
                      textDecorationLine: 'underline',
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.review_transfer_receipt'
                    )}
                  </Button>
                ) : (
                  <Typography color="error" sx={{ textAlign: 'start' }}>
                    {translate(
                      'content.administrative.project_details.payment.table.btn.not_found_cheques'
                    )}
                  </Typography>
                )}
              </Grid>
            ) : null}
            {item.status === 'issued_by_supervisor' ? (
              <>
                <Grid item md={2}>
                  <Button
                    sx={{
                      backgroundColor: '#FF4842',
                      color: '#fff',
                      ':hover': { backgroundColor: '#FF170F' },
                    }}
                    startIcon={<CloseIcon />}
                    onClick={() => {
                      handleRejectPayment(item.id);
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_refuse'
                    )}
                  </Button>
                </Grid>
                <Grid item md={2}>
                  <Button
                    sx={{
                      backgroundColor: '#0E8478',
                      color: '#fff',
                    }}
                    startIcon={<CheckIcon />}
                    onClick={() => {
                      handleApprovalPayment(item.id);
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_approve'
                    )}
                  </Button>
                </Grid>
              </>
            ) : null}
          </Grid>
        </Grid>
      ))}
    </>
  );
}

export default PaymentsTable;
