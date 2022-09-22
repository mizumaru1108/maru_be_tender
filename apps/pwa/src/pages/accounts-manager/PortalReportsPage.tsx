import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';

function PortalReportsPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));

  return (
    <Page title="Portal Reports Page">
      <Container>
        <ContentStyle>
          <Typography>Portal Reports</Typography>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PortalReportsPage;
