import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

function IncomingExchangePermissionRequests() {
  const { translate } = useLocales();
  return (
    <Grid item md={12} xs={12}>
      <CardTableByBE
        title={translate('finance_pages.heading.outgoing_exchange_request')}
        destination="incoming-exchange-permission-requests"
        endPoint="tender-proposal/payment-adjustment"
        limitShowCard={4}
        cardFooterButtonAction="completing-exchange-permission"
        showPagination={false}
        navigateLink="/finance/dashboard/incoming-exchange-permission-requests"
      />
    </Grid>
  );
}

export default IncomingExchangePermissionRequests;
