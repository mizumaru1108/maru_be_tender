import React, { useState } from 'react';
// @mui
import {
  Box,
  Card,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import Scrollbar from 'components/Scrollbar';
import SearchField from 'components/sorting/searchField';
import { TableHeadCustom, TableNoData } from 'components/table';
import { InternalMessagesList } from 'components/table/admin/system-messages/types';
import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import useTable from 'hooks/useTable';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import { hasExpired } from 'utils/checkIsExpired';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import { useSelector } from '../../../../../redux/store';
import InternalMessageListRow from './InternalMessageListRow';
import TableInternalMessageSkeleton from './TableInternalMessageSkeleton';

const TABLE_HEAD = [
  { id: 'title', label: 'system_messages.headercell.title' },
  { id: 'message_content', label: 'system_messages.headercell.message_content' },
  { id: 'track', label: 'system_messages.headercell.track' },
  { id: 'status', label: 'system_messages.headercell.status' },
  { id: 'construction', label: 'system_messages.headercell.construction' },
];

export default function SystemMessageListTable() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSort,
    total,
    setTotal,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { track_list } = useSelector((state) => state.proposal);

  const [tableData, setTableData] = useState<Array<InternalMessagesList>>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [sortValue, setSortValue] = useState<string>('');

  const [banerTitle, setBanerTitle] = useState('');

  const fetchingData = React.useCallback(async () => {
    setIsLoading(true);
    const curretTime = dayjs().valueOf();
    const currentPage = page + 1;
    let filter = '';
    if (sortValue) {
      filter = `${filter}&track_id=${sortValue}`;
    }
    if (banerTitle) {
      filter = `${filter}&title=${banerTitle}`;
    }
    let url;
    if (filter) {
      url = `banners?type=internal&limit=${rowsPerPage}&page=${currentPage}&include_relations=track&current_time=${curretTime}${filter}`;
    } else {
      url = `banners?type=internal&limit=${rowsPerPage}&page=${currentPage}&include_relations=track&current_time=${curretTime}`;
    }
    try {
      const response = await axiosInstance.get(`${url}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (response?.data?.data.length > 0) {
        setTableData(
          response?.data?.data.map((item: InternalMessagesList, index: any) => ({
            id: item.id || '',
            title: item.title || '',
            content: item.content || '',
            desired_track: item?.track?.name || '',
            status:
              item &&
              item.expired_date &&
              item.expired_time &&
              hasExpired({
                expiredDate: item.expired_date,
                expiredTime: item.expired_time,
              })
                ? false
                : true,
          }))
        );
        setTotal(Number(response.data.total));
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
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
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar, page, rowsPerPage, sortValue, banerTitle]);

  const handleDelete = React.useCallback(
    async (id: string) => {
      // setIsLoading(true);
      const url = `/banners`;
      try {
        const response = await axiosInstance.delete(`${url}/${id}`, {
          headers: { 'x-hasura-role': activeRole! },
        });
        // console.log({ response });
        if (response) {
          // console.log('test response', response?.data?.data);
          fetchingData();
        }
      } catch (err) {
        const statusCode = (err && err.statusCode) || 0;
        const message = (err && err.message) || null;
        if (message && statusCode !== 0) {
          enqueueSnackbar(err.message, {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeRole, enqueueSnackbar]
  );

  const handleSortData = (event: any) => {
    setSortValue(event.target.value);
    setPage(0);
  };

  const handleChange = (name: string) => {
    setBanerTitle(name);
    setPage(0);
  };

  React.useEffect(() => {
    fetchingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchingData]);

  return (
    <Box>
      <Grid container display="flex" justifyContent={'space-between'} alignItems="center">
        <Grid item md={3} xs={12}>
          <Box display="flex" alignItems="flex-end">
            <SearchField
              data-cy="search_field"
              isLoading={isLoading}
              onReturnSearch={handleChange}
              reFetch={() => {
                handleChange('');
              }}
            />
          </Box>
        </Grid>
        <Grid item md={4} xs={12} display="flex" justifyContent={'flex-end'}>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ fontSize: '14px', color: 'grey.600' }}>
              {translate('table_filter.sortby_title')} &nbsp;
            </Typography>
            <TextField
              select
              value={sortValue}
              label={translate('system_messages.filter.track.label')}
              // placeholder="Select Track"
              onChange={handleSortData}
              size="small"
              sx={{ fontSize: '14px', width: 200, color: '#000' }}
            >
              {track_list.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {formatCapitalizeText(item.name)}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Grid>
      </Grid>
      <Card sx={{ backgroundColor: '#fff', mt: 2 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                data-cy="table-head-custom"
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
                // onSelectAllRows={(checked) =>
                //   onSelectAllRows(
                //     checked,
                //     tableData.map((row) => row?.user_id)
                //   )
                // }
              />

              <TableBody>
                {isLoading
                  ? [...Array(rowsPerPage)].map((item, index) => (
                      <TableInternalMessageSkeleton key={index} sx={{ bgcolor: '#d9d9d9' }} />
                    ))
                  : [...tableData].map((row) => (
                      <InternalMessageListRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row?.id || '')}
                        onDelete={handleDelete}
                      />
                    ))}
                {!isLoading && tableData.length === 0 && <TableNoData isNotFound={true} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            data-cy="table-pagination"
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

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: InternalMessagesList[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item: Record<string, any>) => item.status === filterStatus);
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item: Record<string, any>) => item.role === filterRole);
  }

  return tableData;
}
