import {
  FormControl,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../utils/axios';
import CardTableLoading from './CardTableLoading';
import CardTableNoData from './CardTableNoData';
import LoadingPage from './LoadingPage';
import ProjectTableBE from './ProjectCardBE';
import { CardTablePropsByBE } from './types';

function CardTableByBE({
  title,
  endPoint,
  limitShowCard = 6,
  cardFooterButtonAction,
  destination,
}: CardTablePropsByBE) {
  // const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);
  const [cardData, setCardData] = useState([]);
  const [limit, setLimit] = useState(limitShowCard);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [filterSorting, setFilterSorting] = useState('');

  const fetchingPrevious = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(
        `${endPoint}?limit=${limit}&page=${page}${filterSorting}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        const tmpTotalPage = Math.ceil(rest.data.total / limit);
        setTotalPage(tmpTotalPage);
        setCardData(
          rest.data.data.map((item: any) => ({
            ...item,
          }))
        );
      }
    } catch (err) {
      console.log('err', err);
      enqueueSnackbar(err.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, enqueueSnackbar, endPoint, limit, page, filterSorting]);

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value as number);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const handleSortingFilter = (event: any) => {
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
        {/* <Typography variant="h4">{title}</Typography> */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel htmlFor="grouped-select">Sorting</InputLabel>
          <Select
            defaultValue=""
            id="grouped-select"
            label="Sorting"
            onChange={handleSortingFilter}
            disabled={isLoading}
          >
            <MenuItem value="">
              {/* <em>None</em> */}
              No Sorting
            </MenuItem>
            <ListSubheader
              sx={{
                backgroundColor: '#fff',
              }}
            >
              Project Name
            </ListSubheader>
            <MenuItem value={1}>Acsending</MenuItem>
            <MenuItem value={2}>Descending</MenuItem>
            <ListSubheader
              sx={{
                backgroundColor: '#fff',
              }}
            >
              Created At
            </ListSubheader>
            <MenuItem value={3}>Acsending</MenuItem>
            <MenuItem value={4}>Descending</MenuItem>
          </Select>
        </FormControl>
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
