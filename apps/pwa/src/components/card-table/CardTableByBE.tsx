import { Box, Button, Grid, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import SearchDateField from 'components/sorting/date-filter';
import SearchField from 'components/sorting/searchField';
import SortingCardTable, { onChangeSorting } from 'components/sorting/sorting';
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
import { getNewestDate } from 'utils/formatTime';
import { FEATURE_MENU_ADMIN_APLICATION_ADMISSION } from '../../config';
import useAuth from '../../hooks/useAuth';
import { getApplicationAdmissionSettings } from '../../redux/slices/applicationAndAdmissionSettings';
import axiosInstance from '../../utils/axios';
import { CheckIsInProcessProposal } from '../../utils/checkIsInProcessProposal';
import { getValueLocalStorage } from '../../utils/getFileData';
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
  onSearch = false,
}: // isIncoming = false,
CardTablePropsByBE) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const navigate = useNavigate();

  // redux
  const { loadingProps } = useSelector((state) => state.proposal);
  // selector for applicationAndAdmissionSettings
  const { isLoading: isFetchingData, error: errorFetchingData } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );

  // loading state when fetching
  const [isLoading, setIsLoading] = React.useState(false);

  // cards Data state
  const [cardData, setCardData] = useState([]);

  // for pagination
  const [limit, setLimit] = useState(limitShowCard);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  // for filtering
  const [searchName, setSearchName] = useState('');
  const [clientName, setClientName] = useState('');
  const [sortingRangedDate, setSortingRangedDate] = useState({
    startDate: '',
    endDate: '',
  });
  const [sortingFilter, setSortingFilter] = useState({
    sorting_field: '',
    sort: '',
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('');

  // localstorage variable
  const filter_sorting_field = getValueLocalStorage('filter_sorting_field') || undefined;
  const filter_sort = getValueLocalStorage('filter_sort') || undefined;
  const filter_project_name = getValueLocalStorage('filter_project_name') || undefined;
  const filter_client_name = getValueLocalStorage('filter_client_name') || undefined;
  const filter_project_track = getValueLocalStorage('filter_project_track') || undefined;
  const filter_project_status = getValueLocalStorage('filter_project_status') || undefined;
  const filter_range_start_date = getValueLocalStorage('filter_range_start_date') || undefined;
  const filter_range_end_date = getValueLocalStorage('filter_range_end_date') || undefined;

  const fetchingPrevious = React.useCallback(async () => {
    setIsLoading(true);
    const url = endPoint;
    const prevProposalParams = {
      sorting_field: sortingFilter?.sorting_field || filter_sorting_field || 'updated_at',
      sort: sortingFilter?.sort || filter_sort || 'desc',
      project_name: searchName || filter_project_name || undefined,
      client_name: clientName || filter_client_name || undefined,
      track_id: trackFilter || filter_project_track || undefined,
      outter_status: statusFilter || filter_project_status || undefined,
      range_start_date: sortingRangedDate?.startDate || filter_range_start_date || undefined,
      range_end_date: sortingRangedDate?.endDate || filter_range_end_date || undefined,
    };
    try {
      const rest = await axiosInstance.get(`${url}`, {
        headers: { 'x-hasura-role': activeRole! },
        params: {
          type: typeRequest || undefined,
          page,
          limit,
          ...(addCustomFilter ? addCustomFilter : undefined),
          ...(destination === 'previous-funding-requests' && prevProposalParams),
        },
      });
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
        setSortingRangedDate({ startDate: '', endDate: '' });
        localStorage.removeItem('filter_range_start_date');
        return;
      } else {
        setSortingRangedDate({ ...sortingRangedDate, startDate: event, endDate: '' });
        localStorage.setItem('filter_range_start_date', event);
      }
    } else {
      if (event === '') {
        setSortingRangedDate({ ...sortingRangedDate, endDate: '' });
        localStorage.removeItem('filter_range_end_date');
        return;
      } else {
        const tmpNewEndDate = dayjs(event).add(1, 'day').format('YYYY-MM-DD');
        localStorage.setItem('filter_range_end_date', tmpNewEndDate);
        setSortingRangedDate({ ...sortingRangedDate, endDate: event });
      }
    }
  };

  const handleSortingFilter = (event: onChangeSorting) => {
    setPage(1);
    setSortingFilter(event);
    if (event.sorting_field) {
      localStorage.setItem('filter_sorting_field', event.sorting_field);
    } else {
      localStorage.removeItem('filter_sorting_field');
    }
    if (event.sort) {
      localStorage.setItem('filter_sort', event.sort);
    } else {
      localStorage.removeItem('filter_sort');
    }
  };

  const handleSortingTrack = (event: string) => {
    if (event !== '-') {
      const trackId = event.split('=')[1];
      setPage(1);
      setTrackFilter(trackId);
      localStorage.setItem('filter_project_track', trackId);
    } else {
      setPage(1);
      setTrackFilter('');
      localStorage.removeItem('filter_project_track');
    }
  };

  const handleSortingProjectStatus = (event: string) => {
    if (event !== '-') {
      const outterStatus = event.split('=')[1];
      setPage(1);
      setStatusFilter(outterStatus);
      localStorage.setItem('filter_project_status', outterStatus);
    } else {
      setPage(1);
      setStatusFilter('');
      localStorage.removeItem('filter_project_status');
    }
  };

  React.useEffect(() => {
    dispatch(getTrackList(1, activeRole! as string));
    dispatch(getApplicationAdmissionSettings(activeRole!));
  }, [activeRole]);

  React.useEffect(() => {
    fetchingPrevious();
  }, [fetchingPrevious, page, limit]);

  if (loadingProps.laodingTrack || isLoading || isFetchingData) {
    return <CardTableLoading />;
  }
  if (errorFetchingData && FEATURE_MENU_ADMIN_APLICATION_ADMISSION)
    return (
      <EmptyContent
        title="لا يوجد بيانات"
        img="/assets/icons/confirmation_information.svg"
        description={`${translate('errors.something_wrong')}`}
        errorMessage={errorFetchingData?.message || undefined}
        sx={{
          '& span.MuiBox-root': { height: 160 },
        }}
      />
    );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack component="div" direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{title}</Typography>
          {!navigateLink ? null : (
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
          )}
        </Stack>
      </Grid>
      {destination === 'previous-funding-requests' ? (
        <Grid item md={12} xs={12}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item md={3} xs={12}>
              <SearchField
                data-cy="search_field"
                isLoading={isLoading}
                value={searchName || filter_project_name}
                label={translate('sorting.label.project_name')}
                onReturnSearch={(value) => {
                  setSearchName(value);
                  localStorage.setItem('filter_project_name', value);
                }}
                reFetch={() => {
                  setPage(1);
                  setSearchName('');
                  localStorage.removeItem('filter_project_name');
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      ) : null}
      <Grid item md={12} xs={12}>
        <Grid container spacing={2} justifyContent="flex-end">
          {sorting.includes('sorting') && (
            <Grid item md={2} xs={6}>
              <SortingCardTable
                isLoading={isLoading}
                value={
                  (filter_sorting_field &&
                    filter_sort &&
                    `${filter_sorting_field}_${filter_sort}`) ||
                  (sortingFilter?.sorting_field &&
                    sortingFilter?.sort &&
                    `${sortingFilter?.sorting_field}_${sortingFilter?.sort}`) ||
                  'updated_at_desc'
                }
                newOnChangeSorting={handleSortingFilter}
              />
            </Grid>
          )}

          {sorting.includes('track') && (
            <Grid item md={2} xs={6}>
              <SortingProjectTrackCardTable
                isLoading={isLoading}
                value={trackFilter || filter_project_track || '-'}
                type="multiple"
                onChangeSorting={handleSortingTrack}
              />
            </Grid>
          )}

          {sorting.includes('project_status') && (
            <Grid item md={2} xs={6}>
              <SortingProjectStatusCardTable
                isLoading={isLoading}
                value={statusFilter || filter_project_status || '-'}
                type="multiple"
                onChangeSorting={handleSortingProjectStatus}
              />
            </Grid>
          )}

          {sorting.includes('client_name') && (
            <Grid item md={3} xs={6}>
              <SearchField
                fullWidth
                isLoading={isLoading}
                value={clientName || filter_client_name}
                data-cy="search_client_name_field"
                label={translate('client_list_headercell.client_name')}
                onReturnSearch={(value) => {
                  setClientName(value);
                  localStorage.setItem('filter_client_name', value);
                }}
                reFetch={() => {
                  setPage(1);
                  setClientName('');
                  localStorage.removeItem('filter_client_name');
                }}
              />
            </Grid>
          )}
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
                value={sortingRangedDate?.startDate || filter_range_start_date}
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
                disabled={(!sortingRangedDate.startDate && !filter_range_end_date) || isLoading}
                label={
                  sortingRangedDate.startDate === '' || sortingRangedDate.startDate === null
                    ? null
                    : translate('sorting.label.range_end_date')
                }
                value={sortingRangedDate.endDate || filter_range_end_date}
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
        cardData.map((item: any, index: any) => {
          const isInProcess = CheckIsInProcessProposal(item, activeRole!);
          return (
            <Grid item key={index} sm={6} xs={12}>
              <ProjectTableBE
                {...item}
                updated_at={getNewestDate(
                  item?.proposal_logs[item?.proposal_logs?.length - 1]?.updated_at ||
                    new Date('10-10-2022').toISOString(),
                  item?.updated_at
                )}
                inquiryStatus={item.outter_status === 'PENDING_CANCELED' ? 'canceled' : null}
                created_at={new Date(item.created_at)}
                cardFooterButtonAction={
                  !onSearch
                    ? destination === 'incoming-amandment-requests' &&
                      item.outter_status === 'ASKED_FOR_AMANDEMENT'
                      ? 'show-details'
                      : cardFooterButtonAction
                    : onSearch && isInProcess
                    ? (item.outter_status !== 'PENDING_CANCELED' && 'show-details') ||
                      (item.outter_status === 'PENDING_CANCELED' && 'reject-project')
                    : cardFooterButtonAction
                }
                destination={
                  !onSearch
                    ? destination
                    : isInProcess
                    ? (activeRole !== 'tender_consultant' && 'requests-in-process') ||
                      (activeRole === 'tender_consultant' && 'incoming-funding-requests')
                    : 'current-project'
                }
              />
            </Grid>
          );
        })}

      {!isLoading && cardData.length === 0 && (
        <Grid item xs={12}>
          {activeRole !== 'tender_client' ? (
            <EmptyContent
              title="لا يوجد بيانات"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          ) : destination === 'current-project' ? (
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
