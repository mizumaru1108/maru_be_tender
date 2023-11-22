import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';

type EditedRequestStatusProps = {
  EditStatus: string;
};

function EditedRequestStatus({ EditStatus }: EditedRequestStatusProps) {
  const { currentLang, translate } = useLocales();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Stack
      spacing={{ xs: 2, md: 4 }}
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
      component="div"
      sx={{ width: '100%' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, md: 4 },
        }}
      >
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ padding: 1, minWidth: 25, minHeight: 25, mr: 3 }}
        >
          <Iconify
            icon={
              currentLang.value === 'en'
                ? 'eva:arrow-ios-back-outline'
                : 'eva:arrow-ios-forward-outline'
            }
            width={25}
            height={25}
          />
        </Button>
        <Box>
          <Typography variant="h4">طلبات تحديث المعلومات</Typography>
        </Box>
      </Box>
      <Label
        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
        color={
          // ((!EditStatus || EditStatus === 'PENDING') && 'warning') ||
          // (EditStatus === 'APPROVED' && 'success') ||
          // 'error'
          EditStatus && EditStatus === 'PENDING'
            ? 'warning'
            : EditStatus === 'APPROVED'
            ? 'success'
            : 'error'
        }
        sx={{ textTransform: 'capitalize', fontSize: 14, py: 2.5, px: 4 }}
      >
        {/* {(EditStatus === 'APPROVED' &&
        translate('account_manager.table.td.label_active_account')) ||
        ((EditStatus === 'WAITING_FOR_ACTIVATION' ||
          EditStatus === 'REVISED_ACCOUNT') &&
          translate('account_manager.table.td.label_waiting_activation')) ||
        (EditStatus !== 'waiting' &&
          EditStatus !== 'approved' &&
          translate('account_manager.table.td.label_canceled_account'))} */}
        {(EditStatus === 'APPROVED' && translate('account_manager.table.td.label_approved')) ||
          (EditStatus === 'PENDING' && translate('account_manager.table.td.label_pending')) ||
          (EditStatus !== 'APPROVED' &&
            EditStatus !== 'PENDING' &&
            translate('account_manager.table.td.label_rejected'))}
      </Label>
    </Stack>
  );
}

export default EditedRequestStatus;
