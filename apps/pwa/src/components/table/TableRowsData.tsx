/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, IconButton, Button } from '@mui/material';
// components
import Label from '../Label';
import Image from '../Image';
import TableMoreMenu from './TableMoreMenu';
// hooks
import { IPropsTablesList } from './type';
import moment from 'moment';
// import currency from 'currency.js';
import useLocales from 'hooks/useLocales';
//
import Iconify from '../Iconify';

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

  const { partner_name, createdAt, account_status, events, update_status } = row;

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
            ((!account_status || account_status === 'waiting') && 'warning') ||
            (account_status === 'approved' && 'success') ||
            'error'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {(account_status === 'approved' && translate('active_account')) ||
            (account_status === 'waiting' && translate('waiting_activation')) ||
            (account_status !== 'waiting' &&
              account_status !== 'approved' &&
              translate('canceled_account'))}
        </Label>
      </TableCell>
      <TableCell align="left">
        <Button
          onClick={() => alert(`${partner_name}`)}
          color="inherit"
          size="small"
          sx={{ mr: 0.5 }}
        >
          <Iconify icon={'eva:eye-outline'} width={20} height={20} sx={{ mr: 1 }} />
          {translate('account_review')}
        </Button>
      </TableCell>
      {update_status && (
        <TableCell align="left">
          <Button
            onClick={() => alert(`${partner_name}`)}
            color="inherit"
            variant="outlined"
            size="medium"
            sx={{ mr: 0.5 }}
          >
            <Iconify icon={'bx:briefcase'} width={20} height={20} sx={{ mr: 1 }} />
            {translate('view_partner_projects')}
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
