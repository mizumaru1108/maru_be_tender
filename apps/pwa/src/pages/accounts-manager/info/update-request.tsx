import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';

function InfoUpdateRequestPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));

  return (
    <Page title="Information Update Request">
      <Container>
        <ContentStyle>
          <Typography>Info Update Request</Typography>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default InfoUpdateRequestPage;
