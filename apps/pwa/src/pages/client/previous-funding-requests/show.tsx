import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';

function PreviousFundingRequests() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Previous Funding Request | #Af123V3">
      <Container>
        <ContentStyle />
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;
