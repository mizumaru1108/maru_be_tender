import { Box, Button, Grid, Stack, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useNavigate, useParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from 'react';
import { useMutation, useQuery } from 'urql';
import useAuth from 'hooks/useAuth';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from 'notistack';
import { updateProposalByProjectManager } from 'queries/project-manager/updateProposalByProjectManager';
import { UpdateAction } from '../../../../@types/project-details';
import NotesModal from 'components/notes-modal';
import { LoadingButton } from '@mui/lab';

//
import axiosInstance from 'utils/axios';

function FloatingActionBar() {
  const { id: proposal_id } = useParams();

  const { user, activeRole } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittingRejected, setIsSubmittingRejected] = useState<boolean>(false);
  const [isSubmittingStepback, setIsSubmittingStepback] = useState<boolean>(false);

  const employee_id = user?.id;

  const [result] = useQuery({
    query: `query MyQuery($id: String = "") {
      user: user_by_pk(id: $id) {
        track: employee_path
      }
    }
    `,
    variables: {
      id: employee_id,
    },
  });

  const { data, fetching, error } = result;

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [, update] = useMutation(updateProposalByProjectManager);

  const { translate } = useLocales();

  const theme = useTheme();

  const [action, setAction] = useState<UpdateAction>('');

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
        proposal_id: proposal_id,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مدير المشاريع ',
        notes: values.notes,
      };

      console.log('payloadApprovalGeneralPM', payload);

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
          navigate(`/project-manager/dashboard/app`);
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

  const handleApprovalConsultant = async (values: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'accept_and_ask_for_consultaion',
        message: 'تم قبول المشروع من قبل مدير المشاريع وإحالته إلى قسم الاستشاريين ',
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
          navigate(`/project-manager/dashboard/app`);
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
        proposal_id: proposal_id,
        action: 'reject',
        message: 'تم رفض المشروع من قبل مدير المشاريع',
        notes: values.notes,
        reject_reason: values.reject_reason ?? null,
      };

      console.log('payloadRejectPM', payload);

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
          navigate(`/project-manager/dashboard/app`);
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

  const stepBackProposal = async (values: any) => {
    setIsSubmittingStepback(true);

    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
        notes: values.notes,
      };

      console.log('payloadStepbackToSupervisor', payload);

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
          navigate(`/project-manager/dashboard/app`);
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

  if (fetching) return <>... Loading</>;

  if (error) return <>... Ops somthing went wrong</>;

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
        <Grid container rowSpacing={5} alignItems="center" justifyContent="space-between">
          {/* disabled other than accept reject button */}
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
                ارجاع المعاملة الى مشرف المشاريع
              </MenuItem>
            </Menu>
          </Grid>
          {data.user.track !== 'CONCESSIONAL_GRANTS' && (
            <Grid item md={3} xs={4}>
              {''}
            </Grid>
          )}
          {/* <Grid item md={data.user.track === 'CONCESSIONAL_GRANTS' ? 7 : 4} xs={12}> */}
          <Grid item md={7} xs={12}>
            <Stack direction="row" gap={2} justifyContent="flex-start">
              <LoadingButton
                onClick={() => setAction('ACCEPT')}
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                sx={{ flex: 1, '&:hover': { backgroundColor: '#13B2A2' } }}
                loading={isSubmitting}
              >
                قبول المشروع
              </LoadingButton>
              <LoadingButton
                sx={{ flex: 1, '&:hover': { backgroundColor: '#FF170F' } }}
                variant="contained"
                color="error"
                onClick={() => setAction('REJECT')}
                endIcon={<ClearIcon />}
                loading={isSubmittingRejected}
              >
                {translate('reject_project')}
              </LoadingButton>
              {/* disabled other than accept reject button */}
              {data.user.track === 'CONCESSIONAL_GRANTS' && (
                <Button
                  variant="outlined"
                  color="inherit"
                  endIcon={<Iconify icon="eva:message-circle-outline" />}
                  onClick={() => setAction('ACCEPT_CONSULTANT')}
                  sx={{ flex: 2 }}
                >
                  عرض المشروع على المستشارين
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
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
      {action === 'ACCEPT_CONSULTANT' && (
        <NotesModal
          title="عرض المشروع على المستشارين"
          onClose={handleCloseModal}
          onSubmit={handleApprovalConsultant}
          action={{
            actionType: action,
            actionLabel: 'تأكيد طلب الاستشارة',
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
