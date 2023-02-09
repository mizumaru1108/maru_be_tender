import { Typography, Grid, Stack, Button } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';

function IncomingConultationRequests() {
  const navigate = useNavigate();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      limit: 4,
      order_by: { created_at: 'desc' },
      where: { inner_status: { _eq: 'ACCEPTED_AND_NEED_CONSULTANT' } },
    },
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>...Loading</>;
  }
  const props = data?.data ?? [];
  if (!props || props.length === 0) return <></>;
  return (
    <Grid container spacing={2}>
      <Grid item md={12} xs={12}>
        <Grid item md={12} xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" sx={{ mb: '20px' }}>
              طلبات الاستشارة الواردة
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
                navigate('/consultant/dashboard/incoming-funding-requests');
              }}
            >
              عرض الكل
            </Button>
          </Stack>
        </Grid>
      </Grid>
      {props.map((item: any, index: any) => (
        <Grid item md={6} key={index}>
          <ProjectCard
            title={{ id: item.id }}
            content={{
              projectName: item.project_name,
              organizationName: item.user.client_data.entity,
              sentSection: 'Supervisor',
              employee: item.user.employee_name,
              createdAtClient: new Date(item.user.client_data.created_at),
            }}
            footer={{ createdAt: new Date(item.created_at) }}
            cardFooterButtonAction="show-details"
            destination="incoming-funding-requests"
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default IncomingConultationRequests;
