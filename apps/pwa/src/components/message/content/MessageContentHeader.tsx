import { Box, Stack, Typography } from '@mui/material';

export default function MessageContentHeader() {
  return (
    <Stack direction="column" padding="10px" sx={{ mt: 4 }}>
      {/* Stack for header message */}
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <img src="/assets/icons/users-alt-green.svg" alt="logo" />
        </Box>
        <Typography>Partner Name - Project Name</Typography>
      </Stack>
    </Stack>
  );
}
