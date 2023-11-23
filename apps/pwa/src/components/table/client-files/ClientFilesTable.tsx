import React, { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
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
import TableSkeleton from '../TableSkeleton';
import ClientFilesRow from './ClientFilesRow';
import { ClientFiles } from './types';

const TABLE_HEAD = [
  { id: 'file_name', label: 'client_files.headercell.file_name', align: 'left' },
  {
    id: 'section_name',
    label: 'client_files.headercell.section_name',
    align: 'left',
  },
  { id: 'download', label: 'client_files.headercell.download', align: 'center' },
  { id: 'view', label: 'client_files.headercell.view', align: 'center' },
];

const status = [
  'Pending',
  'Canceled',
  'Completed',
  'Ongoing',
  'On Revision',
  'Asked for Amandement',
];

export default function ClientFilesTable() {
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
  } = useTable({
    defaultRowsPerPage: 10,
  });

  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const [sortOrder, setSortOrder] = useState<any>({ employee_name: 'asc' });

  const [tableData, setTableData] = useState<Array<ClientFiles>>([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [isLoading, setIsLoading] = useState(false);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const [sortValue, setSortValue] = useState<string>('employee_name asc');

  const [fileFilter, setFileFilter] = useState('');

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
    setFileFilter(`&file_name=${name}`);
    let project_name: string = `&file_name=${name}`;
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
      setFileFilter(`${project_name}&${joinFilterStatus}&${joinFilterTrack}`);
    } else if (name && projectStatus.length > 0) {
      setFileFilter(`${project_name}&${joinFilterStatus}`);
    } else if (name && projectTrack.length > 0) {
      setFileFilter(`${project_name}&${joinFilterTrack}`);
    } else if (name) {
      setFileFilter(project_name);
    } else {
      setFileFilter('');
    }
    setPage(0);
  };

  const getDataClient = async () => {
    let currentPage = page + 1;
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `tender/file-manager/fetch-all?limit=${rowsPerPage}&page=${currentPage}${fileFilter}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (response.data.statusCode === 200) {
        setTableData(
          response.data.data.map((item: any, index: any) => ({
            id: item.id,
            file_name: item.name,
            link: item.url,
            type: item.mimetype,
            section_name: (item && item.column_name && item.column_name) ?? 'No Record',
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
    // eslint-disable-next-line
  }, [page, rowsPerPage, orderBy, fileFilter]);

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        {translate('client_files.title')}
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: 60,
          borderRadius: 0.7,
          backgroundColor: '#E4E9EF',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" sx={{ flexGrow: 1, ml: 3, color: '#118C7E' }}>
          {translate('client_files.administrative_data')}
        </Typography>
      </Box>
      <Typography variant="h3" gutterBottom sx={{ my: 4 }}>
        {translate('client_files.title_read_only')}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
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
                  : dataFiltered.map((row) => <ClientFilesRow key={row.id} row={row} />)}
                {!isLoading && dataFiltered.length === 0 && <TableNoData isNotFound={isNotFound} />}
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
  tableData: ClientFiles[];
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
