// react
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
//
import GovernoratesTableRow from 'sections/admin/governorate/list/GovernoratesTableRow';
import { RegionsTableToolbar } from 'sections/admin/region/list';
import { IRegions } from 'sections/admin/region/list/types';
import { IGovernorate } from './types';

// -----------------------------------------------------------------------------------------------

export default function GovernoratesTableContent({
  data,
  trigger,
  regionList,
}: {
  data: IGovernorate[] | [];
  regionList: IRegions[] | [];
  trigger: () => void;
}) {
  const { translate } = useLocales();
  // console.log({ data });
  const TABLE_HEAD = [
    {
      id: 'governorate_name',
      label: translate('pages.admin.settings.label.governorate.list_of_governorate'),
      align: 'left',
    },
    {
      id: 'region_name',
      label: translate('pages.admin.settings.label.regions.list_of_regions'),
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

  const navigate = useNavigate();

  const [tableData, setTableData] = useState<IGovernorate[] | []>(data.map((row) => row));
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

  const handleDeleteRows = (selected: string[]) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.region_id));
    setSelected([]);
    setTableData(deleteRows);
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

  // console.log({ data, tableData });

  return (
    <Card sx={{ backgroundColor: '#fff' }}>
      <RegionsTableToolbar
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
                  tableData.map((row) => row.region_id)
                )
              }
              actions={
                <IconButton color="primary" disabled={true}>
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
                  tableData.map((row) => row.region_id)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <GovernoratesTableRow
                    key={row.region_id}
                    row={row}
                    regionList={regionList}
                    selected={selected.includes(row.region_id)}
                    onSelectRow={() => onSelectRow(row.region_id)}
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
  tableData: IGovernorate[];
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
