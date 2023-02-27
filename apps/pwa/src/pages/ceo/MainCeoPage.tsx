import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoDashboard from '../../sections/ceo/ceo-dashboard';
import useLocales from '../../hooks/useLocales';

function MainCeoPage() {
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
    // <Page title="Dashboard | Ceo">
    <Page title={translate('pages.ceo.main')}>
      <Container>
        <ContentStyle>
          <CeoDashboard />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainCeoPage;
