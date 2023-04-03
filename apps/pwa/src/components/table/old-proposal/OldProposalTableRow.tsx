import { TableRow, Checkbox, TableCell, Typography, Button } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import { OldProposalsRow } from './types';
import useAuth from 'hooks/useAuth';
import { role_url_map } from '../../../@types/commons';
// import { role_url_map } from '../../../../@types/commons';

export default function OldProposalTableRow({ row, selected, onSelectRow }: OldProposalsRow) {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();

  const navigate = useNavigate();
  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.project_number}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography
          variant="subtitle2"
          noWrap
          sx={{ direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
        >
          {row.project_name}
        </Typography>
      </TableCell>
      {/* <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.email}
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
      </TableCell> */}
      <TableCell align="left">
        <Button
          onClick={() => {
            navigate(
              `/${role_url_map[activeRole!]}/dashboard/current-project/${row.id}/show-project`
            );
          }}
          size="small"
          variant="contained"
          sx={{ backgroundColor: '#0E8478', color: 'white', flexWrap: 'no-wrap' }}
        >
          {translate('table_actions.view_details')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
