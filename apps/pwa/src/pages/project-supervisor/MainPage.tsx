import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import Main from 'sections/project-supervisor/main/Main';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function MainPage() {
  return (
    <Page title="Supervisor | Main Page">
      <Container>
        <ContentStyle>
          <Main />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainPage;
