/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography } from '@mui/material';
// hooks
import { IPropsAvgEmployeeEfectiveness } from '../../sections/portal-reports/types';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router-dom';
// ----------------------------------------------------------------------

type Props = {
  row: IPropsAvgEmployeeEfectiveness;
  selected?: boolean;
  onSelectRow?: VoidFunction;
  share?: boolean;
  shareLink?: string;
};

export default function TableRowsEmployee({ row, selected, onSelectRow }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();
  const navigate = useNavigate();

  const {
    employee_name,
    account_type,
    id,
    average_response_time,
    section,
    raw_average_response_time,
  } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {employee_name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {account_type ? translate(`permissions.${account_type}`) : '-'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {section ? translate(`${section}`) : '-'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {average_response_time}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
