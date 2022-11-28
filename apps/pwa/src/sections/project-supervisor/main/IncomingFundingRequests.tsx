import { Typography, Grid, Box, Stack, Button } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';

function IncomingFundingRequests() {
  const navigate = useNavigate();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      limit: 4,
      order_by: { created_at: 'desc' },
      where: {
        supervisor_id: { _is_null: true },
        _and: { inner_status: { _eq: 'ACCEPTED_BY_MODERATOR' } },
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
    <Grid container spacing={2}>
      <Grid item md={12} xs={12}>
        <Grid item md={12} xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" sx={{ mb: '20px' }}>
              طلبات الدعم الواردة
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
                navigate('/project-supervisor/dashboard/incoming-funding-requests');
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
              organizationName: item.project_name,
              sentSection: 'Supervisor',
              employee: 'Supervisor',
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

export default IncomingFundingRequests;
