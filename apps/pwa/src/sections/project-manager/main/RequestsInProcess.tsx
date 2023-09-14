import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

function RequestsInProcess() {
  const { translate } = useLocales();

  return (
    <Grid item md={12}>
      <CardTableByBE
        title={translate('content.client.main_page.process_request')}
        destination="requests-in-process"
        endPoint="tender-proposal/request-in-process"
        limitShowCard={4}
        cardFooterButtonAction="show-details"
        typeRequest="inprocess"
        showPagination={false}
        navigateLink="/project-manager/dashboard/requests-in-process"
      />
    </Grid>
  );
}

export default RequestsInProcess;
