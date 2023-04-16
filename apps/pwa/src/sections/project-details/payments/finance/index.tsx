import { Box, Grid, Typography, useTheme } from '@mui/material';
import { Proposal } from '../../../../@types/proposal';
import { useSelector } from 'redux/store';
import PaymentsTable from './PaymentsTable';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import useLocales from 'hooks/useLocales';
import { useEffect, useState } from 'react';

function FinancePaymentsPage() {
  const { translate } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);
  const theme = useTheme();

  const [valueSpending, setValueSpending] = useState<number>(0);

  useEffect(() => {
    const paymentList = proposal.payments
      .filter((el) => el.status === 'done')
      .map((el) => Number(el.payment_amount));
    const totalPayments = paymentList.reduce((a, b) => a + b, 0);

    setValueSpending(totalPayments);
  }, [proposal]);

  return (
    <Grid container spacing={3}>
      <Grid item md={12}>
        <Typography variant="h4">
          {translate('content.administrative.project_details.payment.heading.exchange_information')}
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
            {translate('content.administrative.project_details.payment.heading.project_budget')}
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>{`${fCurrencyNumber(
            (proposal as Proposal).fsupport_by_supervisor
          )}`}</Typography>
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
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            p: 2,
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            {translate('content.administrative.project_details.payment.heading.amount_spent')}
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
            {fCurrencyNumber(valueSpending)}
          </Typography>
        </Box>
      </Grid>

      <Grid item md={12}>
        <Typography variant="h4" sx={{ mt: 2 }}>
          {translate('content.administrative.project_details.payment.heading.split_payments')}
        </Typography>
      </Grid>
      <Grid item md={12} xs={12}>
        <PaymentsTable />
      </Grid>
    </Grid>
  );
}

export default FinancePaymentsPage;
