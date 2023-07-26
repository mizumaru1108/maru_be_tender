import { TableRow, Checkbox, TableCell, Typography, Button, Box, Grid } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import useAuth from 'hooks/useAuth';
import { role_url_map } from '../../../../../@types/commons';
import { InternalMessagesListsRow } from 'components/table/admin/system-messages/types';
import Iconify from 'components/Iconify';
import Space from 'components/space/space';
import RejectionModal from '../../../../modal-dialog/RejectionModal';
import React from 'react';
import ConfirmationModal from '../../../../modal-dialog/ConfirmationModal';

export default function InternalMessageListRow({
  row,
  selected,
  onSelectRow,
  onDelete,
}: InternalMessagesListsRow) {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const [openModalReject, setOpenModalReject] = React.useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(row?.id ? row?.id : '-1');
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <ConfirmationModal
        open={openModalReject}
        handleClose={() => setOpenModalReject(!openModalReject)}
        onSumbit={handleDelete}
        message={'Delete Banner'}
      />
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}
        <TableCell align="left" sx={{ maxWidth: 250 }}>
          <Typography variant="subtitle2">{row.title ?? '-'}</Typography>
        </TableCell>
        <TableCell align="left" sx={{ maxWidth: 250 }}>
          <Typography
            variant="subtitle2"
            sx={{ direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
          >
            {row.content ?? '-'}
          </Typography>
        </TableCell>
        <TableCell align="left" sx={{ maxWidth: 250 }}>
          <Typography variant="subtitle2">{row.desired_track ?? '-'}</Typography>
        </TableCell>
        <TableCell align="left">
          <Grid container display="flex" flexDirection="column">
            <Grid item md={5}>
              <Button
                data-cy="pages.admin.settings.label.table.modify"
                startIcon={<Iconify icon="eva:edit-outline" height={20} width={20} />}
                variant="contained"
                fullWidth
                onClick={() => {
                  const url = `/${role_url_map[activeRole!]}/dashboard/system-messages/internal/${
                    row.id
                  }`;
                  navigate(url);
                }}
                sx={{
                  width: '100px',
                  backgroundColor: '#0169DE',
                  '&:hover': { backgroundColor: '#1482FE' },
                }}
              >
                {translate('pages.admin.settings.label.table.modify')}
              </Button>
            </Grid>
            <Space direction="horizontal" size="small" />
            <Grid item md={5}>
              <Button
                data-cy="pages.admin.settings.label.table.delete"
                startIcon={<Iconify icon="eva:trash-2-outline" height={20} width={20} />}
                variant="contained"
                onClick={() => {
                  setOpenModalReject(true);
                }}
                sx={{
                  width: '100px',
                  backgroundColor: '#FF4842',
                  '&:hover': { backgroundColor: '#FF170F' },
                }}
              >
                {translate('pages.admin.settings.label.table.delete')}
              </Button>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
    </>
  );
}
