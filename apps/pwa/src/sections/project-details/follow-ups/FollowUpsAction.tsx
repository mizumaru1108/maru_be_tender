import { Typography, Stack, Button } from '@mui/material';
import { IconButtonAnimate } from 'components/animate';
import Iconify from 'components/Iconify';
import { useState } from 'react';
import ActionPopup from './follow-ups-popups/ActionPopup';
import FilePopup from './follow-ups-popups/FilePopup';
import useLocales from '../../../hooks/useLocales';
import axiosInstance from 'utils/axios';
import { dispatch, useSelector } from 'redux/store';
import { getProposal, setCheckedItems } from 'redux/slices/proposal';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router';
import { LoadingButton } from '@mui/lab';

function FollowUpsAction() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const { checkedItems } = useSelector((state) => state.proposal);

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const { activeRole } = useAuth();

  const [actoinOpen, setActionOpen] = useState(false);

  const [fileOpen, setFileOpen] = useState(false);

  const handleActionClose = () => {
    setActionOpen(false);
  };

  const handleActionOpen = () => {
    setActionOpen(true);
  };

  const handleFileClose = () => {
    setFileOpen(false);
  };

  const handleFileOpen = () => {
    setFileOpen(true);
  };

  const handleDelFollowUps = async () => {
    try {
      setLoading(true);
      setDisabled(true);
      const response = await axiosInstance.patch(
        `tender-proposal/follow-up/delete`,
        {
          id: checkedItems,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (response) {
        dispatch(setCheckedItems([]));
        dispatch(getProposal(id as string));
        enqueueSnackbar('delete success', {
          variant: 'success',
        });
        setLoading(false);
        setDisabled(false);
      }
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      return error;
    }
  };

  return (
    <Stack direction="row" gap={1} justifyContent="space-between">
      {activeRole !== 'tender_client' && (
        <>
          <Stack direction="row" gap={1}>
            <ActionPopup open={actoinOpen} handleClose={handleActionClose} />
            <FilePopup open={fileOpen} handleClose={handleFileClose} />
            <IconButtonAnimate
              onClick={handleActionOpen}
              sx={{
                backgroundColor: '#fff',
                color: '#000',
                ':hover': { backgroundColor: '#fff' },
                borderRadius: '5px',
              }}
            >
              <Iconify icon="eva:edit-2-outline" />
              <Typography sx={{ fontWeight: 700 }}>{translate('add_action')}</Typography>
            </IconButtonAnimate>
            <IconButtonAnimate
              onClick={handleFileOpen}
              sx={{
                backgroundColor: '#fff',
                color: '#000',
                ':hover': { backgroundColor: '#fff' },
                borderRadius: '5px',
                border: '0.5px dashed',
                borderColor: 'gray',
              }}
            >
              <img src="/icons/add-action-follow-up-icon.svg" alt="" />
              <Typography sx={{ fontWeight: 700 }}>{translate('upload_a_new_file')}</Typography>
            </IconButtonAnimate>
          </Stack>
          <Stack>
            {activeRole === 'tender_ceo' && (
              <LoadingButton
                loading={loading}
                disabled={disabled}
                sx={{
                  background: disabled ? '#ddd' : 'red',
                  color: '#fff',
                  p: 1,
                  ':hover': { backgroundColor: 'darkred' },
                }}
                onClick={() => handleDelFollowUps()}
              >
                Delete
              </LoadingButton>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default FollowUpsAction;
