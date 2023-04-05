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
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData } from 'components/table';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import useTable, { getComparator } from 'hooks/useTable';
import useTabs from 'hooks/useTabs';
import axiosInstance from 'utils/axios';
import TableSkeleton from '../TableSkeleton';
import OldProposalTableRow from './OldProposalTableRow';
import { OldProposalsList } from './types';
import { generateHeader } from '../../../utils/generateProposalNumber';

const TABLE_HEAD = [
  { id: 'project_number', label: 'old_proposal.headercell.project_number' },
  {
    id: 'project_name',
    label: 'old_proposal.headercell.project_name',
    align: 'left',
  },
  // {
  //   id: 'employee_name',
  //   label: 'old_proposal.headercell.employee_name',
  //   align: 'left',
  // },
  { id: 'events', label: 'client_list_headercell.events', align: 'left' },
];

export default function OldProposalTable() {
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
  const [sortOrder, setSortOrder] = useState<any>({ employee_name: 'asc' });

  // const [{ data, fetching, error }, mutate] = useQuery({
  //   query: allClientData,
  //   variables: {
  //     limit: rowsPerPage,
  //     offset: page * rowsPerPage,
  //     order_by: sortOrder,
  //   },
  // });

  const [tableData, setTableData] = useState<Array<OldProposalsList>>([]);

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
        // `tender/client/proposal/list?page=${currentPage}&limit=${rowsPerPage}`,
        `tender-proposal/old/list?limit=${rowsPerPage}&page=${currentPage}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (response.data.statusCode === 200) {
        setTableData(
          response.data.data.map((item: any, index: any) => ({
            id: item.id,
            project_name: item.project_name ?? 'No Record',
            project_number: generateHeader(
              item && item.project_number && item.project_number ? item.project_number : item.id
            ),
            employee_name: item.user.employee_name ?? 'No Record',
            // client_name: item.employee_name,
            // email: item.email,
            // number_phone: item.mobile_number,
            // governorate: item.governorate,
            // user_id: item.id,
            // total_proposal: item.proposal_count,
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

  useEffect(() => {
    getDataClient();
    // mutate();
    // eslint-disable-next-line
  }, [page, rowsPerPage, orderBy]);

  // if (error) return <>...Opss, something went wrong</>;

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ marginBottom: '50px' }}>
        {translate('old_proposal.page_title')}
      </Typography>
      <Box>
        {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
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
        </Stack> */}
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
                  ? [...Array(rowsPerPage)].map((item, index) => <TableSkeleton key={index} />)
                  : dataFiltered.map((row) => (
                      <OldProposalTableRow
                        key={row.id}
                        row={row}
                        // selected={selected.includes(row?.user_id)}
                        // onSelectRow={() => onSelectRow(row?.user_id)}
                      />
                    ))}
                {!isLoading && dataFiltered.length === 0 && <TableNoData isNotFound={isNotFound} />}
                {/* {isNotFound && <TableNoData isNotFound={isNotFound} />} */}
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
  tableData: OldProposalsList[];
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
