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
import { useNavigate } from 'react-router';
import { role_url_map } from '../../../../@types/commons';

function PaymentsTable() {
  const { activeRole } = useAuth();
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { proposal } = useSelector((state) => state.proposal);
  // console.log('test', proposal?.payments);
  const [sortingData, setSortingData] = React.useState<any[]>([]);
  const [currentIssuedPayament, setCurrentIssuedPayament] = React.useState(0);

  const handleApprovalPayment = async (id: string) => {
    try {
      await dispatch(
        updatePaymentBySupervisorAndManagerAndFinance({ id, role: activeRole!, action: 'accept' })
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
  };

  // useEffect(() => {
  //   const payments = [...proposal.payments].sort(
  //     (a: any, b: any) => parseInt(a.order) - parseInt(b.order)
  //   );
  //   console.log({ payments });
  // for (var i = 0; i < payments.length; i++) {
  //   if (payments[i].status === 'set_by_supervisor') {
  //     setCurrentIssuedPayament(i);
  //     break;
  //   }
  // }
  // }, [proposal]);
  React.useEffect(() => {
    // const
    const neWvalue: any = proposal.payments;
    const arr = [...neWvalue]
      .sort((a: any, b: any) => parseInt(a.order) - parseInt(b.order))
      .map((item: any) => item);
    setSortingData(arr);
    // console.log('test', arr);

    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status === 'accepted_by_project_manager') {
        setCurrentIssuedPayament(i);
        break;
      }
    }
  }, [proposal]);
  // console.log({ currentIssuedPayament });

  return (
    <>
      {sortingData.length > 0 &&
        sortingData.map((item, index) => (
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
                    {translate(
                      'content.administrative.project_details.payment.table.td.payment_no'
                    )}
                    :
                  </Typography>
                  <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                    {fCurrencyNumber(item.payment_amount)}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={2}>
                <Stack direction="column">
                  <Typography sx={{ color: '#93A3B0' }}>
                    {translate(
                      'content.administrative.project_details.payment.table.td.batch_date'
                    )}
                    :
                  </Typography>
                  <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                    {new Date(item.payment_date).toISOString().substring(0, 10)}
                  </Typography>
                </Stack>
              </Grid>
              {item.status !== 'set_by_supervisor' &&
              item.status !== 'accepted_by_project_manager' ? (
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
              {item.status === 'accepted_by_project_manager' && (
                <Grid item>
                  <LoadingButton
                    variant="contained"
                    endIcon={<Check />}
                    sx={{
                      backgroundColor: currentIssuedPayament !== index ? '#93A3B03D' : '#0E8478',
                      color: index !== currentIssuedPayament ? '#1E1E1E' : '#fff',
                      boxShadow: 'none',
                    }}
                    disabled={index !== currentIssuedPayament}
                    onClick={() => {
                      handleApprovalPayment(item.id);
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_accept_finance'
                    )}
                  </LoadingButton>
                </Grid>
              )}

              {item.status === 'done' && (
                <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                  <Button
                    onClick={() => {
                      localStorage.setItem('receipt_type', 'receipt');
                      navigate(
                        `/${role_url_map[`${activeRole!}`]}/dashboard/generate/${
                          proposal.id
                        }/payments/${item.id}`
                      );
                    }}
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
              {(item.status === 'done' || item.status === 'accepted_by_finance') && (
                <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                  <Button
                    variant="text"
                    color="inherit"
                    sx={{ '&:hover': { textDecorationLine: 'underline' } }}
                    onClick={() => {
                      localStorage.setItem('receipt_type', 'generate');
                      navigate(
                        `/${role_url_map[`${activeRole!}`]}/dashboard/generate/${
                          proposal.id
                        }/payments/${item.id}`
                      );
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_generate_finance'
                    )}
                  </Button>
                </Grid>
              )}
              {
                (item.staus = 'done' && (
                  <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                    <Button
                      variant="text"
                      color="inherit"
                      sx={{
                        '&:hover': { textDecorationLine: 'underline' },
                      }}
                      href={item.cheques[0].transfer_receipt.url ?? '#'}
                      target="_blank"
                    >
                      {translate(
                        'content.administrative.project_details.payment.table.btn.view_transfer_receipt'
                      )}
                    </Button>
                  </Grid>
                ))
              }
              {/* {item.status === 'done' ? (
              <>
                <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                  {item.cheques && item.cheques.length ? (
                    <Button
                      // component={Link}
                      // href={
                      //   typeof item.cheques[0].transfer_receipt === 'string'
                      //     ? item.cheques[0].transfer_receipt
                      //     : item.cheques[0].transfer_receipt.url
                      // }
                      // target="_blank"
                      // rel="noopener noreferrer"
                      // download="صورة الشيك"
                      onClick={() => {
                        localStorage.setItem('receipt_type', 'receipt');
                        navigate(
                          `/${role_url_map[`${activeRole!}`]}/dashboard/generate/${
                            proposal.id
                          }/payments/${item.id}`
                        );
                      }}
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
                <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                  <Button
                    variant="text"
                    color="inherit"
                    sx={{ '&:hover': { textDecorationLine: 'underline' } }}
                    onClick={() => {
                      localStorage.setItem('receipt_type', 'generate');
                      navigate(
                        `/${role_url_map[`${activeRole!}`]}/dashboard/generate/${
                          proposal.id
                        }/payments/${item.id}`
                      );
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_generate_finance'
                    )}
                  </Button>
                </Grid>
              </>
            ) : null} */}
            </Grid>
          </Grid>
        ))}
    </>
  );
}

export default PaymentsTable;
