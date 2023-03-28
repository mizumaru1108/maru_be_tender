import { useEffect, useState } from 'react';
// material
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material';
// components
import Iconify from 'components/Iconify';
import { TableHeadCustom, TableSelectedActions } from 'components/table';
// hooks
import useLocales from 'hooks/useLocales';
import useTable, { getComparator } from 'hooks/useTable';

import { setTracks } from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';
import Scrollbar from 'components/Scrollbar';
import { Appointments, AppointmentsManagementTableProps } from './appointments';
import AppointmentsTableRow from './AppointmentsRow';
import EmptyContent from '../../../EmptyContent';

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
        <Typography variant="h5" sx={{ color: 'text.secondary', mr: 2, mb: 2 }}>
          {translate(`${headline}`)}
        </Typography>
      )}
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ color: 'white' }} thickness={4} />
          <Typography sx={{ color: 'white', fontSize: '1em', ml: 1 }}>
            Fetching Table Datas...
          </Typography>
        </Box>
      )}

      {!isLoading && tableData.length === 0 && (
        <EmptyContent
          title={translate('appointment.no_appointment')}
          sx={{
            '& span.MuiBox-root': { height: 100 },
          }}
        />
      )}
      {!isLoading && tableData.length > 0 && (
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table
              size="medium"
              sx={{ bgcolor: '#FFFFFF', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
            >
              <TableHeadCustom
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
              <TableBody>
                {data.length > 0 &&
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((appointment, key) => (
                      <AppointmentsTableRow
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
