import { LoadingButton } from '@mui/lab';
import { Box, Stack } from '@mui/material';
import NotesModal from 'components/notes-modal';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { updateProposalByProjectManager } from 'queries/project-manager/updateProposalByProjectManager';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';

//
import { FEATURE_PROPOSAL_COUNTING } from 'config';
import axiosInstance from 'utils/axios';
import { getProposalCount } from '../../../../redux/slices/proposal';
import { useDispatch, useSelector } from '../../../../redux/store';

function RejectProject() {
  const [action, setAction] = React.useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { translate, currentLang } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, activeRole } = useAuth();

  const { id: proposal_id } = useParams();

  const [, update] = useMutation(updateProposalByProjectManager);

  const { enqueueSnackbar } = useSnackbar();

  const handleCloseModal = () => {
    setAction('');
  };

  const handleRejected = async (values: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'reject',
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
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
          setIsSubmitting(false);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToStudy = async (data: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'study_again',
        message: 'تم إرجاع المشروع للدراسة من جديد',
        notes: data.notes,
        selectLang: currentLang.value,
        ceo_payload: {
          step_back_to: data.state,
        },
      };

      await axiosInstance
        .patch('/tender-proposal/change-state', payload, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            enqueueSnackbar(translate('proposal_studyagain'), {
              variant: 'success',
            });
          }
          // for re count total proposal
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
          setIsSubmitting(false);
          navigate(
            `/${activeRole === 'tender_project_manager' ? 'project-manager' : 'ceo'}/dashboard/app`
          );
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

      setIsSubmitting(true);
    }
  };
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        p: 3,
        borderRadius: 1,
        position: 'sticky',
        // width: '50%',
        bottom: 24,
        // left: '40%',
        border: `1px`,
      }}
    >
      <Stack direction={{ sm: 'row', md: 'row' }} justifyContent="center">
        {proposal.outter_status === 'PENDING_CANCELED' && (
          <LoadingButton
            variant="contained"
            sx={{
              backgroundColor: '#FF4842',
              ':hover': { backgroundColor: '#FF170F' },
              mx: 1,
            }}
            loading={isSubmitting}
            onClick={() => setAction('REJECT')}
          >
            {translate('button.confirm_rejection')}
          </LoadingButton>
        )}
        <LoadingButton
          variant="contained"
          sx={(theme) => ({
            color: '#fff',
            backgroundColor: theme.palette.background.paper,
            ':hover': { backgroundColor: '#13B2A2' },
            mx: 1,
          })}
          loading={isSubmitting}
          // onClick={() => setAction('STUDY_AGAIN')}
        >
          {translate('button.study_again')}
        </LoadingButton>
      </Stack>

      {action === 'STUDY_AGAIN' && (
        <NotesModal
          title="إرجاع المشروع للدراسة من جديد"
          onClose={handleCloseModal}
          onSubmit={backToStudy}
          loading={isSubmitting}
          action={{
            actionLabel: 'إرجاع',
            backgroundColor: '#0169DE',
            hoverColor: '#1482FE',
            actionType: 'STUDY_AGAIN',
          }}
        />
      )}
      {action === 'REJECT' && (
        <NotesModal
          title="رفض المشروع"
          onClose={handleCloseModal}
          onSubmit={handleRejected}
          loading={isSubmitting}
          action={{
            actionType: action,
            actionLabel: 'رفض',
            backgroundColor: '#FF0000',
            hoverColor: '#FF4842',
          }}
        />
      )}
    </Box>
  );
}

export default RejectProject;
