import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import Appointments from 'sections/project-supervisor/appintments-with-partner';
import useLocales from '../../hooks/useLocales';
import { FEATURE_APPOINTMENT } from 'config';

function AppointmentsWithPartners() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    // <Page title="Appointments With Partners">
    <Page title={translate('pages.project_manager.appointments')}>
      <Container>
        <ContentStyle>
          {FEATURE_APPOINTMENT ? <Appointments /> : <>Under Constuction</>}
          {/* <Appointments /> */}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AppointmentsWithPartners;
