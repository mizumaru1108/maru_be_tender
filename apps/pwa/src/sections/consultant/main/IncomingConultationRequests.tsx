import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

function IncomingConultationRequests() {
  const { translate } = useLocales();
  return (
    <Grid item md={12} xs={12}>
      <CardTableByBE
        title={translate('incoming_funding_requests_project_supervisor')}
        destination="incoming-funding-requests"
        endPoint="tender-proposal/request-in-process"
        limitShowCard={4}
        cardFooterButtonAction="show-details"
        showPagination={false}
        navigateLink="/consultant/dashboard/incoming-funding-requests"
      />
    </Grid>
  );
}

export default IncomingConultationRequests;
