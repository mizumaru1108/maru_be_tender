import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoMessage from '../../sections/ceo/ceo-messages';

function CeoMessagePage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Ceo Messaging">
      <Container>
        <ContentStyle>
          <CeoMessage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default CeoMessagePage;
