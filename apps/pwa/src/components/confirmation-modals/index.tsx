// react
import React from 'react';
// material
import { Typography, Stack, Grid, Button } from '@mui/material';
// component
import ModalDialog from 'components/modal-dialog';
import Image from 'components/Image';
import { LoadingButton } from '@mui/lab';
//
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

interface IPropsConfirmationModal {
  partner_name: string;
  type: 'RESET_PASSWORD' | 'DEACTIVATE_ACCOUNT' | 'INFORMATION';
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
      title={<Stack>{null}</Stack>}
      content={
        <Grid container spacing={2} justifyContent="center" alignItems="center">
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
              <LoadingButton variant="contained" size="medium" loading={loading} onClick={onSubmit}>
                {(type === 'DEACTIVATE_ACCOUNT' &&
                  `${translate(
                    'account_manager.table.td.label_btn_acc_deactivate_account'
                  )} "${partner_name}" ?`) ||
                  (type === 'RESET_PASSWORD' &&
                    `${translate(
                      'account_manager.table.td.label_btn_acc_reset_password'
                    )} "${partner_name}" ?`) ||
                  (type === 'INFORMATION' && `${translate('label_btn_acc_information')}`)}
              </LoadingButton>
              <Button variant="contained" color="error" size="medium" onClick={onClose}>
                {translate('account_manager.table.td.label_cancel')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      }
      onClose={onClose}
      styleContent={{ padding: '2em', backgroundColor: '#fff' }}
      showCloseIcon={true}
    />
  );
}
