// react
import { useState } from 'react';
// material
import { Box, useTheme, Stack, Button } from '@mui/material';
import ModalCashierToFinance from 'components/modal-dialog/ModalCashierToFinance';
// hooks
import useLocales from 'hooks/useLocales';
import Iconify from 'components/Iconify';

// ------------------------------------------------------------------------------------------

export default function FloatingCashierToFinance() {
  const theme = useTheme();
  const { translate, currentLang } = useLocales();
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        p: 2,
        borderRadius: 1,
        position: 'sticky',
        width: '100%',
        bottom: 20,
        ...(currentLang && currentLang.value === 'en'
          ? { ml: '20px !important' }
          : { mr: '20px !important' }),
        border: `1px solid ${theme.palette.grey[400]}`,
      }}
    >
      <ModalCashierToFinance open={openModal} onClose={() => setOpenModal(false)} />
      <Stack component="div" alignItems="center" justifyContent="center">
        <Button
          variant="contained"
          endIcon={<Iconify icon="eva:edit-2-outline" />}
          sx={{
            flex: 1,
            backgroundColor: '#0169DE',
            '&:hover': { backgroundColor: '#1482FE' },
          }}
          onClick={() => setOpenModal(true)}
        >
          {translate('proposal_amandement.tender_cashier.dialog.title')}
        </Button>
      </Stack>
    </Box>
  );
}
