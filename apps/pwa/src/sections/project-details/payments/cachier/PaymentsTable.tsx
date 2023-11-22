import { Button, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'redux/store';
import React from 'react';
import UploadingForm from './UploadingForm';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import { role_url_map } from '../../../../@types/commons';
import { TransferReceipt } from '../../../../@types/proposal';
import { grey } from '@mui/material/colors';
import Iconify from 'components/Iconify';
import Label from 'components/Label';

function PaymentsTable() {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();

  const { activeRole } = useAuth();

  const [modalState, setModalState] = React.useState({ isOpen: false, payment_id: '' });
  const [sortingData, setSortingData] = React.useState<any[]>([]);
  const [currentIssuedPayament, setCurrentIssuedPayament] = React.useState(0);

  const handleOpenModal = (payment_id: string) => {
    setModalState({ isOpen: true, payment_id });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, payment_id: '' });
  };

  React.useEffect(() => {
    const neWvalue: any = proposal.payments;
    const arr = [...neWvalue]
      .sort((a: any, b: any) => parseInt(a.order) - parseInt(b.order))
      .map((item: any) => item);
    setSortingData(arr);

    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status === 'accepted_by_finance') {
        setCurrentIssuedPayament(i);
        break;
      }
    }
  }, [proposal]);

  return (
    <>
      {modalState.isOpen && (
        <UploadingForm paymentId={modalState.payment_id} onClose={handleCloseModal} />
      )}
      {sortingData.length > 0 &&
        sortingData.map((item, index) => (
          <Grid
            item
            md={12}
            key={index}
            sx={{
              mb: 2,
              ...(currentLang && currentLang.value === 'en'
                ? {
                    pl: '40px !important',
                  }
                : {
                    pr: '40px !important',
                  }),
            }}
          >
            <Grid
              container
              direction="row"
              key={item.order}
              spacing={2}
              alignItems="center"
              sx={{
                border: `1px solid ${
                  item.status !== 'set_by_supervisor' ? '#0E847829' : grey[300]
                }`,
                borderRadius: 1,
                pb: 2,
              }}
            >
              {item.status !== 'set_by_supervisor' && (
                <Grid item xs={12}>
                  <Label color="primary">
                    {translate(
                      'content.administrative.project_details.payment.table.btn.exchange_permit_success'
                    )}
                  </Label>
                </Grid>
              )}
              <Grid item xs={12} md={2}>
                <Typography variant="h6">
                  <Typography component="span">
                    {translate('content.administrative.project_details.payment.table.td.batch_no')}
                  </Typography>
                  <Typography component="span">&nbsp;{item.order}</Typography>
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <Stack direction="column">
                  <Typography sx={{ color: '#93A3B0' }}>
                    {translate(
                      'content.administrative.project_details.payment.table.td.payment_no'
                    )}
                    :
                  </Typography>
                  <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                    {item.payment_amount}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
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
              {activeRole !== 'tender_client' ? (
                <Grid item xs={6} sm={3} md={2}>
                  <Stack direction="column">
                    <Typography sx={{ color: '#93A3B0' }}>
                      {translate(
                        'content.administrative.project_details.payment.table.td.reason_payment'
                      )}
                      :
                    </Typography>
                    <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                      {item.notes && item.notes !== '' ? item.notes : '-'}
                    </Typography>
                  </Stack>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
                  {activeRole !== 'tender_client' ? (
                    <Grid item xs={12} sm={6} md={4}>
                      <Button
                        variant="contained"
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
                  ) : null}
                  {item.status === 'done' ||
                  item.status === 'uploaded_by_cashier' ||
                  item.status === 'accepted_by_finance' ? (
                    <>
                      {item && item.status === 'done' && item.cheques.length > 0 && (
                        <Grid item xs={12} sm={6} md={2} key={index}>
                          <Button
                            data-cy="btn.view_transfer_receipt"
                            variant="contained"
                            color="inherit"
                            sx={{
                              '&:hover': { textDecorationLine: 'underline' },
                            }}
                            href={
                              (
                                item.cheques[item.cheques.length - 1]
                                  ?.transfer_receipt as TransferReceipt
                              )?.url ?? '#'
                            }
                            target="_blank"
                          >
                            {translate(
                              'content.administrative.project_details.payment.table.btn.view_transfer_receipt'
                            )}
                          </Button>
                        </Grid>
                      )}
                    </>
                  ) : null}
                  {item.status === 'done' && activeRole !== 'tender_client' ? (
                    <Grid item xs={12} sm={6} md={6}>
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
                          data-cy={'table.btn.not_found_cheques'}
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
                  {item.status === 'accepted_by_finance' && activeRole !== 'tender_client' ? (
                    <Grid item xs={12} sm={4}>
                      <Button
                        data-cy={`finance_pages.button.upload_receipt_${index}`}
                        sx={{
                          backgroundColor: 'transparent',
                          color: '#000',
                          textDecorationLine: 'underline',
                          height: '100%',
                          ':hover': { backgroundColor: '#b8b7b4', textDecorationLine: 'underline' },
                          width: { xs: '80%', md: '100%' },
                          border: `1px solid #000`,
                          borderStyle: 'dashed',
                        }}
                        disabled={index !== currentIssuedPayament}
                        endIcon={
                          <img src="/icons/uploading-field/uploading-cheque-icon.svg" alt="" />
                        }
                        onClick={() => {
                          handleOpenModal(item.id);
                        }}
                      >
                        {translate('finance_pages.button.upload_receipt')}
                      </Button>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
    </>
  );
}

export default PaymentsTable;
