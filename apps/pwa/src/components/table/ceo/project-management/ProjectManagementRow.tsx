/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { Button, Checkbox, TableCell, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from 'hooks/useLocales';
//
import moment from 'moment';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { formatGrantText } from 'utils/formatCapitzlizeText';
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

  // console.log({ row });

  const handleOpenProposal = () => {
    const x = location.pathname.split('/');
    const url = `/${x[1]}/${x[2]}/project-management/${row.id}/show-details`;
    if (destination) {
      navigate(`/${x[1] + '/' + x[2] + '/' + destination}/${row.id}/show-details`);
    } else {
      navigate(url);
    }
  };

  const handleOpenUser = () => {
    const x = location.pathname.split('/');
    const url = `/${x[1]}/dashboard/client-list/owner/${row.userId}`;
    navigate(url);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}> */}
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.projectNumber ?? '-'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography
          variant="subtitle2"
          noWrap
          sx={{ cursor: 'pointer' }}
          onClick={handleOpenProposal}
        >
          {row.projectName ? stringTruncate(row.projectName, 23) : '-'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap sx={{ cursor: 'pointer' }} onClick={handleOpenUser}>
          {/* it should be the entity */}
          {row.associationName ? stringTruncate(row.associationName, 23) : '-'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {/* {row.projectSection ? translate(row.projectSection) : '-'} */}
          {/* formatGrantText */}
          {row.projectSection ? formatGrantText(row.projectSection) : '-'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.createdAt ? moment(row.createdAt).format('DD.MM.YYYY, HH:MM a') : '-'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap sx={{ color: 'red' }}>
          {row.projectDelay ? `${row.projectDelay}` : ''}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Button
          onClick={handleOpenProposal}
          size="small"
          sx={{ backgroundColor: '#0E8478', color: 'white' }}
        >
          {translate('table_actions.view_details')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
