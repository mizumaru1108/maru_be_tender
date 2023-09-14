import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

function ExchangePermission() {
  const { translate } = useLocales();

  return (
    <Grid item md={12}>
      <CardTableByBE
        title={translate('exchange_permission')}
        destination="exchange-permission"
        endPoint="tender-proposal/payment-adjustment"
        limitShowCard={4}
        cardFooterButtonAction="completing-exchange-permission"
        showPagination={false}
        navigateLink="/project-manager/dashboard/exchange-permission"
      />
    </Grid>
  );
}

export default ExchangePermission;
