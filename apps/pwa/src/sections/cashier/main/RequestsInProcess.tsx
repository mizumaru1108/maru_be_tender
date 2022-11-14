import { Typography, Grid, Stack, Button } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';

function RequestsInProcess() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      where: {
        cashier_id: { _eq: user?.id },
        _and: { inner_status: { _eq: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR' } },
      },
    },
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>...Loading</>;
  }
  const props = data?.data ?? [];
  if (props.length === 0) return <></>;
  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4" sx={{ mb: '20px' }}>
            طلبات قيد الإجراء
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
              navigate('/cashier/dashboard/requests-in-process');
            }}
          >
            عرض الكل
          </Button>
        </Stack>
      </Grid>
      {props &&
        props.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{ id: item.id }}
              content={{
                projectName: item.project_name,
                organizationName: item.project_idea,
                sentSection: 'Cahsier',
                employee: 'Cahsier',
              }}
              footer={{
                createdAt: item.created_at,
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
