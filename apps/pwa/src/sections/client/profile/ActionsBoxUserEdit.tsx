import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
interface Props {
  loading?: boolean;
  // onSubmiting: () => void;
}

const ActionsBoxUserEdit = ({ loading }: Props) => (
  <LoadingButton
    type="submit"
    loading={loading}
    variant={'contained'}
    sx={{
      backgroundColor: 'background.paper',
      color: '#fff',
      width: { xs: '100%', sm: '200px' },
      height: { xs: '100%', sm: '50px' },
    }}
  >
    تحديث
  </LoadingButton>
);

export default ActionsBoxUserEdit;
