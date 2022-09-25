import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';

function Messages() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Previous Funding Requests">
      <Container>
        <ContentStyle>Messages</ContentStyle>
      </Container>
    </Page>
  );
}

export default Messages;
