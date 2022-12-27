import { Box, Typography } from '@mui/material';
import { useSelector } from 'redux/store';

function ProjectStatus() {
  const { proposal } = useSelector((state) => state.proposal);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        borderRadius: '10px',
        backgroundColor: '#0E847829',
        px: '5px',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#0E8478',
        }}
      >
        {'State : ' + proposal.state || 'حالة المشروع'}
      </Typography>
      <Typography
        sx={{
          color: {
            COMPLETED: '#0E8478',
            ONGOING: '#0E8478',
            PENDING: '#000',
            CANCELED: '#EB5757',
          }[`${proposal.outter_status}`],
        }}
      >
        {'status : ' + proposal.outter_status || 'status'}
      </Typography>
    </Box>
  );
}

export default ProjectStatus;