import { Typography, Grid, Box, Stack, Button } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import useAuth from '../../../hooks/useAuth';
import { generateHeader } from '../../../utils/generateProposalNumber';

function IncomingAmandementRequest() {
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
            _eq: 'ASKED_FOR_AMANDEMENT',
          },
        },
      },
    },
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return (
      <Grid item md={12}>
        {translate('pages.common.loading')}
      </Grid>
    );
  }
  const props = data?.data ?? [];
  if (!props || props.length === 0) return null;
  return (
    <Grid item md={12}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" sx={{ mb: '20px' }}>
          {translate('incoming_amandement_requests')}
        </Typography>
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
            // navigate('/project-supervisor/dashboard/incoming-funding-requests');
          }}
        >
          {translate('view_all')}
        </Button>
      </Stack>
      <Grid container spacing={2}>
        {props.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{ id: item.id, project_number: generateHeader(item.project_number) }}
              content={{
                projectName: item.project_name,
                organizationName: item.user.client_data.entity ?? '-',
                sentSection: item.state,
                // employee: item.user.employee_name,
                employee:
                  item.proposal_logs &&
                  item.proposal_logs.length > 0 &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                createdAtClient: new Date(item.user.client_data.created_at),
              }}
              footer={{ createdAt: new Date(item.updated_at) }}
              cardFooterButtonAction="show-details"
              destination="incoming-funding-requests"
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default IncomingAmandementRequest;
