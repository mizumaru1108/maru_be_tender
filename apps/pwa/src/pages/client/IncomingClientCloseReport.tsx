// @mui
import { Container, styled } from '@mui/material';
// components
import Page from 'components/Page';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from '../../hooks/useLocales';
// query
import CardTableByBE from 'components/card-table/CardTableByBE';

function IncomingCloseReports() {
  const { user } = useAuth();
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
    <Page title={translate('pages.common.close_report.text.project_report')}>
      <Container>
        <ContentStyle>
          <CardTableByBE
            title={translate('pages.common.close_report.text.project_report')}
            destination="project-report"
            endPoint="tender-proposal/closing-report-list"
            limitShowCard={6}
            cardFooterButtonAction="show-details"
            sorting={['sorting', 'project_name', 'track', 'range_date']}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingCloseReports;
