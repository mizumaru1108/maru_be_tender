// @mui
import { Grid } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
// query
import CardTableByBE from 'components/card-table/CardTableByBE';

// ------------------------------------------------------------------------------------------

export default function IncomingCloseReport() {
  const { translate } = useLocales();

  return (
    <Grid item md={12}>
      <CardTableByBE
        title={translate('pages.common.close_report.text.project_report')}
        destination="project-report"
        endPoint="tender-proposal/closing-report-list"
        limitShowCard={6}
        cardFooterButtonAction="show-details"
        showPagination={false}
        navigateLink="/project-supervisor/dashboard/project-report"
      />
    </Grid>
  );
}
