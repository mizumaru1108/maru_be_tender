import { useEffect, useState } from 'react';
// material
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Link,
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
import { ProjectManagement } from '../project-management/project-management';
import ProjectManagementRow from '../project-management/ProjectManagementRow';
import { RejectionListTableProps, RejectionList } from './rejection-list';

export default function RejectionListTable({
  data,
  headerCell,
  headline,
  isLoading,
}: RejectionListTableProps) {
  const { translate } = useLocales();
  const [tableData, setTableData] = useState<RejectionList[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('projectName-asc');
  const [selectedSortValue, setSelectedSortValue] = useState<string>('projectName');
  const [selectedSortOrder, setSelectedSortOrder] = useState<'asc' | 'desc'>('asc');

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
    defaultOrder: 'asc',
    defaultRowsPerPage: 5,
    defaultCurrentPage: 0,
  });

  const projectTracks = [
    {
      value: '',
      title: translate('table_filter.button_group.all_tracks'),
    },
    {
      value: 'Mosques Department',
      title: translate('table_filter.button_group.mosques_track'),
    },
    {
      value: 'Facilitated Scholarship Track',
      title: translate('table_filter.button_group.scholarships_track'),
    },
    {
      value: 'Initiatives Track',
      title: translate('table_filter.button_group.initiatives_track'),
    },
    {
      value: 'Baptismal Path',
      title: translate('table_filter.button_group.baptism_track'),
    },
    {
      value: "Syeikh's Path",
      title: translate('table_filter.button_group.syeikh_track'),
    },
  ];

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

  useEffect(() => {
    const sortValue = selectedSortValue.split('-');
    setSelectedSortOrder(sortValue[1] as 'asc' | 'desc');
    setSelectedSortValue(sortValue[0]);
  }, [selectedSortValue]);

  const applySortFilter = ({
    tableData,
    comparator,
    filterName,
  }: {
    tableData: ProjectManagement[];
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

  useEffect(() => {
    setTableData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {headline && (
        <Typography variant="h4" sx={{ mr: 2 }}>
          {translate(`${headline}`)}
        </Typography>
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          {projectTracks.map((item) => (
            <Button
              key={item.value}
              variant="text"
              onClick={() => setSelectedTrack(item.value)}
              sx={{
                backgroundColor: selectedTrack === item.value ? 'primary.main' : 'inherit',
                color: selectedTrack === item.value ? 'white' : 'grey.600',
                '&:hover': {
                  backgroundColor: selectedTrack === item.value ? 'primary.main' : 'inherit',
                  color: selectedTrack === item.value ? 'white' : 'grey.600',
                },
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
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
        </Box>
      </Stack>
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ color: 'white' }} thickness={4} />
          <Typography sx={{ color: 'white', fontSize: '1em', ml: 1 }}>
            Fetching Table Datas...
          </Typography>
        </Box>
      )}
      {!isLoading && (
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(checked, tableData.map((row) => row.id) as string[])
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
              headLabel={headerCell}
              rowCount={tableData.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(checked, tableData.map((row) => row.id) as string[])
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
              {data.length > 0 &&
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((projectManagement, key) => (
                    <ProjectManagementRow
                      key={projectManagement.id}
                      row={projectManagement}
                      selected={selected.includes(projectManagement.id as string)}
                      onSelectRow={() => onSelectRow(projectManagement.id as string)}
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
      )}
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
