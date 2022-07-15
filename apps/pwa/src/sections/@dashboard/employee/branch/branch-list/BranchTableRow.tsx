// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, Avatar, Stack } from '@mui/material';

// @types
import { Branches } from '../../../../../@types/branch';
// components
import { TableMoreMenu } from 'components/table';

// ----------------------------------------------------------------------

type Props = {
  row: Branches;
  selected: boolean;
  onSelectRow: VoidFunction;
  actions?: React.ReactNode;
};

export default function BranchTableRow({ actions, row, selected, onSelectRow }: Props) {
  const theme = useTheme();

  const { name, employee } = row;

  const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell sx={{ display: { lg: 'table-cell', md: 'table-cell', sm: 'none', xs: 'none' } }}>
        <Stack spacing={0.5} direction="row">
          {employee.slice(0, 3).map((item, idx) => {
            if (item.avatar_url) {
              return (
                <Avatar
                  key={idx}
                  alt={item.name}
                  src={item.avatar_url}
                  style={{ marginLeft: idx > 0 ? '-5px' : '0px' }}
                  sx={{
                    width: 32,
                    height: 32,
                    zIndex: employee.slice(0, 3).length - idx,
                  }}
                />
              );
            } else {
              return (
                <Avatar
                  key={idx}
                  style={{ marginLeft: idx > 0 ? '-5px' : '0px' }}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: stringToColor(item.name),
                    color: "common.white",
                    zIndex: employee.slice(0, 3).length - idx,
                  }}
                >
                  {item.name.match(/\b(\w)/g)?.join('')}
                </Avatar>
              );
            }
          })}
          {employee.length - 3 > 0 && (
            <Avatar style={{ marginLeft: '-5px' }} sx={{ width: 32, height: 32, bgcolor: 'primary.lighter' }}>
              <Typography color="primary">{`+${employee.length - 3}`}</Typography>
            </Avatar>
          )}
        </Stack>
      </TableCell>
      <TableCell align="right">
        <TableMoreMenu actions={actions} />
      </TableCell>
    </TableRow>
  );
}
