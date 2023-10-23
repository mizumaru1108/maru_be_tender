import { Button, Grid, Link, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'redux/store';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import {
  getProposal,
  getProposalCount,
  updatePaymentBySupervisorAndManagerAndFinance,
} from 'redux/slices/proposal';
import React, { useMemo } from 'react';
import useLocales from 'hooks/useLocales';
import { fCurrencyNumber } from 'utils/formatNumber';
import useAuth from 'hooks/useAuth';
import { role_url_map } from '../../../../@types/commons';
import { useNavigate, useParams } from 'react-router';
import RejectionModal from 'components/modal-dialog/RejectionModal';
import { FEATURE_PAYEMENTS_NEW, FEATURE_PROPOSAL_COUNTING } from 'config';
import { TransferReceipt } from '../../../../@types/proposal';
import { LoadingButton } from '@mui/lab';

function PaymentsTable() {
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();

  const { proposal } = useSelector((state) => state.proposal);

  const paymentSorting = [...proposal.payments].sort(
    (a, b) => parseInt(a.order) - parseInt(b.order)
  );

  const stepBeforeComplete = paymentSorting.findIndex(
    (item) => item.status === 'issued_by_supervisor' || item.status === 'set_by_supervisor'
  );
  // const stepAfterComplete = paymentSorting.findIndex(
  //   (item) => item.status !== 'issued_by_supervisor' && item.status !== 'set_by_supervisor'
  // );
  // const complete = stepBeforeComplete === stepAfterComplete + 1;

  const { translate } = useLocales();

  const [selectedPaymentId, setSelectedPaymentId] = React.useState('');
  const [openModalReject, setOpenModalReject] = React.useState(false);
  // const [sortingData, setSortingData] = React.useState<any[]>([]);
  // const [currentIssuedPayament, setCurrentIssuedPayament] = React.useState(0);

  const payments = useMemo(() => {
    const paymentsHistory = proposal.payments.map((v) => ({
      ...v,
      order: Number(v.order),
    }));

    return paymentsHistory.sort((a, b) => a.order - b.order);
  }, [proposal]);

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
          payments[i].status === 'rejected_by_project_manager'
        ) {
          currIndex = i;
          break;
        }
      }
    }
    return currIndex;
  }, [payments]);
  // console.log({ stepBeforeComplete, currentSelectedIndex, paymentSorting });

  const handleApprovalPayment = async (id: string) => {
    try {
      setIsLoading(true);
      await dispatch(
        updatePaymentBySupervisorAndManagerAndFinance({
          id,
          role: activeRole!,
          action: 'accept',
        })
      ).then((res) => {
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

  const handleRejectPayment = async (id: string, note?: string) => {
    try {
      setIsLoading(true);
      await dispatch(
        updatePaymentBySupervisorAndManagerAndFinance({
          id,
          role: activeRole!,
          action: 'reject',
          note: note,
        })
      ).then((res) => {
        if (res.data.statusCode === 200 || res.statusCode === 201) {
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
          navigate(`/${role_url_map[`${activeRole!}`]}/dashboard/app`);
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
    } finally {
      setIsLoading(false);
    }
  };

  // React.useEffect(() => {
  //   // const
  //   const neWvalue: any = proposal.payments;
  //   const arr = [...neWvalue]
  //     .sort((a: any, b: any) => parseInt(a.order) - parseInt(b.order))
  //     .map((item: any) => item);
  //   setSortingData(arr);
  //   // console.log('test', arr);

  // for (var i = 0; i < arr.length; i++) {
  //   if (arr[i].status === 'accepted_by_finance') {
  //     setCurrentIssuedPayament(i);
  //     break;
  //   }
  // }
  // }, [proposal]);

  return (
    <>
      <RejectionModal
        open={openModalReject}
        handleClose={() => setOpenModalReject(!openModalReject)}
        onReject={(data: string) => handleRejectPayment(selectedPaymentId, data)}
        message={'modal.headline.payment_reject'}
        key={'reject'}
      />
      {payments.map((item, index) => (
        <Grid item md={12} key={index} sx={{ mb: '20px' }}>
          <Grid container direction="row" key={Number(item.order)} spacing={2} alignItems="center">
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
            {(item.status === 'done' ||
              item.status === 'accepted_by_finance' ||
              item.status === 'uploaded_by_cashier') && (
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
            {item.status === 'issued_by_supervisor' ? (
              <>
                <Grid item md={2}>
                  <LoadingButton
                    data-cy={`content.administrative.project_details.payment.table.btn.exchange_permit_refuse_${index}`}
                    sx={{
                      backgroundColor: '#FF4842',
                      color: '#fff',
                      ':hover': { backgroundColor: '#FF170F' },
                    }}
                    startIcon={<CloseIcon />}
                    disabled={
                      currentSelectedIndex !== index ||
                      currentSelectedIndex !== stepBeforeComplete ||
                      isLoading
                    }
                    loading={isLoading}
                    onClick={() => {
                      setSelectedPaymentId(item.id);
                      setOpenModalReject(true);
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_refuse'
                    )}
                  </LoadingButton>
                </Grid>
                <Grid item md={2}>
                  <LoadingButton
                    data-cy={`content.administrative.project_details.payment.table.btn.exchange_permit_approve_${index}`}
                    sx={{
                      backgroundColor: '#0E8478',
                      color: '#fff',
                    }}
                    startIcon={<CheckIcon />}
                    disabled={
                      currentSelectedIndex !== index ||
                      currentSelectedIndex !== stepBeforeComplete ||
                      isLoading
                    }
                    loading={isLoading}
                    onClick={() => {
                      handleApprovalPayment(item.id);
                    }}
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_approve'
                    )}
                  </LoadingButton>
                </Grid>
              </>
            ) : currentSelectedIndex === stepBeforeComplete &&
              item.status === 'rejected_by_project_manager' ? (
              <Grid item md={2}>
                <Typography
                  data-cy="content.administrative.project_details.payment.table.btn.exchange_permit_refuse"
                  color="error"
                  variant="h6"
                >
                  {translate(
                    'content.administrative.project_details.payment.table.btn.exchange_permit_refuse'
                  )}
                </Typography>
              </Grid>
            ) : null}
            {/* {item &&
              item.status === 'done' &&
              item.cheques.length > 0 &&
              item.cheques.map((item: any, index: number) => (
                <Grid item key={index} md={2} sx={{ textAlign: '-webkit-center' }}>
                  <Button
                    data-cy="btn.view_transfer_receipt"
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
            {item && item.status === 'done' && item.cheques.length > 0 && (
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
            {item.status === 'done' ? (
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
            ) : null}
          </Grid>
        </Grid>
      ))}
    </>
  );
}

export default PaymentsTable;
