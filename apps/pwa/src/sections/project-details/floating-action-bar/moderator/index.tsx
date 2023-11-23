import { Box, Button, Stack, useTheme, Menu, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import ProposalRejectingForm from './ProposalRejectingForm';
import axiosInstance from 'utils/axios';
import uuidv4 from 'utils/uuidv4';
import { addConversation, setActiveConversationId } from 'redux/slices/wschat';
import { dispatch, useSelector } from 'redux/store';
import moment from 'moment';
import { Conversation } from '../../../../@types/wschat';
import { getProposalCount } from 'redux/slices/proposal';
import { FEATURE_AMANDEMENT_PROPOSAL, FEATURE_PROPOSAL_COUNTING } from 'config';

function ModeratorActionBar() {
  const { user, activeRole } = useAuth();

  const { id } = useParams();
  const { proposal, isLoading } = useSelector((state) => state.proposal);
  const { conversations } = useSelector((state) => state.wschat);
  const location = useLocation();
  const activeRoleIndex: number = Number(localStorage.getItem('activeRoleIndex')) ?? 0;

  const theme = useTheme();

  const { translate, currentLang } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const [action, setAction] = useState<'accept' | 'reject' | ''>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittingRejected, setIsSubmittingRejected] = useState<boolean>(false);

  const handleOnCloseModal = () => {
    setAction('');
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApproval = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        proposal_id: id,
        action: 'accept',
        moderator_payload: {
          track_id: data.track_id,
          ...(data.supervisors !== 'all' && { supervisor_id: data.supervisors }),
        },
        message: 'تم قبول المشروع من قبل مسوؤل الفرز',
        notes: data.notes,
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

          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }

          setIsSubmitting(false);
          navigate(`/moderator/dashboard/app`);
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

          setIsSubmitting(false);
        });
    } catch (error) {
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
    }
  };

  const handleRejected = async (data: any) => {
    setIsSubmittingRejected(true);

    try {
      const payload = {
        proposal_id: id,
        action: 'reject',
        moderator_payload: {
          track_id: data.path,
        },
        message: 'تم رفض المشروع من قبل مسوؤل الفرز',
        notes: data.notes,
        reject_reason: data.reject_reason,
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

          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }

          setIsSubmittingRejected(false);
          navigate(`/moderator/dashboard/app`);
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
    }
  };
  const handleMessage = () => {
    const proposalSubmitter = proposal.user;
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
          receiver_id: proposalSubmitter.id,
          owner_id: user?.id,
          receiver_role_as: `tender_${proposalSubmitter.roles[0]?.user_type_id.toLowerCase()}`,
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

  if (isLoading) return null;

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
          spacing={2}
          justifyContent={{ xs: 'normal', md: 'space-between' }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: { xs: 2, sm: 0 } }}>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              color="primary"
              onClick={() => setAction('accept')}
            >
              {translate('account_manager.accept_project')}
            </LoadingButton>
            <LoadingButton
              loading={isSubmittingRejected}
              variant="contained"
              sx={{
                backgroundColor: '#FF4842',
                ':hover': { backgroundColor: '#FF170F' },
              }}
              onClick={() => setAction('reject')}
            >
              {translate('account_manager.reject_project')}
            </LoadingButton>
            <Button
              variant="outlined"
              color="inherit"
              endIcon={<Iconify icon="eva:message-circle-outline" />}
              onClick={handleMessage}
            >
              {translate('send_message_to_partner')}
            </Button>
          </Stack>

          <Button
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            endIcon={<Iconify icon="eva:edit-2-outline" />}
            onClick={handleClick}
            sx={{
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
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <MenuItem
              disabled={FEATURE_AMANDEMENT_PROPOSAL ? false : true}
              onClick={() => {
                navigate(`/moderator/dashboard/proposal-amandment-request/${id}`);
              }}
            >
              {translate('account_manager.partner_details.amendment_request_to_client')}
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
      {action === 'accept' && (
        <ProposalAcceptingForm
          onClose={handleOnCloseModal}
          onSubmit={handleApproval}
          loading={isSubmitting}
        />
      )}
      {action === 'reject' && (
        <ProposalRejectingForm
          onClose={handleOnCloseModal}
          onSubmit={handleRejected}
          loading={isSubmittingRejected}
        />
      )}
    </>
  );
}

export default ModeratorActionBar;
