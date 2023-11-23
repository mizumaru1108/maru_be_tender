import { Box, Grid, Pagination, Stack, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import EmptyContent from 'components/EmptyContent';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { dispatch, useSelector } from 'redux/store';
import axiosInstance from 'utils/axios';
import { FEATURE_MENU_ADMIN_APLICATION_ADMISSION } from '../../config';
import { getApplicationAdmissionSettings } from '../../redux/slices/applicationAndAdmissionSettings';
import { generateHeader } from '../../utils/generateProposalNumber';
import CardTableNoData from './CardTableNoData';
import ClientCard from './ClientCard';
import LoadingPage from './LoadingPage';
import ProjectCard from './ProjectCard';
import { FilteredValues, NewCardTableProps } from './types';

function NewCardTable({
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

  // Redux
  const { isLoading: isFetchingData, error: errorFetchingData } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );
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

  const getData = async () => {
    try {
      setLoading(true);
      if (activeRole === 'tender_accounts_manager') {
        try {
          const res = await axiosInstance.get(url, {
            params: {
              limit: params.limit,
              page: page,
              employee_name: activeOptions.client_name && filtered ? filtered : undefined,
              user_type_id: activeOptions.account_status && filtered ? filtered : undefined,
              association_name: filtered || undefined,
              hide_internal: '1',
              email: activeOptions.email && filtered ? filtered : undefined,
              entity_mobile: activeOptions.entity_mobile && filtered ? filtered : undefined,
              license_number: activeOptions.license_number && filtered ? filtered : undefined,
            },
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
      } else {
        const res = await axiosInstance.get(url, {
          params: { limit: params.limit, page: page },
          headers: headersProps,
        });
        if (res.data.statusCode === 200) {
          setData(res.data);
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // It is used for the number of the pages that are rendered
  const pagesNumber = Math.ceil(data?.total / params.limit);

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

  useEffect(() => {
    dispatch(getApplicationAdmissionSettings(activeRole!));
  }, [activeRole]);

  if (loading || isFetchingData) {
    return <LoadingPage />;
  }
  if (errorFetchingData && FEATURE_MENU_ADMIN_APLICATION_ADMISSION)
    return (
      <EmptyContent
        title="لا يوجد بيانات"
        img="/assets/icons/confirmation_information.svg"
        description={`${translate('errors.something_wrong')}`}
        errorMessage={errorFetchingData?.message || undefined}
        sx={{
          '& span.MuiBox-root': { height: 160 },
        }}
      />
    );

  return (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <Grid item md={12} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      {data && !loading ? (
        data?.data.map((item: any, index: any) => (
          <Grid item key={index} md={6} xs={12}>
            {activeRole !== 'tender_accounts_manager' ? (
              <ProjectCard
                title={{
                  id: item.id,
                  project_number: generateHeader(
                    item && item.project_number && item.project_number
                      ? item.project_number
                      : item.id
                  ),
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
                entityName={(item?.client_data && item?.client_data?.entity) || undefined}
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
          {!loading && data.data.length ? (
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
          ) : (
            <Stack direction="row" alignItems="center" justifyContent="center" component="div">
              <EmptyContent
                title="لا يوجد بيانات"
                sx={{
                  '& span.MuiBox-root': { height: 160 },
                }}
              />
            </Stack>
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default NewCardTable;
