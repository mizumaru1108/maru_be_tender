import { Button, Stack, Typography } from '@mui/material';
import MeetingBox from './MeetingBox';
import { data } from './mockData';

function Appointments() {
  return (
    <Stack direction="column" gap={3}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">المواعيد مع الشركاء</Typography>
        <Button
          sx={{
            backgroundColor: '#0E8478',
            color: '#fff',
            borderRadius: '5px',
            px: '30px',
            py: '10px',
          }}
        >
          حجز موعد مقابلة
        </Button>
      </Stack>
      <Typography color="#8E8E8E" sx={{ mt: '30px' }}>
        اجتماعات اليوم
      </Typography>
      {data.map((item, index) => (
        <MeetingBox key={index} id={item.id} date={item.date} client_name={item.client_name} />
      ))}
      <Typography color="#8E8E8E" sx={{ mt: '30px' }}>
        اجتماعات قادمة
      </Typography>
      {data.map((item, index) => (
        <MeetingBox key={index} id={item.id} date={item.date} client_name={item.client_name} />
      ))}
    </Stack>
  );
}

export default Appointments;
