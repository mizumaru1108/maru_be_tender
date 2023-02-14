import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import { getProposals } from 'queries/commons/getProposal';
import { useQuery } from 'urql';

function ExchangePermission() {
  const { user } = useAuth();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      order_by: { created_at: 'asc' },
      limit: 4,
      offset: 0,
      where: {
        project_manager_id: { _eq: user?.id },
        _and: { inner_status: { _eq: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR' } },
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
        إذن الصرف
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {props.map((item: any, index: any) => (
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
              footer={{ createdAt: new Date(item.created_at), payments: item.payments }}
              cardFooterButtonAction="completing-exchange-permission"
              destination="exchange-permission"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ExchangePermission;
