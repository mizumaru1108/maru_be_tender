import { Box, CircularProgress, CircularProgressProps, Typography } from '@mui/material';

export function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        my: 3,
      }}
    >
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Compressing file
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 2,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
