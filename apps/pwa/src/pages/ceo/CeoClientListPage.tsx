import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoClientList from '../../sections/ceo/ceo-clientlist';
import useLocales from '../../hooks/useLocales';

function CeoClientListPage() {
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
    // <Page title="Ceo Client List Page | Ceo">
    <Page title={translate('pages.common.client_list')}>
      <Container>
        <ContentStyle>
          <CeoClientList />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default CeoClientListPage;
