import { Box, Button, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import { UpdateAction } from '../../../../@types/project-details';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByCEO } from 'queries/ceo/updateProposalByCEO';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import NotesModal from 'components/notes-modal';
//
import axiosInstance from 'utils/axios';
import { LoadingButton } from '@mui/lab';
import uuidv4 from 'utils/uuidv4';
import { addConversation, setActiveConversationId, setMessageGrouped } from 'redux/slices/wschat';
import { dispatch, useSelector } from 'redux/store';
import moment from 'moment';
import { Conversation } from '../../../../@types/wschat';
import FacilitateSupervisorAcceptingForm from '../supervisor/supervisor-facilitate-track/forms';
import { setStepsData } from '../../../../redux/slices/supervisorAcceptingForm';
import { getProposalCount } from '../../../../redux/slices/proposal';
import { FEATURE_PROPOSAL_COUNTING } from 'config';
import { FusionAuthRoles } from '../../../../@types/commons';

function FloatingActionBar() {
  const { user, activeRole } = useAuth();

  const { id: proposal_id } = useParams();

  const theme = useTheme();

  const { proposal, track_list } = useSelector((state) => state.proposal);
  const { conversations } = useSelector((state) => state.wschat);
  const location = useLocation();
  const activeRoleIndex: number = Number(localStorage.getItem('activeRoleIndex')) ?? 0;

  const { translate, currentLang } = useLocales();

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
        selectLang: currentLang.value,
      };

      // console.log('payloadApprovalCeo', payload);

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
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          // dispatch(getProposalCount(activeRole ?? 'test'));
          //
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

  const handleRejected = async (data: any) => {
    setIsSubmittingRejected(true);

    try {
      const payload = {
        proposal_id,
        action: 'reject',
        message: 'تم قبول المشروع من قبل الرئيس التنفيذي ',
        notes: data.notes,
        selectLang: currentLang.value,
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
          // for re count total proposal
          // dispatch(getProposalCount(activeRole ?? 'test'));
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
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

  const stepBackProposal = async (data: any) => {
    setIsSubmittingStepback(true);

    try {
      const payload = {
        proposal_id,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
        notes: data.notes,
        selectLang: currentLang.value,
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
          // for re count total proposal
          // dispatch(getProposalCount(activeRole ?? 'test'));
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
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
    console.log('proposalSubmitter', proposalSubmitter);
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
  // console.log(proposal.proposal_item_budgets.length)

  React.useEffect(() => {
    dispatch(setStepsData(proposal, activeRole! as FusionAuthRoles));
  }, [proposal, activeRole]);

  // console.log({ track_list, proposal });
  // console.log(
  //   'testq',
  //   track_list.find((item: any) => item.id === proposal.track_id)?.with_consultation
  // );

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
        <Stack
          direction={{ sm: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
          component="div"
        >
          <Stack spacing={2} direction="row" alignItems="center">
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={() => setAction('ACCEPT')}
              loading={isSubmitting}
            >
              {translate('project_acceptance')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              sx={{
                backgroundColor: '#FF4842',
                ':hover': { backgroundColor: '#FF170F' },
              }}
              onClick={() => setAction('REJECT')}
              loading={isSubmittingRejected}
            >
              {translate('project_rejected')}
            </LoadingButton>
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center">
            <LoadingButton
              variant="outlined"
              color="inherit"
              endIcon={<Iconify icon="eva:message-circle-outline" />}
              onClick={handleMessage}
              loading={isSubmitting || isSubmittingRejected}
            >
              {translate('partner_details.send_messages')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              onClick={handleClick}
              sx={{ backgroundColor: '#0169DE', ':hover': { backgroundColor: '#1482FE' } }}
              endIcon={<Iconify icon="eva:edit-2-outline" />}
              loading={isSubmittingStepback}
            >
              {translate('submit_amendment_request')}
            </LoadingButton>
          </Stack>

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
            {/* <MenuItem
              // disabled={true}
              onClick={() => {
                navigate(`/ceo/dashboard/amandment-request/${proposal_id}`);
                handleClose();
              }}
            >
              {translate('proposal_amandement.button_label')}
            </MenuItem> */}
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

      {/* {action === 'ACCEPT' && proposal.project_track !== 'CONCESSIONAL_GRANTS' && (
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
      {action === 'ACCEPT' &&
        track_list.find((item: any) => item.id === proposal.track_id)?.with_consultation ===
          false && (
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
      {/* {action === 'ACCEPT' && proposal.project_track === 'CONCESSIONAL_GRANTS' && (
        <FacilitateSupervisorAcceptingForm onClose={handleCloseModal} />
      )} */}
      {action === 'ACCEPT' &&
        track_list.find((item: any) => item.id === proposal.track_id)?.with_consultation ===
          true && <FacilitateSupervisorAcceptingForm onClose={handleCloseModal} />}
    </>
  );
}

export default FloatingActionBar;
