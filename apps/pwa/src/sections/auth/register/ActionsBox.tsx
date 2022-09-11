import { Button, Stack } from '@mui/material';

type Props = {
  onReturn?: () => void;
};
const ActionsBox = ({ onReturn }: Props) => (
  <Stack justifyContent="center" direction="row" gap={2}>
    <Button
      onClick={() => {
        if (onReturn !== undefined) onReturn();
      }}
      sx={{
        color: '#000',
        size: 'large',
        width: { xs: '100%', sm: '200px' },
        hieght: { xs: '100%', sm: '50px' },
      }}
    >
      رجوع
    </Button>
    <Button
      type="submit"
      sx={{
        backgroundColor: 'background.paper',
        color: '#fff',
        width: { xs: '100%', sm: '200px' },
        hieght: { xs: '100%', sm: '50px' },
      }}
    >
      التالي
    </Button>
  </Stack>
);

export default ActionsBox;
