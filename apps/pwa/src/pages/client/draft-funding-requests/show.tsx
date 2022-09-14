import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';

function DraftsFundingRequest() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Draft Funding Request | #123D13V">
      <Container>
        <ContentStyle></ContentStyle>
      </Container>
    </Page>
  );
}

export default DraftsFundingRequest;
