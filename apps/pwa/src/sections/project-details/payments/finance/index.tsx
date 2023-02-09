import { Box, Grid, Typography, useTheme } from '@mui/material';
import { Proposal } from '../../../../@types/proposal';
import { useSelector } from 'redux/store';
import PaymentsTable from './PaymentsTable';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import useLocales from 'hooks/useLocales';

function FinancePaymentsPage() {
  const { translate } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);
  const theme = useTheme();

  return (
    <Grid container spacing={3} sx={{ mt: '8px' }}>
      <Grid item md={12}>
        <Typography variant="h4">
          {translate('content.administrative.project_details.payment.heading.exchange_information')}
        </Typography>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
            height: '120px',
          }}
        >
          <img src={`/icons/rial-currency.svg`} alt="" />
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
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
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
            height: '120px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            {translate(
              'content.administrative.project_details.payment.heading.registered_payments'
            )}
          </Typography>
          {/* <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>{`${
            (proposal as Proposal).number_of_payments_by_supervisor ?? 0
          } دفعات`}</Typography> */}
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
      <Grid item md={12} xs={12}>
        <PaymentsTable />
      </Grid>
    </Grid>
  );
}

export default FinancePaymentsPage;
