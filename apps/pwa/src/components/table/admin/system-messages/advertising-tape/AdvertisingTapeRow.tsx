import { Button, Grid, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import Image from 'components/Image';
import Space from 'components/space/space';
import { AdevertisingTapeRow } from 'components/table/admin/system-messages/types';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';

export default function AdvertisingTapeRow({ row, selected, onSelectRow }: AdevertisingTapeRow) {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();

  const navigate = useNavigate();
  return (
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
        <Typography variant="subtitle2">{row.title ?? '-'}</Typography>
      </TableCell>
      <TableCell align="left" sx={{ maxWidth: 200 }}>
        <Typography
          variant="subtitle2"
          sx={{ direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
        >
          {row.message_content ?? '-'}
        </Typography>
      </TableCell>
      <TableCell align="left" sx={{ maxWidth: 200 }}>
        <Typography variant="subtitle2">{row.the_lenght_show ?? '-'}</Typography>
      </TableCell>{' '}
      <TableCell align="left" sx={{ maxWidth: 200 }}>
        <Typography variant="subtitle2">{row.track ?? '-'}</Typography>
      </TableCell>
      <TableCell align="left">
        <Grid container display="flex" flexDirection="column">
          <Grid item md={6}>
            <Button
              data-cy="pages.admin.settings.label.table.modify"
              startIcon={<Iconify icon="eva:edit-outline" height={20} width={20} />}
              variant="contained"
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
  );
}
