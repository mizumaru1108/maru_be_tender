import { Box } from '@mui/material';
import TodaysAppointments from './TodaysAppointments';
import UpcomingAppointments from './UpcomingAppointments';

function AppointmentsTap() {
  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
      <TodaysAppointments />
      <UpcomingAppointments />
    </Box>
  );
}

export default AppointmentsTap;
