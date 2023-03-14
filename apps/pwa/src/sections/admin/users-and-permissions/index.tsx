import { paramCase } from 'change-case';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
// routes
import { PATH_ADMIN, PATH_DASHBOARD } from '../../../routes/paths';
import useTable, { emptyRows, getComparator } from 'hooks/useTable';
import useSettings from 'hooks/useSettings';
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from 'components/table';
import useTabs from 'hooks/useTabs';
import { UsersAndPermissionsInterface } from './list/types';
import UsersAndPermissionsToolbar from './list/UsersAndPermissionsToolbar';
import UsersAndPermissionsTableRow from './list/UsersAndPermissionsTableRow';
import { useQuery } from 'urql';
import { getAllTheEmployees } from 'queries/admin/getAllTheEmployees';
import { FEATURE_NEW_EMPLOYEE, TMRA_RAISE_URL } from 'config';
import axios from 'axios';
import axiosInstance from 'utils/axios';
import useAuth from 'hooks/useAuth';

const TABLE_HEAD = [
  { id: 'name', label: 'الاسم', align: 'left' },
  { id: 'email', label: 'ايميل', align: 'left' },
  { id: 'permissions', label: 'سماحيات', align: 'left' },
  { id: 'activation', label: 'حالة الحساب', align: 'left' },
  { id: 'events', label: 'احداث', align: 'left' },
];

interface SnackBar {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}
export default function UsersAndPermissionsTable() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { activeRole } = useAuth();

  const [openSnackBar, setOpenSnackBar] = React.useState<SnackBar>({
    open: false,
    message: '',
    severity: 'success',
  });
  const { themeStretch } = useSettings();

  const [isDeleting, setIsDeletig] = React.useState<{ id: string; loading: boolean }>({
    id: '',
    loading: false,
  });

  const navigate = useNavigate();

  const [result, mutate] = useQuery({ query: getAllTheEmployees });

  const { data, fetching, error } = result;

  const [tableData, setTableData] = useState<Array<UsersAndPermissionsInterface>>([]);

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

  const handleDeleteRow = async (id: string) => {
    try {
      setIsDeletig({ loading: true, id });
      await axiosInstance.post(
        '/tender-user/delete',
        { user_id: id },
        { headers: { 'x-hasura-role': activeRole! } }
      );
      const deleteRow = tableData.filter((row) => row.id !== id);
      setIsDeletig({ loading: false, id: '' });
      setSelected([]);
      setOpenSnackBar({ open: true, message: 'تم حذف المستخدم بنجاح', severity: 'success' });
      setTableData(deleteRow);
    } catch (error) {
      setIsDeletig({ loading: false, id: '' });
      setOpenSnackBar({ open: true, message: error.message, severity: 'error' });
    }
  };

  const handleCloseSnackBar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar({ open: false, message: '', severity: 'success' });
  };

  const handleDeleteRows = (selected: string[]) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id: string) => {
    // navigate(PATH_ADMIN.user.edit(paramCase(id)));
    console.log('masukedit');
    navigate(PATH_ADMIN.users_and_permissions_edit(paramCase(id)));
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
    if (data?.user) {
      setTableData(data.user);
    }
  }, [data]);
  if (fetching) return <>... Loading</>;
  if (error) return <>...Opss, something went wrong</>;
  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <Snackbar
        open={openSnackBar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={openSnackBar.severity}
          sx={{ width: '100%' }}
        >
          {openSnackBar.message}
        </Alert>
      </Snackbar>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: '40px' }}>
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
            الموظفين و الصلاحيات
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{ px: '50px', fontSize: '16px' }}
          disabled={!FEATURE_NEW_EMPLOYEE}
          onClick={() => {
            navigate('/admin/dashboard/users-and-permissions/add');
          }}
        >
          اضافة موظف
        </Button>
      </Stack>
      <Card sx={{ backgroundColor: '#fff' }}>
        {/* done */}
        <UsersAndPermissionsToolbar
          filterName={filterName}
          filterRole={filterRole}
          onFilterName={handleFilterName}
          onFilterRole={handleFilterRole}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            {selected.length > 0 && (
              <TableSelectedActions
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                actions={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                      <Iconify icon={'eva:trash-2-outline'} />
                    </IconButton>
                  </Tooltip>
                }
              />
            )}

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
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UsersAndPermissionsTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      isDeleting={isDeleting}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Box>
      </Card>
    </Container>
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
  tableData: UsersAndPermissionsInterface[];
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
