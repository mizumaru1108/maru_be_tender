import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import DashboardPage from 'sections/client/dashboard';

function MainClientPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));

  return (
    <Page title="Client Dashboard">
      <Container>
        <ContentStyle>
          <DashboardPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainClientPage;
