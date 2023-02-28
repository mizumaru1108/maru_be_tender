import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import BookingAMeetingWothClient from 'sections/project-manager/appintments-with-partner/BookingAMeetingWothClient';
import useLocales from '../../hooks/useLocales';
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function BookingAMeeting() {
  const { translate } = useLocales();
  return (
    // <Page title="Booking a Meeting">
    <Page title={translate('pages.project_manager.book_a_meeting')}>
      <Container>
        <ContentStyle>
          <BookingAMeetingWothClient />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default BookingAMeeting;
