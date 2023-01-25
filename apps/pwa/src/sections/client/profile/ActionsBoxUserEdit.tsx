import { Button, Stack } from '@mui/material';

const ActionsBoxUserEdit = () => (
  <Stack justifyContent="center" direction="row" gap={2}>
    <Button
      type="submit"
      variant={'contained'}
      sx={{
        backgroundColor: 'background.paper',
        color: '#fff',
        width: { xs: '100%', sm: '200px' },
        hieght: { xs: '100%', sm: '50px' },
      }}
    >
      تحديث
    </Button>
  </Stack>
);

export default ActionsBoxUserEdit;
