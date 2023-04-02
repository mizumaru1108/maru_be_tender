import { TableRow, Checkbox, TableCell, Typography, Button } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import { RejectedProjectsRow } from './types';
import useAuth from 'hooks/useAuth';

export default function RejectionListTableRow({ row, selected, onSelectRow }: RejectedProjectsRow) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  const navigate = useNavigate();
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {/* {row.id} */}
          {row.project_number ?? row.id}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.project_name}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.entity}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {translate(`${row.project_track}`)}
        </Typography>
      </TableCell>
      <TableCell>{new Date(row.created_at).toISOString().substring(0, 10)}</TableCell>
      <TableCell align="left">
        <Button
          onClick={() => {
            navigate(
              `/${
                activeRole === 'tender_ceo' ? 'ceo' : 'project-manager'
              }/dashboard/rejection-list/${row.id}/reject-project`
            );
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
