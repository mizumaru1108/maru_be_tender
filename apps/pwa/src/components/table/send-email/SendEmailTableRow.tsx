import { TableRow, Checkbox, TableCell, Typography, Button } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import useAuth from 'hooks/useAuth';
import { role_url_map } from '../../../@types/commons';
import { EmailToClienRow } from 'components/table/send-email/types';
// import { role_url_map } from '../../../../@types/commons';

export default function SendEmailTableRow({ row, selected, onSelectRow }: EmailToClienRow) {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();

  const navigate = useNavigate();
  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.employee_name}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography
          variant="subtitle2"
          noWrap
          sx={{ direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
        >
          {row.email_content}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Button
          onClick={() => {
            // navigate(
            //   `/${role_url_map[activeRole!]}/dashboard/current-project/${row.id}/show-project`
            // );
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
