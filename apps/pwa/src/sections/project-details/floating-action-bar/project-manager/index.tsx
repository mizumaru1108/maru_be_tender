import { Box, Button, Grid, Stack, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate, useParams } from 'react-router';
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
import uuidv4 from 'utils/uuidv4';
import { addConversation, setActiveConversationId, setMessageGrouped } from 'redux/slices/wschat';
import { dispatch, useSelector } from 'redux/store';
import moment from 'moment';

//
import axiosInstance from 'utils/axios';
import { Conversation } from '../../../../@types/wschat';
import FacilitateSupervisorAcceptingForm from '../supervisor/supervisor-facilitate-track/forms';
import { setStepsData, stepResetActive } from '../../../../redux/slices/supervisorAcceptingForm';
import { getProposalCount } from '../../../../redux/slices/proposal';
import { FEATURE_PROPOSAL_COUNTING } from 'config';
import { FusionAuthRoles } from '../../../../@types/commons';
import ProposalAcceptingForm from 'sections/project-details/floating-action-bar/supervisor/supervisor-general-tracks/ProposalAcceptingForm';

function FloatingActionBar() {
  const { id: proposal_id } = useParams();

  const { user, activeRole } = useAuth();

  const { proposal } = useSelector((state) => state.proposal);
  const { conversations } = useSelector((state) => state.wschat);
  const location = useLocation();
  const activeRoleIndex: number = Number(localStorage.getItem('activeRoleIndex')) ?? 0;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittingRejected, setIsSubmittingRejected] = useState<boolean>(false);
  const [isSubmittingStepback, setIsSubmittingStepback] = useState<boolean>(false);

  const employee_id = user?.id;

  const [result] = useQuery({
    query: `
    query GetEmployeePath($id: String = "") {
      user: user_by_pk(id: $id) {
        path: employee_path
        track {
          id
          name
          with_consultation
          is_grant
        }
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

  const { translate, currentLang } = useLocales();

  const theme = useTheme();

  const [action, setAction] = useState<UpdateAction>('');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const checkGrant =
    data && data.user && data.user.track && data.user.track.is_grant ? true : false;

  const checkConsultant =
    data && data.user && data.user.track && data.user.track.with_consultation ? true : false;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setAction('');
    dispatch(stepResetActive({}));
  };

  const handleApproval = async (values: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مدير المشاريع ',
        notes: values.notes,
        selectLang: currentLang.value,
      };

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
          // for re count total proposal
          // dispatch(getProposalCount(activeRole ?? 'test'));
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
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
            // enqueueSnackbar(err.message, {
            //   variant: 'error',
            //   preventDuplicate: true,
            //   autoHideDuration: 3000,
            // });
            const statusCode = (err && err.statusCode) || 0;
            const message = (err && err.message) || null;
            enqueueSnackbar(
              `${
                statusCode < 500 && message
                  ? message
                  : translate('pages.common.internal_server_error')
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
        });
    } catch (error) {
      // enqueueSnackbar(error.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      // });
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
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

      setIsSubmitting(false);
    }
  };

  const handleApprovalConsultant = async (values: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'accept_and_ask_for_consultation',
        message: 'تم قبول المشروع من قبل مدير المشاريع وإحالته إلى قسم الاستشاريين ',
        notes: values.notes,
        selectLang: currentLang.value,
      };

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
          // for re count total proposal
          // dispatch(getProposalCount(activeRole ?? 'test'));
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
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
            // enqueueSnackbar(err.message, {
            //   variant: 'error',
            //   preventDuplicate: true,
            //   autoHideDuration: 3000,
            // });
            const statusCode = (err && err.statusCode) || 0;
            const message = (err && err.message) || null;
            enqueueSnackbar(
              `${
                statusCode < 500 && message
                  ? message
                  : translate('pages.common.internal_server_error')
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
        });
    } catch (error) {
      // enqueueSnackbar(error.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      // });
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
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
        selectLang: currentLang.value,
      };

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
          // for re count total proposal
          // dispatch(getProposalCount(activeRole ?? 'test'));
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
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
            // enqueueSnackbar(err.message, {
            //   variant: 'error',
            //   preventDuplicate: true,
            //   autoHideDuration: 3000,
            // });
            const statusCode = (err && err.statusCode) || 0;
            const message = (err && err.message) || null;
            enqueueSnackbar(
              `${
                statusCode < 500 && message
                  ? message
                  : translate('pages.common.internal_server_error')
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

          setIsSubmittingRejected(false);
        });
    } catch (error) {
      // enqueueSnackbar(error.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      // });
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
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
        selectLang: currentLang.value,
      };

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
          // for re count total proposal
          // dispatch(getProposalCount(activeRole ?? 'test'));
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
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
            // enqueueSnackbar(err.message, {
            //   variant: 'error',
            //   preventDuplicate: true,
            //   autoHideDuration: 3000,
            // });
            const statusCode = (err && err.statusCode) || 0;
            const message = (err && err.message) || null;
            enqueueSnackbar(
              `${
                statusCode < 500 && message
                  ? message
                  : translate('pages.common.internal_server_error')
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

          setIsSubmittingStepback(false);
        });
    } catch (error) {
      // enqueueSnackbar(error.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      // });
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
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

      setIsSubmittingStepback(false);
    }
  };

  const handleMessage = () => {
    const proposalSubmitter: any = proposal.user;
    const proposalStateRole = proposal.state;
    const x = location.pathname.split('/');
    const urlToMessage = `/${x[1]}/${x[2]}/messages`;

    const valueToConversation: Conversation = {
      id: uuidv4(),
      correspondance_category_id: 'EXTERNAL',
      messages: [
        {
          content: null,
          attachment: null,
          content_title: null,
          content_type_id: 'TEXT',
          receiver_id: proposalSubmitter.client_data.user_id,
          owner_id: user?.id,
          receiver_role_as: `tender_${proposalSubmitter.roles[0].user_type_id.toLowerCase()}`,
          sender_role_as: `tender_${proposalStateRole.toLowerCase()}`,
          created_at: moment().toISOString(),
          updated_at: moment().toISOString(),
          read_status: false,
          receiver: {
            employee_name: proposalSubmitter.employee_name,
          },
          sender: {
            employee_name: user?.firstName,
          },
        },
      ],
    };

    const valueNewConversation = conversations;
    let hasConversationId: string | undefined = undefined;

    if (valueNewConversation.length) {
      for (let index = 0; index < valueNewConversation.length; index++) {
        const { messages } = valueNewConversation[index];
        const findReceiverId = messages.find(
          (el) =>
            el.owner_id === valueToConversation.messages[0].receiver_id ||
            el.receiver_id === valueToConversation.messages[0].receiver_id
        );

        if (findReceiverId) {
          hasConversationId = valueNewConversation[index].id;
        }
      }
    }

    if (hasConversationId) {
      dispatch(setActiveConversationId(hasConversationId));
      handleReadMessages(hasConversationId);
      navigate(urlToMessage);
    } else {
      dispatch(addConversation(valueToConversation));
      dispatch(setActiveConversationId(valueToConversation.id!));
      handleReadMessages(valueToConversation.id!);
      navigate(urlToMessage);
    }
  };

  const handleReadMessages = async (conversationId: string) => {
    await axiosInstance.patch(
      '/tender/messages/toogle-read',
      {
        roomId: conversationId,
      },
      {
        headers: { 'x-hasura-role': `tender_${proposal.state.toLowerCase()}` },
      }
    );
  };

  React.useEffect(() => {
    dispatch(setStepsData(proposal, activeRole! as FusionAuthRoles));
  }, [proposal, activeRole]);

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
        <Grid container rowSpacing={10} alignItems="center" justifyContent="space-between">
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
              {/* <MenuItem
                onClick={() => {
                  navigate(`/project-manager/dashboard/amandment-request/${proposal_id}`);
                  handleClose();
                }}
              >
                {translate('proposal_amandement.button_label')}
              </MenuItem> */}
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
          <Grid item md={checkGrant ? 10 : 8} xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-start">
              {checkConsultant ? (
                <Button
                  variant="outlined"
                  color="inherit"
                  endIcon={<Iconify icon="eva:message-circle-outline" />}
                  onClick={() => setAction('ACCEPT_CONSULTANT')}
                  sx={{ display: 'inline-flex' }}
                >
                  عرض المشروع على المستشارين
                </Button>
              ) : null}
              {checkGrant ? (
                <LoadingButton
                  variant="outlined"
                  color="inherit"
                  endIcon={<Iconify icon="eva:message-circle-outline" />}
                  onClick={handleMessage}
                  sx={{ flex: 1 }}
                  loading={isSubmitting}
                >
                  {translate('partner_details.send_messages')}
                </LoadingButton>
              ) : null}
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
              <LoadingButton
                onClick={() => {
                  setAction('ACCEPT');
                }}
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                sx={{ flex: 1, '&:hover': { backgroundColor: '#13B2A2' } }}
                loading={isSubmitting}
              >
                قبول المشروع
              </LoadingButton>

              {/* disabled other than accept reject button */}
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
      {/* {action === 'ACCEPT' && (
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
      )} */}

      {action === 'ACCEPT' && !checkGrant && (
        // <NotesModal
        //   title="قبول المشروع"
        //   onClose={handleCloseModal}
        //   onSubmit={handleApproval}
        //   action={{
        //     actionType: action,
        //     actionLabel: 'قبول',
        //     backgroundColor: 'background.paper',
        //     hoverColor: '#13B2A2',
        //   }}
        //   loading={isSubmitting}
        // />
        <ProposalAcceptingForm
          onSubmit={handleApproval}
          onClose={handleCloseModal}
          loading={isSubmitting}
        />
      )}
      {action === 'ACCEPT' && checkGrant && (
        <FacilitateSupervisorAcceptingForm onClose={handleCloseModal} />
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
