import { Box, Button, Menu, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import ModalDialog from 'components/modal-dialog';

import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByCEO } from 'queries/ceo/updateProposalByCEO';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import { FusionAuthRoles, InnerStatus, role_url_map } from '../../../../@types/commons';
import ApproveModal from './ApproveModal';
import FormActionBox from './FormActionBox';
import ProposalRejectingForm from './ProposalRejectingForm';
import { ModeratoeCeoFloatingActionBarProps, ProposalRejectPayload } from './types';

function FloatingActionBar({ organizationId }: ModeratoeCeoFloatingActionBarProps) {
  const { user } = useAuth();
  const { id: proposal_id } = useParams();
  const theme = useTheme();
  const location = useLocation();
  const { translate } = useLocales();
  const [modalState, setModalState] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loadingState, setLoadingState] = useState({ action: '', isLoading: false });

  const [, update] = useMutation(updateProposalByCEO);

  const [action, setAction] = useState<'accept' | 'reject'>('reject');

  const amandementPath = location.pathname.split('show-details')[0] + `amandementRequest`;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseModal = () => {
    setModalState(false);
  };
  const handleOpenModal = () => {
    setModalState(true);
  };
  const handleApproval = async (data: any) => {
    setLoadingState({ action: 'accept', isLoading: true });
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
        navigate(`/ceo/dashboard/app`);
      }
    });
  };
  const handleRejected = async (data: any) => {
    setLoadingState({ action: 'reject', isLoading: true });
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
              onClick={() => {
                setAction('accept');
                handleOpenModal();
              }}
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
              onClick={() => {
                setAction('reject');
                handleOpenModal();
              }}
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
            <MenuItem
              onClick={() => {
                navigate(amandementPath);
              }}
            >
              ارسال طلب تعديل الى المشرف
            </MenuItem>
            <MenuItem onClick={stepBackProposal}>ارجاع المعاملة الى مدير الإدارة</MenuItem>
          </Menu>
        </Stack>
      </Box>

      <ModalDialog
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {action === 'accept' ? 'قبول المشروع' : 'رفض المشروع'}
            </Typography>
          </Stack>
        }
        content={
          action === 'accept' ? (
            <>
              <ApproveModal
                action="accept"
                isLoading={loadingState.action === 'accept' ? loadingState.isLoading : false}
                onReturn={() => {
                  setModalState(false);
                }}
                onSubmited={handleApproval}
              />
            </>
          ) : (
            <ProposalRejectingForm onSubmit={handleRejected}>
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
