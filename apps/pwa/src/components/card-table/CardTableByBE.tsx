import { Box, Button, Grid, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import SearchDateField from 'components/sorting/date-filter';
import SearchField from 'components/sorting/searchField';
import SortingCardTable from 'components/sorting/sorting';
import SortingProjectStatusCardTable from 'components/sorting/sorting-project-status';
import SortingProjectTrackCardTable from 'components/sorting/sorting-project-track';
import SvgIconStyle from 'components/SvgIconStyle';
import dayjs from 'dayjs';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { getTrackList } from 'redux/slices/proposal';
import { dispatch, useSelector } from 'redux/store';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../utils/axios';
import { getSortingValue } from '../../utils/formatNumber';
import CardTableLoading from './CardTableLoading';
import ProjectTableBE from './ProjectCardBE';
import { CardTablePropsByBE } from './types';

function CardTableByBE({
  title,
  endPoint,
  limitShowCard = 6,
  cardFooterButtonAction,
  destination,
  typeRequest,
  addCustomFilter,
  navigateLink,
  showPagination = true,
  sorting = ['sorting'],
}: // isIncoming = false,
CardTablePropsByBE) {
  // const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const navigate = useNavigate();

  // redux
  const { loadingProps } = useSelector((state) => state.proposal);
  // console.log({ track_list });
  // loading state when fetching
  const [isLoading, setIsLoading] = React.useState(false);
  // cards Data state
  const [cardData, setCardData] = useState([]);
  const [tmpCardData, setTmpCardData] = useState([]);
  // for pagination
  const [limit, setLimit] = useState(limitShowCard);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  // for filtering
  const [searchName, setSearchName] = useState('');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [sortingRangedDate, setSortingRangedDate] = useState({
    startDate: '',
    endDate: '',
    filter: '',
  });
  const [sortingFilter, setSortingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  // const [filterSorting, setFilterSorting] = useState('');
  const tmpTypeRequest = `&type=${typeRequest}`;
  const endPointOrigin = `${endPoint}?limit=${limit}&page=${page}${addCustomFilter || ''}${
    (typeRequest && tmpTypeRequest) || ''
  }`;

  const fetchingPrevious = React.useCallback(async () => {
    setIsLoading(true);
    const url = endPointOrigin;
    try {
      const rest = await axiosInstance.get(
        `${url}${sortingFilter}${searchName}${statusFilter}${clientName}${startDate}${trackFilter}${sortingRangedDate.filter}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        const tmpTotalPage = Math.ceil(rest.data.total / limit);
        setTotalPage(tmpTotalPage);
        if (destination === 'incoming-amandment-requests') {
          const tmpValues = rest.data.data.map((item: any) => ({
            ...item.proposal,
            user: item.proposal.user,
          }));
          setCardData(tmpValues);
        } else {
          const tmpValue = rest.data.data.map((item: any) => ({
            ...item,
          }));
          setCardData(tmpValue);
        }
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeRole,
    enqueueSnackbar,
    endPoint,
    limit,
    page,
    typeRequest,
    searchName,
    sortingFilter,
    statusFilter,
    clientName,
    startDate,
    trackFilter,
    sortingRangedDate,
  ]);

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value as number);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const changeHandleRangeDate = (event: string, type: 'start' | 'end') => {
    if (type === 'start') {
      if (event === '') {
        setSortingRangedDate({ startDate: '', endDate: '', filter: '' });
        return;
      } else {
        setSortingRangedDate({ ...sortingRangedDate, startDate: event, endDate: '' });
      }
    } else {
      if (event === '') {
        setSortingRangedDate({ ...sortingRangedDate, endDate: '', filter: '' });
        return;
      } else {
        const tmpNewEndDate = dayjs(event).add(1, 'day').format('YYYY-MM-DD');
        const filter = `&range_start_date=${sortingRangedDate.startDate}&range_end_date=${tmpNewEndDate}`;
        setSortingRangedDate({ ...sortingRangedDate, endDate: event, filter: filter });
        localStorage.setItem('filter_date_range', filter);
      }
    }
  };

  React.useEffect(() => {
    // for date range filter
    const filter = localStorage.getItem('filter_date_range');
    const filterArr = localStorage.getItem('filter_date_range')?.split('&');
    const startDateStorage = (filterArr && filterArr[1]?.split('=')[1]) || '';
    const endDate = (filterArr && filterArr[2]?.split('=')[1]) || '';
    if (startDateStorage && endDate && filter) {
      setSortingRangedDate({ startDate: startDateStorage, endDate: endDate, filter: filter });
    }

    // for project name filter
    const projectName = localStorage.getItem('filter_project_name');
    if (projectName) {
      setSearchName(projectName);
    }
    // for client name filter
    const clientName = localStorage.getItem('filter_client_name');
    if (clientName) {
      setClientName(clientName);
    }

    // for project status filter
    const projectStatus = localStorage.getItem('filter_project_status');
    if (projectStatus) {
      setStatusFilter(projectStatus);
    }

    // for project track filter
    const projectTrack = localStorage.getItem('filter_project_track');
    if (projectTrack) {
      setTrackFilter(projectTrack);
    }
  }, []);

  React.useEffect(() => {
    dispatch(getTrackList(1, activeRole! as string));
  }, [activeRole]);

  React.useEffect(() => {
    fetchingPrevious();
  }, [fetchingPrevious, page, limit]);

  if (loadingProps.laodingTrack || isLoading) {
    return <CardTableLoading />;
  }

  return (
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item md={8} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>
      {destination === 'previous-funding-requests' ? (
        <Grid item md={3} xs={12}>
          <SearchField
            data-cy="search_field"
            isLoading={isLoading}
            value={searchName ? searchName.split('=')[1] : ''}
            label={translate('sorting.label.project_name')}
            onReturnSearch={(value) => {
              setSearchName(`&project_name=${value}`);
              localStorage.setItem('filter_project_name', `&project_name=${value}`);
            }}
            reFetch={() => {
              setPage(1);
              setSearchName('');
              localStorage.removeItem('filter_project_name');
            }}
            fullWidth
          />
        </Grid>
      ) : null}
      <Grid item md={12} xs={12}>
        <Grid container spacing={2} justifyContent="flex-end">
          {sorting.includes('sorting') && (
            <Grid item md={2} xs={6}>
              <SortingCardTable
                isLoading={isLoading}
                value={getSortingValue(sortingFilter)}
                onChangeSorting={(event: string) => {
                  setPage(1);
                  setSortingFilter(event);
                }}
              />
            </Grid>
          )}

          {/* {destination === 'previous-funding-requests' ? (
            <>
              {activeRole !== 'tender_project_manager' &&
              activeRole !== 'tender_project_supervisor' &&
              activeRole !== 'tender_cashier' &&
              activeRole !== 'tender_finance' ? (
                <Grid item md={2} xs={6}>
                  <SortingProjectTrackCardTable
                    isLoading={isLoading}
                    onChangeSorting={(event: string) => {
                      setPage(1);
                      setTrackFilter(event);
                    }}
                  />
                </Grid>
              ) : null}
              <Grid item md={2} xs={6}>
                <SortingProjectStatusCardTable
                  isLoading={isLoading}
                  onChangeSorting={(event: string) => {
                    setPage(1);
                    setStatusFilter(event);
                  }}
                />
              </Grid>
              {activeRole !== 'tender_client' ? (
                <Grid item md={3} xs={6}>
                  <SearchField
                    fullWidth
                    data-cy="search_client_name_field"
                    isLoading={isLoading}
                    label={translate('client_list_headercell.client_name')}
                    onReturnSearch={(value) => {
                      setClientName(`&client_name=${value}`);
                    }}
                    reFetch={() => {
                      setPage(1);
                      setClientName('');
                      // if (reFetch) reFetch();
                    }}
                  />
                </Grid>
              ) : null}
            </>
          ) : null} */}

          {sorting.includes('track') && (
            <Grid item md={2} xs={6}>
              <SortingProjectTrackCardTable
                isLoading={isLoading}
                value={trackFilter ? trackFilter.split('=')[1] : '-'}
                onChangeSorting={(event: string) => {
                  setPage(1);
                  setTrackFilter(event);
                  localStorage.setItem('filter_project_track', event);
                }}
              />
            </Grid>
          )}

          {sorting.includes('project_status') && (
            <Grid item md={2} xs={6}>
              <SortingProjectStatusCardTable
                isLoading={isLoading}
                value={statusFilter ? statusFilter.split('=')[1] : '-'}
                onChangeSorting={(event: string) => {
                  setPage(1);
                  setStatusFilter(event);
                  localStorage.setItem('filter_project_status', event);
                }}
              />
            </Grid>
          )}

          {sorting.includes('client_name') && (
            <Grid item md={3} xs={6}>
              <SearchField
                fullWidth
                isLoading={isLoading}
                value={clientName ? clientName.split('=')[1] : ''}
                data-cy="search_client_name_field"
                label={translate('client_list_headercell.client_name')}
                onReturnSearch={(value) => {
                  setClientName(`&client_name=${value}`);
                  localStorage.setItem('filter_client_name', `&client_name=${value}`);
                }}
                reFetch={() => {
                  setPage(1);
                  setClientName('');
                  localStorage.removeItem('filter_client_name');
                  // if (reFetch) reFetch();
                }}
              />
            </Grid>
          )}

          {navigateLink ? (
            <Grid item md={1} xs={6}>
              <Button
                sx={{
                  backgroundColor: 'transparent',
                  color: '#93A3B0',
                  textDecoration: 'underline',
                  ':hover': {
                    backgroundColor: 'transparent',
                  },
                }}
                onClick={() => {
                  navigate(navigateLink);
                }}
              >
                {translate('view_all')}
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
      {sorting.includes('range_date') && (
        <Grid item md={12} xs={12}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item md={2} xs={6}>
              <SearchDateField
                fullWidth
                disabled={isLoading}
                label={translate('sorting.label.range_start_date')}
                value={sortingRangedDate.startDate}
                focused={true}
                onReturnDate={(event: string) => {
                  setPage(1);
                  if (event && event !== '') {
                    changeHandleRangeDate(`${event}`, 'start');
                  } else {
                    changeHandleRangeDate('', 'start');
                  }
                }}
              />
            </Grid>
            <Grid item md={2} xs={6}>
              <SearchDateField
                fullWidth
                focused={true}
                disabled={
                  sortingRangedDate.startDate === '' ||
                  sortingRangedDate.startDate === null ||
                  isLoading
                }
                label={
                  sortingRangedDate.startDate === '' || sortingRangedDate.startDate === null
                    ? null
                    : translate('sorting.label.range_end_date')
                }
                value={sortingRangedDate.endDate}
                minDate={
                  sortingRangedDate.startDate
                    ? dayjs(sortingRangedDate.startDate).add(1, 'day').toISOString().split('T')[0]
                    : ''
                }
                onReturnDate={(event: string) => {
                  setPage(1);
                  if (event && event !== '') {
                    // const tmpNewEndDate = dayjs(event).add(1, 'day').format('YYYY-MM-DD');
                    changeHandleRangeDate(`${event}`, 'end');
                  } else {
                    changeHandleRangeDate('', 'end');
                  }
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      )}

      {isLoading && (
        <Grid item md={12} xs={12}>
          <CardTableLoading />
        </Grid>
      )}
      {!isLoading &&
        cardData.length > 0 &&
        cardData.map((item: any, index: any) => (
          <Grid item key={index} md={6} xs={12}>
            <ProjectTableBE
              {...item}
              inquiryStatus={item.outter_status === 'PENDING_CANCELED' ? 'canceled' : null}
              created_at={new Date(item.created_at)}
              cardFooterButtonAction={
                destination === 'incoming-amandment-requests' &&
                item.outter_status === 'ASKED_FOR_AMANDEMENT'
                  ? 'show-details'
                  : cardFooterButtonAction
              }
              destination={destination}
            />
          </Grid>
        ))}

      {!isLoading && cardData.length === 0 && (
        <Grid item md={12} xs={12}>
          {activeRole !== 'tender_client' ? (
            <EmptyContent
              title="لا يوجد بيانات"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          ) : destination === 'current-project' ? (
            <>
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                p="20px"
              >
                <Box sx={{ width: '100%' }}>
                  <Stack justifyItems="center">
                    <Box sx={{ textAlign: 'center' }}>
                      <SvgIconStyle src={`/icons/empty-project.svg`} />
                    </Box>
                    <Typography sx={{ textAlign: 'center' }}>
                      {translate('content.client.main_page.no_current_projects')}
                    </Typography>
                    <Button
                      sx={{
                        textAlign: 'center',
                        margin: '0 auto',
                        textDecorationLine: 'underline',
                      }}
                      onClick={() => {
                        navigate('/client/dashboard/funding-project-request');
                      }}
                    >
                      {translate('content.client.main_page.apply_new_support_request')}
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            </>
          ) : (
            <EmptyContent
              title="لا يوجد بيانات"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          )}
        </Grid>
      )}
      {!isLoading && cardData && showPagination && (
        <>
          {cardData.length > 0 ? (
            <Grid
              item
              md={12}
              xs={12}
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Pagination count={totalPage} page={page} onChange={handleChange} />
            </Grid>
          ) : null}
          <Grid
            item
            md={12}
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Stack direction="row">
              <Typography sx={{ padding: '13px' }}>عدد المشاريع المعروضة:</Typography>
              <Select
                labelId="simple-select"
                id="demo-simple-select"
                value={limit}
                onChange={handleLimitChange}
                sx={{
                  backgroundColor: '#fff !important',
                }}
              >
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </Stack>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default CardTableByBE;
