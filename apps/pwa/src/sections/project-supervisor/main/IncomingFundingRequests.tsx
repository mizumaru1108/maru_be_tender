import { Container, Grid, styled } from '@mui/material';
import CardTableByBE from 'components/card-table/CardTableByBE';
import useLocales from 'hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function IncomingFundingRequests() {
  const { translate } = useLocales();

  return (
    <Grid item md={12}>
      <CardTableByBE
        title={translate('incoming_support_requests')}
        destination="requests-in-process"
        endPoint="tender-proposal/request-in-process"
        limitShowCard={4}
        cardFooterButtonAction="show-details"
        typeRequest="incoming"
        showPagination={false}
        navigateLink="/project-supervisor/dashboard/incoming-funding-requests"
      />
    </Grid>
  );
}

export default IncomingFundingRequests;
