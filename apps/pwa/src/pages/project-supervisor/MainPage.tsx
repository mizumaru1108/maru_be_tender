import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import Main from 'sections/project-supervisor/main/Main';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function MainPage() {
  const { translate } = useLocales();
  return (
    // <Page title="Supervisor | Main Page">
    <Page title={translate('pages.project_supervisor.main')}>
      <Container>
        <ContentStyle>
          <Main />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainPage;
