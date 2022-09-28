import { Stack, InputAdornment, TextField, Typography, Button } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  filterRole: string;
  onFilterName: (value: string) => void;
  onFilterRole: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AuthorityTableToolbar({ filterName, onFilterName }: Props) {
  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ py: 2.5, px: 3 }}
      justifyContent="space-between"
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="اكتب اسم للبحث عنه"
        sx={{ flex: 1 }}
      />
      <Stack direction="row" gap={1} flex={1} justifyContent="end">
        <Typography sx={{ textAlign: 'center', my: 'auto' }}>ترتيب حسب:</Typography>
        <Button
          endIcon={<img src="/icons/asc-order-icon.svg" alt="" />}
          sx={{ '&:hover': { backgroundColor: '#fff' }, color: '#000' }}
        >
          اسم المشروع من أ الى ي
        </Button>
      </Stack>
    </Stack>
  );
}
