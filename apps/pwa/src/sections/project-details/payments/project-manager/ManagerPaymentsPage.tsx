import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import PaymentsTable from './PaymentsTable';
import { useSelector } from 'redux/store';
import { fCurrencyNumber } from 'utils/formatNumber';
import useLocales from 'hooks/useLocales';
import Image from 'components/Image';

function ManagerPaymentsPage() {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate } = useLocales();
  const theme = useTheme();

  const [valuePayments, setValuePayments] = useState<number>(0);

  useEffect(() => {
    const paymentList: number[] = proposal.payments.map((el) => el.payment_amount);
    const totalPayments = paymentList.reduce((acc: number, curr: number) => acc + (curr || 0), 0);

    setValuePayments(totalPayments);
  }, [proposal]);

  return (
    <Grid container spacing={3} sx={{ mt: '2px' }}>
      <Grid item md={12} xs={12}>
        <Stack direction="column" gap={2}>
          <Typography variant="h4">
            {translate(
              'content.administrative.project_details.payment.heading.exchange_information'
            )}
          </Typography>
          <Typography variant="h6">
            <Typography
              component="span"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
                color: theme.palette.primary.main,
              }}
            >
              {translate('content.administrative.project_details.payment.heading.iban')}
              &nbsp;:&nbsp;
            </Typography>
            <Typography
              component="span"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
                color: theme.palette.primary.main,
              }}
            >
              {proposal.user.bank_informations[0].bank_account_number}
            </Typography>
          </Typography>
        </Stack>
      </Grid>
      <Grid item md={12}>
        <Typography variant="h4">
          {translate('content.administrative.project_details.payment.heading.project_budget')}
        </Typography>
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
          <Image
            src={`/icons/rial-currency.svg`}
            alt="icon_rial_currency"
            sx={{ display: 'inline-flex' }}
          />
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            {translate('content.administrative.project_details.payment.heading.total_budget')}
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
            {fCurrencyNumber(proposal.amount_required_fsupport)}
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
            {fCurrencyNumber(valuePayments)}
          </Typography>
        </Box>{' '}
      </Grid>
      <Grid item md={12}>
        <Typography variant="h4">
          {translate('content.administrative.project_details.payment.heading.split_payments')}
        </Typography>
      </Grid>
      <Grid item md={12}>
        <PaymentsTable />
      </Grid>
    </Grid>
  );
}

export default ManagerPaymentsPage;
