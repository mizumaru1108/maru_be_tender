import React, { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import useTable, { emptyRows, getComparator } from 'hooks/useTable';
import useSettings from 'hooks/useSettings';
import Scrollbar from 'components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData } from 'components/table';
import useTabs from 'hooks/useTabs';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import { ClientsList } from './types';
import ClientListRow from './ClientListRow';
import { allClientData } from 'queries/ceo/getAllClientsData';
import TableSkeleton from '../../TableSkeleton';
import Iconify from 'components/Iconify';
import axiosInstance from 'utils/axios';
import useAuth from 'hooks/useAuth';
import SearchbarTable from 'components/table/SearchbarTable';

const TABLE_HEAD = [
  { id: 'entity', label: 'client_list_headercell.client_name' },
  {
    id: 'data_entry_mobile',
    label: 'client_list_headercell.number_phone',
    align: 'left',
  },
  {
    id: 'data_entry_mail',
    label: 'client_list_headercell.email',
    align: 'left',
  },
  {
    id: 'governorate',
    label: 'client_list_headercell.governorate',
    align: 'left',
  },
  {
    id: 'total_proposal',
    label: 'client_list_headercell.total_proposal',
    align: 'left',
    flexWrap: 'nowrap',
  },
  { id: 'events', label: 'client_list_headercell.events', align: 'left' },
];

export default function ClientListTable() {
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
  const [sortOrder, setSortOrder] = useState<any>({ employee_name: 'asc' });

  // const [{ data, fetching, error }, mutate] = useQuery({
  //   query: allClientData,
  //   variables: {
  //     limit: rowsPerPage,
  //     offset: page * rowsPerPage,
  //     order_by: sortOrder,
  //   },
  // });

  const [tableData, setTableData] = useState<Array<ClientsList>>([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [isLoading, setIsLoading] = useState(false);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const [sortValue, setSortValue] = useState<string>('employee_name asc');

  const sortOptions = [
    {
      value: 'employee_name asc',
      // title: 'Client Name (ASC)',
      title: translate('table_filter.sortby_options.client_name_az'),
    },
    {
      value: 'employee_name desc',
      // title: 'Client Name (DESC)',
      title: translate('table_filter.sortby_options.client_name_za'),
    },
    {
      value: 'email asc',
      // title: 'Email (ASC)',
      title: translate('table_filter.sortby_options.email_az'),
    },
    {
      value: 'email desc',
      // title: 'Email (DESC)',
      title: translate('table_filter.sortby_options.email_za'),
    },
    {
      value: 'governorate asc',
      // title: 'governorate (ASC)',
      title: translate('table_filter.sortby_options.governorate_az'),
    },
    {
      value: 'governorate desc',
      // title: 'governorate (DESC)',
      title: translate('table_filter.sortby_options.governorate_za'),
    },
  ];

  const getDataClient = async () => {
    let currentPage = page + 1;
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        // `tender/client/proposal/list?page=1&limit=5`,
        `tender/client/proposal/list?page=${currentPage}&limit=${rowsPerPage}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (response.data.statusCode === 200) {
        setTableData(
          response.data.data.map((item: any, index: any) => ({
            id: item.id,
            client_name: item.employee_name,
            email: item.email,
            number_phone: item.mobile_number,
            governorate: item.governorate,
            user_id: item.id,
            total_proposal: item.proposal_count,
          }))
        );
        setTotal(response.data.total as number);
        setIsLoading(false);
      }
      return response.data;
    } catch (error) {
      setIsLoading(false);
      return <>...Opss, something went wrong</>;
    }
  };

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
    const { value } = event.target;
    setSortValue(event.target.value as string);
    const [key, order] = value.split(' ');
    if (key === 'governorate') {
      const newOrder = { client_data: { [key]: order } };
      setSortOrder(newOrder);
    } else {
      const newOrder = { [key]: order };

      setSortOrder(newOrder);
    }
  };

  const handleChange = (name: string) => {
    console.log(name);
  };

  // useEffect(() => {
  //   if (datas?.data) {
  //     setTableData(
  //       datas.data.map((item: any, index: any) => ({
  //         id: item.id,
  //         client_name: item.employee_name,
  //         email: item.email,
  //         number_phone: item.mobile_number,
  //         governorate: item.governorate,
  //         user_id: item.id,
  //         total_proposal: item.proposal_count,
  //       }))
  //     );
  //     setTotal(datas.total as number);
  //   }
  // }, [datas, setTotal]);

  useEffect(() => {
    getDataClient();
    // mutate();
    // eslint-disable-next-line
  }, [page, rowsPerPage, orderBy]);

  // if (error) return <>...Opss, something went wrong</>;

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ marginBottom: '50px' }}>
        {translate('client_list_table.headline')}
      </Typography>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ fontSize: '14px', color: 'grey.600' }}>
              {translate('table_filter.sortby_title')} &nbsp;
            </Typography>
            <Select
              value={sortValue}
              onChange={handleSortData}
              size="small"
              sx={{ fontSize: '14px', width: 200 }}
            >
              {sortOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                p: 1,
                '&:hover': {
                  backgroundColor: 'black',
                  color: 'white',
                },
              }}
            >
              {translate('commons.filter_button_label')}
              <Iconify icon="bx:bx-filter-alt" sx={{ ml: 1 }} />
            </Button>
          </Box>
          <SearchbarTable onSearch={(data: string) => handleChange(data)} />
        </Stack>
      </Box>
      <Card sx={{ backgroundColor: '#fff', mt: 2 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
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
                      <TableSkeleton key={index} sx={{ bgcolor: '#d9d9d9' }} />
                    ))
                  : dataFiltered.map((row) => (
                      <ClientListRow
                        key={row.user_id}
                        row={row}
                        selected={selected.includes(row?.user_id)}
                        // onSelectRow={() => onSelectRow(row?.user_id)}
                      />
                    ))}
                {!isLoading && dataFiltered.length === 0 && <TableNoData isNotFound={isNotFound} />}
                {/* <TableEmptyRows height={denseHeight} emptyRows={0} /> */}
              </TableBody>
            </Table>
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

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: ClientsList[];
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
