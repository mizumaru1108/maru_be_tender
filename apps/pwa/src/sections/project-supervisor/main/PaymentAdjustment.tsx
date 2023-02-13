import { Typography, Grid, Box, Stack, Button } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';

function PaymentAdjustment() {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { user } = useAuth();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      limit: 4,
      where: {
        supervisor_id: { _eq: user?.id },
        _and: {
          inner_status: {
            _in: [
              'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
              'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
            ],
          },
        },
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
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" sx={{ mb: '20px' }}>
          {translate('payment_adjustment')}
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
            navigate('/project-supervisor/dashboard/payment-adjustment');
          }}
        >
          {translate('view_all')}
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {props.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{ id: item.id }}
              content={{
                projectName: item.project_name,
                organizationName: item.user.client_data.entity,
                sentSection: item.state,
                employee:
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                createdAtClient: new Date(item.user.client_data.created_at),
              }}
              footer={{ createdAt: new Date(item.created_at), payments: item.payments }}
              cardFooterButtonAction="completing-exchange-permission"
              destination="payment-adjustment"
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default PaymentAdjustment;
