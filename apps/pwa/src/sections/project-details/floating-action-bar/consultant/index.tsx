import { Box, Stack, useTheme, Button, MenuItem, Menu, Grid } from '@mui/material';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { AcceptProposalByConsultant } from 'queries/consultant/AcceptProposalByConsultant';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import { useSnackbar } from 'notistack';
import { UpdateAction } from '../../../../@types/project-details';
import React, { useState } from 'react';
import NotesModal from 'components/notes-modal';
//
import axiosInstance from 'utils/axios';
import { LoadingButton } from '@mui/lab';

function ConsultantFloatingActionBar() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, activeRole } = useAuth();

  const { translate } = useLocales();

  const navigate = useNavigate();

  const [action, setAction] = useState<UpdateAction>('');

  const { id: proposal_id } = useParams();

  const [, update] = useMutation(AcceptProposalByConsultant);

  const theme = useTheme();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittingRejected, setIsSubmittingRejected] = useState<boolean>(false);
  const [isSubmittingStepback, setIsSubmittingStepback] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setAction('');
  };

  const handleApproval = async (values: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id,
        action: 'accept',
        message: 'تم قبول المشروع من قبل لجنة المستشارين ',
        notes: values.notes,
      };

      console.log('payloadApprovalConsultant', payload);

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
          navigate(`/consultant/dashboard/app`);
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

  const handleRejected = async (values: any) => {
    setIsSubmittingRejected(true);

    try {
      const payload = {
        proposal_id,
        action: 'reject',
        message: 'تم قبول المشروع من قبل مدير المشاريع ',
        notes: values.notes,
      };

      console.log('payloadRejectedConsultant', payload);

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

          setIsSubmitting(false);
          navigate(`/consultant/dashboard/app`);
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

      setIsSubmittingRejected(false);
    }
  };

  const stepBackProposal = async (values: any) => {
    setIsSubmittingStepback(true);

    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
        notes: values.notes,
      };

      console.log('payloadStepbackToManager', payload);

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
          navigate(`/consultant/dashboard/app`);
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
          {/* disabled other than accept reject button */}
          {/* <Button
            variant="contained"
            onClick={() => {
              setAction('STEP_BACK');
            }}
            sx={{ backgroundColor: '#0169DE', ':hover': { backgroundColor: '#1482FE' } }}
            endIcon={<Iconify icon="eva:edit-2-outline" />}
          >
            {translate('submit_amendment_request')}
          </Button> */}
          <Grid item md={2} xs={12}>
            <LoadingButton
              id="demo-positioned-button"
              aria-controls={open ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              endIcon={<Iconify icon="eva:edit-2-outline" />}
              sx={{
                flex: 1,
                backgroundColor: '#0169DE',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
              onClick={handleClick}
              loading={isSubmittingStepback}
            >
              {translate('partner_details.submit_amendment_request')}
            </LoadingButton>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                disabled={true}
                // onClick={() => {
                //   navigate(`/project-manager/dashboard/amandment-request/${proposal_id}`);
                //   handleClose();
                // }}
              >
                {translate('proposal_amandement.button_label')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  setAction('STEP_BACK');
                }}
              >
                {translate('proposal_amandement.send_to_project_manager')}
              </MenuItem>
            </Menu>
          </Grid>
          <Stack flexDirection={{ sm: 'column', md: 'row' }}>
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
            <LoadingButton
              variant="contained"
              color="primary"
              sx={{ mr: { md: '1em' } }}
              onClick={() => setAction('ACCEPT')}
              loading={isSubmitting}
            >
              {translate('project_acceptance')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Box>
      {action === 'REJECT' && (
        <NotesModal
          title="رفض المشروع وإعادته لمدير الإدارة"
          onClose={handleCloseModal}
          onSubmit={handleRejected}
          action={{
            actionType: action,
            actionLabel: 'رفض',
            backgroundColor: '#FF0000',
            hoverColor: '#FF4842',
          }}
        />
      )}
      {action === 'STEP_BACK' && (
        <NotesModal
          title="إرجاع المعاملة إلى مشرف المشروع"
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

export default ConsultantFloatingActionBar;
