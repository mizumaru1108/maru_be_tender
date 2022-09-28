/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, Button } from '@mui/material';
import useLocales from 'hooks/useLocales';
//
import { ProjectManagementTableColumn } from './project-management';
import Iconify from '../../../Iconify';
import { stringTruncate } from '../../../../utils/stringTruncate';
import moment from 'moment';

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
}: ProjectManagementTableColumn) {
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
          onClick={() => alert(`${row.projectName}`)}
          color="inherit"
          size="small"
          sx={{ mr: 0.5 }}
        >
          <Iconify icon={'eva:eye-outline'} width={20} height={20} sx={{ mr: 1 }} />
          {translate('account_review')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
