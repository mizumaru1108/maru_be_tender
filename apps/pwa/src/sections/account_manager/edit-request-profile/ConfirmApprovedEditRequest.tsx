import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import axiosInstance from '../../../utils/axios';
import { IEditedValues } from '../../../@types/client_data';

type Props = {
  open: boolean;
  handleClose: () => void;
  EditValues: {
    old_data: IEditedValues;
    new_data: IEditedValues;
    difference: IEditedValues;
  };
};

function ConfirmApprovedEditRequest({ open, handleClose, EditValues }: Props) {
  const { user, activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [showBankTextAlert, setShowBankTextAlert] = React.useState<boolean>(false);

  const handleAccepted = async () => {
    setLoading(true);
    const payload = {
      requestId: params.requestId,
      status: 'APPROVED',
    };
    // console.log({ payload });
    try {
      const rest = await axiosInstance.patch(
        'tender/client/edit-requests/change-status',
        {
          ...payload,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar(translate('snackbar.account_manager.edit_request.approved'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        navigate(-1);
      }
    } catch (err) {
      // setLoading(false);
      // enqueueSnackbar(
      //   `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
      //   {
      //     variant: 'error',
      //     preventDuplicate: true,
      //     autoHideDuration: 3000,
      //   }
      // );
      // handle error fetching
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const oldBankInfo = EditValues.old_data.bank_information;
    const newBankInfo = EditValues.new_data.bank_information;

    const colorOldTransparent = oldBankInfo?.every((item) => item.color);
    const colorNewTransparent = newBankInfo?.every((item) => item.color);

    if (open && colorOldTransparent && colorNewTransparent) {
      const hasOldTrasnparent = oldBankInfo?.every(
        (item) => item.color && item.color === 'transparent'
      );
      const hasNewTrasnparent = newBankInfo?.every(
        (item) => item.color && item.color === 'transparent'
      );

      if (
        (!hasOldTrasnparent && !hasNewTrasnparent) ||
        newBankInfo?.length !== oldBankInfo?.length
      ) {
        setShowBankTextAlert(true);
      }
    }
  }, [EditValues, open]);

  return (
    <ModalDialog
      maxWidth="md"
      title={
        <Stack display="flex">
          <Typography variant="h6" fontWeight="bold" color="#000000">
            تمت الموافقة على طلب التعديل
          </Typography>
        </Stack>
      }
      showCloseIcon={true}
      content={
        <>
          {showBankTextAlert && (
            <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.error.main }}>
              يرجى التأكد من أن بيانات البنك تم تحديثها بشكل صحيح من قبل العميل
            </Typography>
          )}
        </>
      }
      actionBtn={
        <Stack direction="row" justifyContent="space-around" gap={4}>
          <Button
            sx={{
              color: '#000',
              size: 'large',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              ':hover': { backgroundColor: '#efefef' },
            }}
            onClick={handleClose}
          >
            رجوع
          </Button>
          <LoadingButton
            onClick={handleAccepted}
            sx={{
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              backgroundColor: '#0E8478',
              ':hover': { backgroundColor: '#13B2A2' },
            }}
            loading={loading}
          >
            اضافة
          </LoadingButton>
        </Stack>
      }
      isOpen={open}
      onClose={handleClose}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default ConfirmApprovedEditRequest;
