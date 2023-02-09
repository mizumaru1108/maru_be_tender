import { Button, Grid, Stack, Typography, Link } from '@mui/material';
import { useDispatch, useSelector } from 'redux/store';
import Check from '@mui/icons-material/Check';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { updatePaymentBySupervisorAndManagerAndFinance } from 'redux/slices/proposal';
import React from 'react';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';

function PaymentsTable() {
  const { activeRole } = useAuth();
  const { translate } = useLocales();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { proposal } = useSelector((state) => state.proposal);

  const handleApprovalPayment = async (id: string) => {
    try {
      await dispatch(
        updatePaymentBySupervisorAndManagerAndFinance({ id, role: activeRole!, action: 'accept' })
      ).then((res) => {
        if (res.data.statusCode === 200) {
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

  React.useEffect(() => {}, [proposal]);

  return (
    <>
      {proposal.payments.map((item, index) => (
        <Grid item md={12} key={index} sx={{ mb: '20px' }}>
          <Grid container direction="row" key={index} spacing={2} alignItems="center">
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
            {item.status !== 'SET_BY_SUPERVISOR' ? (
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
            ) : (
              <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                <Button
                  component={Link}
                  href={item.cheques[0].transfer_receipt}
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
              </Grid>
            )}
            {item.status === 'ACCEPTED_BY_PROJECT_MANAGER' && (
              <>
                {/* <Grid item md={2}>
                  <Button
                    variant="outlined"
                    startIcon={
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_5026_13413)">
                          <path
                            d="M15.2353 0.769209C14.7821 0.316673 14.1678 0.0625 13.5273 0.0625C12.8869 0.0625 12.2726 0.316673 11.8193 0.769209L0.976677 11.6119C0.666178 11.9206 0.419985 12.2879 0.252342 12.6924C0.0846994 13.0969 -0.00106532 13.5307 9.98748e-06 13.9685V15.3372C9.98748e-06 15.514 0.0702479 15.6836 0.195272 15.8086C0.320296 15.9336 0.489866 16.0039 0.666677 16.0039H2.03534C2.47318 16.0051 2.90692 15.9195 3.31145 15.752C3.71597 15.5844 4.08325 15.3383 4.39201 15.0279L15.2353 4.18454C15.6877 3.73134 15.9417 3.11719 15.9417 2.47688C15.9417 1.83657 15.6877 1.22241 15.2353 0.769209V0.769209ZM3.44934 14.0852C3.07335 14.4587 2.56532 14.669 2.03534 14.6705H1.33334V13.9685C1.33267 13.7058 1.38411 13.4456 1.4847 13.2028C1.58529 12.9601 1.73302 12.7398 1.91934 12.5545L10.148 4.32588L11.6813 5.85921L3.44934 14.0852ZM14.292 3.24188L12.6213 4.91321L11.088 3.38321L12.7593 1.71188C12.86 1.61141 12.9795 1.53177 13.111 1.47748C13.2424 1.4232 13.3833 1.39534 13.5255 1.39549C13.6678 1.39564 13.8086 1.42381 13.9399 1.47838C14.0712 1.53296 14.1905 1.61286 14.291 1.71354C14.3915 1.81422 14.4711 1.9337 14.5254 2.06516C14.5797 2.19663 14.6076 2.33749 14.6074 2.47972C14.6072 2.62195 14.5791 2.76275 14.5245 2.8941C14.4699 3.02544 14.39 3.14475 14.2893 3.24521L14.292 3.24188Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_5026_13413">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    }
                    onClick={() => {}}
                    sx={{
                      backgroundColor: '#0169DE',
                      color: '#fff',
                      ':hover': { backgroundColor: '#1482FE' },
                    }}
                  >
                    ارسال طلب تعديل
                  </Button>
                </Grid> */}
                <Grid item>
                  <LoadingButton
                    variant="contained"
                    endIcon={<Check />}
                    sx={{ backgroundColor: '#0E8478' }}
                    onClick={() => {
                      handleApprovalPayment(item.id);
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_accept_finance'
                    )}
                  </LoadingButton>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
}

export default PaymentsTable;
