import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
// sections
import useLocales from '../hooks/useLocales';
import CardTableByBE from 'components/card-table/CardTableByBE';

function PortalReports() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: 40,
  }));

  return (
    <Page title={translate('pages.common.portal_reports')}>
      <Container>
        <ContentStyle>
          <CardTableByBE
            title={translate('section_portal_reports.heading.reports')}
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

export default PortalReports;
