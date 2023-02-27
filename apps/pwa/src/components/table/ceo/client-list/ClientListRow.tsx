import { TableRow, Checkbox, TableCell, Typography, Button } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import { ClientListsRow } from './types';
import useAuth from 'hooks/useAuth';
import { role_url_map } from '../../../../@types/commons';

export default function ClientListTableRow({ row, selected, onSelectRow }: ClientListsRow) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  const navigate = useNavigate();
  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.entity}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.data_entry_mobile}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.data_entry_mail}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.governorate}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.total_proposal}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Button
          onClick={() => {
            navigate(`/${role_url_map[activeRole!]}/dashboard/client-list/owner/${row.user_id}`);
          }}
          size="small"
          variant="contained"
          sx={{ backgroundColor: '#0E8478', color: 'white' }}
        >
          {translate('table_actions.view_details')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
