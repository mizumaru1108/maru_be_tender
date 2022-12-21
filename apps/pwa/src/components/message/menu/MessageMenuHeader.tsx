import { Button, Stack, Typography } from '@mui/material';
import useLocales from '../../../hooks/useLocales';
import Iconify from '../../Iconify';

type Props = {
  onClickFilter: () => void;
};

export default function MessageMenuHeader({ onClickFilter }: Props) {
  const { translate } = useLocales();
  return (
    <Stack
      direction="row"
      display="flex"
      gap="24px"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        marginTop: '0px !important',
        '& .MuiStack-root.:not(style)+:not(style)': {
          marginTop: 0,
          paddingTop: '8px',
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Cairo',
          fontWeight: 700,
          fontSize: '24px',
        }}
      >
        {translate('message')}
      </Typography>
      <Button
        sx={{ color: '#000', backgroundColor: '#fff', width: '82px', p: 1 }}
        variant="outlined"
        color="inherit"
        onClick={onClickFilter}
        startIcon={<Iconify icon={'clarity:filter-line'} color="#000" width={16} height={16} />}
        // onClick={handleOpenFilter}
      >
        {translate('commons.filter_button_label')}
      </Button>
    </Stack>
  );
}
