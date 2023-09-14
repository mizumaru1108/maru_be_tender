import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

export default function RequestsInProcess() {
  const { translate } = useLocales();
  return (
    <Grid item md={12}>
      <CardTableByBE
        title={translate('pages.common.request_in_process')}
        destination="requests-in-process"
        endPoint="tender-proposal/request-in-process"
        limitShowCard={4}
        cardFooterButtonAction="show-details"
        typeRequest="inprocess"
        navigateLink="/project-supervisor/dashboard/requests-in-process"
        showPagination={false}
      />
    </Grid>
  );
}
