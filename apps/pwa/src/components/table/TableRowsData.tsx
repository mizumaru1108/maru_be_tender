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
};

export default function ProductTableRow({ row, selected, onSelectRow }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();
  const navigate = useNavigate();

  const { partner_name, createdAt, account_status, events, update_status, id } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {partner_name}
        </Typography>
      </TableCell>
      <TableCell>{moment(createdAt).format('DD-MM-YYYY')}</TableCell>
      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            ((!account_status ||
              account_status === 'WAITING_FOR_ACTIVATION' ||
              account_status === 'REVISED_ACCOUNT') &&
              'warning') ||
            (account_status === 'ACTIVE_ACCOUNT' && 'success') ||
            'error'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {(account_status === 'ACTIVE_ACCOUNT' && translate('active_account')) ||
            ((account_status === 'WAITING_FOR_ACTIVATION' ||
              account_status === 'REVISED_ACCOUNT') &&
              translate('waiting_activation')) ||
            (account_status !== 'waiting' &&
              account_status !== 'approved' &&
              translate('canceled_account'))}
        </Label>
      </TableCell>
      {update_status ? (
        <TableCell align="left">
          <Button
            onClick={() => navigate(PATH_ACCOUNTS_MANAGER.partnerDetails(id as string))}
            color="inherit"
            variant="outlined"
            size="medium"
          >
            {translate('view_partner_projects')}
            <Iconify icon={'bx:briefcase'} width={20} height={20} sx={{ ml: 1 }} />
          </Button>
        </TableCell>
      ) : (
        <TableCell align="left">
          <Button
            onClick={() => navigate(PATH_ACCOUNTS_MANAGER.partnerDetails(id as string))}
            color="inherit"
            size="small"
          >
            {translate('account_review')}
            <Iconify icon={'eva:eye-outline'} width={20} height={20} sx={{ ml: 1 }} />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
