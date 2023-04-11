import { useState } from 'react';
// @mui
import { Checkbox, TableRow, TableCell, Stack, Button } from '@mui/material';
import Iconify from 'components/Iconify';
import { AuthorityInterface } from './types';
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

type Props = {
  row: AuthorityInterface;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function BankNameTableRow({ row, selected, onSelectRow }: Props) {
  const { name } = row;
  const { translate } = useLocales();

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{name}</TableCell>
      <TableCell align="left">
        <Stack direction="row" gap={2}>
          <Button
            startIcon={<Iconify icon="eva:trash-2-outline" height={20} width={20} />}
            color="info"
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: '#0169DE',
              '&:hover': { backgroundColor: '#1482FE' },
            }}
            onClick={() => console.log('asdlamsdkl')}
          >
            {translate('pages.admin.settings.label.table.amendment')}
          </Button>
          <Button
            startIcon={<Iconify icon="eva:edit-outline" height={20} width={20} />}
            color="error"
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: '#FF4842',
              '&:hover': { backgroundColor: '#FF170F' },
            }}
            onClick={() => console.log('asdlamsdkl')}
          >
            {translate('pages.admin.settings.label.table.delete')}
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
