/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  TableRow,
  Checkbox,
  TableCell,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
// components
import Label from '../Label';
import Iconify from '../Iconify';
import { LoadingButton } from '@mui/lab';
import ConfirmationModals from 'components/confirmation-modals';
// hooks
import { IPropsTablesList } from './type';
import moment from 'moment';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
import { PATH_ACCOUNTS_MANAGER } from 'routes/paths';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';

// ----------------------------------------------------------------------

type Props = {
  row: IPropsTablesList;
  selected?: boolean;
  onSelectRow?: VoidFunction;
  // actions?: React.ReactNode;
  share?: boolean;
  shareLink?: string;
  editRequest?: boolean;
};

type UserStatus =
  | 'WAITING_FOR_ACTIVATION'
  | 'SUSPENDED_ACCOUNT'
  | 'CANCELED_ACCOUNT'
  | 'ACTIVE_ACCOUNT'
  | 'REVISED_ACCOUNT'
  | 'WAITING_FOR_EDITING_APPROVAL';

interface ChangeStatusRequest {
  status: UserStatus;
  user_id: string;
}

// ----------------------------------------------------------------------

export default function ProductTableRow({ row, selected, onSelectRow, editRequest }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  const [action, setAction] = useState('');

  const url = location.pathname.split('/').slice(0, 3).join('/');

  // Menu item
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenuItem = Boolean(anchorEl);
  const [isSubmitting, setIsSubimitting] = useState<boolean>(false);
  const [isSubmittingReset, setIsSubimittingReset] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setAction('');
  };

  const handleChangeStatus = async (
    id: string,
    status: 'ACTIVE_ACCOUNT' | 'SUSPENDED_ACCOUNT' | 'CANCELED_ACCOUNT'
  ) => {
    setIsSubimitting(true);

    try {
      await axiosInstance.patch<ChangeStatusRequest, any>(
        '/tender-user/update-status',
        {
          status: status,
          user_id: id,
        } as ChangeStatusRequest,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      let notif = '';
      if (status === 'ACTIVE_ACCOUNT') {
        notif = 'account_manager.partner_details.notification.activate_account';
      } else if (status === 'SUSPENDED_ACCOUNT') {
        notif = 'account_manager.partner_details.notification.disabled_account';
      } else if (status === 'CANCELED_ACCOUNT') {
        notif = 'account_manager.partner_details.notification.deleted_account';
      }

      setIsSubimitting(false);
      enqueueSnackbar(`${translate(notif)}`, {
        variant: 'success',
      });
      handleClose();
      handleCloseModal();

      window.location.reload();
    } catch (err) {
      setIsSubimitting(false);

      enqueueSnackbar(
        `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
        {
          variant: 'error',
        }
      );

      setAction('INFORMATION');
      console.log(err);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsSubimittingReset(true);

    try {
      const res = await axiosInstance.post(
        '/tender-auth/forgot-password-request',
        { email },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (res.status === 201) {
        setIsSubimittingReset(false);
        enqueueSnackbar(
          `${translate('account_manager.partner_details.notification.reset_password')}`,
          {
            variant: 'success',
          }
        );
        handleClose();
        handleCloseModal();
      }
    } catch (err) {
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

      setIsSubimittingReset(false);
      handleClose();
      handleCloseModal();
      console.log(err);
    }
  };

  const {
    partner_name,
    createdAt,
    account_status,
    events,
    update_status,
    id,
    status_id,
    user,
    email,
  } = row;
  return (
    <React.Fragment>
      <TableRow hover selected={selected}>
        {!editRequest && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </TableCell>
        )}
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {editRequest && user?.client_data?.entity}
            {partner_name}
          </Typography>
        </TableCell>
        <TableCell>{moment(createdAt).format('DD-MM-YYYY')}</TableCell>
        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (((!account_status && !editRequest) ||
                account_status === 'WAITING_FOR_ACTIVATION' ||
                account_status === 'REVISED_ACCOUNT') &&
                !editRequest &&
                'warning') ||
              (account_status === 'ACTIVE_ACCOUNT' && !editRequest && 'success') ||
              (editRequest && status_id === 'PENDING' && 'warning') ||
              (editRequest && status_id === 'APPROVED' && 'success') ||
              (editRequest && status_id === 'REJECTED' && 'error') ||
              'error'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {!editRequest
              ? (account_status === 'ACTIVE_ACCOUNT' &&
                  translate('account_manager.table.td.label_active_account')) ||
                ((account_status === 'WAITING_FOR_ACTIVATION' ||
                  account_status === 'REVISED_ACCOUNT') &&
                  translate('account_manager.table.td.label_waiting_activation')) ||
                (account_status !== 'WAITING_FOR_ACTIVATION' &&
                account_status !== 'ACTIVE_ACCOUNT' &&
                account_status === 'CANCELED_ACCOUNT'
                  ? translate('account_manager.table.td.label_canceled_account')
                  : translate('account_manager.table.td.label_rejected_account'))
              : (status_id === 'PENDING' && translate('account_manager.table.td.label_pending')) ||
                (status_id === 'APPROVED' &&
                  translate('account_manager.table.td.label_approved')) ||
                (status_id === 'REJECTED' && translate('account_manager.table.td.label_rejected'))}
          </Label>
        </TableCell>
        <TableCell align="left">
          {editRequest ? (
            <Button
              onClick={() => {
                navigate(
                  PATH_ACCOUNTS_MANAGER.partnerEditProfileDetails(id as string, status_id as string)
                );
              }}
              color="inherit"
              variant="outlined"
              size="medium"
              endIcon={<Iconify icon={'bx:briefcase'} width={20} height={20} />}
            >
              {translate('account_manager.table.td.btn_view_edit_request')}
            </Button>
          ) : (
            <React.Fragment>
              <LoadingButton
                color="inherit"
                variant="outlined"
                size="medium"
                endIcon={<Iconify icon={'eva:eye-outline'} width={20} height={20} />}
                aria-controls={openMenuItem ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenuItem ? 'true' : undefined}
                onClick={handleClick}
                loading={isSubmitting || isSubmittingReset}
              >
                {translate('account_manager.table.td.btn_account_review')}
              </LoadingButton>
              <Menu
                id="menuItemList"
                anchorEl={anchorEl}
                open={openMenuItem}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                PaperProps={{
                  style: {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    // navigate(`${url}/partner/owner/${id as string}`);
                    navigate(PATH_ACCOUNTS_MANAGER.partnerDetails(id as string));
                  }}
                >
                  <Iconify icon={'eva:person-outline'} width={20} height={20} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    {translate('account_manager.table.td.label_client_profile')}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAction('RESET_PASSWORD');
                    handleClose();
                  }}
                >
                  <Iconify icon={'eva:edit-2-outline'} width={18} height={18} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    {translate('account_manager.table.td.label_reset_password')}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleChangeStatus(id as string, 'ACTIVE_ACCOUNT')}>
                  <Iconify
                    icon={'eva:checkmark-circle-outline'}
                    width={18}
                    height={18}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="subtitle2">
                    {translate('account_manager.partner_details.btn_activate_account')}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAction('DEACTIVATE_ACCOUNT');
                    handleClose();
                  }}
                >
                  <Iconify icon={'eva:slash-outline'} width={18} height={18} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    {translate('account_manager.table.td.label_deactivate_account')}
                  </Typography>
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </TableCell>

        {action === 'DEACTIVATE_ACCOUNT' && (
          <ConfirmationModals
            type="DEACTIVATE_ACCOUNT"
            onSubmit={() => handleChangeStatus(id as string, 'SUSPENDED_ACCOUNT')}
            onClose={handleCloseModal}
            partner_name={partner_name!}
            loading={isSubmitting}
          />
        )}

        {action === 'RESET_PASSWORD' && (
          <ConfirmationModals
            type="RESET_PASSWORD"
            onSubmit={() => handleResetPassword(email!)}
            onClose={handleCloseModal}
            partner_name={partner_name!}
            loading={isSubmittingReset}
          />
        )}

        {action === 'INFORMATION' && (
          <ConfirmationModals
            type="INFORMATION"
            onSubmit={() => window.location.reload()}
            onClose={handleCloseModal}
            partner_name={partner_name!}
          />
        )}
      </TableRow>
    </React.Fragment>
  );
}
