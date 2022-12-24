import { Box, Button, Grid, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useMutation } from 'urql';
import { useNavigate, useParams } from 'react-router';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import { ProposalRejectBySupervisor } from 'queries/project-supervisor/ProposalAcceptBySupervisor';
import { ProposalRejectBySupervisorFacilitateGrant } from 'queries/project-supervisor/ProposalRejectBySupervisorFacilitateGrant';
import { UpdateAction } from '../../../../../@types/project-details';
import NotesModal from 'components/notes-modal';
import FacilitateSupervisorAcceptingForm from './forms';
import { useDispatch, useSelector } from 'redux/store';
import { setStepsData } from 'redux/slices/supervisorAcceptingForm';

function FloatinActionBar() {
  const dispatch = useDispatch();

  const { proposal } = useSelector((state) => state.proposal);

  const navigate = useNavigate();

  const { id: proposal_id } = useParams();

  const { user } = useAuth();

  const { translate } = useLocales();

  const theme = useTheme();

  const [action, setAction] = React.useState<UpdateAction>('');

  const { enqueueSnackbar } = useSnackbar();

  const [, stepBack] = useMutation(ProposalRejectBySupervisor);

  const [, reject] = useMutation(ProposalRejectBySupervisorFacilitateGrant);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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

  const stepBackProposal = () => {
    stepBack({
      proposal_id,
      new_values: {
        inner_status: 'CREATED_BY_CLIENT',
        outter_status: 'ONGOING',
        state: 'MODERATOR',
        supervisor_id: null,
        project_track: null,
      },
      log: {
        id: nanoid(),
        proposal_id,
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

  const handleRejected = (values: any) => {
    reject({
      proposal_id,
      new_values: {
        inner_status: 'REJECTED_BY_SUPERVISOR',
        outter_status: 'CANCELED',
        state: 'PROJECT_SUPERVISOR',
      },
      log: {
        id: nanoid(),
        proposal_id,
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
        enqueueSnackbar(translate('proposal_accept'), {
          variant: 'success',
        });
        navigate(`/project-supervisor/dashboard/app`);
      }
    });
  };

  useEffect(() => {
    dispatch(setStepsData(proposal));
  }, [dispatch, proposal]);
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
                onClick={() => setAction('SEND_CLIENT_MESSAGE')}
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
                <MenuItem onClick={() => setAction('STEP_BACK')}>
                  ارجاع المعاملة الى مسؤول الفرز
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
          action={{ actionLabel: 'إرجاع', backgroundColor: '#0169DE', hoverColor: '#1482FE' }}
        />
      )}
      {action === 'REJECT' && (
        <NotesModal
          title="رفض المشروع"
          onClose={handleCloseModal}
          onSubmit={handleRejected}
          action={{ actionLabel: 'رفض', backgroundColor: '#FF0000', hoverColor: '#FF4842' }}
        />
      )}
      {action === 'ACCEPT' && <FacilitateSupervisorAcceptingForm onClose={handleCloseModal} />}
    </>
  );
}

export default FloatinActionBar;
