import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import Appointments from 'sections/project-supervisor/appintments-with-partner';
import useLocales from 'hooks/useLocales';
import PrintProposal from 'sections/project-details/PrintProposal';

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
    <Page title={translate('pages.common.print_preview')}>
      <Container>
        <ContentStyle>
          <PrintProposal />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AppointmentsWithPartners;
