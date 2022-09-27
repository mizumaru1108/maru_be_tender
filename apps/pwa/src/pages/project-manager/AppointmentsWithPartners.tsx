import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import Appointments from 'sections/project-manager/appintments-with-partner';

function AppointmentsWithPartners() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Appointments With Partners">
      <Container>
        <ContentStyle>
          <Appointments />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AppointmentsWithPartners;
