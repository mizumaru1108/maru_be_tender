import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
// form
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// @mui
import {
  Box,
  Table,
  Button,
  Tooltip,
  MenuItem,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';

// redux
import { useDispatch, useSelector } from 'redux/store';
import { getBranches, getBranch, deleteBranch, resetState } from 'redux/slices/branch';

// @types
import { Branches } from '../../../@types/branch';

// routes
import { PATH_DASHBOARD } from 'routes/paths';

// hooks
import useSettings from 'hooks/useSettings';
import useTable, { getComparator, emptyRows } from 'hooks/useTable';

// components
import Page from 'components/Page';
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableSelectedActions } from 'components/table';
import Toast from 'components/toast';
import ModalDialog from 'components/modal-dialog';
import { RHFTextField, FormProvider } from 'components/hook-form';
import EmptyContent from 'components/EmptyContent';
import BranchDetail from 'components/branch-detail';

// sections
import { BranchTableRow } from 'sections/@dashboard/employee/branch/branch-list';

// assets
import IconArrowRight from 'assets/employee/ic-arrow-right.svg';
import NoDataFound from 'assets/employee/illustration-empty-state.svg';
import { ReactElement } from 'react-markdown/lib/react-markdown';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {
    id: 'name',
    label: 'Full Name',
    align: 'left',
    width: { lg: '70%', md: '70%', sm: '100%', xs: '100%' },
  },
  {
    id: 'employee',
    label: 'Employee',
    align: 'left',
    width: { lg: '30%', md: '30%', sm: '0%', xs: '0%' },
    display: { lg: 'table-cell', md: 'table-cell', sm: 'none', xs: 'none' },
  },
  {
    id: 'action',
    label: '',
  },
];

// ----------------------------------------------------------------------

export default function Branch() {
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
  } = useTable({
    defaultOrderBy: 'name',
  });

  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { branches, branch, isLoading, message, isError, isSuccess, isLoadingDetail } = useSelector(
    (state) => state.branch
  );

  const NewBlogSchema = Yup.object().shape({
    branch_name: Yup.string().required('Branch name is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const [editableName, setEditableName] = useState('');
  const [deletableId, setDeletableId] = useState<string[]>([]);
  const [modalType, setModalType] = useState('none');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [tableData, setTableData] = useState<Branches[]>([]);

  useEffect(() => {
    dispatch(getBranches());
  }, [dispatch]);

  useEffect(() => {
    if (branches.length) {
      setTableData(branches);
    }
  }, [branches]);

  useEffect(() => {
    if (isError && message) {
      setAlertOpen(true);
    }
  }, [isError, message]);

  useEffect(() => {
    if (isSuccess && message) {
      setAlertOpen(true);
    }
  }, [isSuccess, message]);

  const handleEditRow = (id: string) => {};

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName: '',
  });

  const renderModalContent = () => {
    let content = null;
    switch (modalType) {
      case 'add':
        content = (
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFTextField name="branch_name" label="Branch" />
            <Box display="flex" justifyContent="flex-end">
              <Button
                sx={{ mt: 4 }}
                type="submit"
                variant="contained"
                size="medium"
                color="primary"
              >
                Save
              </Button>
            </Box>
          </FormProvider>
        );
        break;
      case 'delete':
        content = (
          <Typography variant="body1">
            Are you sure you want to permanently remove this branch?
          </Typography>
        );
        break;
      case 'deleteMultiple':
        content = (
          <Typography variant="body1">
            Are you sure you want to permanently remove{' '}
            <b>
              {selected.length} branch{selected.length > 1 ? 'es' : ''}?
            </b>
          </Typography>
        );
        break;
      case 'detail':
        content = <BranchDetail />;
        break;
      default:
        break;
    }
    return content;
  };

  const renderModalTitle = () => {
    let title: string | React.ReactNode = '';
    switch (modalType) {
      case 'add':
        title = 'New Branch';
        break;
      case 'delete':
        title = 'Confirm';
        break;
      case 'deleteMultiple':
        title = 'Confirm';
        break;
      case 'detail':
        title = (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            pr={3}
          >
            <Typography variant="h4">{editableName ?? ''}</Typography>
            <Button variant="contained" size="small">
              Edit
            </Button>
          </Box>
        );
        break;
      default:
        break;
    }
    return title;
  };

  const renderModalButton = () => {
    let button = null;
    switch (modalType) {
      case 'add':
        button = null;
        break;
      case 'delete':
        button = (
          <Button
            variant="contained"
            size="medium"
            color="error"
            onClick={() => {
              dispatch(deleteBranch(deletableId));
              setDialogOpen(false);
              setDeletableId([]);
            }}
          >
            Remove
          </Button>
        );
        break;
      case 'deleteMultiple':
        button = (
          <Button
            variant="contained"
            size="medium"
            color="error"
            onClick={() => {
              dispatch(deleteBranch(selected));
              setDialogOpen(false);
              setSelected([]);
            }}
          >
            Remove
          </Button>
        );
        break;
      case 'edit':
        button = (
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              setDialogOpen(false);
              setAlertOpen(true);
            }}
          >
            Edit
          </Button>
        );
        break;
      default:
        break;
    }
    return button;
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isNotFound = !dataFiltered.length;

  return (
    <Page title="Branch">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          customSeparator={
            <img
              src={IconArrowRight}
              alt="icon-arrow-right"
              style={{ width: '5px', height: '8px' }}
            />
          }
          heading="HR Branch"
          links={[
            { name: 'My Organization', href: PATH_DASHBOARD.root },
            { name: 'Human Resources', href: PATH_DASHBOARD.hr.root },
            { name: 'Branch' },
          ]}
        />
        {isLoading ? (
          <Box justifyContent="center" alignItems="center" display="flex" height={200}>
            <CircularProgress color="primary" />
          </Box>
        ) : !isLoading && isNotFound ? (
          <EmptyContent
            title="No Branch found"
            description="You do not have a list of Branch at this time. Come on, make a list of Branch now!"
            img={NoDataFound}
            actionButton={
              <Button
                to="#"
                onClick={() => {
                  setModalType('add');
                  setDialogOpen(true);
                }}
                sx={{ mt: 4 }}
                variant="contained"
                component={RouterLink}
              >
                Create a new Branch
              </Button>
            }
          />
        ) : !isLoading && !isNotFound ? (
          <>
            {/* <Scrollbar> */}
            <TableContainer sx={{ overflowX: 'hidden', position: 'relative' }}>
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
                      <Stack direction="row" spacing={0} alignItems="center">
                        <Button
                          color="error"
                          onClick={() => {
                            setModalType('deleteMultiple');
                            setDialogOpen(true);
                          }}
                          startIcon={<Iconify icon={'eva:trash-2-outline'} />}
                        >
                          Remove
                        </Button>
                      </Stack>
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
                      <BranchTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        actions={
                          <>
                            <MenuItem
                              onClick={() => {
                                setEditableName(
                                  branches.find((x) => x.id === row.id)?.name as string
                                );
                                dispatch(getBranch(row.id));
                                setModalType('detail');
                                setDialogOpen(true);
                              }}
                            >
                              <Iconify icon={'majesticons:checkbox-list-detail'} />
                              Detail
                            </MenuItem>
                            <MenuItem onClick={() => handleEditRow(row.name)}>
                              <Iconify icon={'eva:edit-fill'} />
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                setDeletableId([row.id]);
                                setModalType('delete');
                                setDialogOpen(true);
                              }}
                              sx={{ color: 'error.main' }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} />
                              Delete
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
              </Table>
            </TableContainer>
            {/* </Scrollbar> */}
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
          </>
        ) : null}
        <ModalDialog
          fullWidth={true}
          isOpen={isDialogOpen}
          maxWidth="sm"
          title={renderModalTitle()}
          showCancelBtn={modalType === 'delete' || modalType === 'deleteMultiple'}
          showCloseIcon={modalType === 'add' || modalType === 'detail'}
          styleContent={{ mt: 4 }}
          onClose={() => setDialogOpen(false)}
          content={renderModalContent()}
          actionBtn={renderModalButton()}
        />
        <Toast
          variant="filled"
          toastType={isSuccess ? 'success' : isError ? 'error' : 'success'}
          message={message}
          autoHideDuration={3000}
          isOpen={isAlertOpen}
          position="top-right"
          onClose={() => {
            dispatch(resetState());
            setAlertOpen(false);
          }}
        />
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
  tableData: Branches[];
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
