import { Button, Box, Stack } from '@mui/material';
import NotesModal from 'components/notes-modal';
import useAuth from 'hooks/useAuth';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByProjectManager } from 'queries/project-manager/updateProposalByProjectManager';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import { LoadingButton } from '@mui/lab';
import useLocales from 'hooks/useLocales';

//
import axiosInstance from 'utils/axios';

function RejectProject() {
  const [action, setAction] = React.useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { translate } = useLocales();

  const navigate = useNavigate();

  const { user, activeRole } = useAuth();

  const { id: proposal_id } = useParams();

  const [, update] = useMutation(updateProposalByProjectManager);

  const { enqueueSnackbar } = useSnackbar();

  const handleCloseModal = () => {
    setAction('');
  };

  const backToStudy = async (data: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'study_again',
        message: 'تم إرجاع المشروع للدراسة من جديد',
        notes: data.notes,
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

      setIsSubmitting(true);
    }
    // update({
    //   proposal_id,
    //   new_values: {
    //     inner_status: 'CREATED_BY_CLIENT',
    //     outter_status: 'ONGOING',
    //     state: 'MODERATOR',
    //     project_manager_id: null,
    //     supervisor_id: null,
    //   },
    //   log: {
    //     id: nanoid(),
    //     proposal_id,
    //     reviewer_id: user?.id!,
    //     action: 'study_again',
    //     message: 'تم إرجاع المشروع للدراسة من جديد',
    //     user_role: activeRole === 'tender_ceo' ? 'CEO' : 'PROJECT_MANAGER',
    //     state: activeRole === 'tender_ceo' ? 'CEO' : 'PROJECT_MANAGER',
    //     notes: data.notes,
    //   },
    // }).then((res) => {
    //   if (res.error) {
    //     enqueueSnackbar(res.error.message, {
    //       variant: 'error',
    //       preventDuplicate: true,
    //       autoHideDuration: 3000,
    //     });
    //   } else {
    //     enqueueSnackbar('تم إعادة المشروع للدراسة من جديد', {
    //       variant: 'success',
    //     });
    //     navigate(
    //       `/${activeRole === 'tender_project_manager' ? 'project-manager' : 'ceo'}/dashboard/app`
    //     );
    //   }
    // });
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
        <LoadingButton
          variant="contained"
          sx={(theme) => ({
            color: '#fff',
            backgroundColor: theme.palette.background.paper,
            ':hover': { backgroundColor: '#13B2A2' },
          })}
          loading={isSubmitting}
          onClick={() => setAction('STUDY_AGAIN')}
        >
          إرجاع المعاملة للدراسة
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
    </Box>
  );
}

export default RejectProject;
