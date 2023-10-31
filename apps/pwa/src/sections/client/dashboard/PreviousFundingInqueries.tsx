import { Grid } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

function PreviousFundingInqueries() {
  const { translate } = useLocales();

  return (
    <>
      <Grid item md={12} xs={12}>
        <CardTableByBE
          title={translate('previous_support_requests')}
          endPoint="tender-proposal/previous"
          destination="previous-funding-requests"
          limitShowCard={4}
          cardFooterButtonAction="show-project"
          showPagination={false}
          navigateLink="/client/dashboard/previous-funding-requests"
          sorting={['sorting']}
        />
      </Grid>
    </>
  );
}

export default PreviousFundingInqueries;
