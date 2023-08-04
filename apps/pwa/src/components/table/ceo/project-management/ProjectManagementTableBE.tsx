import { useEffect, useState } from 'react';
// material
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
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

import Scrollbar from 'components/Scrollbar';
import { setTracks } from 'redux/slices/proposal';
import { useSelector } from 'redux/store';
import { ProjectManagement, ProjectManagementTableBEProps } from './project-management';
import ProjectManagementTableRow from './ProjectManagementRow';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import SearchField from 'components/sorting/searchField';
import { REOPEN_TMRA_4601ec1d4d7e4d96ae17ecf65e2c2006 } from 'config';

export default function ProjectManagementTableBE({
  data,
  headerCell,
  headline,
  isLoading,
  total = 0,
  table_type = 'show-details',
  onPageChange,
  onFilterChange,
  onChangeRowsPage,
  onSearch,
  reFetch,
}: ProjectManagementTableBEProps) {
  const { translate } = useLocales();
  const { track_list } = useSelector((state) => state.proposal);

  const [tableData, setTableData] = useState<ProjectManagement[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>('all');
  // const [sortValue, setSortValue] = useState<string>('projectName-asc');

  const {
    page,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    // onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultRowsPerPage: 10,
    defaultCurrentPage: 0,
  });

  const deleteRowValue = () => {
    alert('data');
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);
  useEffect(() => {
    onPageChange(Number(page) + 1);
  }, [page, onPageChange]);
  useEffect(() => {
    onChangeRowsPage(Number(rowsPerPage));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, onChangeRowsPage]);

  return (
    <>
      {headline && (
        <Typography data-cy="project-table-management-headline" variant="h4" sx={{ mr: 2, mb: 2 }}>
          {translate(`${headline}`)}
        </Typography>
      )}

      {/* <Stack
        data-cy="select-option-track-list"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Select
          value={selectedTrack}
          disabled={isLoading}
          onChange={(e) => {
            setSelectedTrack(e.target.value as string);
            onFilterChange('track_id', e.target.value as string);
          }}
          size="small"
          sx={{ fontSize: '12px', width: 200 }}
        >
          <MenuItem value={'all'}>{'All'}</MenuItem>
          {track_list.map((item) => (
            <MenuItem data-cy={`select-option-track-${item.id}`} key={item.id} value={item.id}>
              {formatCapitalizeText(item.name)}
            </MenuItem>
          ))}
        </Select>
        <SearchField
          onReturnSearch={(value) => {
            console.log({ value });
          }}
        />
      </Stack> */}
      <Grid
        container
        data-cy="select-option-track-list"
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Grid item md={2} xs={12}>
          <Select
            data-cy="select-option-track-list"
            value={selectedTrack}
            disabled={isLoading}
            onChange={(e) => {
              setSelectedTrack(e.target.value as string);
              onFilterChange('track_id', e.target.value as string);
            }}
            size="small"
            sx={{ fontSize: '12px', width: 200 }}
          >
            <MenuItem value={'all'}>{'All'}</MenuItem>
            {track_list.map((item) => (
              <MenuItem data-cy={`select-option-track-${item.id}`} key={item.id} value={item.id}>
                {formatCapitalizeText(item.name)}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        {REOPEN_TMRA_4601ec1d4d7e4d96ae17ecf65e2c2006 && (
          <Grid item md={4} xs={12}>
            <SearchField
              data-cy="search_field"
              isLoading={isLoading}
              onReturnSearch={(value) => {
                if (onSearch) {
                  onSearch(value);
                }
              }}
              reFetch={() => {
                if (reFetch) reFetch();
              }}
            />
          </Grid>
        )}
      </Grid>

      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ color: 'white' }} thickness={4} />
          <Typography sx={{ color: 'white', fontSize: '1em', ml: 1 }}>
            Fetching Table Datas...
          </Typography>
        </Box>
      )}
      {/* {!isLoading && (
       
      )} */}
      <Scrollbar>
        <TableContainer
          data-cy="project-table-management-table_container"
          sx={{ minWidth: 800, position: 'relative' }}
        >
          {/* {selected.length > 0 && (
              <TableSelectedActions
                numSelected={selected.length}
                rowCount={data.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(checked, data.map((row) => row.id) as string[])
                }
                actions={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={() => setDeleteDialogOpen(true)}>
                      <Iconify icon={'eva:trash-2-outline'} />
                    </IconButton>
                  </Tooltip>
                }
              />
            )} */}
          <Table
            data-cy="project-table-management-table"
            size="medium"
            sx={{ bgcolor: '#FFFFFF', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          >
            <TableHeadCustom
              // order={order}
              // orderBy={orderBy}
              data-cy="project-table-management-table_head"
              headLabel={headerCell}
              rowCount={data.length}
              // onSort={onSort}
              // onSelectAllRows={(checked) =>
              //   onSelectAllRows(checked, data.map((row) => row.id) as string[])
              // }
              editRequest={true}
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
            <TableBody data-cy="project-table-management-table_body">
              {!isLoading &&
                data.length > 0 &&
                data.map((projectManagement, key) => (
                  <ProjectManagementTableRow
                    data-cy="project-table-management-table_body_row"
                    key={projectManagement.id}
                    row={projectManagement}
                    selected={selected.includes(projectManagement.id as string)}
                    onSelectRow={() => console.log('onSelectRow')}
                    destination={table_type}
                    needSelection={false}
                  />
                ))}
            </TableBody>
          </Table>
          <TablePagination
            data-cy="project-table-management-table_pagination"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            // count={dataFiltered.length}
            count={total}
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
      </Scrollbar>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelected([]);
        }}
        data-cy="project-table-management-delete-dialog"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent data-cy="project-table-management-delete-dialog-content">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Iconify
              data-cy="project-table-management-delete-dialog-icon"
              icon="akar-icons:info-fill"
              sx={{ width: 50, height: 50 }}
            />
            <Typography variant="h5" sx={{ flex: 1, marginLeft: 2 }}>
              {`Are you sure you want to delete this${selected?.length > 1 ? 's' : ''}?`}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1.5}>
            <Button
              data-cy="project-table-management-delete-dialog-cancel"
              variant="contained"
              onClick={() => setDeleteDialogOpen(false)}
              autoFocus
            >
              No
            </Button>
            <Button
              data-cy="project-table-management-delete-dialog-confirm"
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
