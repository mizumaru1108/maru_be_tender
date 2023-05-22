import { Typography, Grid, Box, Stack, Button } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import useAuth from '../../../hooks/useAuth';
import { generateHeader } from '../../../utils/generateProposalNumber';
import React from 'react';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import EmptyContent from 'components/EmptyContent';

function ProposalOnAmandement() {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { user } = useAuth();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      limit: 4,
      order_by: { updated_at: 'desc' },
      where: {
        supervisor_id: { _eq: user?.id },
        _and: {
          outter_status: {
            _eq: 'ON_REVISION',
          },
        },
      },
    },
  });
  const { data, fetching, error } = result;

  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [cardData, setCardData] = React.useState([]);

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`tender-proposal/amandement-lists?limit=4`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        setCardData(
          rest.data.data
            .filter((item: any) => item.proposal.inner_status === 'ON_REVISION')
            .map((item: any) => ({
              ...item.proposal,
              user: {
                employee_name: item.user.employee_name,
              },
            }))
        );
      }
    } catch (err) {
      console.log('err', err);
      enqueueSnackbar(`Something went wrong ${err.message}`, {
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
  }, [activeRole, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingIncoming();
    // fetchingPrevious();
  }, [fetchingIncoming]);
  if (fetching || isLoading)
    return (
      <Grid item md={12}>
        {translate('pages.common.loading')}
      </Grid>
    );
  // console.log({ cardData });
  // const props = data?.data ?? [];
  // if (!props || props.length === 0) return null;
  return (
    <Grid item md={12}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" sx={{ mb: '20px' }}>
          {translate('amandement_requests_project_supervisor')}
        </Typography>
        {/* <Button
          sx={{
            backgroundColor: 'transparent',
            color: '#93A3B0',
            textDecoration: 'underline',
            ':hover': {
              backgroundColor: 'transparent',
            },
          }}
          onClick={() => {
            // navigate('/project-supervisor/dashboard/incoming-funding-requests');
          }}
        >
          {translate('view_all')}
        </Button> */}
      </Stack>
      <Grid container spacing={2}>
        {cardData.length > 0 ? (
          cardData.map((item: any, index: any) => (
            <Grid item md={6} key={index}>
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
                  organizationName: (item && item.user && item.user.employee_name) ?? '-',
                  sentSection: item.state,
                  // employee: item.user.employee_name,
                  employee:
                    item.proposal_logs &&
                    item.proposal_logs.length > 0 &&
                    item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                    item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                  // createdAtClient: new Date(item.user.client_data.created_at),
                  createdAtClient: new Date(item.created_at),
                }}
                footer={{ createdAt: new Date(item.updated_at) }}
                cardFooterButtonAction="show-project"
                destination="incoming-funding-requests"
              />
            </Grid>
          ))
        ) : (
          <Grid item md={12}>
            <EmptyContent
              title="No Data"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ProposalOnAmandement;
