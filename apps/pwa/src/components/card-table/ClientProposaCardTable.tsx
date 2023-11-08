import { Box, Pagination, Grid, Stack, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { setFiltered } from 'redux/slices/searching';
import { dispatch, useSelector } from 'redux/store';
import axiosInstance from 'utils/axios';
import { generateHeader } from '../../utils/generateProposalNumber';
import CardTableNoData from './CardTableNoData';
import LoadingPage from './LoadingPage';
import ProjectCard from './ProjectCard';
import { FilteredValues, NewCardTableProps } from './types';
import EmptyContent from 'components/EmptyContent';

function ClientProposaCardTable({
  title,
  limitShowCard,
  pagination = true,
  cardFooterButtonAction,
  url,
  headersProps,
}: NewCardTableProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [page, setPage] = useState(1);
  const { translate } = useLocales();
  const { filtered, activeOptions } = useSelector((state) => state.searching);
  const [params, setParams] = useState({
    limit: limitShowCard ? limitShowCard : 6,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FilteredValues>({
    data: [],
    hasNextPage: false,
    hasPrevPage: false,
    limit: 6,
    message: 'success',
    nextPage: 0,
    prevPage: 0,
    total: 0,
  });

  // console.log({ activeOptions });

  const getData = async () => {
    try {
      setLoading(true);
      if (activeRole === 'tender_accounts_manager') {
        try {
          const res = await axiosInstance.get(url, {
            headers: headersProps,
          });
          if (res.data.statusCode === 200) {
            setData(res.data);
          }
        } catch (error) {
          const statusCode = (error && error.statusCode) || 0;
          const message = (error && error.message) || null;
          enqueueSnackbar(`${statusCode < 500 && message ? message : 'something went wrong!'}`, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        }
        // return res.data;
      } else {
        const res = await axiosInstance.get(url, {
          params: { limit: params.limit, page: page },
          headers: headersProps,
        });
        if (res.data.statusCode === 200) {
          setData(res.data);
        }
        // return res.data;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      dispatch(setFiltered(''));
    }
  };

  // It is used for the number of the pages that are rendered
  const pagesNumber = Math.ceil(data?.total / params.limit);

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

  // Later on we will use useEffect for re-render the page after every change for the data
  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
    // eslint-disable-next-line
  }, [params, page]);

  useEffect(() => {}, [data]);

  return (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <Grid item md={12} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      {loading ? (
        <LoadingPage />
      ) : data && data?.data.length ? (
        data?.data.map((item: any, index: any) => (
          <Grid item key={index} md={6} xs={12}>
            <ProjectCard
              title={{
                id: item.id,
                project_number: generateHeader(
                  item && item.project_number && item.project_number ? item.project_number : item.id
                ),
                inquiryStatus: item.outter_status.toLowerCase(),
              }}
              content={{
                projectName: item.project_name,
                organizationName:
                  (item.user.client_data && item.user.client_data.entity) ??
                  item.user.employee_name,
                sentSection: item.state,
                employee: item.user.employee_name,
                createdAtClient: new Date(item.created_at),
                projectStatus: item.outter_status,
              }}
              footer={{
                createdAt: new Date(item.updated_at),
              }}
              cardFooterButtonAction={cardFooterButtonAction}
              destination="current-project"
            />
          </Grid>
        ))
      ) : (
        <Grid item md={12} xs={12}>
          <CardTableNoData />
        </Grid>
      )}

      {pagination && (
        <Grid item md={12} xs={12}>
          {!loading && data.data.length && (
            <Stack direction="row" justifyContent="space-between">
              <Box flex={1} />
              <Stack direction="row" flex={2} gap={1} justifyContent="center">
                <Pagination
                  count={pagesNumber}
                  page={page}
                  onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                    setPage(value);
                    setParams((prevParams) => ({
                      ...prevParams,
                      offset: (page + 1 - 1) * prevParams.limit,
                    }));
                  }}
                />
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
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default ClientProposaCardTable;
