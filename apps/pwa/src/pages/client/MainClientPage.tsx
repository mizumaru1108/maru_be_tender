import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import DashboardPage from 'sections/client/dashboard/DashboardPage';

function MainClientPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));

  return (
    <Page title="Fundin Project Request">
      <Container>
        <ContentStyle>
          <DashboardPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainClientPage;
