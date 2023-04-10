/* eslint-disable array-callback-return */
import React, { useState, useEffect, ChangeEvent } from 'react';
// material
import {
  Table,
  TableBody,
  TablePagination,
  TableContainer,
  Tooltip,
  IconButton,
  Box,
  Dialog,
  DialogContent,
  Typography,
  Button,
} from '@mui/material';
// components
import {
  TableHeadCustom,
  TableRowsEmployee,
  TableSelectedActions,
  TableNoData,
} from 'components/table';
import Iconify from 'components/Iconify';
import SearchbarTable from 'components/table/SearchbarTable';
// hooks
import useTable, { getComparator } from 'hooks/useTable';
import useLocales from 'hooks/useLocales';
// types
import { IPropsAvgEmployeeEfectiveness } from './types';

// -------------------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee_name', label: 'section_portal_reports.table.th.employee_name' },
  { id: 'account_type', label: 'section_portal_reports.table.th.account_type' },
  { id: 'section', label: 'section_portal_reports.table.th.section', align: 'left' },
  {
    id: 'raw_average_response_time',
    label: 'section_portal_reports.table.th.number_of_clock',
    align: 'left',
  },
];

// -------------------------------------------------------------------------------

export default function TableEmployee({ data }: { data: IPropsAvgEmployeeEfectiveness[] }) {
  const { translate } = useLocales();
  const [tableData, setTableData] = useState<IPropsAvgEmployeeEfectiveness[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'raw_average_response_time',
    defaultOrder: 'asc',
    defaultRowsPerPage: 5,
    defaultCurrentPage: 0,
  });

  const applySortFilter = ({
    tableData,
    comparator,
    filterName,
  }: {
    tableData: IPropsAvgEmployeeEfectiveness[];
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

  const deleteRowValue = () => {
    alert('data');
  };

  // Searchbar
  const [query, setQuery] = useState('');

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setQuery(event.target.value);
  // };
  const handleChange = (name: string) => {
    setQuery(name);
  };

  useEffect(() => {
    setTableData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {/* <SearchbarTable func={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)} /> */}
      <SearchbarTable onSearch={(data: string) => handleChange(data)} />
      <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
        {selected.length > 0 && (
          <TableSelectedActions
            numSelected={selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(checked, tableData.map((row) => row?.employee_name) as string[])
            }
            actions={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={() => setDeleteDialogOpen(true)}>
                  <Iconify icon={'eva:trash-2-outline'} />
                </IconButton>
              </Tooltip>
            }
          />
        )}
        <Table
          size="medium"
          sx={{ bgcolor: '#FFFFFF', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        >
          <TableHeadCustom
            order={order}
            orderBy={orderBy}
            headLabel={TABLE_HEAD}
            rowCount={tableData.length}
            onSort={onSort}
            onSelectAllRows={(checked) =>
              onSelectAllRows(checked, tableData.map((row) => row.employee_name) as string[])
            }
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
            {dataFiltered.length > 0 ? (
              dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter((v) => {
                  if (query === '') {
                    return v;
                  } else if (v.employee_name?.toLowerCase().includes(query.toLowerCase())) {
                    return v;
                  }
                })
                .map((x, key) => (
                  <TableRowsEmployee
                    key={key}
                    row={x}
                    selected={selected.includes(x.average_response_time as string)}
                    onSelectRow={() => onSelectRow(x.average_response_time as string)}
                  />
                ))
            ) : (
              <TableNoData isNotFound={!dataFiltered.length} />
            )}
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
      {/* <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelected([]);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Iconify icon="akar-icons:info-fill" sx={{ width: 50, height: 50 }} />
            <Typography variant="h5" sx={{ flex: 1, marginLeft: 2 }}>
              {`Are you sure you want to delete this${selected?.length > 1 ? 's' : ''}?`}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1.5}>
            <Button variant="contained" onClick={() => setDeleteDialogOpen(false)} autoFocus>
              No
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteRowValue()}
              sx={{ marginLeft: 1.5 }}
            >
              Yes
            </Button>
          </Box>
        </DialogContent>
      </Dialog> */}
    </React.Fragment>
  );
}
