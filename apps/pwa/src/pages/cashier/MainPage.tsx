import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import Main from 'sections/cashier/main/Main';

function MainPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="The Cashier | Main Page">
      <Container>
        <ContentStyle>
          <Main />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainPage;
