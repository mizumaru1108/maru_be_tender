import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { NewCardTableProps, FilteredValues } from './types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useQuery } from 'urql';
import { useTheme } from '@mui/material/styles';
import ProjectTableBE from './ProjectCardBE';
import CardTableNoData from './CardTableNoData';
import LoadingPage from './LoadingPage';
import useLocales from 'hooks/useLocales';
import axiosInstance from 'utils/axios';
import useAuth from 'hooks/useAuth';
import { useSelector } from 'redux/store';
import ProjectCard from './ProjectCard';
import ClientCard from './ClientCard';
import { generateHeader } from '../../utils/generateProposalNumber';

function NewCardTable({
  title,
  limitShowCard,
  pagination = true,
  cardFooterButtonAction,
  url,
  headersProps,
}: NewCardTableProps) {
  const { activeRole } = useAuth();
  const [page, setPage] = useState(1);
  const { translate } = useLocales();
  const { sort, filtered } = useSelector((state) => state.searching);
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

  const getData = async () => {
    try {
      setLoading(true);
      if (activeRole === 'tender_accounts_manager') {
        if (filtered !== null) {
          const res = await axiosInstance.get(url, {
            params: {
              limit: params.limit,
              page: page,
              employee_name: filtered,
              account_status: filtered,
            },
            headers: headersProps,
          });
          if (res.data.statusCode === 200) {
            setData(res.data);
          }
          // setLoading(false);
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
      setLoading(false);
    } catch (error) {
      throw error;
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

  // console.log(data, 'DATA');

  return (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <Grid item md={12} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      {loading && <LoadingPage />}
      {data && !loading ? (
        data?.data.map((item: any, index: any) => (
          <Grid item key={index} md={6} xs={12}>
            {activeRole !== 'tender_accounts_manager' ? (
              <ProjectCard
                title={{
                  id: item.id,
                  project_number: generateHeader(item.project_number),
                  inquiryStatus: item.outter_status.toLowerCase(),
                }}
                content={{
                  projectName: item.project_name,
                  organizationName: item.user.employee_name,
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
            ) : (
              <ClientCard
                id={item.id}
                title={{ statusId: item.status_id }}
                email={item.email}
                employeeName={item.employee_name}
                createdAt={new Date(item.created_at)}
                cardFooterButtonAction="show-project"
              />
            )}
          </Grid>
        ))
      ) : (
        <Grid item md={12} xs={12}>
          <CardTableNoData />
        </Grid>
      )}

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

export default NewCardTable;
