/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { Button, Checkbox, TableCell, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from 'hooks/useLocales';
//
import moment from 'moment';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { stringTruncate } from '../../../../utils/stringTruncate';
import { ProjectManagementTableColumn } from './project-management';

export default function ProjectManagementTableRow({
  row,
  selected,
  onSelectRow,
  destination,
}: ProjectManagementTableColumn) {
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
          {row.projectNumber ?? 'N/A'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.projectName ? stringTruncate(row.projectName, 23) : 'N/A'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.associationName ? stringTruncate(row.associationName, 23) : 'N/A'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.projectSection ? stringTruncate(row.projectSection, 23) : 'N/A'}
        </Typography>
      </TableCell>
      <TableCell>
        {row.createdAt ? moment(row.createdAt).format('DD.MM.YYYY, HH:MM a') : 'N/A'}
      </TableCell>
      <TableCell align="left">
        <Button
          onClick={() => {
            if (destination) {
              const x = location.pathname.split('/');
              navigate(
                `/${x[1] + '/' + x[2] + '/' + destination}/${row.projectNumber}/show-details/main`
              );
            } else {
              console.log('destination is not defined');
              console.log(
                `navigate to ${location.pathname}/${row.projectNumber}/show-details/main`
              );
              navigate(`${location.pathname}/${row.projectNumber}/show-details/main`);
            }
          }}
          size="small"
          sx={{ backgroundColor: '#0E8478', color: 'white' }}
        >
          {translate('table_actions.view_details')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
