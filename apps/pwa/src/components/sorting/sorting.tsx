import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import axiosInstance from 'utils/axios';

type SortingCardTableProps = {
  // handleSorting: ((event: SelectChangeEvent<string>, child: ReactNode) => void) | undefined;
  isLoading?: boolean;
  loadingState: (loading: boolean) => void;
  api: string;
  returnData: (data: any) => void;
  limit: number;
  type?: 'incoming' | 'inprocess';
  page?: number;
  typeRequest?: string;
  addCustomFilter?: '&vat=false' | '&vat=true' | '&status=PENDING' | undefined;
};

export default function SortingCardTable({
  // handleSorting,
  isLoading,
  api,
  limit = 4,
  type,
  page,
  typeRequest,
  loadingState,
  returnData,
  addCustomFilter,
}: SortingCardTableProps) {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [filterSorting, setFilterSorting] = React.useState('');
  const [limitPage, setLimitPage] = React.useState<string>(`?limit=${limit}`);
  const [typeFilter, setTypeFilter] = React.useState(
    type || typeRequest ? `&type=${type ?? typeRequest}` : ''
  );
  const [pageFilter, setPageFilter] = React.useState(page ? `&page=${page}` : '');
  const [tmpAddCustomFilter, setTmpAddCustomFilter] = React.useState(addCustomFilter || '');
  // const [isLoading, setIsLoading] = React.useState(false);

  const handleSortingFilter = (event: any) => {
    // console.log('test masuk sini');
    const value = event.target.value as number;
    let tmpFilter = '';
    if (value < 3) {
      tmpFilter = '&sorting_field=project_name';
      if (value === 1) {
        tmpFilter = '&sorting_field=project_name&sort=asc';
      } else {
        tmpFilter = '&sorting_field=project_name&sort=desc';
      }
    } else {
      if (value === 3) {
        tmpFilter = '&sort=asc';
      } else {
        tmpFilter = '&sort=desc';
      }
    }
    if (!!tmpFilter) {
      setFilterSorting(tmpFilter);
    }
  };

  const fetching = React.useCallback(async () => {
    loadingState(true);
    // setIsLoading(true);

    try {
      const rest = await axiosInstance.get(
        `${api}${limitPage}${typeFilter}${filterSorting}${pageFilter}${tmpAddCustomFilter}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        const cardData = rest.data.data.map((item: any) => ({
          ...item,
        }));
        returnData(cardData);
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    } finally {
      // setIsLoading(false);
      loadingState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar, api, filterSorting]);

  React.useEffect(() => {
    fetching();
  }, [fetching]);
  return (
    // <Grid
    //   item
    //   md={4}
    //   xs={12}
    //   sx={{
    //     display: 'flex',
    //     justifyContent: 'flex-end',
    //     alignItems: 'center',
    //   }}
    // >

    // </Grid>
    <FormControl sx={{ minWidth: 120, paddingBottom: 2 }}>
      <InputLabel htmlFor="grouped-select">{translate('sorting.label.sorting')}</InputLabel>
      <Select
        defaultValue=""
        id="grouped-select"
        label="Sorting"
        onChange={handleSortingFilter}
        disabled={isLoading}
      >
        <MenuItem value="">
          {/* <em>None</em> */}
          {/* No Sorting */}
          {translate('sorting.label.no_sorting')}
        </MenuItem>
        <ListSubheader
          sx={{
            backgroundColor: '#fff',
          }}
        >
          {/* Project Name */}
          {translate('sorting.label.project_name')}
        </ListSubheader>
        <MenuItem value={1}>{translate('sorting.label.ascending')}</MenuItem>
        <MenuItem value={2}>{translate('sorting.label.descending')}</MenuItem>
        <ListSubheader
          sx={{
            backgroundColor: '#fff',
          }}
        >
          {/* Created At */}
          {translate('sorting.label.created_at')}
        </ListSubheader>
        <MenuItem value={3}>{translate('sorting.label.ascending')}</MenuItem>
        <MenuItem value={4}>{translate('sorting.label.descending')}</MenuItem>
      </Select>
    </FormControl>
  );
}
