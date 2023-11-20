import { Button, Stack } from '@mui/material';

interface Props {
  // children?: React.ReactNode;
  isEdit?: boolean;
}

const ActionsBox = ({ isEdit }: Props) => (
  <Stack justifyContent="center" direction="row" gap={2}>
    <Button
      type="submit"
      variant={isEdit ? 'outlined' : 'contained'}
      size="large"
      sx={{
        backgroundColor: isEdit ? '#fff' : 'background.paper',
        color: isEdit ? 'background.paper' : '#fff',
        width: { xs: '100%', sm: '200px' },
        hieght: { xs: '100%', sm: '50px' },
      }}
    >
      {isEdit ? 'إلغاء' : 'حفظ'}
    </Button>
  </Stack>
);

export default ActionsBox;
