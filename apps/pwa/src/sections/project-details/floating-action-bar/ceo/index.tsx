import { Box, Button, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import { UpdateAction } from '../../../../@types/project-details';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByCEO } from 'queries/ceo/updateProposalByCEO';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import NotesModal from 'components/notes-modal';
//
import axiosInstance from 'utils/axios';
import { LoadingButton } from '@mui/lab';

function FloatingActionBar() {
  const { user, activeRole } = useAuth();

  const { id: proposal_id } = useParams();

  const theme = useTheme();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [, update] = useMutation(updateProposalByCEO);

  const [action, setAction] = useState<UpdateAction>('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittingRejected, setIsSubmittingRejected] = useState<boolean>(false);
  const [isSubmittingStepback, setIsSubmittingStepback] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setAction('');
  };

  const handleApproval = async (data: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id,
        action: 'accept',
        message: 'تم قبول المشروع من قبل الرئيس التنفيذي ',
        notes: data.notes,
      };

      console.log('payloadApprovalCeo', payload);

      await axiosInstance
        .patch('/tender-proposal/change-state', payload, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            enqueueSnackbar(translate('proposal_approved'), {
              variant: 'success',
            });
          }

          setIsSubmitting(false);
          navigate(`/ceo/dashboard/app`);
        })
        .catch((err) => {
          if (typeof err.message === 'object') {
            err.message.forEach((el: any) => {
              enqueueSnackbar(el, {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 3000,
              });
            });
          } else {
            enqueueSnackbar(err.message, {
              variant: 'error',
              preventDuplicate: true,
              autoHideDuration: 3000,
            });
          }

          setIsSubmitting(false);
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });

      setIsSubmitting(false);
    }
  };

  const handleRejected = async (data: any) => {
    setIsSubmittingRejected(true);

    try {
      const payload = {
        proposal_id,
        action: 'reject',
        message: 'تم قبول المشروع من قبل الرئيس التنفيذي ',
        notes: data.notes,
      };

      console.log('payloadRejectedCeo', payload);

      await axiosInstance
        .patch('/tender-proposal/change-state', payload, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            enqueueSnackbar(translate('proposal_rejected'), {
              variant: 'success',
            });
          }

          setIsSubmittingRejected(false);
          navigate(`/ceo/dashboard/app`);
        })
        .catch((err) => {
          if (typeof err.message === 'object') {
            err.message.forEach((el: any) => {
              enqueueSnackbar(el, {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 3000,
              });
            });
          } else {
            enqueueSnackbar(err.message, {
              variant: 'error',
              preventDuplicate: true,
              autoHideDuration: 3000,
            });
          }

          setIsSubmittingRejected(false);
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });

      setIsSubmittingRejected(false);
    }
  };

  const stepBackProposal = async (data: any) => {
    setIsSubmittingStepback(true);

    try {
      const payload = {
        proposal_id,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
        notes: data.notes,
      };

      console.log('payloadStepBackCeo', payload);

      await axiosInstance
        .patch('/tender-proposal/change-state', payload, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            enqueueSnackbar(translate('proposal_stepback'), {
              variant: 'success',
            });
          }

          setIsSubmittingStepback(false);
          navigate(`/ceo/dashboard/app`);
        })
        .catch((err) => {
          if (typeof err.message === 'object') {
            err.message.forEach((el: any) => {
              enqueueSnackbar(el, {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 3000,
              });
            });
          } else {
            enqueueSnackbar(err.message, {
              variant: 'error',
              preventDuplicate: true,
              autoHideDuration: 3000,
            });
          }

          setIsSubmittingStepback(false);
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });

      setIsSubmittingStepback(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          p: 3,
          borderRadius: 1,
          position: 'sticky',
          width: '100%',
          bottom: 24,
          border: `1px solid ${theme.palette.grey[400]}`,
        }}
      >
        <Stack direction={{ sm: 'column', md: 'row' }} justifyContent="space-between">
          <Stack flexDirection={{ sm: 'column', md: 'row' }}>
            <LoadingButton
              variant="contained"
              color="primary"
              sx={{ mr: { md: '1em' } }}
              onClick={() => setAction('ACCEPT')}
              loading={isSubmitting}
            >
              {translate('project_acceptance')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              sx={{
                my: { xs: '1.3em', md: '0' },
                mr: { md: '1em' },
                backgroundColor: '#FF4842',
                ':hover': { backgroundColor: '#FF170F' },
              }}
              onClick={() => setAction('REJECT')}
              loading={isSubmittingRejected}
            >
              {translate('project_rejected')}
            </LoadingButton>
          </Stack>
          {/* disabled other than accept reject button */}
          <LoadingButton
            variant="contained"
            onClick={handleClick}
            sx={{ backgroundColor: '#0169DE', ':hover': { backgroundColor: '#1482FE' } }}
            endIcon={<Iconify icon="eva:edit-2-outline" />}
            loading={isSubmittingStepback}
          >
            {translate('submit_amendment_request')}
          </LoadingButton>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem
            disabled={true}
              // onClick={() => {
              //   navigate(`/ceo/dashboard/amandment-request/${proposal_id}`);
              //   handleClose();
              // }}
            >
              {translate('proposal_amandement.button_label')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAction('STEP_BACK');
                handleClose();
              }}
            >
              ارجاع المعاملة الى مدير الإدارة
            </MenuItem>
          </Menu>
        </Stack>
      </Box>

      {action === 'REJECT' && (
        <NotesModal
          title="رفض المشروع"
          onClose={handleCloseModal}
          onSubmit={handleRejected}
          action={{
            actionType: action,
            actionLabel: 'رفض',
            backgroundColor: '#FF0000',
            hoverColor: '#FF4842',
          }}
          loading={isSubmittingRejected}
        />
      )}
      {action === 'STEP_BACK' && (
        <NotesModal
          title="إرجاع المعاملة إلى مدير الإدارة"
          onClose={handleCloseModal}
          onSubmit={stepBackProposal}
          action={{
            actionType: action,
            actionLabel: 'إرجاع',
            backgroundColor: '#0169DE',
            hoverColor: '#1482FE',
          }}
          loading={isSubmittingStepback}
        />
      )}
      {action === 'ACCEPT' && (
        <NotesModal
          title="قبول المشروع"
          onClose={handleCloseModal}
          onSubmit={handleApproval}
          action={{
            actionType: action,
            actionLabel: 'قبول',
            backgroundColor: 'background.paper',
            hoverColor: '#13B2A2',
          }}
          loading={isSubmitting}
        />
      )}
    </>
  );
}

export default FloatingActionBar;
