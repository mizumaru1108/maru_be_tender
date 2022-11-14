import { Box, Stack, Typography } from '@mui/material';

function FollowUpsAction({ created_at, action }: any) {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '95%',
      }}
    >
      <Stack direction="column" justifyContent="space-between">
        <Typography>{action}</Typography>
        <Typography sx={{ color: 'gray', alignSelf: 'end', fontSize: '10px' }}>{`${
          new Date().getDate() - new Date(created_at).getDate()
        } ساعات`}</Typography>
      </Stack>
    </Box>
  );
}

export default FollowUpsAction;
