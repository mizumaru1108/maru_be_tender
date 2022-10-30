import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { AppointmentsPage } from 'sections/client/appointments';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100%',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function Appointments() {
  return (
    <Page title="Appointments with the company">
      <Container>
        <ContentStyle>
          <AppointmentsPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default Appointments;
