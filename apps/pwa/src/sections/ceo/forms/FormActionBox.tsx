import { Button, Stack } from '@mui/material';

type Props = {
  action: 'accept' | 'reject';
  onReturn?: () => void;
};
const FormActionBox = ({ action, onReturn }: Props) => (
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
      {action}
    </Button>
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
      Close
    </Button>
  </Stack>
);

export default FormActionBox;
