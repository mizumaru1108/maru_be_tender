// react
import React, { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
import useTable, { emptyRows, getComparator } from 'hooks/useTable';
import useTabs from 'hooks/useTabs';
// components
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from 'components/table';
import { BeneficiariesTableToolbar } from '../../beneficiaries/list';
import AuthoritiesTableRow from './AuthorityTableRow';
import { AuthorityInterface, ClientFieldInterface } from './types';
import axiosInstance from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import FormModalAuthority from './FormModalAuthority';

// -----------------------------------------------------------------------------------------------

export default function AuthorityTableContent({
  data,
  clientFieldList,
  trigger,
}: {
  data: AuthorityInterface[] | [];
  clientFieldList: ClientFieldInterface[];
  trigger: () => void;
}) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // console.log({ data });
  const TABLE_HEAD = [
    {
      id: 'name',
      label: translate('pages.admin.settings.label.table.name'),
      align: 'left',
    },
    {
      id: 'client_field_name',
      label: translate('pages.admin.settings.label.table.client_field_name'),
      align: 'left',
    },
    {
      id: 'status',
      label: translate('system_messages.headercell.status'),
      align: 'left',
    },
    {
      id: 'permissions',
      label: translate('pages.admin.settings.label.table.permissions'),
      align: 'left',
    },
  ];

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
    defaultRowsPerPage: 10,
  });

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [type, setType] = useState<'add' | 'edit' | 'delete'>('edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tableData, setTableData] = useState<AuthorityInterface[] | []>(data.map((row) => row));
  // console.log({ tableData });

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const handleFilterName = (name: string) => {
    setFilterName(name);
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

  useEffect(() => {
    if (data) {
      setTableData(data.map((row) => row));
    }
  }, [data]);

  const denseHeight = dense ? 52 : 72;
  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  // TODO: make another modal to confirm deleteion
  // console.log({ data, tableData });
  const handleDelete = async (authority_id: string[]) => {
    // setIsSubmitting(true);
    console.log({ authority_id });
    // try {
    //   const { status } = await axiosInstance.patch(
    //     'authority-management/authorities/delete',
    //     { authority_id },
    //     {
    //       headers: { 'x-hasura-role': activeRole! },
    //     }
    //   );
    //   if (status === 200) {
    //     enqueueSnackbar(translate('pages.admin.settings.label.modal.success_edit_bank'), {
    //       variant: 'success',
    //       preventDuplicate: true,
    //       autoHideDuration: 3000,
    //     });
    //   }
    // } catch (err) {
    //   const statusCode = (err && err.statusCode) || 0;
    //   const message = (err && err.message) || null;
    //   enqueueSnackbar(
    //     `${
    //       statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
    //     }`,
    //     {
    //       variant: 'error',
    //       preventDuplicate: true,
    //       autoHideDuration: 3000,
    //       anchorOrigin: {
    //         vertical: 'bottom',
    //         horizontal: 'center',
    //       },
    //     }
    //   );
    // } finally {
    //   // onTrigger();
    //   // setIsSubmitting(false);
    //   // setOpenEditModal(false);
    // }
  };

  return (
    <Card sx={{ backgroundColor: '#fff' }}>
      <BeneficiariesTableToolbar
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
                  tableData.map((row) => row.authority_id)
                )
              }
              actions={
                <IconButton color="primary" onClick={() => handleDelete(selected)}>
                  <Iconify icon={'eva:trash-2-outline'} />
                </IconButton>
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
                  tableData.map((row) => row.authority_id)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <AuthoritiesTableRow
                    clientFieldList={clientFieldList}
                    key={row.authority_id}
                    row={row}
                    selected={selected.includes(row.authority_id)}
                    onSelectRow={() => onSelectRow(row.authority_id)}
                    onTrigger={() => trigger()}
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
  );
}

// --------------------------------------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: AuthorityInterface[];
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
