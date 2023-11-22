import { Box, Grid, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
//
import { LoadingButton } from '@mui/lab';
import { UpdateAction } from '../../../../@types/project-details';
import ClearIcon from '@mui/icons-material/Clear';
import NotesModal from '../../../../components/notes-modal';
import axiosInstance from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { FEATURE_PROPOSAL_COUNTING } from '../../../../config';
import { dispatch } from '../../../../redux/store';
import { getProposalCount } from '../../../../redux/slices/proposal';

function PaymentAmandementFloatingActionBar() {
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { id: proposal_id } = useParams();

  const { activeRole } = useAuth();

  const [action, setAction] = useState<UpdateAction>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleRejected = async (values: any) => {
    try {
      setIsLoading(true);
      const payload = {
        proposal_id: proposal_id,
        action: 'reject_amandement_payment',
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
      setIsLoading(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setAction('');
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
          <Grid container spacing={2}>
            <Grid item md={currentLang.value === 'ar' ? 2 : 3} xs={12}>
              <LoadingButton
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
                loading={isLoading}
              >
                {translate('account_manager.partner_details.submit_amendment_request')}
              </LoadingButton>
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
                  // disabled={true}
                  onClick={() => {
                    // navigate(`/finance/dashboard/amandement-request/${proposal_id}`);
                    navigate(
                      `/project-supervisor/dashboard/proposal-amandment-request/${proposal_id}`
                    );
                    // handleClose();
                  }}
                >
                  {translate('account_manager.partner_details.amendment_request_to_client')}
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item md={2} xs={12}>
              <LoadingButton
                sx={{
                  flex: 1,
                  backgroundColor: '#FF4842',
                  ':hover': { backgroundColor: '#FF170F' },
                }}
                variant="contained"
                onClick={() => setAction('REJECT')}
                endIcon={<ClearIcon />}
                loading={isLoading}
              >
                {translate('account_manager.reject_project')}
              </LoadingButton>
            </Grid>
          </Grid>
        </Stack>
        {action === 'REJECT' && (
          <NotesModal
            title="رفض المشروع"
            onClose={handleCloseModal}
            onSubmit={handleRejected}
            loading={isLoading}
            action={{
              actionType: action,
              actionLabel: 'رفض',
              backgroundColor: '#FF0000',
              hoverColor: '#FF4842',
            }}
          />
        )}
      </Box>
    </>
  );
}

export default PaymentAmandementFloatingActionBar;
