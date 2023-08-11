import { Button, Chip, Grid, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import Image from 'components/Image';
import Space from 'components/space/space';
import { AdevertisingTapeRow } from 'components/table/admin/system-messages/types';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useNavigate } from 'react-router';
import { isActiveToday } from 'utils/checkIsExpired';
import { role_url_map } from '../../../../../@types/commons';
import ConfirmationModal from '../../../../modal-dialog/ConfirmationModal';

export default function AdvertisingTapeRow({
  row,
  selected,
  onSelectRow,
  onDelete,
}: AdevertisingTapeRow) {
  // console.log({ row });
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();

  const navigate = useNavigate();

  const isToday = row?.expired_date ? isActiveToday({ expiredDate: row?.expired_date }) : undefined;
  // console.log({ test, row });

  const [openModalReject, setOpenModalReject] = React.useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(row?.id ? row?.id : '-1');
    }
  };

  return (
    <>
      <ConfirmationModal
        open={openModalReject}
        handleClose={() => setOpenModalReject(!openModalReject)}
        onSumbit={handleDelete}
        message={translate('system_messages.dialog.delete_banner')}
      />
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}
        <TableCell
          align="left"
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {/* <Typography variant="subtitle2" noWrap>
          {row.title ?? '-'}
        </Typography> */}
          <Image
            src={(row.image as string) || 'https://picsum.photos/200/300'}
            alt="logo"
            sx={{ width: '70px', height: '70px' }}
          />
        </TableCell>
        <TableCell align="left" sx={{ maxWidth: 200 }}>
          <Typography variant="subtitle2" noWrap>
            {row.title ?? '-'}
          </Typography>
        </TableCell>
        <TableCell align="left" sx={{ maxWidth: 200 }}>
          <Typography
            variant="subtitle2"
            sx={{ direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
            noWrap
          >
            {row.content ?? '-'}
          </Typography>
        </TableCell>
        <TableCell align="left" sx={{ maxWidth: 200 }}>
          <Typography variant="subtitle2">{row.showTime ?? '-'}</Typography>
        </TableCell>{' '}
        {/* <TableCell align="left" sx={{ maxWidth: 200 }}>
          <Typography variant="subtitle2">{row.track_id ?? '-'}</Typography>
        </TableCell> */}
        <TableCell align="left" sx={{ maxWidth: 250 }}>
          {/* <Typography variant="subtitle2">{row?.status ? 'active' : 'expired'}</Typography> */}
          {row?.status && isToday ? (
            <Chip
              label={translate('system_messages.status.active')}
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
          ) : (
            <Chip
              label={translate('system_messages.status.inactive')}
              color="error"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </TableCell>
        <TableCell align="left">
          <Grid container display="flex" flexDirection="column">
            <Grid item md={6}>
              <Button
                data-cy="pages.admin.settings.label.table.modify"
                startIcon={<Iconify icon="eva:edit-outline" height={20} width={20} />}
                variant="contained"
                onClick={() => {
                  navigate(
                    `/${role_url_map[activeRole!]}/dashboard/system-messages/external/${row.id}`
                  );
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
            <Grid item md={6}>
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
