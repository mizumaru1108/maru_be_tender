import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

function RequestsInProcess() {
  const { translate } = useLocales();
  return (
    <Grid item md={12} xs={12}>
      <CardTableByBE
        title={translate('finance_pages.heading.proccess_request')}
        destination="requests-in-process"
        endPoint="tender-proposal/request-in-process"
        limitShowCard={4}
        cardFooterButtonAction="completing-exchange-permission"
        typeRequest="inprocess"
        showPagination={false}
        navigateLink="/cashier/dashboard/requests-in-process"
      />
    </Grid>
  );
}

export default RequestsInProcess;
