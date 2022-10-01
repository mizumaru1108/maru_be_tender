import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoDashboard from '../../sections/ceo/ceo-dashboard';

function MainCeoPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Ceo Dashboard">
      <Container>
        <ContentStyle>
          <CeoDashboard />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainCeoPage;