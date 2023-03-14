import { Box, Typography, Grid, useTheme } from '@mui/material';
import { useSelector } from 'redux/store';
import PaymentsTable from './PaymentsTable';
import { fCurrencyNumber } from 'utils/formatNumber';
import useLocales from 'hooks/useLocales';
//
import FloatingCloseReport from '../../floating-close-report/index';
import { useEffect, useState } from 'react';

function CashierPaymentsPage() {
  const { translate } = useLocales();
  const theme = useTheme();
  const { proposal } = useSelector((state) => state.proposal);

  const [paymentDone, setPayementDone] = useState<boolean>(false);

  useEffect(() => {
    const acc_payments = proposal.number_of_payments_by_supervisor;
    const payment_actual_done = proposal.payments.filter(
      (el: { status: string }) => el.status === 'DONE'
    ).length;

    if (payment_actual_done === acc_payments && proposal.inner_status !== 'DONE_BY_CASHIER') {
      setPayementDone(true);
    } else {
      setPayementDone(false);
    }
  }, [proposal]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <Typography variant="h4">
            {translate(
              'content.administrative.project_details.payment.heading.exchange_information'
            )}
          </Typography>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: '#fff',
              p: 2,
            }}
          >
            <img src={`/icons/rial-currency.svg`} alt="" />
            <Typography sx={{ color: '#93A3B0', fontSize: '10px', my: '5px' }}>
              {translate('content.client.main_page.total_track_budget')}
            </Typography>
            <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
              {fCurrencyNumber(proposal.fsupport_by_supervisor)}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: '#fff',
              p: 2,
            }}
          >
            <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
              {translate(
                'content.administrative.project_details.payment.heading.registered_payments'
              )}
            </Typography>
            <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
              <Typography
                component="span"
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                  color: theme.palette.primary.main,
                }}
              >
                {proposal.number_of_payments_by_supervisor ?? 0}&nbsp;
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                  color: theme.palette.primary.main,
                }}
              >
                {translate('project_details.actions.payments')}
              </Typography>
            </Typography>
          </Box>
        </Grid>

        <Grid item md={12}>
          <Typography variant="h4">
            {translate('content.administrative.project_details.payment.heading.split_payments')}
          </Typography>
        </Grid>
        <PaymentsTable />

        {paymentDone ? <FloatingCloseReport /> : null}
      </Grid>
    </>
  );
}

export default CashierPaymentsPage;
