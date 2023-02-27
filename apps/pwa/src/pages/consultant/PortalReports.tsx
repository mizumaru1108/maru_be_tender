import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import useLocales from '../../hooks/useLocales';

function PortalReports() {
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
    // <Page title="Previous Funding Requests">
    <Page title={translate('pages.common.portal_reports')}>
      <Container>
        <ContentStyle>Portal Reports</ContentStyle>
      </Container>
    </Page>
  );
}

export default PortalReports;
