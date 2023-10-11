import React, { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import Scrollbar from 'components/Scrollbar';
import { SearchbarTable, TableHeadCustom, TableNoData } from 'components/table';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import useTable, { getComparator } from 'hooks/useTable';
import useTabs from 'hooks/useTabs';
import axiosInstance from 'utils/axios';
import { generateHeader } from '../../../utils/generateProposalNumber';
import TableSkeleton from '../TableSkeleton';
import OldProposalTableRow from './OldProposalTableRow';
import { OldProposalsList } from './types';
import { useSelector } from 'redux/store';
import EmptyContent from 'components/EmptyContent';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';

const TABLE_HEAD = [
  { id: 'project_number', label: 'old_proposal.headercell.project_number' },
  {
    id: 'project_name',
    label: 'old_proposal.headercell.project_name',
    align: 'left',
  },
  { id: 'events', label: 'client_list_headercell.events', align: 'left' },
];

const status = [
  'COMPLETED',
  'CANCELED',
  'PENDING',
  'ONGOING',
  'ON_REVISION',
  'ASKED_FOR_AMENDMENT',
  'ASKED_FOR_AMENDMENT_PAYMENT',
];

export default function OldProposalTable() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSort,
    total,
    setTotal,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { track_list } = useSelector((state) => state.proposal);

  const [tableData, setTableData] = useState<Array<OldProposalsList>>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [projectName, setProjectName] = useState('');

  const [projectStatus, setProjectStatus] = React.useState<string[]>([]);

  const [projectTrack, setProjectTrack] = React.useState<string[]>([]);

  const handleSelectedStatus = (event: SelectChangeEvent<typeof projectStatus>) => {
    const {
      target: { value },
    } = event;
    setProjectStatus(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleSelectedTrack = (event: SelectChangeEvent<typeof projectTrack>) => {
    const {
      target: { value },
    } = event;
    setProjectTrack(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleChange = (name: string) => {
    if (name) {
      setProjectName(name);
    } else {
      setProjectName('');
    }
  };

  const getDataClient = async () => {
    const url = 'tender-proposal/old/list';
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': activeRole! },
        params: {
          page: page + 1,
          limit: rowsPerPage,
          track_id: projectTrack.length > 0 ? projectTrack.join(',') : undefined,
          status: projectStatus.length > 0 ? projectStatus.join(',') : undefined,
          project_name: projectName || undefined,
        },
      });
      if (response.data.statusCode === 200) {
        setTableData(
          response.data.data.map((item: any, index: any) => ({
            id: item.id,
            project_name: item.project_name ?? 'No Record',
            project_number: generateHeader(
              item && item.project_number && item.project_number ? item.project_number : item.id
            ),
            employee_name: item.user.employee_name ?? 'No Record',
          }))
        );
        setTotal(response.data.total as number);
      }
    } catch (error) {
      console.log({ error });
      return <>...Opss, something went wrong</>;
    } finally {
      setIsLoading(false);
      onChangePage(null, 0);
    }
  };

  useEffect(() => {
    getDataClient();
    // eslint-disable-next-line
  }, [page, rowsPerPage, projectName, projectStatus, projectTrack]);

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ marginBottom: '50px' }}>
        {translate('old_proposal.page_title')}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
        <FormControl size="small" sx={{ m: 1, width: 200 }}>
          <InputLabel id="demo-multiple-checkbox-label">
            {translate('search_component.by_project_status')}
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={projectStatus}
            onChange={handleSelectedStatus}
            input={<OutlinedInput label={translate('search_component.by_project_status')} />}
            // renderValue={(selected) => selected.join(', ')}
            renderValue={(selected) => {
              const newSelected = selected.map((item) =>
                translate(`portal_report.outter_status.${item.toLowerCase()}`)
              );
              return newSelected.join(', ');
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            {status.map((item) => (
              <MenuItem key={item} value={item}>
                <Checkbox checked={projectStatus.indexOf(item) > -1} />
                <ListItemText
                  primary={translate(`portal_report.outter_status.${item.toLowerCase()}`)}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ m: 1, width: 200 }}>
          <InputLabel id="demo-multiple-checkbox-label">
            {translate('search_component.by_track_name')}
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            value={projectTrack}
            onChange={handleSelectedTrack}
            input={<OutlinedInput label={translate('search_component.by_track_name')} />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            {track_list.map((track) => (
              <MenuItem key={track.id} value={track.id}>
                <Checkbox checked={projectTrack.indexOf(track.id) > -1} />
                {formatCapitalizeText(track?.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <SearchbarTable onSearch={(data: string) => handleChange(data)} />
      </Stack>
      <Card sx={{ backgroundColor: '#fff', mt: 2 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
              />

              <TableBody>
                {isLoading
                  ? [...Array(rowsPerPage)].map((item, index) => <TableSkeleton key={index} />)
                  : tableData.map((row) => <OldProposalTableRow key={row.id} row={row} />)}
                {!isLoading && tableData.length === 0 && (
                  <EmptyContent
                    title="لا يوجد بيانات"
                    sx={{
                      '& span.MuiBox-root': { height: 160 },
                    }}
                  />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Box>
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------
