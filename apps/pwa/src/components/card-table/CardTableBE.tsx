import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CardTablePropsBE } from './types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useQuery } from 'urql';
import { useTheme } from '@mui/material/styles';
import ProjectTableBE from './ProjectCardBE';
import CardTableNoData from './CardTableNoData';
import LoadingPage from './LoadingPage';
import FilterModalBE from './FilterModalBE';
import { whereFilterGenerator } from 'utils/whereFilterGenerator';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DateFilterBE from './DateFilterBE';
import TapTableFilterBE from './TapTableFilterBE';

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
  baseFilters = {},
}: CardTablePropsBE) {
  const [page, setPage] = useState(1);
  const [alphabeticalOrderState, setAlphabeticalOrderState] = useState<string | null>(null);
  const [filtersStateObjectArray, setFiltersStateObjectArray] = useState(baseFilters);
  // The params that will be used with the query later on
  const [params, setParams] = useState({
    limit: limitShowCard ? limitShowCard : 6,
    // offset: (page - 1) * (limitShowCard ? limitShowCard : 6),
    order_by: { created_at: 'desc' },
    where: whereFilterGenerator(
      Object.keys(filtersStateObjectArray).map((item, index) => filtersStateObjectArray[item])
    ),
  });

  const [result, mutate] = useQuery({
    query: resource,
    variables: { ...params, ...staticFilters },
  });
  const { data, fetching, error } = result;

  const [open, setOpen] = useState(false);
  // For the Filter Modal
  const handleOpenFilter = () => setOpen(true);
  const handleCloseFilter = () => setOpen(false);

  // It is used for the number of the pages that are rendered
  const pagesNumber = Math.ceil(data?.proposal_aggregate?.aggregate?.count / params.limit);

  // The data showed in a single page
  const dataSinglePage = data?.data.slice(
    (page - 1) * params.limit,
    (page - 1) * params.limit + params.limit
  );

  // For the number of projects that are showed in a single page
  const handleLimitChange = (event: any) => {
    setParams((prevParams) => ({
      ...prevParams,
      limit: event.target.value as any,
      offset: ((page - 1) * event.target.value) as number,
    }));
  };

  const alphabeticalOrderHandleChange = (event: React.MouseEvent<HTMLElement>) => {
    setParams((prevParams) => ({
      ...prevParams,
      offset: (page - 1) * (limitShowCard ? limitShowCard : 6),
      order_by: {
        ...prevParams.order_by,
        project_name: alphabeticalOrderState === 'asc' ? 'desc' : 'asc',
      },
    }));
    setAlphabeticalOrderState(alphabeticalOrderState === 'asc' ? 'desc' : 'asc');
  };
  // Later on we will use useEffect for re-render the page after every change for the data
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params, page, data]);

  return (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <FilterModalBE
        open={open}
        handleClose={handleCloseFilter}
        filters={filters}
        setFiltersStateObjectArray={setFiltersStateObjectArray}
        filtersStateObjectArray={filtersStateObjectArray}
        setParams={setParams}
      />
      <Grid item md={12} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      <Grid item md={6} xs={12}>
        {taps && (
          <TapTableFilterBE
            setParams={setParams}
            taps={taps}
            filtersStateObjectArray={filtersStateObjectArray}
            setFiltersStateObjectArray={setFiltersStateObjectArray}
          />
        )}
      </Grid>
      <Grid item md={6} xs={12}>
        <Stack direction="row" justifyContent="end" gap={1}>
          {/* Date Filter */}
          {dateFilter && (
            <DateFilterBE
              filtersStateObjectArray={filtersStateObjectArray}
              setFiltersStateObjectArray={setFiltersStateObjectArray}
              setParams={setParams}
            />
          )}
          {/* Alpha-betical Order Filter */}
          {alphabeticalOrder && (
            <Stack direction="row" gap={1}>
              <Typography sx={{ textAlign: 'center', my: 'auto' }}>ترتيب حسب:</Typography>
              <Button
                endIcon={
                  alphabeticalOrderState === 'desc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
                }
                sx={{ color: '#000' }}
                onClick={alphabeticalOrderHandleChange}
              >
                اسم المشروع من أ الى ي
              </Button>
            </Stack>
          )}
          {filters && (
            <Button
              sx={{
                color: '#fff',
                backgroundColor: '#000000',
                ':hover': { backgroundColor: '#1E1E1E' },
              }}
              startIcon={<img alt="" src="/icons/filter-icon.svg" />}
              onClick={handleOpenFilter}
            >
              فلتر
            </Button>
          )}
        </Stack>
      </Grid>
      {fetching && <LoadingPage />}
      {!data ||
        (data?.data?.length === 0 && (
          <Grid item md={12} xs={12}>
            <CardTableNoData />
          </Grid>
        ))}
      {data &&
        !fetching &&
        data?.data.map((item: any, index: any) => (
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
                    setParams((prevParams) => ({
                      ...prevParams,
                      offset: (index + 1 - 1) * prevParams.limit,
                    }));
                    mutate({ requestPolicy: 'network-only' });
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
