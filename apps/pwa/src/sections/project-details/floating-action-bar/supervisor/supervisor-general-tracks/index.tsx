import { Box, Button, Grid, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useNavigate, useParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState } from 'react';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import { nanoid } from 'nanoid';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useMutation } from 'urql';
import {
  ProposalAcceptBySupervisor,
  ProposalRejectBySupervisor,
} from 'queries/project-supervisor/ProposalAcceptBySupervisor';
import { UpdateAction } from '../../../../../@types/project-details';
import NotesModal from 'components/notes-modal';

function FloatingActionBar() {
  const { id: pid } = useParams();

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [, accept] = useMutation(ProposalAcceptBySupervisor);

  const [, reject] = useMutation(ProposalRejectBySupervisor);

  const { translate } = useLocales();

  const theme = useTheme();

  const [action, setAction] = useState<UpdateAction>('');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleCloseModal = () => {
    setAction('');
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApproval = async (values: any) => {
    const { notes, ...restValues } = values;
    accept({
      proposal_id: pid,
      new_values: {
        inner_status: 'ACCEPTED_BY_SUPERVISOR',
        outter_status: 'ONGOING',
        state: 'PROJECT_MANAGER',
        ...restValues,
      },
      log: {
        id: nanoid(),
        proposal_id: pid,
        reviewer_id: user?.id!,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مشرف المشاريع ',
        notes: notes,
        user_role: 'PROJECT_SUPERVISOR',
        state: 'PROJECT_SUPERVISOR',
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar('تم قبول المشروع بنجاح', {
          variant: 'success',
        });
        navigate(`/project-supervisor/dashboard/app`);
      }
    });
  };

  const handleRejected = async (values: any) => {
    reject({
      proposal_id: pid,
      new_values: {
        inner_status: 'REJECTED_BY_SUPERVISOR',
        outter_status: 'CANCELED',
        state: 'PROJECT_SUPERVISOR',
      },
      log: {
        id: nanoid(),
        proposal_id: pid,
        reviewer_id: user?.id!,
        action: 'reject',
        message: 'تم رفض المشروع من قبل مشرف المشاريع',
        notes: values.notes,
        user_role: 'PROJECT_SUPERVISOR',
        state: 'PROJECT_SUPERVISOR',
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar(translate('proposal_rejected'), {
          variant: 'success',
        });
        navigate(`/project-supervisor/dashboard/app`);
      }
    });
  };

  const stepBackProposal = () => {
    reject({
      proposal_id: pid,
      new_values: {
        inner_status: 'CREATED_BY_CLIENT',
        outter_status: 'ONGOING',
        state: 'MODERATOR',
        supervisor_id: null,
        project_track: null,
      },
      log: {
        id: nanoid(),
        proposal_id: pid,
        reviewer_id: user?.id!,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
        user_role: 'PROJECT_SUPERVISOR',
        state: 'PROJECT_SUPERVISOR',
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar('تم إرجاع المعاملة لمسوؤل الفرز بنجاح', {
          variant: 'success',
        });
        navigate(`/project-supervisor/dashboard/app`);
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
        <Grid container rowSpacing={5} alignItems="center" justifyContent="space-around">
          <Grid item md={5} xs={12}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                onClick={() => setAction('ACCEPT')}
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                sx={{ flex: 1 }}
              >
                {translate('accept_project')}
              </Button>
              <Button
                sx={{
                  flex: 1,
                  backgroundColor: '#FF4842',
                  ':hover': { backgroundColor: '#FF170F' },
                }}
                variant="contained"
                onClick={() => setAction('REJECT')}
                endIcon={<ClearIcon />}
              >
                {translate('reject_project')}
              </Button>
            </Stack>
          </Grid>
          <Grid item md={2}>
            <Box>{''}</Box>
          </Grid>
          <Grid item md={5}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                variant="outlined"
                color="inherit"
                endIcon={<Iconify icon="eva:message-circle-outline" />}
                sx={{ flex: 1 }}
                disabled={true}
              >
                {translate('partner_details.send_messages')}
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
                {translate('partner_details.submit_amendment_request')}
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
                <MenuItem disabled={true}>ارسال طلب تعديل الى المشرف</MenuItem>
                <MenuItem
                  onClick={() => setAction('STEP_BACK')} //{stepBackProposal}
                >
                  ارجاع المعاملة الى مسؤول الفرز
                </MenuItem>
              </Menu>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {action === 'REJECT' && (
        <NotesModal
          title="رفض المشروع"
          onClose={handleCloseModal}
          onSubmit={handleRejected}
          action={{ actionLabel: 'رفض', backgroundColor: '#FF0000', hoverColor: '#FF4842' }}
        />
      )}
      {action === 'ACCEPT' && (
        <ProposalAcceptingForm onSubmit={handleApproval} onClose={handleCloseModal} />
      )}
      {action === 'STEP_BACK' && (
        <NotesModal
          title="إرجاع المعاملة إلى مسؤول الفرز"
          onClose={handleCloseModal}
          onSubmit={stepBackProposal}
          action={{ actionLabel: 'إرجاع', backgroundColor: '#0169DE', hoverColor: '#1482FE' }}
        />
      )}
    </>
  );
}

export default FloatingActionBar;
