import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import useLocales from 'hooks/useLocales';
import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { getApplicationAdmissionSettings } from '../../../redux/slices/applicationAndAdmissionSettings';
import { dispatch, useSelector } from '../../../redux/store';
import EmptyContent from '../../EmptyContent';
import Iconify from '../../Iconify';
import LoadingPage from '../LoadingPage';
import ProjectCard from '../ProjectCard';
import { CardTableSearchingProps, SearchingProposal } from '../types';
import FilterModalSearch from './FilterModalSearch';

//create theme for component box
const themeBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '2px #0E8478 solid',
  mr: '7px',
  borderRadius: '12px',
  maxWidth: 250,
  minWidth: 150,
  minHeight: 50,
};

const themeButton = {
  color: '#0E8478',
  backgroundColor: 'inherit',
  minWidth: 30,
  '&:hover': {
    backgroundColor: 'inherit',
  },
};

function CardTableSearching({
  title,
  data,
  limitShowCard,
  pagination = true,
  cardFooterButtonAction,
}: CardTableSearchingProps) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  const [page, setPage] = useState(1);

  // Redux
  const { isLoading: isFetchingData, error: errorFetchingData } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );

  const [filter, setFilter] = useState<SearchingProposal>({
    project: '',
    theYear: '',
    detailReport: '',
    theField: '',
    geoRange: '',
  });
  // The params that will be used with the query later on
  const [params, setParams] = useState({
    limit: limitShowCard ? limitShowCard : 6,
    offset: 0,
    order_by: { email: 'asc' },
  });

  // For the filter Modal
  const [open, setOpen] = useState(false);
  // For the ASC|DESC order
  const [ascOrder, setAscOrder] = useState(false);

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
      <Grid item md={6} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>{' '}
      <FilterModalSearch
        open={open}
        data={filter}
        handleClose={handleCloseFilter}
        appliedFilter={(data) => {
          setFilter(data);
          // console.log('data appliedFilter :', filter);
        }}
      />
      <Grid item md={6} xs={12}>
        <Stack direction="row" justifyContent="end" gap={1}>
          {/*  Filter */}
          <Button
            sx={{ color: '#fff', backgroundColor: '#000' }}
            startIcon={<img alt="" src="/icons/filter-icon.svg" />}
            onClick={handleOpenFilter}
          >
            {translate('commons.filter_button_label')}
          </Button>
        </Stack>
      </Grid>
      {filter && (
        <Grid item md={12} xs={12}>
          {filter.project && (
            <Box sx={themeBox}>
              <Typography sx={{ ml: 2 }}> Key : {filter.project} </Typography>
              <Button
                variant="text"
                color="primary"
                sx={themeButton}
                onClick={() => setFilter({ ...filter, project: '' })}
                endIcon={
                  <Iconify
                    icon="eva:close-fill"
                    width={26}
                    height={26}
                    style={{ marginLeft: 10 }}
                  />
                }
              />
            </Box>
          )}
          {filter.geoRange && (
            <Box sx={themeBox}>
              <Typography sx={{ ml: 2 }}> {filter.geoRange} </Typography>
              <Button
                variant="text"
                color="primary"
                sx={themeButton}
                onClick={() => setFilter({ ...filter, geoRange: '' })}
                endIcon={
                  <Iconify
                    icon="eva:close-fill"
                    width={26}
                    height={26}
                    style={{ marginLeft: 10 }}
                  />
                }
              />
            </Box>
          )}
          {filter.theYear && (
            <Box sx={themeBox}>
              <Typography sx={{ ml: 2 }}> {filter.theYear} </Typography>
              <Button
                variant="text"
                color="primary"
                sx={themeButton}
                onClick={() => setFilter({ ...filter, theYear: '' })}
                endIcon={
                  <Iconify
                    icon="eva:close-fill"
                    width={26}
                    height={26}
                    style={{ marginLeft: 10 }}
                  />
                }
              />
            </Box>
          )}
          {filter.theField && (
            <Box sx={themeBox}>
              <Typography sx={{ ml: 2 }}> {filter.theField} </Typography>
              <Button
                variant="text"
                color="primary"
                sx={themeButton}
                onClick={() => setFilter({ ...filter, theField: '' })}
                endIcon={
                  <Iconify
                    icon="eva:close-fill"
                    width={26}
                    height={26}
                    style={{ marginLeft: 10 }}
                  />
                }
              />
            </Box>
          )}
        </Grid>
      )}
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
          <Stack direction="row" justifyContent="space-between">
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
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={8}>8</MenuItem>
              </Select>
            </Stack>
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}

export default CardTableSearching;
