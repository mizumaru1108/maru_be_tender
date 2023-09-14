import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

function PaymentAdjustment() {
  const { translate } = useLocales();

  return (
    <Grid item md={12}>
      <CardTableByBE
        title={translate('pages.common.payment_adjustment')}
        endPoint="tender-proposal/payment-adjustment"
        destination="payment-adjustment"
        limitShowCard={4}
        cardFooterButtonAction="completing-exchange-permission"
        showPagination={false}
        navigateLink="/project-supervisor/dashboard/payment-adjustment"
      />
    </Grid>
  );
}

export default PaymentAdjustment;
