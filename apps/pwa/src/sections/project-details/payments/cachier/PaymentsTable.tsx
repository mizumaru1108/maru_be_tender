import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import { useSelector } from 'redux/store';
import React from 'react';
import UploadingForm from './UploadingForm';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import { role_url_map } from '../../../../@types/commons';

function PaymentsTable() {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate } = useLocales();
  const navigate = useNavigate();

  const { activeRole } = useAuth();

  const [modalState, setModalState] = React.useState({ isOpen: false, payment_id: '' });

  const handleOpenModal = (payment_id: string) => {
    setModalState({ isOpen: true, payment_id });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, payment_id: '' });
  };
  console.log('proposal.payments.', proposal.payments);

  return (
    <>
      {modalState.isOpen && (
        <UploadingForm paymentId={modalState.payment_id} onClose={handleCloseModal} />
      )}
      {[...proposal.payments]
        .sort((a: any, b: any) => parseInt(a.order) - parseInt(b.order))
        .map((item, index) => (
          <Grid item md={12} key={index} sx={{ mb: '20px' }}>
            <Grid container direction="row" key={item.order} spacing={2} alignItems="center">
              <Grid item md={2} sx={{ alignSelf: 'center' }}>
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
                    {item.payment_amount}
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
              {item.status !== 'set_by_supervisor' && (
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
              )}

              {item.status === 'accepted_by_finance' && activeRole === 'tender_cashier' ? (
                <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
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
                    {translate('finance_pages.button.upload_receipt')}
                  </Button>
                </Grid>
              ) : item.status === 'done' || item.status === 'accepted_by_finance' ? (
                <>
                  <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                    {item.cheques.length ? (
                      <Button
                        // component={Link}
                        // href={
                        //   typeof item.cheques[0].transfer_receipt === 'string'
                        //     ? item.cheques[0].transfer_receipt
                        //     : item.cheques[0].transfer_receipt.url
                        // }
                        // target="_blank"
                        // rel="noopener noreferrer"
                        // download="صورة بطاقة الحساب البنكي"
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
                </>
              ) : null}
              {(item.status === 'done' || item.status === 'accepted_by_finance') &&
                activeRole !== 'tender_client' && (
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
            </Grid>
          </Grid>
        ))}
    </>
  );
}

export default PaymentsTable;
