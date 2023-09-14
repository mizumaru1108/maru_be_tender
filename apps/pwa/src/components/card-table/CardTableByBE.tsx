import { Grid, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import SearchDateField from 'components/sorting/date-filter';
import SearchField from 'components/sorting/searchField';
import SortingCardTable from 'components/sorting/sorting';
import SortingProjectStatusCardTable from 'components/sorting/sorting-project-status';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../utils/axios';
import CardTableLoading from './CardTableLoading';
import CardTableNoData from './CardTableNoData';
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
}: // isIncoming = false,
CardTablePropsByBE) {
  // const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { activeRole } = useAuth();

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
  const [sortingFilter, setSortingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
        `${url}${sortingFilter}${searchName}${statusFilter}${clientName}${startDate}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        // console.log('rest.data.data', rest.data.data);
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
  ]);

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value as number);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  React.useEffect(() => {
    fetchingPrevious();
  }, [fetchingPrevious, page, limit]);

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
              <Grid item md={2} xs={6}>
                <SortingProjectStatusCardTable
                  isLoading={isLoading}
                  onChangeSorting={(event: string) => {
                    setPage(1);
                    setStatusFilter(event);
                  }}
                />
              </Grid>
              <Grid item md={2} xs={6}>
                <SearchDateField
                  fullWidth
                  isLoading={isLoading}
                  onReturnDate={(event: string) => {
                    setPage(1);
                    if (event && event !== '') {
                      setStartDate(`&start_date=${event}`);
                    } else {
                      setStartDate('');
                    }
                  }}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <SearchField
                  fullWidth
                  data-cy="search_field"
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
      {!isLoading && !cardData && (
        <Grid item md={12} xs={12}>
          <CardTableNoData />
        </Grid>
      )}
      {/* {!isLoading && cardData && cardData.length > 0 ? (
        cardData.map((item: any, index: any) => (
          <Grid item key={index} md={6} xs={12}>
            <ProjectTableBE
              {...item}
              created_at={new Date(item.created_at)}
              cardFooterButtonAction={cardFooterButtonAction}
              destination={destination}
            />
          </Grid>
        ))
      ) : (
        <Grid item md={12} xs={12}>
          <CardTableNoData />
        </Grid>
      )} */}
      {!isLoading && cardData && (
        <>
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
