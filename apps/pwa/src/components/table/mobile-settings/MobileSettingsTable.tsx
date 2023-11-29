import { useEffect } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import { TableHeadCustom } from 'components/table';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import useTable from 'hooks/useTable';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { role_url_map } from '../../../@types/commons';
import { getMobileSettings } from '../../../redux/slices/mobile-settings';
import { dispatch, useSelector } from '../../../redux/store';
import TableSkeleton from '../TableSkeleton';
import MobileSettingsTableRow from './MobileSettingsTableRow';
import Space from '../../space/space';

const TABLE_HEAD = [
  { id: 'username', label: '_mobile_settings.username.label' },
  {
    id: 'user_sender',
    label: '_mobile_settings.user_sender.label',
    align: 'left',
  },
  {
    id: 'user_sender',
    label: '_mobile_settings.is_active.label',
    align: 'left',
  },
  { id: 'events', label: 'client_list_headercell.events', align: 'left' },
];

export default function MobileSettingsTable() {
  const { dense, page, rowsPerPage, total, setTotal, onChangePage, onChangeRowsPerPage } =
    useTable();

  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // redux
  const { mobile_settings, loadingProps, error } = useSelector((state) => state.mobileSetting);

  useEffect(() => {
    if (error) {
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (activeRole) {
      dispatch(getMobileSettings(activeRole, { page, limit: rowsPerPage }));
    }
  }, [activeRole, page, rowsPerPage]);

  if (error) return <>{translate('pages.common.error')}</>;

  return (
    <Box>
      <Space direction="horizontal" size="small" />
      <Grid container spacing={2}>
        <Grid item md={1} xs={12}>
          <Button
            color="inherit"
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{ p: 1, minWidth: 35, minHeight: 35, mr: 3, mb: 2 }}
          >
            <Iconify
              icon={
                currentLang.value === 'en'
                  ? 'eva:arrow-ios-back-outline'
                  : 'eva:arrow-ios-forward-outline'
              }
              width={35}
              height={35}
            />
          </Button>
        </Grid>
        <Grid item md={9} xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
            {`${translate('pages.common.mobile_settings')} : MSEGATE`}
          </Typography>
        </Grid>
        <Grid item md={2} xs={12}>
          <Button
            onClick={() => {
              navigate(`/${role_url_map[activeRole!]}/dashboard/mobile-settings/add`);
            }}
            size="small"
            variant="contained"
            sx={{ minWidth: 35, minHeight: 35 }}
          >
            {translate('_mobile_settings.button.add')}
          </Button>
        </Grid>
      </Grid>

      <Card sx={{ backgroundColor: '#fff', mt: 2 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {loadingProps.isLoading
                  ? [...Array(rowsPerPage)].map((item, index) => <TableSkeleton key={index} />)
                  : mobile_settings.map((row) => <MobileSettingsTableRow key={row.id} row={row} />)}
              </TableBody>
            </Table>
            {!loadingProps.isLoading && mobile_settings.length === 0 && (
              <EmptyContent
                title="لا يوجد بيانات"
                sx={{
                  '& span.MuiBox-root': { height: 160 },
                }}
              />
            )}
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Box>
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------
