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

const TABLE_HEAD = [
  { id: 'project_number', label: 'old_proposal.headercell.project_number' },
  {
    id: 'project_name',
    label: 'old_proposal.headercell.project_name',
    align: 'left',
  },
  // {
  //   id: 'employee_name',
  //   label: 'old_proposal.headercell.employee_name',
  //   align: 'left',
  // },
  { id: 'events', label: 'client_list_headercell.events', align: 'left' },
];

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

const status = [
  'Pending',
  'Canceled',
  'Completed',
  'Ongoing',
  'On Revision',
  'Asked for Amandement',
];

const tracks = ['Mosques', 'Concessional grants', 'Initiatives', 'Baptisms'];

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
  const [sortOrder, setSortOrder] = useState<any>({ employee_name: 'asc' });

  // const [{ data, fetching, error }, mutate] = useQuery({
  //   query: allClientData,
  //   variables: {
  //     limit: rowsPerPage,
  //     offset: page * rowsPerPage,
  //     order_by: sortOrder,
  //   },
  // });

  const [tableData, setTableData] = useState<Array<OldProposalsList>>([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [isLoading, setIsLoading] = useState(false);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const [sortValue, setSortValue] = useState<string>('employee_name asc');

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

  const sortOptions = [
    {
      value: 'employee_name asc',
      // title: 'Client Name (ASC)',
      title: translate('table_filter.sortby_options.client_name_az'),
    },
    {
      value: 'employee_name desc',
      // title: 'Client Name (DESC)',
      title: translate('table_filter.sortby_options.client_name_za'),
    },
    {
      value: 'email asc',
      // title: 'Email (ASC)',
      title: translate('table_filter.sortby_options.email_az'),
    },
    {
      value: 'email desc',
      // title: 'Email (DESC)',
      title: translate('table_filter.sortby_options.email_za'),
    },
    {
      value: 'governorate asc',
      // title: 'governorate (ASC)',
      title: translate('table_filter.sortby_options.governorate_az'),
    },
    {
      value: 'governorate desc',
      // title: 'governorate (DESC)',
      title: translate('table_filter.sortby_options.governorate_za'),
    },
  ];

  const handleChange = (name: string) => {
    setProjectName(`&project_name=${name}`);
    let project_name: string = `&project_name=${name}`;
    const filterStatus = projectStatus.map((status) => {
      if (status === 'Pending') {
        return `PENDING`;
      } else if (status === 'Canceled') {
        return `CANCELED`;
      } else if (status === 'Completed') {
        return `COMPLETED`;
      } else if (status === 'Ongoing') {
        return `ONGOING`;
      } else if (status === 'On Revision') {
        return `ON_REVISION`;
      } else if (status === 'Asked for Amandement') {
        return `ASKED_FOR_AMANDEMENT`;
      }
      return false;
    });

    const filterTracks = projectTrack.map((track) => {
      if (track === 'Mosques') {
        return `MOSQUES`;
      } else if (track === 'Concessional grants') {
        return `CONCESSIONAL_GRANTS`;
      } else if (track === 'Initiatives') {
        return `INITIATIVES`;
      } else if (track === 'Baptisms') {
        return `BAPTISMS`;
      }
      return false;
    });

    const statusParams = filterStatus.map((status: any) => `outter_status=${status}`);
    const trackParams = filterTracks.map((track: any) => `project_track=${track}`);
    const joinFilterStatus = statusParams.join('&');
    const joinFilterTrack = trackParams.join('&');

    if (name && projectTrack.length > 0 && projectStatus.length > 0) {
      setProjectName(`${project_name}&${joinFilterStatus}&${joinFilterTrack}`);
    } else if (name && projectStatus.length > 0) {
      setProjectName(`${project_name}&${joinFilterStatus}`);
    } else if (name && projectTrack.length > 0) {
      setProjectName(`${project_name}&${joinFilterTrack}`);
    } else if (name) {
      setProjectName(project_name);
    } else {
      setProjectName('');
    }
    setPage(0);
  };

  const getDataClient = async () => {
    let currentPage = page + 1;
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        // `tender/client/proposal/list?page=${currentPage}&limit=${rowsPerPage}`,
        `tender-proposal/old/list?limit=${rowsPerPage}&page=${currentPage}${projectName}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (response.data.statusCode === 200) {
        setTableData(
          response.data.data.map((item: any, index: any) => ({
            id: item.id,
            project_name: item.project_name ?? 'No Record',
            project_number: generateHeader(
              item && item.project_number && item.project_number ? item.project_number : item.id
            ),
            employee_name: item.user.employee_name ?? 'No Record',
            // client_name: item.employee_name,
            // email: item.email,
            // number_phone: item.mobile_number,
            // governorate: item.governorate,
            // user_id: item.id,
            // total_proposal: item.proposal_count,
          }))
        );
        setTotal(response.data.total as number);
        setIsLoading(false);
      }
      return response.data;
    } catch (error) {
      setIsLoading(false);
      return <>...Opss, something went wrong</>;
    }
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
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

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleSortData = (event: any) => {
    const { value } = event.target;
    setSortValue(event.target.value as string);
    const [key, order] = value.split(' ');
    if (key === 'governorate') {
      const newOrder = { client_data: { [key]: order } };
      setSortOrder(newOrder);
    } else {
      const newOrder = { [key]: order };

      setSortOrder(newOrder);
    }
  };

  useEffect(() => {
    getDataClient();
    // mutate();
    // eslint-disable-next-line
  }, [page, rowsPerPage, orderBy, projectName]);

  // if (error) return <>...Opss, something went wrong</>;

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
            renderValue={(selected) => selected.join(', ')}
          >
            {status.map((item) => (
              <MenuItem key={item} value={item}>
                <Checkbox checked={projectStatus.indexOf(item) > -1} />
                <ListItemText
                  primary={translate(
                    `outter_status.${item.replace(/ /g, '_').toUpperCase()}`
                  ).toLowerCase()}
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
            multiple
            value={projectTrack}
            onChange={handleSelectedTrack}
            input={<OutlinedInput label={translate('search_component.by_track_name')} />}
            renderValue={(selected) => selected.join(', ')}
          >
            {tracks.map((track) => (
              <MenuItem key={track} value={track}>
                <Checkbox checked={projectTrack.indexOf(track) > -1} />
                <ListItemText
                  primary={translate(`${track.replace(/ /g, '_').toUpperCase()}`).toLowerCase()}
                />
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
                  : dataFiltered.map((row) => (
                      <OldProposalTableRow
                        key={row.id}
                        row={row}
                        // selected={selected.includes(row?.user_id)}
                        // onSelectRow={() => onSelectRow(row?.user_id)}
                      />
                    ))}
                {!isLoading && dataFiltered.length === 0 && <TableNoData isNotFound={isNotFound} />}
                {/* {isNotFound && <TableNoData isNotFound={isNotFound} />} */}
                {/* <TableEmptyRows height={denseHeight} emptyRows={0} /> */}
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

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: OldProposalsList[];
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
