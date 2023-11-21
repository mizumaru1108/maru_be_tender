import { Button, Chip, TableCell, TableRow, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import { role_url_map } from '../../../@types/commons';
import { MobileSettingsRow } from './types';

export default function MobileSettingsTableRow({ row, selected, onSelectRow }: MobileSettingsRow) {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();

  const navigate = useNavigate();
  return (
    <TableRow hover selected={selected}>
      <TableCell align="left" sx={{ minWidth: 180 }}>
        <Typography variant="subtitle2" noWrap>
          {row?.username || '-'}
        </Typography>
      </TableCell>
      <TableCell align="left">{row?.user_sender || '-'}</TableCell>
      {/* <TableCell align="left">{row?.is_active ? 'Active' : 'Inactive'}</TableCell> */}
      <TableCell align="left">
        {row?.is_active ? (
          <Chip
            label={translate('system_messages.status.active')}
            color="primary"
            sx={{ fontSize: 12, fontWeight: 'bold' }}
          />
        ) : (
          <Chip
            label={translate('system_messages.status.inactive')}
            color="error"
            sx={{ fontSize: 12, fontWeight: 'bold' }}
          />
        )}
      </TableCell>
      <TableCell align="left" sx={{ minWidth: 130 }}>
        <Button
          onClick={() => {
            navigate(`/${role_url_map[activeRole!]}/dashboard/mobile-settings/${row?.id}`);
          }}
          size="small"
          variant="contained"
          sx={{ backgroundColor: '#0E8478', color: 'white', flexWrap: 'no-wrap' }}
        >
          {translate('button.edit')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
