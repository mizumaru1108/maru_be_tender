import { Button, Grid, Stack, Typography, Link } from '@mui/material';
import { useDispatch, useSelector } from 'redux/store';
// import Check from '@mui/icons-material/Check';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  getProposal,
  getProposalCount,
  updatePaymentBySupervisorAndManagerAndFinance,
} from 'redux/slices/proposal';
import React, { useMemo } from 'react';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useNavigate, useParams } from 'react-router';
import { role_url_map } from '../../../../@types/commons';
import { FEATURE_PAYEMENTS_NEW, FEATURE_PROPOSAL_COUNTING } from 'config';
import { TransferReceipt } from '../../../../@types/proposal';

function PaymentsTable() {
  const { activeRole } = useAuth();
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  // console.log({ params });
  const { enqueueSnackbar } = useSnackbar();

  const { proposal } = useSelector((state) => state.proposal);
  // console.log('test', proposal?.payments);
  const [sortingData, setSortingData] = React.useState<any[]>([]);
  const [currentIssuedPayament, setCurrentIssuedPayament] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleApprovalPayment = async (
    id: string,
    payment_action: 'accept' | 'confirm_payment'
  ) => {
    try {
      setIsLoading(true);
      await dispatch(
        updatePaymentBySupervisorAndManagerAndFinance({
          id,
          role: activeRole!,
          action: payment_action,
        })
      ).then((res) => {
        console.log({ res });
        if (res.statusCode === 200 || res.statusCode === 201) {
          enqueueSnackbar('تم قبول أذن الصرف بنجاح', {
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
          if (FEATURE_PAYEMENTS_NEW) {
            dispatch(getProposal(params.id as string, activeRole as string));
          }
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectPayment = async (
    id: string,
    payment_action: 'accept' | 'reject_payment',
    url?: string
  ) => {
    // console.log({ note });
    // console.log({ url });

    try {
      await dispatch(
        updatePaymentBySupervisorAndManagerAndFinance({
          id,
          role: activeRole!,
          action: payment_action,
          url: url,
        })
      ).then((res) => {
        console.log({ res });
        if (res.statusCode === 200 || res.statusCode === 201) {
          enqueueSnackbar('تم رفض أذن الصرف بنجاح', {
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
          dispatch(getProposal(params.id as string, activeRole as string));
        }
      });
    } catch (error) {
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

  const payments = useMemo(() => {
    const paymentsHistory = proposal.payments.map((v) => ({
      ...v,
      order: Number(v.order),
    }));

    return paymentsHistory.sort((a, b) => a.order - b.order);
  }, [proposal]);

  const stepBeforeComplete = payments.findIndex(
    (item) => item.status === 'issued_by_supervisor' || item.status === 'set_by_supervisor'
  );
  const alreadyExist =
    proposal.proposal_logs.findIndex((item) => {
      if (item.action === 'set_by_supervisor' && item.user_role === 'PROJECT_MANAGER') {
        return true;
      } else {
        return false;
      }
    }) !== -1
      ? true
      : false;

  const currentSelectedIndex = useMemo(() => {
    let currIndex = 0;
    if (payments.length > 0) {
      for (var i = 0; i < payments.length; i++) {
        // if (payments[i].status === 'issued_by_supervisor') {
        //   currIndex = i;
        //   break;
        // }
        if (
          payments[i].status === 'issued_by_supervisor' ||
          payments[i].status === 'set_by_supervisor'
        ) {
          currIndex = i;
          break;
        }
      }
    }
    return currIndex;
  }, [payments]);

  // console.log({ proposal, payments });

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
  // console.log({ sortingData });

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
              item.status !== 'issued_by_supervisor' &&
              item.status !== 'uploaded_by_cashier' &&
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
              {item.status === 'issued_by_supervisor' && (
                <Grid item md={2}>
                  <Typography data-cy="review.review_by_project_manager">
                    {translate('review.review_by_project_manager')}
                  </Typography>
                </Grid>
              )}

              {item.status === 'accepted_by_project_manager' ? (
                <Grid item>
                  <LoadingButton
                    variant="contained"
                    loading={isLoading}
                    endIcon={<CheckIcon />}
                    sx={{
                      backgroundColor: currentIssuedPayament !== index ? '#93A3B03D' : '#0E8478',
                      color: index !== currentIssuedPayament ? '#1E1E1E' : '#fff',
                      boxShadow: 'none',
                    }}
                    disabled={index !== currentIssuedPayament}
                    onClick={() => {
                      handleApprovalPayment(item.id, 'accept');
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_accept_finance'
                    )}
                  </LoadingButton>
                </Grid>
              ) : currentSelectedIndex === stepBeforeComplete &&
                item.status === 'set_by_supervisor' ? (
                <Grid item md={2}>
                  <Typography
                    data-cy="content.administrative.project_details.payment.table.btn.exchange_permit_reject_by_pm"
                    color="error"
                    variant="h6"
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_reject_by_pm'
                    )}
                  </Typography>
                </Grid>
              ) : null}

              {item.status === 'uploaded_by_cashier' ? (
                <>
                  <Grid item md={2}>
                    <LoadingButton
                      data-cy="content.administrative.project_details.payment.table.btn.exchange_upload_refuse"
                      sx={{
                        backgroundColor: '#FF4842',
                        color: '#fff',
                        ':hover': { backgroundColor: '#FF170F' },
                      }}
                      loading={isLoading}
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        const url =
                          (item &&
                            item.cheques.length > 0 &&
                            item.cheques[item.cheques.length - 1].transfer_receipt.url) ||
                          '#';
                        // console.log('test', item.cheques.length);
                        handleRejectPayment(item.id, 'reject_payment', url);
                      }}
                    >
                      {translate(
                        'content.administrative.project_details.payment.table.btn.exchange_upload_refuse'
                      )}
                    </LoadingButton>
                  </Grid>
                  <Grid item md={2}>
                    <LoadingButton
                      data-cy="content.administrative.project_details.payment.table.btn.exchange_upload_approve"
                      sx={{
                        backgroundColor: '#0E8478',
                        color: '#fff',
                      }}
                      loading={isLoading}
                      startIcon={<CheckIcon />}
                      // disabled={currentSelectedIndex !== index}
                      onClick={() => {
                        handleApprovalPayment(item.id, 'confirm_payment');
                      }}
                    >
                      {translate(
                        'content.administrative.project_details.payment.table.btn.exchange_upload_approve'
                      )}
                    </LoadingButton>
                  </Grid>
                </>
              ) : null}

              {/* {item.status === 'done' && (
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
              )} */}
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
              {/* {item &&
                (item.status === 'done' || item.status === 'uploaded_by_cashier') &&
                item.cheques.length > 0 &&
                item.cheques.map((item: any, index: number) => (
                  <Grid item key={index} md={2} sx={{ textAlign: '-webkit-center' }}>
                    <Button
                      data-cy={`btn.view_transfer_receipt${index}`}
                      variant="text"
                      color="inherit"
                      sx={{
                        '&:hover': { textDecorationLine: 'underline' },
                      }}
                      href={item?.transfer_receipt?.url ?? '#'}
                      target="_blank"
                    >
                      {translate(
                        'content.administrative.project_details.payment.table.btn.view_transfer_receipt'
                      )}
                    </Button>
                  </Grid>
                ))} */}
              {item &&
                (item.status === 'done' || item.status === 'uploaded_by_cashier') &&
                item.cheques.length > 0 && (
                  <Grid item key={index} md={2} sx={{ textAlign: '-webkit-center' }}>
                    <Button
                      data-cy="btn.view_transfer_receipt"
                      variant="text"
                      color="inherit"
                      sx={{
                        '&:hover': { textDecorationLine: 'underline' },
                      }}
                      href={
                        (item.cheques[item.cheques.length - 1]?.transfer_receipt as TransferReceipt)
                          ?.url ?? '#'
                      }
                      target="_blank"
                    >
                      {translate(
                        'content.administrative.project_details.payment.table.btn.view_transfer_receipt'
                      )}
                    </Button>
                  </Grid>
                )}
              {item.status === 'done' && (
                <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                  {item.cheques.length ? (
                    <Button
                      data-cy="btn.review_transfer_receipt"
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
                    <Typography
                      data-cy="btn.not_found_cheques"
                      color="error"
                      sx={{ textAlign: 'start' }}
                    >
                      {translate(
                        'content.administrative.project_details.payment.table.btn.not_found_cheques'
                      )}
                    </Typography>
                  )}
                </Grid>
              )}
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
