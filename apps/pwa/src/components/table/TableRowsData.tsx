/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, Button } from '@mui/material';
// components
import Label from '../Label';
import Iconify from '../Iconify';
// hooks
import { IPropsTablesList } from './type';
import moment from 'moment';
import useLocales from 'hooks/useLocales';
import { PATH_ACCOUNTS_MANAGER } from 'routes/paths';
import { useNavigate } from 'react-router-dom';

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

export default function ProductTableRow({ row, selected, onSelectRow, editRequest }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();
  const navigate = useNavigate();
  // console.log({ editRequest });

  const { partner_name, createdAt, account_status, events, update_status, id, status_id, user } =
    row;
  return (
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
          {(account_status === 'ACTIVE_ACCOUNT' &&
            !editRequest &&
            translate('account_manager.table.td.label_active_account')) ||
            ((account_status === 'WAITING_FOR_ACTIVATION' ||
              account_status === 'REVISED_ACCOUNT') &&
              !editRequest &&
              translate('account_manager.table.td.label_waiting_activation')) ||
            (account_status !== 'waiting' &&
              !editRequest &&
              account_status !== 'approved' &&
              translate('account_manager.table.td.label_canceled_account'))}
          {(editRequest &&
            status_id === 'PENDING' &&
            translate('account_manager.table.td.label_pending')) ||
            (editRequest &&
              status_id === 'APPROVED' &&
              translate('account_manager.table.td.label_approved')) ||
            (editRequest &&
              status_id === 'REJECTED' &&
              translate('account_manager.table.td.label_rejected'))}
        </Label>
      </TableCell>
      {update_status ? (
        <TableCell align="left">
          <Button
            onClick={() =>
              editRequest
                ? navigate(
                    PATH_ACCOUNTS_MANAGER.partnerEditProfileDetails(
                      id as string,
                      status_id as string
                    )
                  )
                : navigate(PATH_ACCOUNTS_MANAGER.partnerDetails(id as string))
            }
            color="inherit"
            variant="outlined"
            size="medium"
          >
            {editRequest
              ? translate('account_manager.table.td.btn_view_edit_request')
              : translate('account_manager.table.td.btn_view_partner_projects')}
            <Iconify icon={'bx:briefcase'} width={20} height={20} sx={{ ml: 1 }} />
          </Button>
        </TableCell>
      ) : (
        <TableCell align="left">
          <Button
            onClick={() =>
              editRequest
                ? navigate(
                    PATH_ACCOUNTS_MANAGER.partnerEditProfileDetails(
                      id as string,
                      status_id as string
                    )
                  )
                : navigate(PATH_ACCOUNTS_MANAGER.partnerDetails(id as string))
            }
            color="inherit"
            size="small"
          >
            {editRequest
              ? translate('account_manager.table.td.btn_view_edit_request')
              : translate('account_manager.table.td.btn_view_partner_projects')}
            <Iconify icon={'eva:eye-outline'} width={20} height={20} sx={{ ml: 1 }} />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
