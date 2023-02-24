import React, { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
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

const TABLE_HEAD = [
  { id: 'id', label: 'Client ID' },
  {
    id: 'entity',
    label: 'project_management_headercell.association_name',
    align: 'left',
  },
  {
    id: 'data_entry_mail',
    label: 'Email',
    align: 'left',
  },
  {
    id: 'data_entry_mobile',
    label: 'Mobile Number',
    align: 'left',
  },
  {
    id: 'created_at',
    label: 'project_management_headercell.date_created',
    align: 'left',
    flexWrap: 'nowrap',
  },
  { id: 'events', label: 'project_management_headercell.events', align: 'left' },
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

  const [{ data, fetching, error }, mutate] = useQuery({
    query: allClientData,
    variables: {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      // order_by: orderBy,
    },
  });

  const [tableData, setTableData] = useState<Array<ClientsList>>([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

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

  useEffect(() => {
    if (data?.client_data) {
      setTableData(
        data.client_data.map((item: any, index: any) => ({
          id: item.id,
          entity: item.entity,
          data_entry_mail: item.data_entry_mail,
          data_entry_mobile: item.data_entry_mobile,
          created_at: item.created_at,
        }))
      );
      setTotal(data.total.aggregate.count as number);
    }
  }, [data, setTotal]);

  useEffect(() => {
    mutate();
  }, [mutate, page, rowsPerPage, orderBy]);

  if (error) return <>...Opss, something went wrong</>;

  console.log({ data, tableData });

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ marginBottom: '50px' }}>
        {/* {translate('rejection_list_table.headline')} */}
        CLIENT LIST
      </Typography>
      <Card sx={{ backgroundColor: '#fff' }}>
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
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {fetching
                  ? [...Array(rowsPerPage)].map((item, index) => <TableSkeleton key={index} />)
                  : dataFiltered.map((row) => (
                      <ClientListRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                      />
                    ))}

                <TableEmptyRows height={denseHeight} emptyRows={0} />
                <TableNoData isNotFound={isNotFound} />
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
