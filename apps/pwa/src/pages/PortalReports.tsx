import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
// sections
import PortalReportsSection from 'sections/portal-reports';
import useLocales from '../hooks/useLocales';

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
    // <Page title="Portal Reports Page">
    <Page title={translate('pages.common.portal_reports')}>
      <Container>
        <ContentStyle>
          <PortalReportsSection />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PortalReports;
