import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import useLocales from 'hooks/useLocales';
import CardTableByBE from '../../components/card-table/CardTableByBE';

function PreviousFundingRequests() {
  const { translate } = useLocales();

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title={translate('pages.common.previous_funding_requests')}>
      <Container>
        <ContentStyle>
          <CardTableByBE
            title={translate('previous_support_requests')}
            endPoint="tender-proposal/previous"
            destination="previous-funding-requests"
            limitShowCard={6}
            cardFooterButtonAction="show-project"
            sorting={[
              'sorting',
              'project_name',
              'project_status',
              'range_date',
              'client_name',
              'track',
            ]}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;
