import { TableRow, Checkbox, TableCell, Typography, Button } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate } from 'react-router';
import { RejectedProjectsRow } from './types';
import useAuth from 'hooks/useAuth';

export default function RejectionListTableRow({ row, selected, onSelectRow }: RejectedProjectsRow) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenProposal = () => {
    const x = location.pathname.split('/');
    const url = `/${x[1]}/${x[2]}/project-management/${row.id}/show-details`;
    navigate(url);
  };

  const handleOpenUser = () => {
    const x = location.pathname.split('/');
    const url = `/${x[1]}/dashboard/client-list/owner/${row.user_id}`;
    navigate(url);
  };

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
        <Typography
          variant="subtitle2"
          noWrap
          sx={{ cursor: 'pointer' }}
          onClick={handleOpenProposal}
        >
          {row.project_name}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap sx={{ cursor: 'pointer' }} onClick={handleOpenUser}>
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
