/* eslint-disable array-callback-return */
import { useState, useEffect, ChangeEvent } from 'react';
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
  Stack,
  Select,
  MenuItem,
} from '@mui/material';
// components
import { TableHeadCustom, TableRowsEmployee, TableSelectedActions } from 'components/table';
import Iconify from 'components/Iconify';
import SearchbarTable from 'components/table/SearchbarTable';
// hooks
import useTable, { getComparator } from 'hooks/useTable';
import useLocales from 'hooks/useLocales';
//
import { IPropsPortalReportEmployee } from 'components/table/type';

// -------------------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee_name', label: 'section_portal_reports.table.th.employee_name' },
  { id: 'account_type', label: 'section_portal_reports.table.th.account_type' },
  { id: 'section', label: 'section_portal_reports.table.th.section', align: 'left' },
  {
    id: 'number_of_clock',
    label: 'section_portal_reports.table.th.number_of_clock',
    align: 'left',
  },
];

// -------------------------------------------------------------------------------

export default function TableEmployee({
  data,
  lengthRowsPerPage,
}: {
  data: IPropsPortalReportEmployee[];
  lengthRowsPerPage?: number;
}) {
  const { translate } = useLocales();
  const [tableData, setTableData] = useState<IPropsPortalReportEmployee[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>('projectName-asc');

  const sortOptions = [
    {
      value: 'createdAt-asc',
      title: translate('table_filter.sortby_options.date_created_oldest'),
    },
    {
      value: 'createdAt-desc',
      title: translate('table_filter.sortby_options.date_created_newest'),
    },
    {
      value: 'projectName-asc',
      title: translate('table_filter.sortby_options.project_name_az'),
    },
    {
      value: 'projectName-desc',
      title: translate('table_filter.sortby_options.project_name_za'),
    },
    {
      value: 'associationName-asc',
      title: translate('table_filter.sortby_options.association_name_az'),
    },
    {
      value: 'associationName-desc',
      title: translate('table_filter.sortby_options.association_name_za'),
    },
    {
      value: 'projectSection-asc',
      title: translate('table_filter.sortby_options.section_az'),
    },
    {
      value: 'projectSection-desc',
      title: translate('table_filter.sortby_options.section_za'),
    },
    {
      value: 'projectNumber-asc',
      title: translate('table_filter.sortby_options.project_number_lowest'),
    },
    {
      value: 'projectNumber-desc',
      title: translate('table_filter.sortby_options.project_number_highest'),
    },
  ];

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
    defaultOrderBy: 'employee_name',
    defaultOrder: 'asc',
    defaultRowsPerPage: lengthRowsPerPage ? lengthRowsPerPage : 5,
    defaultCurrentPage: 0,
  });

  const applySortFilter = ({
    tableData,
    comparator,
    filterName,
  }: {
    tableData: IPropsPortalReportEmployee[];
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
      <Stack spacing={2} direction="row" justifyContent="space-between" component="div">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          component="div"
        >
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ color: 'grey.600' }}>
              {translate('table_filter.sortby_title')} &nbsp;
            </Typography>
            <Select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value as string)}
              size="small"
              sx={{ width: 200 }}
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
              {translate('table_filter.filter_button_label')}
              <Iconify icon="bx:bx-filter-alt" sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Stack>
        <SearchbarTable func={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)} />
      </Stack>
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
            {dataFiltered.length > 0 &&
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
                    selected={selected.includes(x.employee_name as string)}
                    onSelectRow={() => onSelectRow(x.employee_name as string)}
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
