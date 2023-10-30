import { Box, Button, Grid, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import SearchDateField from 'components/sorting/date-filter';
import SearchField from 'components/sorting/searchField';
import SortingCardTable from 'components/sorting/sorting';
import SortingProjectStatusCardTable from 'components/sorting/sorting-project-status';
import SortingProjectTrackCardTable from 'components/sorting/sorting-project-track';
import SvgIconStyle from 'components/SvgIconStyle';
import { FEATURE_PREVIOUS_PROPOSAL_FILTER } from 'config';
import dayjs from 'dayjs';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { getTrackList } from 'redux/slices/proposal';
import { dispatch, useSelector } from 'redux/store';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../utils/axios';
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
}: // isIncoming = false,
CardTablePropsByBE) {
  // const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const navigate = useNavigate();

  // redux
  const { loadingProps, track_list } = useSelector((state) => state.proposal);
  // console.log({ track_list });
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
          // params: {
          //   include_relations: 'client_data',
          // },
        }
      );
      if (rest) {
        const tmpTotalPage = Math.ceil(rest.data.total / limit);
        setTotalPage(tmpTotalPage);
        if (destination === 'incoming-amandment-requests') {
          setCardData(
            rest.data.data.map((item: any) => ({
              ...item.proposal,
              user: item.proposal.user,
            }))
          );
        } else {
          setCardData(
            rest.data.data.map((item: any) => ({
              ...item,
            }))
          );
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
    sortingRangedDate.filter,
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
      }
    }
  };

  // console.log({ sortingRangedDate });

  React.useEffect(() => {
    dispatch(getTrackList(1, activeRole! as string));
  }, [activeRole]);

  React.useEffect(() => {
    fetchingPrevious();
  }, [fetchingPrevious, page, limit]);

  if (loadingProps.laodingTrack) {
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
            label={translate('sorting.label.project_name')}
            onReturnSearch={(value) => {
              setSearchName(`&project_name=${value}`);
            }}
            reFetch={() => {
              setPage(1);
              setSearchName('');
              // if (reFetch) reFetch();
            }}
            fullWidth
            // sx={{ width: '250px' }}
          />
        </Grid>
      ) : null}
      <Grid item md={12} xs={12}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item md={2} xs={6}>
            <SortingCardTable
              isLoading={isLoading}
              onChangeSorting={(event: string) => {
                setPage(1);
                setSortingFilter(event);
              }}
            />
          </Grid>

          {destination === 'previous-funding-requests' ? (
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
              {/* <Grid item md={2} xs={6}>
                <SearchDateField
                  fullWidth
                  disabled={isLoading}
                  label={translate('sorting.label.start_project_date')}
                  focused={true}
                  onReturnDate={(event: string) => {
                    setPage(1);
                    if (event && event !== '') {
                      setStartDate(`&start_date=${event}`);
                    } else {
                      setStartDate('');
                    }
                  }}
                />
              </Grid> */}
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
          ) : null}
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
      <Grid item md={12} xs={12}>
        <Grid container spacing={2} justifyContent="flex-end">
          {destination === 'previous-funding-requests' || destination === 'project-report' ? (
            <>
              <Grid item md={2} xs={6}>
                <SearchDateField
                  fullWidth
                  disabled={isLoading}
                  label={translate('sorting.label.range_start_date')}
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
            </>
          ) : null}
        </Grid>
      </Grid>
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
              // cardFooterButtonAction={cardFooterButtonAction}
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
