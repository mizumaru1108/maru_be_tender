import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { getProposals } from 'queries/commons/getProposal';
import { useQuery } from 'urql';

function IncomingFundingRequests() {
  const [result] = useQuery({
    query: getProposals,
    variables: {
      order_by: { created_at: 'asc' },
      limit: 4,
      offset: 0,
      where: {
        project_manager_id: { _is_null: true },
        _and: { inner_status: { _in: ['ACCEPTED_BY_SUPERVISOR', 'REJECTED_BY_CONSULTANT'] } },
      },
    },
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>...Loading</>;
  }
  const props = data?.data ?? [];
  if (!props || props.length === 0) return <></>;
  return (
    <Box sx={{ mt: '20px' }}>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        طلبات الدعم الواردة
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {props?.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{ id: item.id }}
              content={{
                projectName: item.project_name,
                organizationName: item.user.client_data.entity,
                sentSection: item.state,
                employee: item.user.employee_name,
                // employee:
                //   item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                //   item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                createdAtClient: new Date(item.user.client_data.created_at),
              }}
              footer={{ createdAt: new Date(item.created_at) }}
              cardFooterButtonAction="show-details"
              destination="incoming-funding-requests"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default IncomingFundingRequests;
