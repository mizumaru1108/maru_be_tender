import { Box, Button, Stack, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByModerator } from 'queries/Moderator/updateProposalByModerator';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import ProposalRejectingForm from './ProposalRejectingForm';
import axiosInstance from 'utils/axios';
import uuidv4 from 'utils/uuidv4';
import { addConversation, setActiveConversationId, setMessageGrouped } from 'redux/slices/wschat';
import { dispatch, useDispatch, useSelector } from 'redux/store';
import moment from 'moment';
import { Conversation } from '../../../../@types/wschat';
import { getProposalCount, getTrackList } from 'redux/slices/proposal';
import { FEATURE_PROPOSAL_COUNTING } from 'config';

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

  const [, update] = useMutation(updateProposalByModerator);

  const [action, setAction] = useState<'accept' | 'reject' | ''>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittingRejected, setIsSubmittingRejected] = useState<boolean>(false);

  const handleOnCloseModal = () => {
    setAction('');
  };

  const handleApproval = async (data: any) => {
    setIsSubmitting(true);
    // console.log({ data });

    try {
      const payload = {
        proposal_id: id,
        action: 'accept',
        moderator_payload: {
          // project_track: data.path,
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
          // for re count total proposal
          // dispatch(getProposalCount(activeRole ?? 'test'));
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
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
    }
  };

  const handleRejected = async (data: any) => {
    setIsSubmittingRejected(true);
    // console.log({ data });

    try {
      const payload = {
        proposal_id: id,
        action: 'reject',
        moderator_payload: {
          // project_track: data.path,
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
          // for re count total proposal
          // dispatch(getProposalCount(activeRole ?? 'test'));
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
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
          // receiver_role_as: `tender_${proposalSubmitter.roles[0].role.id.toLowerCase()}`,
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

  // useEffect(() => {
  //   dispatch(getTrackList(0, activeRole!));
  // }, [activeRole]);

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
        <Stack direction={{ sm: 'column', md: 'row' }} justifyContent="space-between">
          <Stack flexDirection={{ sm: 'column', md: 'row' }}>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              color="primary"
              sx={{ mr: { md: '1em' } }}
              onClick={() => setAction('accept')}
            >
              {translate('account_manager.accept_project')}
            </LoadingButton>
            <LoadingButton
              loading={isSubmittingRejected}
              variant="contained"
              sx={{
                my: { xs: '1.3em', md: '0' },
                mr: { md: '1em' },
                backgroundColor: '#FF4842',
                ':hover': { backgroundColor: '#FF170F' },
              }}
              onClick={() => setAction('reject')}
            >
              {translate('account_manager.reject_project')}
            </LoadingButton>
            {/* disabled other than accept reject button */}
            {/* <Button
              // disabled={true}
              variant="outlined"
              color="primary"
              sx={{ my: { xs: '1.3em', md: '0' }, ':hover': { backgroundColor: '#fff' } }}
            >
              {translate('send_message_to_partner')}
            </Button> */}
            <Button
              variant="outlined"
              color="inherit"
              endIcon={<Iconify icon="eva:message-circle-outline" />}
              // onClick={() => setAction('SEND_CLIENT_MESSAGE')}
              onClick={handleMessage}
              sx={{ flex: 1 }}
              // disabled={true}
            >
              {translate('send_message_to_partner')}
            </Button>
          </Stack>

          {/* disabled other than accept reject button */}
          {/* <Button
            disabled={true}
            variant="contained"
            onClick={() => {}}
            sx={{ backgroundColor: '#0169DE', ':hover': { backgroundColor: '#1482FE' } }}
            endIcon={<Iconify icon="eva:edit-2-outline" />}
          >
            {translate('submit_amendment_request')}
          </Button> */}
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
