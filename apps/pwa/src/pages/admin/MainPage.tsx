import { Container, styled } from '@mui/material';
import Page from 'components/Page';
import Main from 'sections/admin/main/Main';

function MainPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: 42,
  }));
  return (
    <Page title="Manager Dashboard">
      <Container>
        <ContentStyle>
          <Main />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainPage;
