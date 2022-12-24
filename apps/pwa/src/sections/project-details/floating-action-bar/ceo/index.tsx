import { Box, Button, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import { UpdateAction } from '../../../../@types/project-details';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByCEO } from 'queries/ceo/updateProposalByCEO';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import NotesModal from 'components/notes-modal';

function FloatingActionBar() {
  const { user } = useAuth();

  const { id: proposal_id } = useParams();

  const theme = useTheme();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [, update] = useMutation(updateProposalByCEO);

  const [action, setAction] = useState<UpdateAction>('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const handleApproval = async (data: any) => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
        outter_status: 'ONGOING',
        state: `CEO`,
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'accept',
        notes: data.notes,
        message: 'تم قبول المشروع من قبل الرئيس التنفيذي ',
        user_role: 'CEO',
        state: 'CEO',
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar(translate('proposal_accept'), {
          variant: 'success',
        });
        navigate(`/ceo/dashboard/app`);
      }
    });
  };

  const handleRejected = async (data: any) => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'REJECTED_BY_CEO',
        outter_status: 'CANCELED',
        state: 'CEO',
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'reject',
        notes: data.notes,
        message: 'تم قبول المشروع من قبل الرئيس التنفيذي ',
        user_role: 'CEO',
        state: 'CEO',
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar(translate('proposal_accept'), {
          variant: 'success',
        });
        navigate(`/ceo/dashboard/app`);
      }
    });
  };

  const stepBackProposal = () => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'ACCEPTED_BY_SUPERVISOR',
        outter_status: 'ONGOING',
        state: 'PROJECT_MANAGER',
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
        user_role: 'CEO',
        state: 'CEO',
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar('تم إرجاع المعاملة لمدير المشروع', {
          variant: 'success',
        });
        navigate(`/ceo/dashboard/app`);
      }
    });
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
          <Stack flexDirection={{ sm: 'column', md: 'row' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: { md: '1em' } }}
              onClick={() => setAction('ACCEPT')}
            >
              {translate('project_acceptance')}
            </Button>
            <Button
              variant="contained"
              sx={{
                my: { xs: '1.3em', md: '0' },
                mr: { md: '1em' },
                backgroundColor: '#FF4842',
                ':hover': { backgroundColor: '#FF170F' },
              }}
              onClick={() => setAction('REJECT')}
            >
              {translate('project_rejected')}
            </Button>
          </Stack>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{ backgroundColor: '#0169DE', ':hover': { backgroundColor: '#1482FE' } }}
            endIcon={<Iconify icon="eva:edit-2-outline" />}
          >
            {translate('submit_amendment_request')}
          </Button>
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
            <MenuItem disabled={true}>ارسال طلب تعديل الى المشرف</MenuItem>
            <MenuItem onClick={() => setAction('STEP_BACK')}>
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
          action={{ actionLabel: 'رفض', backgroundColor: '#FF0000', hoverColor: '#FF4842' }}
        />
      )}
      {action === 'STEP_BACK' && (
        <NotesModal
          title="إرجاع المعاملة إلى مدير الإدارة"
          onClose={handleCloseModal}
          onSubmit={stepBackProposal}
          action={{ actionLabel: 'إرجاع', backgroundColor: '#0169DE', hoverColor: '#1482FE' }}
        />
      )}
      {action === 'ACCEPT' && (
        <NotesModal
          title="قبول المشروع"
          onClose={handleCloseModal}
          onSubmit={handleApproval}
          action={{
            actionLabel: 'رفض',
            backgroundColor: 'background.paper',
            hoverColor: '#13B2A2',
          }}
        />
      )}
    </>
  );
}

export default FloatingActionBar;
