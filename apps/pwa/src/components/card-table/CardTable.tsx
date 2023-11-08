import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import useLocales from 'hooks/useLocales';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { getApplicationAdmissionSettings } from '../../redux/slices/applicationAndAdmissionSettings';
import { dispatch, useSelector } from '../../redux/store';
import EmptyContent from '../EmptyContent';
import FilterModal from './FilterModal';
import LoadingPage from './LoadingPage';
import ProjectCard from './ProjectCard';
import { CardTableProps } from './types';

function CardTable({
  resource,
  title,
  data,
  dateFilter,
  limitShowCard,
  alphabeticalOrder,
  pagination = true,
  filters,
  taps,
  cardFooterButtonAction,
}: CardTableProps) {
  // const [result, reexecuteQuery] = useQuery(resource);
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  const [page, setPage] = useState(1);
  // The params that will be used with the query later on
  const [params, setParams] = useState({
    limit: limitShowCard ? limitShowCard : 6,
    offset: 0,
    order_by: {},
  });

  // Redux
  const { isLoading: isFetchingData, error: errorFetchingData } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );

  // For the filter Modal
  const [open, setOpen] = useState(false);

  // For the Filter Modal
  const handleOpenFilter = () => setOpen(true);
  const handleCloseFilter = () => setOpen(false);

  // For the number of projects that are showed in a single page
  const handleLimitChange = (event: any) => {
    setParams((prevParams) => ({
      ...prevParams,
      limit: event.target.value as any,
    }));
  };

  // It is used for the number of the pages that are rendered
  const pagesNumber = Math.ceil(data.length / params.limit);

  // The data showed in a single page
  const dataSinglePage = data.slice(
    (page - 1) * params.limit,
    (page - 1) * params.limit + params.limit
  );

  // Later on we will use useEffect for re-render the page after every change for the data
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params, page]);

  useEffect(() => {
    dispatch(getApplicationAdmissionSettings(activeRole!));
  }, [activeRole]);

  if (isFetchingData) {
    return <LoadingPage />;
  }
  if (errorFetchingData)
    return (
      <>
        {' '}
        <EmptyContent
          title="لا يوجد بيانات"
          img="/assets/icons/confirmation_information.svg"
          description={`${translate('errors.something_wrong')}`}
          errorMessage={errorFetchingData?.message || undefined}
          sx={{
            '& span.MuiBox-root': { height: 160 },
          }}
        />
      </>
    );

  return (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <FilterModal open={open} handleClose={handleCloseFilter} filters={filters} />
      {taps && (
        <Grid item md={12} xs={12}>
          <Typography variant="h4">{title}</Typography>
        </Grid>
      )}
      {!taps && (
        <Grid item md={6} xs={12}>
          <Typography variant="h4" sx={{ padding: '10px' }}>
            {title}
          </Typography>
        </Grid>
      )}
      {/*  Taps Section */}
      {taps && (
        <Grid item md={6} xs={6}>
          <Stack direction="row" sx={{ height: '100%' }} gap={1}>
            {taps.map((label, index) => (
              <Button
                key={index}
                onClick={() => {
                  console.log('lkklasnklasn');
                }}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Grid>
      )}
      <Grid item md={6} xs={12}>
        <Stack direction="row" justifyContent="end" gap={1}>
          {/* Date Filter */}
          {dateFilter && (
            <Stack direction="row" flex={0.5}>
              <TextField type="date" />
              <Box sx={{ padding: '15px' }}>-</Box>
              <TextField type="date" />
            </Stack>
          )}
          {/* Optional Filters with thier options */}

          {/* Alpha-betical Order Filter */}
          {alphabeticalOrder && (
            <Stack direction="row" gap={1}>
              <Typography sx={{ textAlign: 'center', my: 'auto' }}>
                {translate('table_filter.sortby_title')}:
              </Typography>
              <Button endIcon={<img src="/icons/asc-order-icon.svg" alt="" />}>
                {translate('table_filter.sortby_options.project_name_az')}
              </Button>
            </Stack>
          )}
          {filters && (
            <Button
              sx={{ color: '#fff', backgroundColor: '#000' }}
              startIcon={<img alt="" src="/icons/filter-icon.svg" />}
              onClick={handleOpenFilter}
            >
              {translate('commons.filter_button_label')}
            </Button>
          )}
        </Stack>
      </Grid>
      {/* {dataSinglePage.map((item, index) => (
        <Grid item key={index} md={6} xs={12}>
          <ProjectCard {...item} cardFooterButtonAction={cardFooterButtonAction} />
        </Grid>
      ))} */}
      <Grid
        container
        rowSpacing={3}
        columnSpacing={2}
        sx={{
          mt: 1.5,
          height: dataSinglePage.length < 5 ? 800 : 'auto',
        }}
      >
        {dataSinglePage.length !== 0 &&
          dataSinglePage.map((item, index) => (
            <Grid item key={index} md={6} xs={12}>
              <ProjectCard {...item} cardFooterButtonAction={cardFooterButtonAction} />
            </Grid>
          ))}
      </Grid>

      {pagination && (
        <Grid item md={12} xs={12}>
          <Stack direction="row" gap={20}>
            <Box flex={1} />
            <Stack direction="row" flex={2} gap={1} justifyContent="center">
              {Array.from(Array(pagesNumber).keys()).map((elem, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setPage(index + 1);
                  }}
                  sx={{
                    color: index === page - 1 ? '#fff' : 'rgba(147, 163, 176, 0.8)',
                    backgroundColor:
                      index === page - 1 ? 'background.paper' : 'rgba(147, 163, 176, 0.16)',
                    height: '50px',
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            </Stack>
            <Stack direction="row" flex={1}>
              <Typography sx={{ padding: '13px' }}>عدد المشاريع المعروضة:</Typography>
              <Select
                labelId="simple-select"
                id="demo-simple-select"
                value={params.limit}
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
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}

export default CardTable;
