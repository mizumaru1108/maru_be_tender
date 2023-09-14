import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

function IncomingFundingRequests() {
  const { translate } = useLocales();
  return (
    <Grid item md={12}>
      <CardTableByBE
        title={translate('incoming_funding_requests_project_supervisor')}
        destination="incoming-funding-requests"
        endPoint="tender-proposal/request-in-process"
        limitShowCard={4}
        cardFooterButtonAction="show-details"
        typeRequest="incoming"
        showPagination={false}
        navigateLink="/project-manager/dashboard/incoming-funding-requests"
      />
    </Grid>
  );
}

export default IncomingFundingRequests;
