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
  const [sortingData, setSortingData] = React.useState<any[]>([]);
  const [currentIssuedPayament, setCurrentIssuedPayament] = React.useState(0);

  const handleOpenModal = (payment_id: string) => {
    setModalState({ isOpen: true, payment_id });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, payment_id: '' });
  };

  React.useEffect(() => {
    // const
    const neWvalue: any = proposal.payments;
    const arr = [...neWvalue]
      .sort((a: any, b: any) => parseInt(a.order) - parseInt(b.order))
      .map((item: any) => item);
    setSortingData(arr);
    // console.log('test', arr);

    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status === 'accepted_by_finance') {
        setCurrentIssuedPayament(i);
        break;
      }
    }

    console.log({ proposal });
  }, [proposal]);
  // console.log('proposal.payments.', proposal.payments);

  return (
    <>
      {modalState.isOpen && (
        <UploadingForm paymentId={modalState.payment_id} onClose={handleCloseModal} />
      )}
      {sortingData.length > 0 &&
        sortingData.map((item, index) => (
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
              {(item.status === 'done' || item.status === 'accepted_by_finance') &&
                activeRole !== 'tender_client' && (
                  <>
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

                    {item &&
                      item.cheques.length > 0 &&
                      item.cheques.map((item: any, index: number) => (
                        <Grid item key={index} md={2} sx={{ textAlign: '-webkit-center' }}>
                          <Button
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
                      ))}
                  </>
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
                <>
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
                </>
              ) : null}
            </Grid>
          </Grid>
        ))}
    </>
  );
}

export default PaymentsTable;
