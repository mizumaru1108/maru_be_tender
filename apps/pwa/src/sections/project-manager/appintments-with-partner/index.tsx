import { Button, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import MeetingBox from './MeetingBox';
import { data } from './mockData';

function Appointments() {
  const navigate = useNavigate();
  const { translate } = useLocales();
  return (
    <Stack direction="column" gap={3}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">{translate('appointments_with_clients')}</Typography>
        <Button
          sx={{
            backgroundColor: '#0E8478',
            color: '#fff',
            borderRadius: '5px',
            px: '30px',
            py: '10px',
          }}
          onClick={() => {
            navigate('/project-manager/dashboard/appointments-with-partners/booking');
          }}
        >
          {translate('booking_for_a_meeting')}
        </Button>
      </Stack>
      <Typography color="#8E8E8E" sx={{ mt: '30px' }}>
        {translate('todays_meetings')}
      </Typography>
      {data.map((item, index) => (
        <MeetingBox key={index} id={item.id} date={item.date} client_name={item.client_name} />
      ))}
      <Typography color="#8E8E8E" sx={{ mt: '30px' }}>
        {translate('upcoming_meetings')}
      </Typography>
      {data.map((item, index) => (
        <MeetingBox key={index} id={item.id} date={item.date} client_name={item.client_name} />
      ))}
    </Stack>
  );
}

export default Appointments;
