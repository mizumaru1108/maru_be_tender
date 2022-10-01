/* eslint-disable array-callback-return */
import { useState, useEffect, ChangeEvent } from 'react';
// material
import {
  Link,
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
  Stack,
} from '@mui/material';
// components
import { TableHeadCustom, TableRowsData, TableSelectedActions } from 'components/table';
import Iconify from 'components/Iconify';
import SearchbarTable from './SearchbarTable';
// hooks
import useTable, { getComparator } from 'hooks/useTable';
import useLocales from 'hooks/useLocales';
//
import { IPropsTablesList } from './type';
import { Link as RouterLink } from 'react-router-dom';

// -------------------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'partner_name', label: 'partner_name' },
  { id: 'createdAt', label: 'date_of_registration' },
  { id: 'account_status', label: 'account_status', align: 'left' },
  { id: 'events', label: 'events', align: 'left' },
  // { id: '', label: '', align: 'center' },
];

// -------------------------------------------------------------------------------

export default function TableAMCustom({
  data,
  view_all,
  headline,
  lengthRowsPerPage,
}: {
  data: IPropsTablesList[];
  view_all?: string;
  headline: string;
  lengthRowsPerPage?: number;
}) {
  const { translate } = useLocales();
  const [tableData, setTableData] = useState<IPropsTablesList[]>([]);
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
    defaultOrderBy: 'partner_name',
    defaultOrder: 'asc',
    defaultRowsPerPage: lengthRowsPerPage ? lengthRowsPerPage : 5,
    defaultCurrentPage: 0,
  });

  const applySortFilter = ({
    tableData,
    comparator,
    filterName,
  }: {
    tableData: IPropsTablesList[];
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    setTableData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Stack direction="row" spacing={6} justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ mr: 2 }}>
          {translate(`${headline}`)}
        </Typography>
        {!view_all ? (
          <SearchbarTable func={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)} />
        ) : (
          <Link component={RouterLink} to={view_all} variant="caption">
            <Typography variant="subtitle2" noWrap>
              {translate(`link_view_all`)}
            </Typography>
          </Link>
        )}
      </Stack>
      <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
        {selected.length > 0 && (
          <TableSelectedActions
            numSelected={selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(checked, tableData.map((row) => row?.partner_name) as string[])
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
              onSelectAllRows(checked, tableData.map((row) => row.partner_name) as string[])
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
            {dataFiltered.length > 0 &&
              dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter((v) => {
                  if (query === '') {
                    return v;
                  } else if (v.partner_name?.toLowerCase().includes(query.toLowerCase())) {
                    return v;
                  }
                })
                .map((x, key) => (
                  <TableRowsData
                    key={key}
                    row={x}
                    selected={selected.includes(x.partner_name as string)}
                    onSelectRow={() => onSelectRow(x.partner_name as string)}
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
      <Dialog
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
      </Dialog>
    </>
  );
}
