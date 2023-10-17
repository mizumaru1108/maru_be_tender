// @mui
import { Container, styled } from '@mui/material';
// components
import Page from 'components/Page';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from '../../hooks/useLocales';
// query
import CardTableByBE from 'components/card-table/CardTableByBE';

function InProcessCloseReports() {
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
    <Page title={translate('pages.common.close_report.text.pending_project_report')}>
      <Container>
        <ContentStyle>
          <CardTableByBE
            title={translate('pages.common.close_report.text.pending_project_report')}
            destination="complete-project-report"
            endPoint="tender-proposal/closing-report-list"
            limitShowCard={6}
            cardFooterButtonAction="show-project"
            addCustomFilter="&supervisor_status=waiting_to_be_submitted"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default InProcessCloseReports;
