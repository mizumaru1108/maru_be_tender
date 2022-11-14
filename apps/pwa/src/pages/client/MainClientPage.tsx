import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import DashboardPage from 'sections/client/dashboard';
import useLocales from 'hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function MainClientPage() {
  const { translate } = useLocales();
  return (
    <Page title={translate('pages.client.main')}>
      <Container>
        <ContentStyle>
          <DashboardPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainClientPage;
