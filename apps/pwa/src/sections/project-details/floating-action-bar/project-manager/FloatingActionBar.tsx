import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useNavigate, useParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ModalDialog from 'components/modal-dialog';
import { useState } from 'react';
import FormActionBox from './FormActionBox';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import ProposalRejectingForm from './ProposalRejectingForm';
import { useMutation, useQuery } from 'urql';
import useAuth from 'hooks/useAuth';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useSnackbar } from 'notistack';
import { nanoid } from 'nanoid';
import { updateProposalByProjectManager } from 'queries/project-manager/updateProposalByProjectManager';

function FloatingActionBar({ organizationId }: any) {
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
  const [action, setAction] = useState<
    'accept' | 'reject' | 'edit_request' | 'send_client_message' | 'accept_cons'
  >('reject');

  const [loadingState, setLoadingState] = useState({ action: '', isLoading: false });

  const [modalState, setModalState] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenModal = () => {
    setModalState(true);
  };
  const handleCloseModal = () => {
    setModalState(false);
  };
  const handleApproval = (values: any) => {
    setLoadingState({ action: 'accept', isLoading: true });
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
      setLoadingState({ action: '', isLoading: false });
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
        navigate(`/project-manager/dashboard/app`);
      }
    });
  };
  const handleApprovalConu = (values: any) => {
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
        enqueueSnackbar(translate('proposal_accept'), {
          variant: 'success',
        });
        navigate(`/project-manager/dashboard/app`);
      }
    });
  };
  const handleRejected = (values: any) => {
    setLoadingState({ action: 'reject', isLoading: true });
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
      setLoadingState({ action: '', isLoading: false });
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
              onClick={handleClick}
              sx={{
                flex: 1,
                backgroundColor: '#0169DE',
                '&:hover': { backgroundColor: '#1482FE' },
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
              <MenuItem onClick={stepBackProposal}>ارجاع المعاملة الى مشرف المشاريع</MenuItem>
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
                onClick={() => {
                  setAction('accept');
                  handleOpenModal();
                }}
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
                onClick={() => {
                  setAction('reject');
                  handleOpenModal();
                }}
                endIcon={<ClearIcon />}
              >
                {translate('reject_project')}
              </Button>
              {data.user.track === 'CONCESSIONAL_GRANTS' && (
                <Button
                  variant="outlined"
                  color="inherit"
                  endIcon={<Iconify icon="eva:message-circle-outline" />}
                  onClick={() => {
                    setAction('accept_cons');
                    handleOpenModal();
                  }}
                  sx={{ flex: 2 }}
                >
                  عرض المشروع على المستشارين
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <ModalDialog
        maxWidth="md"
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {action === 'accept'
                ? translate('accept_project')
                : action === 'accept_cons'
                ? 'عرض الطلب على المستشارين'
                : translate('reject_project')}
            </Typography>
          </Stack>
        }
        content={
          action === 'accept' ? (
            <ProposalAcceptingForm onSubmit={handleApproval}>
              <FormActionBox
                action="accept"
                isLoading={loadingState.action === 'accept' ? loadingState.isLoading : false}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalAcceptingForm>
          ) : action === 'accept_cons' ? (
            <ProposalAcceptingForm onSubmit={handleApprovalConu}>
              <FormActionBox
                action="accept"
                isLoading={false}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalAcceptingForm>
          ) : (
            <ProposalRejectingForm
              onSubmit={(values: any) => {
                handleRejected(values);
              }}
            >
              <FormActionBox
                action="reject"
                isLoading={loadingState.action === 'reject' ? loadingState.isLoading : false}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalRejectingForm>
          )
        }
        isOpen={modalState}
        onClose={handleCloseModal}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </>
  );
}

export default FloatingActionBar;
