/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, Button } from '@mui/material';
import useLocales from 'hooks/useLocales';

import Iconify from '../../../Iconify';
import { stringTruncate } from '../../../../utils/stringTruncate';
import moment from 'moment';
import { RejectionListTableColumn } from './rejection-list';
import { useLocation, useNavigate } from 'react-router';

export default function RejectionListTableRow({
  row,
  selected,
  destination,
  onSelectRow,
}: RejectionListTableColumn) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { translate } = useLocales();

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {row.projectNumber ?? ''}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.projectName ? stringTruncate(row.projectName, 23) : ''}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.associationName ? stringTruncate(row.associationName, 23) : ''}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.projectSection ? stringTruncate(row.projectSection, 23) : ''}
        </Typography>
      </TableCell>
      <TableCell>{row.createdAt ? moment(row.createdAt).format('DD-MM-YYYY') : ''}</TableCell>
      <TableCell align="left">
        <Button
          onClick={() => {
            if (destination) {
              const x = location.pathname.split('/');
              navigate(`/${x[1] + '/' + x[2] + '/' + destination}/${row.id}/show-details/main`);
            } else {
              console.log('destination is not defined');
              console.log(`navigate to ${location.pathname}/${row.id}/show-details/main`);
              navigate(`${location.pathname}/${row.id}/show-details/main`);
            }
          }}
          size="small"
          sx={{ backgroundColor: '#0E8478', color: 'white' }}
        >
          {translate('View Details')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
