import { paramCase } from 'change-case';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  Switch,
  Tooltip,
  MenuItem,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getProducts } from '../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// @types
import { Product } from '../../../@types/product';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableSearchNotFound,
  TableSelectedActions,
} from '../../../components/table';
// sections
import {
  ProductTableRow,
  ProductTableToolbar,
} from '../../../sections/@dashboard/e-commerce/product-list';
import EmptyContent from '../../../components/EmptyContent';
import IconArrowRight from 'assets/employee/ic-arrow-right.svg';
import EmployeeListEmpty from 'assets/employee/illustration_empty_employee_list.svg';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Product', align: 'left' },
  { id: 'createdAt', label: 'Create at', align: 'left' },
  { id: 'inventoryType', label: 'Status', align: 'center', width: 180 },
  { id: 'price', label: 'Price', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceProductList() {
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
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.product);

  const [tableData, setTableData] = useState<Product[]>([]);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected: string[]) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = !dataFiltered.length;

  return (
    <Page title="Ecommerce: Employee List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Employee List"
          customSeparator={
            <img
              src={IconArrowRight}
              alt="icon-arrow-right"
              style={{ width: '5px', height: '8px' }}
            />
          }
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Human Resources',
              href: PATH_DASHBOARD.hr.root,
            },
            { name: 'Employee List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.eCommerce.new}
            >
              Add Employee
            </Button>
          }
        />
        {
            products.length == 0 ? 
            (
              <EmptyContent
                  title="You haven't created an Employee yet"
                  description="You do not have a list of Employee at this time. Come on, make a list Employee now!"
                  img={EmployeeListEmpty}
                  actionButton={
                    <Button to="#" sx={{ mt: 4 }} variant="contained" component={RouterLink}>
                      Add Employee
                    </Button>
                  }
              />
            )
            :
            (
              <Card>
                <ProductTableToolbar filterName={filterName} onFilterName={handleFilterName} />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
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
                            <ProductTableRow
                                key={row.id}
                                row={row}
                                selected={selected.includes(row.id)}
                                onSelectRow={() => onSelectRow(row.id)}
                                actions={
                                <>
                                    <MenuItem
                                    onClick={() => handleDeleteRow(row.id)}
                                    sx={{ color: 'error.main' }}
                                    >
                                    <Iconify icon={'eva:trash-2-outline'} />
                                    Delete
                                    </MenuItem>
                                    <MenuItem onClick={() => handleEditRow(row.name)}>
                                    <Iconify icon={'eva:edit-fill'} />
                                    Edit
                                    </MenuItem>
                                </>
                                }
                            />
                            ))}

                        <TableEmptyRows
                            height={dense ? 60 : 80}
                            emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                        />
                        </TableBody>

                        {isNotFound && <TableSearchNotFound />}
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

                    <FormControlLabel
                    control={<Switch checked={dense} onChange={onChangeDense} />}
                    label="Dense"
                    sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                    />
                </Box>
              </Card>
            )
        }
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
}: {
  tableData: Product[];
  comparator: (a: any, b: any) => number;
  filterName: string;
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

  return tableData;
}
