import { Button, Stack } from '@mui/material';

const ActionsBox = () => (
  <Stack justifyContent="center" direction="row" gap={2}>
    <Button
      type="submit"
      sx={{
        backgroundColor: 'background.paper',
        color: '#fff',
        width: { xs: '100%', sm: '200px' },
        hieght: { xs: '100%', sm: '50px' },
      }}
    >
      حفظ
    </Button>
  </Stack>
);

export default ActionsBox;
