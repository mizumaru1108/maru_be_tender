import { Box, Button, Grid, Stack, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useNavigate, useParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from 'react';
import { useMutation, useQuery } from 'urql';
import useAuth from 'hooks/useAuth';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from 'notistack';
import { nanoid } from 'nanoid';
import { updateProposalByProjectManager } from 'queries/project-manager/updateProposalByProjectManager';
import { UpdateAction } from '../../../../@types/project-details';
import NotesModal from 'components/notes-modal';

function FloatingActionBar() {
  const { id: proposal_id } = useParams();

  const { user } = useAuth();

  const employee_id = user?.id;

  const [result] = useQuery({
    query: `query MyQuery($id: String = "") {
      user: user_by_pk(id: $id) {
        track: employee_path
      }
    }
    `,
    variables: {
      id: employee_id,
    },
  });

  const { data, fetching, error } = result;

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [, update] = useMutation(updateProposalByProjectManager);

  const { translate } = useLocales();

  const theme = useTheme();

  const [action, setAction] = useState<UpdateAction>('');

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

  const handleApproval = (values: any) => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'ACCEPTED_BY_PROJECT_MANAGER',
        outter_status: 'ONGOING',
        state: 'CEO',
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مدير المشاريع ',
        notes: values.notes,
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
        enqueueSnackbar(translate('proposal_approved'), {
          variant: 'success',
        });
        navigate(`/project-manager/dashboard/app`);
      }
    });
  };

  const handleApprovalConsultant = (values: any) => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'ACCEPTED_AND_NEED_CONSULTANT',
        outter_status: 'ONGOING',
        state: 'CONSULTANT',
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مدير المشاريع وإحالته إلى قسم الاستشاريين ',
        notes: values.notes,
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
        enqueueSnackbar(translate('تم إرسال طلب الاستشارة بنجاح'), {
          variant: 'success',
        });
        navigate(`/project-manager/dashboard/app`);
      }
    });
  };

  const handleRejected = (values: any) => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'REJECTED',
        outter_status: 'CANCELED',
        state: 'PROJECT_MANAGER',
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'rejected',
        message: 'تم رفض المشروع من قبل مدير المشاريع',
        notes: values.notes,
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
        enqueueSnackbar(translate('proposal_rejected'), {
          variant: 'success',
        });
        navigate(`/project-manager/dashboard/app`);
      }
    });
  };

  const stepBackProposal = () => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'ACCEPTED_BY_MODERATOR',
        outter_status: 'ONGOING',
        state: 'PROJECT_SUPERVISOR',
        project_manager_id: null,
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
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
        enqueueSnackbar('تم إرجاع المعاملة لمشرف المشروع بنجاح', {
          variant: 'success',
        });
        navigate(`/project-manager/dashboard/app`);
      }
    });
  };

  if (fetching) return <>... Loading</>;

  if (error) return <>... Ops somthing went wrong</>;

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
            <Button
              id="demo-positioned-button"
              aria-controls={open ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              endIcon={<Iconify icon="eva:edit-2-outline" />}
              sx={{
                flex: 1,
                backgroundColor: '#0169DE',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
              onClick={handleClick}
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
              <MenuItem
                onClick={() =>
                  navigate(`/project-manager/dashboard/amandment-request/${proposal_id}`)
                }
              >
                {translate('proposal_amandement.button_label')}
              </MenuItem>
              <MenuItem onClick={() => setAction('STEP_BACK')}>
                ارجاع المعاملة الى مشرف المشاريع
              </MenuItem>
            </Menu>
          </Grid>
          {data.user.track !== 'CONCESSIONAL_GRANTS' && (
            <Grid item md={3} xs={4}>
              {''}
            </Grid>
          )}
          <Grid item md={data.user.track === 'CONCESSIONAL_GRANTS' ? 7 : 4} xs={12}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                onClick={() => setAction('ACCEPT')}
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                sx={{ flex: 1, '&:hover': { backgroundColor: '#13B2A2' } }}
              >
                قبول المشروع
              </Button>
              <Button
                sx={{ flex: 1, '&:hover': { backgroundColor: '#FF170F' } }}
                variant="contained"
                color="error"
                onClick={() => setAction('REJECT')}
                endIcon={<ClearIcon />}
              >
                {translate('reject_project')}
              </Button>
              {data.user.track === 'CONCESSIONAL_GRANTS' && (
                <Button
                  variant="outlined"
                  color="inherit"
                  endIcon={<Iconify icon="eva:message-circle-outline" />}
                  onClick={() => setAction('ACCEPT_CONSULTANT')}
                  sx={{ flex: 2 }}
                >
                  عرض المشروع على المستشارين
                </Button>
              )}
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
      {action === 'STEP_BACK' && (
        <NotesModal
          title="إرجاع المعاملة إلى مشرف المشروع"
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
            actionLabel: 'قبول',
            backgroundColor: 'background.paper',
            hoverColor: '#13B2A2',
          }}
        />
      )}
      {action === 'ACCEPT_CONSULTANT' && (
        <NotesModal
          title="عرض المشروع على المستشارين"
          onClose={handleCloseModal}
          onSubmit={handleApprovalConsultant}
          action={{
            actionLabel: 'تأكيد طلب الاستشارة',
            backgroundColor: 'background.paper',
            hoverColor: '#13B2A2',
          }}
        />
      )}
    </>
  );
}

export default FloatingActionBar;
