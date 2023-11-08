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
import { Proposal } from '../../../@types/proposal';
import { FEATURE_MENU_ADMIN_APLICATION_ADMISSION } from '../../../config';
import { getApplicationAdmissionSettings } from '../../../redux/slices/applicationAndAdmissionSettings';
import { CheckIsInProcessProposal } from '../../../utils/checkIsInProcessProposal';
import { generateHeader } from '../../../utils/generateProposalNumber';
import CardTableNoData from '../CardTableNoData';
import LoadingPage from '../LoadingPage';
import ProjectCard from '../ProjectCard';
import { CardSearchingProps, EnumInquiryStatus, FilteredValues } from '../types';

function CardSearching({
  title,
  limitShowCard,
  pagination = true,
  cardFooterButtonAction,
}: CardSearchingProps) {
  const { activeRole } = useAuth();
  const [page, setPage] = useState(1);
  const { translate } = useLocales();

  // Redux
  const {
    sort,
    filtered,
    activeOptionsSearching,
    outter_status: filter_outter_status,
  } = useSelector((state) => state.searching);
  const { isLoading: isFetchingData, error: errorFetchingData } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );

  const { enqueueSnackbar } = useSnackbar();
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
      if (filtered !== null && filtered !== '') {
        const tmpParams = {
          limit: params.limit,
          page: page,
          sort: sort || undefined,
          project_name: activeOptionsSearching.project_name && filtered ? filtered : undefined,
          employee_name: activeOptionsSearching.employee_name && filtered ? filtered : undefined,
          // project_number: activeOptionsSearching.project_number && filtered ? filtered : undefined,
          outter_status:
            activeOptionsSearching.outter_status && filter_outter_status
              ? filter_outter_status
              : undefined,
        };
        setLoading(true);
        const res = await axiosInstance.get(`tender-proposal/list`, {
          params: {
            ...tmpParams,
          },
          headers: { 'x-hasura-role': activeRole! },
        });
        if (res.data.statusCode === 200) {
          setData(res.data);
        }
        setLoading(false);
        // return res.data;
      }
    } catch (error) {
      setLoading(false);
      // throw error;
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    }
  };

  // It is used for the number of the pages that are rendered
  const pagesNumber = Math.ceil(data.total / params.limit);

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

  useEffect(() => {
    dispatch(getApplicationAdmissionSettings(activeRole!));
  }, [activeRole]);

  if (loading || isFetchingData) {
    return <LoadingPage />;
  }
  if (errorFetchingData && FEATURE_MENU_ADMIN_APLICATION_ADMISSION)
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
      <Grid item md={12} xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      {/* {loading && <LoadingPage />} */}
      {data && !loading ? (
        data?.data.map((item: Proposal, index: any) => {
          const isInProcess = CheckIsInProcessProposal(item, activeRole!);
          // console.log({ isInProcess });
          return (
            <Grid item key={index} md={6} xs={12}>
              <ProjectCard
                title={{
                  id: item.id,
                  project_number: generateHeader(
                    item && item.project_number && item.project_number
                      ? item.project_number
                      : item.id
                  ),
                  inquiryStatus: item.outter_status.toLowerCase() as EnumInquiryStatus,
                }}
                content={{
                  projectName: item.project_name,
                  organizationName: item.user?.client_data?.entity ?? item.user?.employee_name,
                  sentSection: item.state,
                  employee: item.user.employee_name,
                  createdAtClient: new Date(item.created_at),
                  projectStatus: item.outter_status,
                }}
                footer={{
                  createdAt: new Date(item.updated_at),
                }}
                cardFooterButtonAction={
                  isInProcess && item.outter_status !== 'PENDING_CANCELED'
                    ? 'show-details'
                    : item.outter_status === 'PENDING_CANCELED'
                    ? 'reject-project'
                    : cardFooterButtonAction
                }
                destination={
                  isInProcess && activeRole !== 'tender_consultant'
                    ? 'requests-in-process'
                    : activeRole === 'tender_consultant'
                    ? 'incoming-funding-requests'
                    : 'current-project'
                }
              />
            </Grid>
          );
        })
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

export default CardSearching;
