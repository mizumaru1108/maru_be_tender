// react
import { useState } from 'react';
import { useNavigate } from 'react-router';
// material
import { Box, useTheme, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import axiosInstance from 'utils/axios';
//
import { useSelector, useDispatch } from 'redux/store';
import { useSnackbar } from 'notistack';
import { getProposalCount } from '../../../redux/slices/proposal';

// ------------------------------------------------------------------------------------------

export default function FloatingSpv() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const { translate } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async (send: boolean) => {
    const payload = {
      id: proposal.id,
      send,
    };

    setIsSubmitting(true);

    try {
      const { status, data } = await axiosInstance.patch(
        '/tender/proposal/payment/send-closing-report',
        payload,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 200) {
        setIsSubmitting(false);

        enqueueSnackbar(translate('pages.common.close_report.notification.succes_send'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });

        // for re count total proposal
        dispatch(getProposalCount(activeRole ?? 'test'));
        //
        navigate('/project-supervisor/dashboard/project-report');
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
        // enqueueSnackbar(err.message, {
        //   variant: 'error',
        //   preventDuplicate: true,
        //   autoHideDuration: 3000,
        // });
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
        margin: 'auto',
        width: '100%',
        bottom: 24,
        border: `1px solid ${theme.palette.grey[400]}`,
      }}
    >
      <Stack
        component="div"
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={() => handleAccept(true)}
          loading={isSubmitting}
        >
          {translate('pages.common.close_report.btn.request_project_close_report')}
        </LoadingButton>
        <LoadingButton
          variant="outlined"
          color="primary"
          onClick={() => handleAccept(false)}
          loading={isSubmitting}
        >
          {translate('pages.common.close_report.btn.end_project')}
        </LoadingButton>
      </Stack>
    </Box>
  );
}
