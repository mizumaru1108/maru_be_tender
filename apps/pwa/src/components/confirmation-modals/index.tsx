// react
import React from 'react';
// material
import { Typography, Stack, Grid, Button, Box, CircularProgress } from '@mui/material';
// component
import ModalDialog from 'components/modal-dialog';
import Image from 'components/Image';
import { LoadingButton } from '@mui/lab';
//
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

interface IPropsConfirmationModal {
  partner_name: string;
  type:
    | 'RESET_PASSWORD'
    | 'DEACTIVATE_ACCOUNT'
    | 'INFORMATION'
    | 'RESET_PASSWORD_LINK'
    | 'DELETED_ACCOUNT';
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
  isCopy?: boolean;
  resetPasswordLink?: string;
}

// ----------------------------------------------------------------------

export default function ConfirmationModals({
  partner_name,
  type,
  onSubmit,
  onClose,
  loading,
  isCopy,
  resetPasswordLink,
}: IPropsConfirmationModal) {
  const { translate } = useLocales();

  let imgCover: string;

  switch (type) {
    case 'DEACTIVATE_ACCOUNT':
      imgCover = '/assets/icons/confirmation_deactivate_account.svg';
      break;
    case 'DELETED_ACCOUNT':
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
      content={
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {type !== 'RESET_PASSWORD_LINK' && type !== 'DELETED_ACCOUNT' && (
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
                <Stack
                  component="div"
                  spacing={3}
                  direction={{ xs: 'column', md: 'row' }}
                  sx={{ pb: 8 }}
                >
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
              {loading ? (
                <CircularProgress sx={{ mt: 3 }} />
              ) : (
                <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: { xs: 'normal', sm: 'space-between' },
                      alignItems: 'center',
                      backgroundColor: '#93A3B029',
                      borderRadius: 4,
                      width: '80%',
                      p: 3,
                    }}
                  >
                    <Typography
                      variant="body1"
                      textAlign={'left'}
                      sx={{ width: '80%', overflow: 'hidden' }}
                    >
                      {resetPasswordLink ? resetPasswordLink : '-'}
                    </Typography>
                    <Button
                      variant="contained"
                      disabled={isCopy}
                      onClick={onSubmit}
                      sx={{
                        m: 1,
                        boxShadow: 'none',
                        borderRadius: 4,
                        width: { xs: '100%', sm: 'auto' },
                      }}
                    >
                      <Typography variant="button" textAlign={'center'}>
                        {!isCopy
                          ? translate('account_manager.table.td.label_copy')
                          : translate('account_manager.table.td.label_copied')}
                      </Typography>
                    </Button>
                  </Box>
                </Grid>
              )}
            </>
          )}
          {type === 'DELETED_ACCOUNT' && (
            <>
              <Grid item>
                <Typography variant="h4" component="p" sx={{ fontWeight: 600 }}>
                  {`${translate(
                    'account_manager.table.td.label_question_deleted'
                  )} "${partner_name}" ?`}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Image src={imgCover!} alt="logo" sx={{ maxWidth: 205, mx: 'auto', py: 4 }} />
              </Grid>
              <Grid item>
                <Stack
                  component="div"
                  spacing={3}
                  direction={{ xs: 'column', md: 'row' }}
                  sx={{ pb: 8 }}
                >
                  <LoadingButton
                    variant="contained"
                    size="medium"
                    loading={loading}
                    onClick={onSubmit}
                  >
                    {`${translate(
                      'account_manager.table.td.label_question_deleted'
                    )} "${partner_name}" ?`}
                  </LoadingButton>
                  <Button variant="contained" color="error" size="medium" onClick={onClose}>
                    {translate('account_manager.table.td.label_cancel')}
                  </Button>
                </Stack>
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
