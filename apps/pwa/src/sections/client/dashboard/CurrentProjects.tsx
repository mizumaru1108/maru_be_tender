import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';
//

function CurrentProjects() {
  const { translate } = useLocales();

  return (
    <Grid item md={12} xs={12}>
      <CardTableByBE
        title={translate('content.client.main_page.current_projects')}
        destination="current-project"
        endPoint="/tender-proposal/list"
        limitShowCard={4}
        cardFooterButtonAction="show-details"
      />
    </Grid>
  );
}

export default CurrentProjects;
