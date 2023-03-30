// react
import React from 'react';
// material
import { Typography, Stack, Grid, Button, Box } from '@mui/material';
// component
import ModalDialog from 'components/modal-dialog';
import Image from 'components/Image';
import { LoadingButton } from '@mui/lab';
//
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

interface IPropsConfirmationModal {
  partner_name: string;
  type: 'RESET_PASSWORD' | 'DEACTIVATE_ACCOUNT' | 'INFORMATION' | 'RESET_PASSWORD_LINK';
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
}

// ----------------------------------------------------------------------

export default function ConfirmationModals({
  partner_name,
  type,
  onSubmit,
  onClose,
  loading,
}: IPropsConfirmationModal) {
  const { translate } = useLocales();

  let imgCover: string;

  switch (type) {
    case 'DEACTIVATE_ACCOUNT':
      imgCover = '/assets/icons/confirmation_deactivate_account.svg';
      break;
    case 'RESET_PASSWORD':
      imgCover = '/assets/icons/confirmation_reset_password.svg';
      break;
    case 'RESET_PASSWORD_LINK':
      imgCover = '';
      break;
    case 'INFORMATION':
      imgCover = '/assets/icons/confirmation_information.svg';
      break;
    default:
      imgCover = '/assets/placeholder.svg';
      break;
  }

  return (
    <ModalDialog
      maxWidth="md"
      isOpen={true}
      // title={<Stack>{null}</Stack>}
      content={
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {type !== 'RESET_PASSWORD_LINK' && (
            <>
              <Grid item>
                <Typography variant="h4" component="p" sx={{ fontWeight: 600 }}>
                  {(type === 'DEACTIVATE_ACCOUNT' &&
                    `${translate(
                      'account_manager.table.td.label_question_deactivate'
                    )} "${partner_name}" ?`) ||
                    (type === 'RESET_PASSWORD' &&
                      `${translate(
                        'account_manager.table.td.label_question_reset_password'
                      )} "${partner_name}" ?`) ||
                    (type === 'INFORMATION' &&
                      `${translate('account_manager.table.td.label_question_information')}`)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Image src={imgCover!} alt="logo" sx={{ maxWidth: 205, mx: 'auto', py: 4 }} />
              </Grid>
              <Grid item>
                <Stack component="div" spacing={3} direction="row" sx={{ pb: 8 }}>
                  <LoadingButton
                    variant="contained"
                    size="medium"
                    loading={loading}
                    onClick={onSubmit}
                  >
                    {(type === 'DEACTIVATE_ACCOUNT' &&
                      `${translate(
                        'account_manager.table.td.label_btn_acc_deactivate_account'
                      )} "${partner_name}" ?`) ||
                      (type === 'RESET_PASSWORD' &&
                        `${translate(
                          'account_manager.table.td.label_btn_acc_reset_password'
                        )} "${partner_name}" ?`) ||
                      (type === 'INFORMATION' &&
                        `${translate('account_manager.table.td.label_btn_acc_information')}`)}
                  </LoadingButton>
                  <Button variant="contained" color="error" size="medium" onClick={onClose}>
                    {translate('account_manager.table.td.label_cancel')}
                  </Button>
                </Stack>
              </Grid>
            </>
          )}
          {type === 'RESET_PASSWORD_LINK' && (
            <>
              <Grid item xs={12} md={12}>
                <Typography variant="h5" textAlign={'center'}>
                  {translate('account_manager.table.td.label_header_reset_password_link')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#93A3B029',
                    // opacity: 0.16,
                    borderRadius: 4,
                    width: '80%',
                    height: 45,
                    // p: 1,
                  }}
                >
                  <Typography variant="subtitle2" textAlign={'center'} sx={{ p: 3 }}>
                    Link for Redirect
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#0E8478',
                      borderRadius: 5,
                      width: 120,
                      height: '70%',
                      m: 1,
                      color: '#fff',
                      cursor: 'pointer',
                      '& :hover': {
                        backgroundColor: '#0E8478',
                      },
                    }}
                  >
                    {/* tst */}
                    <Typography variant="button" textAlign={'center'}>
                      {translate('account_manager.table.td.label_copy')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      }
      onClose={onClose}
      styleContent={{ padding: '2em', backgroundColor: '#fff' }}
      showCloseIcon={true}
    />
  );
}
