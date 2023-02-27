import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { AppointmentsPage } from 'sections/client/appointments';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100%',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function Appointments() {
  const { translate } = useLocales();
  return (
    // <Page title="Appointments with the company">
    <Page title={translate('pages.client.appointments_with')}>
      <Container>
        <ContentStyle>
          <AppointmentsPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default Appointments;
