import { Button, Box, Stack } from '@mui/material';
import NotesModal from 'components/notes-modal';
import useAuth from 'hooks/useAuth';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByProjectManager } from 'queries/project-manager/updateProposalByProjectManager';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';

function RejectProject() {
  const [action, setAction] = React.useState('');

  const navigate = useNavigate();

  const { user, activeRole } = useAuth();

  const { id: proposal_id } = useParams();

  const [, update] = useMutation(updateProposalByProjectManager);

  const { enqueueSnackbar } = useSnackbar();

  const handleCloseModal = () => {
    setAction('');
  };

  const backToStudy = () => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'CREATED_BY_CLIENT',
        outter_status: 'ONGOING',
        state: 'MODERATOR',
        project_manager_id: null,
        supervisor_id: null,
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'step_back',
        message: 'تم إرجاع المشروع للدراسة من جديد',
        user_role: 'PROJECT_MANAGER',
        state: 'PROJECT_MANAGER',
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar('تم إعادة المشروع للدراسة من جديد', {
          variant: 'success',
        });
        navigate(
          `/${activeRole === 'tender_project_manager' ? 'project-manager' : 'ceo'}/dashboard/app`
        );
      }
    });
  };
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        p: 3,
        borderRadius: 1,
        position: 'sticky',
        width: '50%',
        bottom: 24,
        left: '40%',
        border: `1px`,
      }}
    >
      <Stack direction={{ sm: 'row', md: 'row' }} justifyContent="center">
        <Button
          variant="contained"
          sx={(theme) => ({
            color: '#fff',
            backgroundColor: theme.palette.background.paper,
            ':hover': { backgroundColor: '#13B2A2' },
          })}
          onClick={() => setAction('STUDY_AGAIN')}
        >
          إرجاع المعاملة للدراسة
        </Button>
      </Stack>

      {action === 'STUDY_AGAIN' && (
        <NotesModal
          title="إرجاع المشروع للدراسة من جديد"
          onClose={handleCloseModal}
          onSubmit={backToStudy}
          action={{ actionLabel: 'إرجاع', backgroundColor: '#0169DE', hoverColor: '#1482FE' }}
        />
      )}
    </Box>
  );
}

export default RejectProject;
