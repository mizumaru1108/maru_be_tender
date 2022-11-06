import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { AdjustClentAvailableTime } from 'sections/client/appointments/adjust-your-time';
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100%',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function AdjustYourTime() {
  return (
    <Page title="Appointments with the company">
      <Container>
        <ContentStyle>
          <AdjustClentAvailableTime />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AdjustYourTime;
