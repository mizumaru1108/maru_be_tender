import { TableRow, Checkbox, TableCell, Typography, Button } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import useAuth from 'hooks/useAuth';
import { role_url_map } from '../../../@types/commons';
import { EmailToClienRow } from 'components/table/send-email/types';
import dayjs from 'dayjs';
// import { role_url_map } from '../../../../@types/commons';

export default function SendEmailTableRow({ row, selected, onSelectRow }: EmailToClienRow) {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();

  const navigate = useNavigate();
  return (
    <TableRow hover selected={selected}>
      <TableCell align="left" sx={{ minWidth: 180 }}>
        <Typography variant="subtitle2" noWrap>
          {row.receiver_name}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography
          variant="subtitle2"
          // noWrap
          sx={{ direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
        >
          {row.content}
        </Typography>
      </TableCell>
      <TableCell align="left" sx={{ minWidth: 130 }}>
        <Typography
          variant="subtitle2"
          // noWrap
        >
          {dayjs(row.created_at).format('YYYY-MM-DD')}
        </Typography>
      </TableCell>
      <TableCell align="left" sx={{ minWidth: 130 }}>
        <Button
          onClick={() => {
            navigate(
              `/${role_url_map[activeRole!]}/dashboard/send-email/details/${row.email_record_id}`
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
