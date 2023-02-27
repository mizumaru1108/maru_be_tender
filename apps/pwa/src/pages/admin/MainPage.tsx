import { Container, styled } from '@mui/material';
import Page from 'components/Page';
import Main from 'sections/admin/main/Main';
import useLocales from '../../hooks/useLocales';

function MainPage() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: 42,
  }));
  return (
    // <Page title="Admin | Main Page">
    <Page title={translate('pages.admin.main')}>
      <Container>
        <ContentStyle>
          <Main />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainPage;
