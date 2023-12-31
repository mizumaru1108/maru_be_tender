import React, { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import SearchField from 'components/sorting/searchField';
import { TableHeadCustom, TableNoData } from 'components/table';
import TableInternalMessageSkeleton from 'components/table/admin/system-messages/internal-message/TableInternalMessageSkeleton';
import { AdvertisingTapeListMock } from 'components/table/admin/system-messages/mock';
import { AdvertisingTapeList } from 'components/table/admin/system-messages/types';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import useTable, { getComparator } from 'hooks/useTable';
import useTabs from 'hooks/useTabs';
import axiosInstance from 'utils/axios';
import AdvertisingTapeRow from './AdvertisingTapeRow';
import { useSnackbar } from 'notistack';
import { responsePathAsArray } from 'graphql';
import { useSelector } from '../../../../../redux/store';
import dayjs from 'dayjs';
import { hasActive, hasExpired, isActiveToday } from 'utils/checkIsExpired';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';

const TABLE_HEAD = [
  { id: 'image', label: 'system_messages.headercell.image' },
  { id: 'title', label: 'system_messages.headercell.title' },
  { id: 'message_content', label: 'system_messages.headercell.message_content' },
  { id: 'the_show_lenght', label: 'system_messages.headercell.the_show_lenght' },
  // { id: 'track', label: 'system_messages.headercell.track' },
  { id: 'status', label: 'system_messages.headercell.status' },

  { id: 'construction', label: 'system_messages.headercell.construction' },
];

export default function AdvertisingTapeListTable() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSelectRow,
    onSelectAllRows,
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

  const [sortOrder, setSortOrder] = useState<any>({ employee_name: 'asc' });

  const [tableData, setTableData] = useState<Array<AdvertisingTapeList>>([]);

  // console.log({ tableData });

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [isLoading, setIsLoading] = useState(false);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const [sortValue, setSortValue] = useState<string>();

  const [banerTitle, setBanerTitle] = useState('');

  const sortOptions = [
    {
      value: 'track asc',
      title: translate('table_filter.sortby_options.track_az'),
    },
    {
      value: 'track desc',
      title: translate('table_filter.sortby_options.track_za'),
    },
  ];

  const fetchingData = React.useCallback(async () => {
    setIsLoading(true);
    const currentPage = page + 1;
    const curretTime = dayjs().valueOf();
    // const url = employeeName
    //   ? `tender/client/proposal/list?page=${currentPage}&limit=${rowsPerPage}&employee_name=${employeeName}`
    //   : `tender/client/proposal/list?page=${currentPage}&limit=${rowsPerPage}`;
    // const url = `banners?type=external&limit=${rowsPerPage}&page=${currentPage}&include_relations=track&current_time=${curretTime}`;
    let filter = '';
    if (sortValue) {
      filter = `${filter}&track_id=${sortValue}`;
    }
    if (banerTitle) {
      filter = `${filter}&title=${banerTitle}`;
    }
    let url;
    if (filter) {
      url = `banners?type=external&limit=${rowsPerPage}&page=${currentPage}&include_relations=track&current_time=${curretTime}${filter}`;
    } else {
      url = `banners?type=external&limit=${rowsPerPage}&page=${currentPage}&include_relations=track&current_time=${curretTime}`;
    }
    // console.log({ track_list });
    try {
      const response = await axiosInstance.get(`${url}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (response) {
        // console.log('test : ', response?.data?.data);
        setTableData(
          response?.data?.data.map((item: AdvertisingTapeList, index: any) => ({
            id: item.id || '',
            title: item.title || '',
            content: item.content || '',
            // track_id: item.track_id || '',
            showTime: `${dayjs(item.expired_date).format('YYYY-MM-DD')} (${item.expired_time})`,
            // track_id: track_list.find((track) => track.id === item.track_id)?.name || '',
            image: item?.logo && item?.logo?.length > 0 ? item?.logo[0].url : null,
            // is_expired: item?.is_expired ? false : true,
            status:
              item &&
              item.expired_date &&
              item.expired_time &&
              hasActive({
                startTime: item.expired_time,
              }) &&
              isActiveToday({
                expiredDate: item.expired_date,
              })
                ? true
                : false,
            expired_date: item.expired_date,
          }))
        );
        setTotal(Number(response?.data?.total));
      }
    } catch (err) {
      // console.log('masuk cacth', err);
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

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleSortData = (event: any) => {
    setSortValue(event.target.value);
    setPage(0);
    // const { value } = event.target;
    // setSortValue(event.target.value as string);
    // const [key, order] = value.split(' ');
    // if (key === 'governorate') {
    //   const newOrder = { client_data: { [key]: order } };
    //   setSortOrder(newOrder);
    // } else {
    //   const newOrder = { [key]: order };

    //   setSortOrder(newOrder);
    // }
  };

  const handleChange = (name: string) => {
    // console.log(name);
    setBanerTitle(name);
    setPage(0);
  };

  useEffect(() => {
    fetchingData();
    // eslint-disable-next-line
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
                // console.log('re-fetch');
                handleChange('');
              }}
            />
          </Box>
        </Grid>
        {/* <Grid item md={4} xs={12} display="flex" justifyContent={'flex-end'}>
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
        </Grid> */}
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
                      <AdvertisingTapeRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row?.id || '')}
                        onDelete={handleDelete}
                      />
                    ))}
                {!isLoading && dataFiltered.length === 0 && <TableNoData isNotFound={isNotFound} />}
                {/* {AdvertisingTapeListMock.map((row) => (
                  <AdvertisingTapeRow
                    data-cy={`table-row-advertising-${row.id}`}
                    key={row.id}
                    row={row}
                    selected={selected.includes(row?.id || '')}
                  />
                ))} */}
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
  tableData: AdvertisingTapeList[];
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
