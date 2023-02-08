import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import { getProposals } from 'queries/commons/getProposal';
import { useQuery } from 'urql';

function RequestsInProcess() {
  const { user } = useAuth();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      order_by: { created_at: 'asc' },
      limit: 4,
      offset: 0,
      where: {
        project_manager_id: { _eq: user?.id },
        _and: { inner_status: { _in: ['ACCEPTED_BY_SUPERVISOR', 'REJECTED_BY_CONSULTANT'] } },
      },
    },
  });
  const { data, fetching, error } = result;
  if (fetching) return <>...Loading</>;
  const props = data?.data ?? [];
  if (!props || props.length === 0) return <></>;
  return (
    <Box sx={{ mt: '20px' }}>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        طلبات قيد الإجراء
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {props?.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{ id: item.id }}
              content={{
                projectName: item.project_name,
                organizationName: item.user.client_data.entity,
                sentSection: 'Supervisor',
                employee: item.user.employee_name,
              }}
              footer={{ createdAt: new Date(item.created_at) }}
              cardFooterButtonAction="show-details"
              destination="requests-in-process"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RequestsInProcess;
