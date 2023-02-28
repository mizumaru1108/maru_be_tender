import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import Main from 'sections/finance/main/Main';
import useLocales from '../../hooks/useLocales';

function MainPage() {
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
    // <Page title="The Finance | Main Page">
    <Page title={translate('pages.finance.main')}>
      <Container>
        <ContentStyle>
          <Main />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainPage;
