import { Box, Button, Grid, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CardTablePropsBE } from './types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FilterModal from './FilterModal';
import { useQuery } from 'urql';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import ProjectTableBE from './ProjectCardBE';
import CardTableNoData from './CardTableNoData';

function CardTableBE({
  title,
  resource,
  taps,
  limitShowCard,
  dateFilter,
  alphabeticalOrder,
  pagination = true,
  filters,
  cardFooterButtonAction,
  destination,
  staticFilters = {},
}: CardTablePropsBE) {
  const theme = useTheme();
  const { user } = useAuth();
  const id = user?.id;
  const [page, setPage] = useState(1);
  const [activeTap, setActiveTap] = useState(0);
  // The params that will be used with the query later on
  const [params, setParams] = useState({
    limit: limitShowCard ? limitShowCard : 6,
    offset: 0,
    order_by: {},
    ...(taps && { tap_filter: taps.options[0].value }),
  });

  const [result, mutate] = useQuery({
    query: resource,
    variables: { ...params, id, ...staticFilters },
  });
  const { data, fetching, error } = result;
  // For the number of projects that are showed in a single page
  const handleLimitChange = (event: any) => {
    setParams((prevParams) => ({
      ...prevParams,
      limit: event.target.value as any,
    }));
  };

  const handleTapChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    setActiveTap(newValue);
    setParams((prevParams) => ({
      ...prevParams,
      tap_filter: taps?.options[newValue].value,
    }));
  };
  const [open, setOpen] = useState(false);
  const [ascOrder, setAscOrder] = useState(false);
  // For the Filter Modal
  const handleOpenFilter = () => setOpen(true);
  const handleCloseFilter = () => setOpen(false);

  // It is used for the number of the pages that are rendered
  const pagesNumber = Math.ceil(data?.data?.length / params.limit);

  // The data showed in a single page
  const dataSinglePage = data?.data.slice(
    (page - 1) * params.limit,
    (page - 1) * params.limit + params.limit
  );

  // Later on we will use useEffect for re-render the page after every change for the data
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params, page, data]);
  console.log(data);
  return (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <FilterModal open={open} handleClose={handleCloseFilter} filters={filters} />
      <Grid item md={12} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      <Grid item md={6} xs={12}>
        {taps && (
          <Tabs
            indicatorColor="primary"
            textColor="inherit"
            value={activeTap}
            onChange={handleTapChange}
          >
            {taps.options.map((item, index) => (
              <Tab
                key={index}
                label={item.label}
                sx={{
                  borderRadius: 0,
                  px: 3,
                  '&.MuiTab-root:not(:last-of-type)': {
                    marginRight: 0,
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              />
            ))}
          </Tabs>
        )}
      </Grid>
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
          {/* Alpha-betical Order Filter */}
          {alphabeticalOrder && (
            <Stack direction="row" gap={1}>
              <Typography sx={{ textAlign: 'center', my: 'auto' }}>ترتيب حسب:</Typography>
              <Button endIcon={<img src="/icons/asc-order-icon.svg" alt="" />}>
                اسم المشروع من أ الى ي
              </Button>
            </Stack>
          )}
          {filters && (
            <Button
              sx={{ color: '#fff', backgroundColor: '#000' }}
              startIcon={<img alt="" src="/icons/filter-icon.svg" />}
              onClick={handleOpenFilter}
            >
              فلتر
            </Button>
          )}
        </Stack>
      </Grid>
      {fetching && <>... Loading</>}
      {!data ||
        (data?.data?.length === 0 && (
          <Grid item md={12} xs={12}>
            <CardTableNoData />
          </Grid>
        ))}
      {data &&
        !fetching &&
        dataSinglePage.map((item: any, index: any) => (
          <Grid item key={index} md={6} xs={12}>
            <ProjectTableBE
              {...item}
              created_at={new Date(item.created_at)}
              cardFooterButtonAction={cardFooterButtonAction}
              destination={destination}
              mutate={mutate}
            />
          </Grid>
        ))}

      {pagination && (
        <Grid item md={12} xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Box flex={1} />
            <Stack direction="row" flex={2} gap={1} justifyContent="center">
              {Array.from(Array(pagesNumber ? pagesNumber : 0).keys()).map((elem, index) => (
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

export default CardTableBE;
