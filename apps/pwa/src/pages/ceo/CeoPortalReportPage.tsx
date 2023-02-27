import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoRejectionList from '../../sections/ceo/ceo-rejection-list';
import CeoPortalReport from '../../sections/ceo/ceo-portal-reports';
import useLocales from '../../hooks/useLocales';

function CeoPortalReportPage() {
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
    // <Page title="Ceo - Portal Report">
    <Page title={translate('pages.common.portal_reports')}>
      <Container>
        <ContentStyle>
          <CeoPortalReport />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default CeoPortalReportPage;
