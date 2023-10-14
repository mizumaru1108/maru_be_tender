/* eslint-disable array-callback-return */
import { useEffect, useState } from 'react';
// material
import {
  Button,
  IconButton,
  Link,
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
import { TableHeadCustom, TableRowsData, TableSelectedActions } from 'components/table';
import SearchbarTable from './SearchbarTable';
// hooks
import useLocales from 'hooks/useLocales';
import useTable, { getComparator } from 'hooks/useTable';
//
import { LoadingButton } from '@mui/lab';
import EmptyContent from 'components/EmptyContent';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../utils/axios';
import ModalDialog from '../modal-dialog';
import { ChangeStatusRequest } from './TableRowsData';
import { IPropsTablesList } from './type';

// -------------------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'partner_name', label: 'account_manager.table.th.partner_name' },
  { id: 'createdAt', label: 'account_manager.table.th.createdAt' },
  { id: 'account_status', label: 'account_manager.table.th.account_status', align: 'left' },
  { id: 'events', label: 'account_manager.table.th.actions', align: 'left' },
  // { id: '', label: '', align: 'center' },
];
const TABLE_HEAD_EDIT = [
  { id: 'partner_name', label: 'account_manager.table.th.partner_name' },
  { id: 'createdAt', label: 'account_manager.table.th.createdAt' },
  { id: 'account_edit', label: 'account_manager.table.th.request_status', align: 'left' },
  { id: 'events', label: 'account_manager.table.th.actions', align: 'left' },
  // { id: '', label: '', align: 'center' },
];

// -------------------------------------------------------------------------------

export default function TableAMCustom({
  data,
  view_all,
  headline,
  lengthRowsPerPage,
  editRequest,
  // isLoading
  refetch,
}: {
  data: IPropsTablesList[];
  view_all?: string;
  headline: string;
  lengthRowsPerPage?: number;
  editRequest?: boolean;
  refetch?: () => void;
}) {
  // console.log({
  //   testClientData:
  //     data && data.find((item: any) => item.id === '5c1d3ef7-773a-4552-b8c5-dfd22ed72afd'),
  // });
  const { translate, currentLang } = useLocales();
  // const [tableData, setTableData] = useState<IPropsTablesList[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    defaultOrderBy: 'createdAt',
    defaultOrder: 'desc',
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
    // console.log({ tableData, filterName });
    if (filterName) {
      tableData = tableData.filter(
        (item: Record<string, any>) =>
          item.partner_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    }

    return tableData;
  };
  const [dataTable, setDataTable] = useState<IPropsTablesList[]>(
    applySortFilter({
      tableData: data,
      comparator: getComparator(order, orderBy),
      filterName: '',
    })
  );

  const [query, setQuery] = useState('');

  useEffect(() => {
    const dataFiltered = applySortFilter({
      tableData: data,
      comparator: getComparator(order, orderBy),
      filterName: query,
    });
    setDataTable(dataFiltered);
  }, [order, orderBy, data, query]);

  const deleteRowValue = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.patch<ChangeStatusRequest, any>(
        '/tender-user/update-status',
        {
          status: 'CANCELED_ACCOUNT',
          user_id: selected,
          selectLang: currentLang.value,
        } as ChangeStatusRequest,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      const notif = 'account_manager.partner_details.notification.deleted_account';

      enqueueSnackbar(`${translate(notif)}`, {
        variant: 'success',
      });
      setDeleteDialogOpen(false);
      setSelected([]);
      if (refetch) {
        refetch();
      } else {
        window.location.reload();
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;

      enqueueSnackbar(`${statusCode < 500 && message ? message : 'something went wrong!'}`, {
        variant: 'error',
      });

      console.log(err);
    } finally {
      setIsLoading(false);
    }

    // console.log({ selected });
    // alert('work around');
  };

  // Searchbar

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setQuery(event.target.value);
  // };
  const handleChange = (name: string) => {
    setQuery(name);
    setPage(0);
  };

  // useEffect(() => {
  //   setTableData(data);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // console.log({ tableData });
  return (
    <>
      <Stack direction="row" spacing={6} justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ mr: 2 }}>
          {translate(`${headline}`)}
        </Typography>
        {!view_all ? (
          // <SearchbarTable func={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)} />
          <SearchbarTable onSearch={(data: string) => handleChange(data)} />
        ) : (
          <Link component={RouterLink} to={view_all} variant="caption">
            <Typography variant="subtitle2" noWrap>
              {translate(`account_manager.heading.link_view_all`)}
            </Typography>
          </Link>
        )}
      </Stack>
      <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
        {selected.length > 0 && (
          <TableSelectedActions
            numSelected={selected.length}
            rowCount={dataTable.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(checked, dataTable.map((row) => row?.id) as string[])
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
            headLabel={editRequest ? TABLE_HEAD_EDIT : TABLE_HEAD}
            rowCount={data.length}
            onSort={onSort}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                data
                  .filter((row) => row.account_status !== 'CANCELED_ACCOUNT')
                  .map((row) => row.id) as string[]
              )
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
            editRequest={editRequest}
          />
          <TableBody>
            {dataTable.length > 0 &&
              dataTable
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((x, key) => (
                  <TableRowsData
                    key={key}
                    row={x}
                    selected={selected.includes(x.id as string)}
                    onSelectRow={() => onSelectRow(x.id as string)}
                    editRequest={editRequest}
                  />
                ))}
          </TableBody>
        </Table>
        {dataTable.length === 0 && <EmptyContent />}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataTable.length}
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
      <ModalDialog
        maxWidth="md"
        title={
          <Stack display="flex">
            <Typography variant="h5" sx={{ flex: 1, marginLeft: 2 }}>
              {`${translate('pages.admin.tracks_budget.notification.confirm_delete')} ?`}
            </Typography>
          </Stack>
        }
        showCloseIcon={true}
        actionBtn={
          <Stack direction="row" justifyContent="space-around" gap={4}>
            <Button
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                ':hover': { backgroundColor: '#efefef' },
              }}
              onClick={() => setDeleteDialogOpen(false)}
            >
              {translate('button.cancel')}
            </Button>
            <LoadingButton
              onClick={deleteRowValue}
              sx={{
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                backgroundColor: '#0E8478',
                ':hover': { backgroundColor: '#13B2A2' },
              }}
              loading={isLoading}
            >
              {translate('button.confirm')}
            </LoadingButton>
          </Stack>
        }
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelected([]);
        }}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </>
  );
}
