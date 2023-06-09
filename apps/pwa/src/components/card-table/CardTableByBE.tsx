import { Grid, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import SortingCardTable from 'components/sorting/sorting';
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
  addCustomFilter = '',
}: // isIncoming = false,
CardTablePropsByBE) {
  // const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);
  const [cardData, setCardData] = useState([]);
  const [limit, setLimit] = useState(limitShowCard);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  // const [filterSorting, setFilterSorting] = useState('');

  const fetchingPrevious = React.useCallback(async () => {
    setIsLoading(true);
    let url = '';
    if (!typeRequest) {
      url = `${endPoint}?limit=${limit}&page=${page}`;
    } else {
      url = `${endPoint}?limit=${limit}&page=${page}&type=${typeRequest}`;
    }
    try {
      const rest = await axiosInstance.get(`${url}${addCustomFilter}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        const tmpTotalPage = Math.ceil(rest.data.total / limit);
        // console.log('rest.data.data', rest.data.data);
        setTotalPage(tmpTotalPage);
        setCardData(
          rest.data.data.map((item: any) => ({
            ...item,
          }))
        );
      }
    } catch (err) {
      // console.log('err', err);
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
      // handle error fetching
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
  }, [activeRole, enqueueSnackbar, endPoint, limit, page, typeRequest]);

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
    <Grid container spacing={2}>
      <Grid item md={8} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>
      <Grid
        item
        md={4}
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <SortingCardTable
          isLoading={isLoading}
          limit={limit}
          page={page}
          typeRequest={typeRequest}
          api={!typeRequest ? `${endPoint}` : `${endPoint}`}
          returnData={setCardData}
          loadingState={setIsLoading}
        />
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
              cardFooterButtonAction={cardFooterButtonAction}
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
