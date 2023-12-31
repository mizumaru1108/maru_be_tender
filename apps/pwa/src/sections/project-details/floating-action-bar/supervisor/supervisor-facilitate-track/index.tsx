import { Box, Button, Grid, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { useMutation } from 'urql';
import { useLocation, useNavigate, useParams } from 'react-router';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import { ProposalRejectBySupervisor } from 'queries/project-supervisor/ProposalAcceptBySupervisor';
import { ProposalRejectBySupervisorFacilitateGrant } from 'queries/project-supervisor/ProposalRejectBySupervisorFacilitateGrant';
import { UpdateAction, PendingRequest } from '../../../../../@types/project-details';
import NotesModal from 'components/notes-modal';
import FacilitateSupervisorAcceptingForm from './forms';
import { useDispatch, useSelector } from 'redux/store';
import { setStepsData, stepResetActive } from 'redux/slices/supervisorAcceptingForm';
import PendingProposalRequestSending from '../PendingProposalRequestSending';
import { FEATURE_AMANDEMENT_PROPOSAL, FEATURE_PROPOSAL_COUNTING } from '../../../../../config';
import axiosInstance from 'utils/axios';
import uuidv4 from 'utils/uuidv4';
import { addConversation, setActiveConversationId, setMessageGrouped } from 'redux/slices/wschat';
import moment from 'moment';
import { Conversation } from '../../../../../@types/wschat';

import { LoadingButton } from '@mui/lab';
import { getProposalCount } from '../../../../../redux/slices/proposal';
import { FusionAuthRoles } from '../../../../../@types/commons';
import ProposalNoBudgetRemainModal from '../../../../../components/modal-dialog/ProposalNoBudgetRemainModal';

function FloatinActionBar() {
  const dispatch = useDispatch();

  // state open budget modal state
  const [openBudgetModal, setOpenBudgetModal] = useState(false);

  const { proposal } = useSelector((state) => state.proposal);
  const { track } = useSelector((state) => state.tracks);

  const isAvailBudget = useMemo(() => {
    let tmpIsAvail = false;
    const budgetByClient =
      proposal?.amount_required_fsupport || proposal?.fsupport_by_supervisor || 0;
    const remainBudget = track
      ? (track?.total_budget || 0) - (track?.total_spending_budget || 0)
      : 0;
    if (remainBudget <= budgetByClient) {
      tmpIsAvail = false;
    } else {
      if (track?.total_budget && track?.total_budget > 0) {
        tmpIsAvail = true;
      } else {
        tmpIsAvail = false;
      }
    }
    return tmpIsAvail;
  }, [track, proposal]);

  const availBudget = useMemo(() => {
    const remainBudget = track
      ? (track?.total_budget || 0) - (track?.total_spending_budget || 0)
      : 0;
    return remainBudget;
  }, [track]);

  const { conversations } = useSelector((state) => state.wschat);
  const location = useLocation();
  const activeRoleIndex: number = Number(localStorage.getItem('activeRoleIndex')) ?? 0;

  const navigate = useNavigate();

  const { id: proposal_id } = useParams();

  const { user, activeRole } = useAuth();

  const { translate, currentLang } = useLocales();

  const theme = useTheme();

  const [action, setAction] = React.useState<UpdateAction>('');

  const { enqueueSnackbar } = useSnackbar();

  const [, stepBack] = useMutation(ProposalRejectBySupervisor);

  const [, reject] = useMutation(ProposalRejectBySupervisorFacilitateGrant);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSubmittingStepback, setIsSubmittingStepback] = useState<boolean>(false);
  const [isSubmittingRejected, setIsSubmittingRejected] = useState<boolean>(false);

  const open = Boolean(anchorEl);

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

  // const stepBackProposal = () => {
  //   stepBack({
  //     proposal_id,
  //     new_values: {
  //       inner_status: 'CREATED_BY_CLIENT',
  //       outter_status: 'ONGOING',
  //       state: 'MODERATOR',
  //       supervisor_id: null,
  //       project_track: null,
  //     },
  //     log: {
  //       id: nanoid(),
  //       proposal_id,
  //       reviewer_id: user?.id!,
  //       action: 'step_back',
  //       message: 'تم إرجاع المشروع خطوة للوراء',
  //       user_role: 'PROJECT_SUPERVISOR',
  //       state: 'PROJECT_SUPERVISOR',
  //     },
  //   }).then((res) => {
  //     if (res.error) {
  //       enqueueSnackbar(res.error.message, {
  //         variant: 'error',
  //         preventDuplicate: true,
  //         autoHideDuration: 3000,
  //       });
  //     } else {
  //       enqueueSnackbar('تم إرجاع المعاملة لمسوؤل الفرز بنجاح', {
  //         variant: 'success',
  //       });
  //       navigate(`/project-supervisor/dashboard/app`);
  //     }
  //   });
  // };

  const stepBackProposal = async (data: any) => {
    setIsSubmittingStepback(true);

    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
        notes: data.notes,
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
          navigate(`/project-supervisor/dashboard/app`);
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

  const handleRejected = async (values: any) => {
    setIsSubmittingRejected(true);

    try {
      const payload = {
        proposal_id,
        // action: 'reject',
        action: 'hold',
        message: 'تم رفض المشروع من قبل مشرف المشاريع',
        notes: values.notes,
        reject_reason: values.reject_reason,
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
          navigate(`/project-supervisor/dashboard/app`);
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

      setIsSubmittingRejected(true);
    }
  };

  const pendingProposal = (data: PendingRequest) => {};

  const handleMessage = () => {
    const proposalSubmitter = proposal.user;
    const proposalStateRole = proposal.state;
    const x = location.pathname.split('/');
    const urlToMessage = `/${x[1]}/${x[2]}/messages`;

    const valueToConversation: Conversation = {
      id: uuidv4(),
      correspondance_category_id: 'INTERNAL',
      messages: [
        {
          content: null,
          attachment: null,
          content_title: null,
          content_type_id: 'TEXT',
          receiver_id: proposalSubmitter.id,
          owner_id: user?.id,
          // receiver_role_as: `tender_${proposalSubmitter.roles[
          //   activeRoleIndex
          // ].role.id.toLowerCase()}`,
          receiver_role_as: `tender_${proposalSubmitter.roles[
            activeRoleIndex
          ]?.user_type_id.toLowerCase()}`,

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

  const handleCloseBudgetModal = () => {
    setOpenBudgetModal(false);
  };

  const handleContinueBudgetModal = () => {
    setOpenBudgetModal(false);
    setAction('ACCEPT');
  };

  React.useEffect(() => {
    dispatch(setStepsData(proposal, activeRole! as FusionAuthRoles));
  }, [proposal, dispatch, activeRole]);

  return (
    <>
      <ProposalNoBudgetRemainModal
        open={openBudgetModal}
        isAvailBudget={availBudget > 0 ? true : false}
        message={`ميزانية المشروع تتخطى الميزانية المخصصة للمسار
            (${
              (track?.total_budget || 0) - (track.total_spending_budget || 0)
            }) الميزانية المحددة للمشروع هي ${
          proposal?.fsupport_by_supervisor || proposal?.amount_required_fsupport || 0
        } ، الميزانية المتبقية في المسار هي `}
        handleClose={handleCloseBudgetModal}
        handleOnContinue={handleContinueBudgetModal}
      />
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
          <Grid item md={4} xs={12}>
            <Stack direction="row" gap={2} justifyContent="space-between">
              <Button
                // disabled={!isAvailBudget}
                onClick={() => {
                  if (isAvailBudget) {
                    setAction('ACCEPT');
                  } else {
                    setOpenBudgetModal(true);
                  }
                }}
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                sx={{ flex: 1 }}
              >
                {translate('account_manager.accept_project')}
              </Button>
              <LoadingButton
                sx={{
                  flex: 1,
                  backgroundColor: '#FF4842',
                  ':hover': { backgroundColor: '#FF170F' },
                }}
                variant="contained"
                onClick={() => setAction('REJECT')}
                endIcon={<ClearIcon />}
                loading={isSubmittingRejected}
              >
                {translate('account_manager.reject_project')}
              </LoadingButton>
            </Stack>
          </Grid>
          <Grid item md={5} xs={12}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                variant="outlined"
                color="inherit"
                endIcon={<Iconify icon="eva:message-circle-outline" />}
                onClick={handleMessage}
                sx={{ flex: 1 }}
              >
                {translate('account_manager.partner_details.send_messages')}
              </Button>
              <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                endIcon={<Iconify icon="eva:edit-2-outline" />}
                onClick={handleClick}
                sx={{
                  flex: 1,
                  backgroundColor: '#0169DE',
                  ':hover': { backgroundColor: '#1482FE' },
                }}
              >
                {translate('account_manager.partner_details.submit_amendment_request')}
              </Button>
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
                  disabled={FEATURE_AMANDEMENT_PROPOSAL ? false : true}
                  onClick={() => {
                    navigate(
                      `/project-supervisor/dashboard/proposal-amandment-request/${proposal_id}`
                    );
                  }}
                >
                  {translate('account_manager.partner_details.amendment_request_to_client')}
                </MenuItem>
                <MenuItem onClick={() => setAction('STEP_BACK')}>
                  {translate('account_manager.partner_details.amendment_return_to_moderator')}
                </MenuItem>
              </Menu>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      {action === 'STEP_BACK' && (
        <NotesModal
          title="إرجاع المعاملة إلى مسؤول الفرز"
          onClose={handleCloseModal}
          onSubmit={stepBackProposal}
          loading={isSubmittingStepback}
          action={{
            actionType: action,
            actionLabel: 'إرجاع',
            backgroundColor: '#0169DE',
            hoverColor: '#1482FE',
          }}
        />
      )}
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
      {action === 'ACCEPT' && <FacilitateSupervisorAcceptingForm onClose={handleCloseModal} />}
      {action === 'PENDING_REQUEST' && (
        <PendingProposalRequestSending onClose={handleCloseModal} onSubmit={pendingProposal} />
      )}
    </>
  );
}

export default FloatinActionBar;
