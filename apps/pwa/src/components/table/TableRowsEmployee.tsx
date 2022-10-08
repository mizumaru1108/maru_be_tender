/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography } from '@mui/material';
// hooks
import { IPropsPortalReportEmployee } from './type';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

type Props = {
  row: IPropsPortalReportEmployee;
  selected?: boolean;
  onSelectRow?: VoidFunction;
  // actions?: React.ReactNode;
  share?: boolean;
  shareLink?: string;
};

export default function TableRowsEmployee({ row, selected, onSelectRow }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();
  const navigate = useNavigate();

  const { employee_name, account_type, id, number_of_clock, sections } = row;

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
          {account_type}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {sections}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {number_of_clock}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
