// react
import { useState } from 'react';
// material
import { Box, useTheme, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import axiosInstance from 'utils/axios';
//
import { useSelector, useDispatch, dispatch } from 'redux/store';
import { useSnackbar } from 'notistack';
import { FEATURE_PROPOSAL_COUNTING } from 'config';
import { getProposalCount } from 'redux/slices/proposal';

// ------------------------------------------------------------------------------------------

export default function FloatingCloseReport() {
  const theme = useTheme();
  const { activeRole } = useAuth();
  const { translate, currentLang } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);
  const { enqueueSnackbar } = useSnackbar();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);

    const pid = proposal.id;

    try {
      const { status, data } = await axiosInstance.patch(
        '/tender/proposal/payment/complete-payment',
        {
          id: pid,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 200) {
        if (FEATURE_PROPOSAL_COUNTING) {
          dispatch(getProposalCount(activeRole ?? 'test'));
        }
        setIsSubmitting(false);
        enqueueSnackbar(
          translate('pages.common.close_report.notification.success_accept_exchange'),
          { variant: 'success', preventDuplicate: true, autoHideDuration: 3000 }
        );
        window.location.reload();
      }
    } catch (err) {
      if (typeof err.message === 'object') {
        err.message.forEach((el: any) => {
          enqueueSnackbar(el, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        });
      } else {
        const statusCode = (err && err.statusCode) || 0;
        const message = (err && err.message) || null;
        enqueueSnackbar(
          `${
            statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
          }`,
          {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          }
        );
      }

      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        p: 2,
        borderRadius: 1,
        position: 'sticky',
        ...(currentLang && currentLang.value === 'en'
          ? { ml: '20px !important' }
          : { mr: '20px !important' }),
        width: '100%',
        bottom: 20,
        border: `1px solid ${theme.palette.grey[400]}`,
      }}
    >
      <Stack component="div" alignItems="center" justifyContent="center">
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={handleAccept}
          loading={isSubmitting}
        >
          {translate('pages.common.close_report.btn.accept_exchange_permission')}
        </LoadingButton>
      </Stack>
    </Box>
  );
}
