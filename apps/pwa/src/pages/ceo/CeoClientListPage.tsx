import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoClientList from '../../sections/ceo/ceo-clientlist';

function CeoClientListPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Ceo - Rejection List">
      <Container>
        <ContentStyle>
          <CeoClientList />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default CeoClientListPage;
