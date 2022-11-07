import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import BookingAMeetingWothClient from 'sections/project-manager/appintments-with-partner/BookingAMeetingWothClient';
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function BookingAMeeting() {
  return (
    <Page title="Booking a Meeting">
      <Container>
        <ContentStyle>
          <BookingAMeetingWothClient />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default BookingAMeeting;
