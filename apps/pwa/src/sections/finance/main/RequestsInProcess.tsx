import { Typography, Grid, Stack, Button, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';
import useAuth from 'hooks/useAuth';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import { generateHeader } from '../../../utils/generateProposalNumber';
import React from 'react';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../utils/axios';
import SortingCardTable from 'components/sorting/sorting';

function RequestsInProcess() {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [cardData, setCardData] = React.useState([]);
  const [sortingFilter, setSortingFilter] = React.useState('');

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(
        `tender-proposal/request-in-process?limit=4${sortingFilter}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        // console.log('rest total :', rest.data);
        setCardData(
          rest.data.data.map((item: any) => ({
            ...item,
          }))
        );
      }
    } catch (err) {
      // console.log('err', err);
      // enqueueSnackbar(`Something went wrong ${err.message}`, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
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
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar, sortingFilter]);

  React.useEffect(() => {
    fetchingIncoming();
    // fetchingPrevious();
  }, [fetchingIncoming]);
  // const props = data?.data ?? [];
  // if (!props || props.length === 0) return null;
  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4" sx={{ mb: '20px' }}>
            {translate('finance_pages.heading.proccess_request')}
          </Typography>
          <Box>
            <SortingCardTable
              isLoading={isLoading}
              onChangeSorting={(event: string) => {
                setSortingFilter(event);
              }}
            />
            <Button
              sx={{
                backgroundColor: 'transparent',
                color: '#93A3B0',
                textDecoration: 'underline',
                ':hover': {
                  backgroundColor: 'transparent',
                },
              }}
              onClick={() => {
                navigate('/finance/dashboard/requests-in-process');
              }}
            >
              {translate('finance_pages.heading.link_view_all')}
            </Button>
          </Box>
        </Stack>
      </Grid>
      {isLoading && translate('pages.common.loading')}
      {!isLoading &&
        cardData.map((item: any, index: any) => (
          <Grid item md={6} xs={6} key={index}>
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
                organizationName: (item && item.user && item.user.employee_name) ?? '-',
                sentSection: item.state,
                // employee: item.user.employee_name,
                employee:
                  item.proposal_logs &&
                  item.proposal_logs.length > 0 &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                createdAtClient: new Date(item.created_at),
              }}
              footer={{
                createdAt: new Date(item.updated_at),
                payments: item.payments,
              }}
              cardFooterButtonAction="completing-exchange-permission"
              destination="requests-in-process"
            />
          </Grid>
        ))}
    </Grid>
  );
}

export default RequestsInProcess;
