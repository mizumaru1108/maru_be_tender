import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
interface Props {
  loading?: boolean;
  // onSubmiting: () => void;
}

const ActionsBoxUserEdit = ({ loading }: Props) => (
  <Stack justifyContent="center" direction="row" gap={2}>
    <LoadingButton
      type="submit"
      loading={loading}
      variant={'contained'}
      sx={{
        backgroundColor: 'background.paper',
        color: '#fff',
        width: { xs: '100%', sm: '200px' },
        hieght: { xs: '100%', sm: '50px' },
      }}
    >
      تحديث
    </LoadingButton>
  </Stack>
);

export default ActionsBoxUserEdit;
