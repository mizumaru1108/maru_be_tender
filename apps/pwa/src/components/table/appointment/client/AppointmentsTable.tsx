import { useEffect, useState } from 'react';
// material
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
// components
import { TableHeadCustom } from 'components/table';
// hooks
import useLocales from 'hooks/useLocales';
import useTable, { getComparator } from 'hooks/useTable';

import Scrollbar from 'components/Scrollbar';
import { useDispatch } from 'redux/store';
import EmptyContent from '../../../EmptyContent';
import { Appointments, AppointmentsManagementTableProps } from './appointments';
import AppointmentsTableRow from './AppointmentsRow';

export default function AppointmentsTable({
  data,
  headerCell,
  headline,
  isLoading,
  isRequest = false,
  onAccept,
  onReject,
}: AppointmentsManagementTableProps) {
  const { translate } = useLocales();
  const dispatch = useDispatch();

  const [tableData, setTableData] = useState<Appointments[]>([]);
  const [selectedSortValue, setSelectedSortValue] = useState<string>('projectName');
  // const [selectedSortOrder, setSelectedSortOrder] = useState<'asc' | 'desc'>('asc');

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
    defaultOrder: 'asc',
    defaultRowsPerPage: 5,
    defaultCurrentPage: 0,
  });

  useEffect(() => {
    const sortValue = selectedSortValue.split('-');
    // setSelectedSortOrder(sortValue[1] as 'asc' | 'desc');
    setSelectedSortValue(sortValue[0]);
  }, [selectedSortValue]);

  const applySortFilter = ({
    tableData,
    comparator,
    filterName,
  }: {
    tableData: Appointments[];
    comparator: (a: any, b: any) => number;
    filterName: string;
  }) => {
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

    return tableData;
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName: '',
  });

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleAccept = (id: string) => {
    // console.log({ id });
    if (!!id) {
      onAccept!(id);
    }
  };
  const handleReject = (data: any) => {
    // console.log({ data });
    if (!!data) {
      onReject!(data);
    }
  };

  return (
    <>
      {headline && (
        <Typography
          data-cy="table_appointments_table_head"
          variant="h5"
          sx={{ color: 'text.secondary', mr: 2, mb: 2 }}
        >
          {translate(`${headline}`)}
        </Typography>
      )}
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress
            data-cy="table_appointments_circular_loading"
            size={20}
            sx={{ color: 'white' }}
            thickness={4}
          />
          <Typography
            data-cy="table_appointments_text_loading"
            sx={{ color: 'white', fontSize: '1em', ml: 1 }}
          >
            Fetching Table Datas...
          </Typography>
        </Box>
      )}

      {!isLoading && tableData.length === 0 && (
        <EmptyContent
          data-cy="table_no_appointments"
          title={translate('appointment.no_appointment')}
          sx={{
            '& span.MuiBox-root': { height: 100 },
          }}
        />
      )}
      {!isLoading && tableData.length > 0 && (
        <Scrollbar>
          <TableContainer
            data-cy="table_appointments_table_container"
            sx={{ minWidth: 800, position: 'relative' }}
          >
            <Table
              data-cy="table_appointments_table"
              size="medium"
              sx={{ bgcolor: '#FFFFFF', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
            >
              <TableHeadCustom
                data-cy="table_appointments_table_head_custom"
                order={order}
                orderBy={orderBy}
                headLabel={headerCell}
                rowCount={tableData.length}
                onSort={onSort}
                sx={{
                  minWidth: '100%',
                  '& .MuiTableCell-root': {
                    bgcolor: '#FFFFFF',
                    borderRadius: 0,
                  },
                  '& .MuiTableCell-root:first-of-type, .MuiTableCell-root:last-of-type': {
                    boxShadow: 'none !important',
                  },
                }}
              />
              <TableBody data-cy="table_appointments_table_body">
                {data.length > 0 &&
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((appointment, key) => (
                      <AppointmentsTableRow
                        data-cy={`table_appointments_table_row_${key}`}
                        key={appointment.id}
                        row={appointment}
                        isRequest={isRequest}
                        onAccept={(id: string) => {
                          if (!!id) {
                            handleAccept(id);
                          }
                        }}
                        onReject={(data: any) => {
                          if (!!data) {
                            handleReject(data);
                          }
                        }}
                      />
                    ))}
              </TableBody>
            </Table>
            <TablePagination
              data-cy="table_appointments_table_pagination"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              sx={{
                bgcolor: 'rgba(147, 163, 176, 0.16)',
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            />
          </TableContainer>
        </Scrollbar>
      )}
    </>
  );
}
