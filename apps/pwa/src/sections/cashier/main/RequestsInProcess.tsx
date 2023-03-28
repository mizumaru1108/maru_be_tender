import { Typography, Grid, Stack, Button } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';

function RequestsInProcess() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      limit: 10,
      order_by: { updated_at: 'desc' },
      where: {
        // inner_status: { _eq: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR' },
        // payments: { status: { _eq: 'ACCEPTED_BY_FINANCE' } },
        // _and: { cashier_id: { _eq: user?.id } },
        cashier_id: { _eq: user?.id },
        _or: [
          {
            inner_status: {
              _in: ['ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR'],
            },
            payments: { status: { _in: ['ACCEPTED_BY_FINANCE'] } },
          },
          {
            payments: { status: { _in: ['ACCEPTED_BY_FINANCE', 'DONE'] } },
            _not: {
              payments: {
                status: {
                  _in: ['SET_BY_SUPERVISOR', 'ISSUED_BY_SUPERVISOR', 'ACCEPTED_BY_PROJECT_MANAGER'],
                },
              },
            },
            _and: [
              {
                _not: {
                  inner_status: {
                    _in: ['DONE_BY_CASHIER', 'PROJECT_COMPLETED', 'REQUESTING_CLOSING_FORM'],
                  },
                },
              },
            ],
          },
        ],
      },
    },
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>{translate('pages.common.loading')}</>;
  }
  const props = data?.data ?? [];
  if (props.length === 0) return <></>;
  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">
            {translate('finance_pages.heading.proccess_request')}
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
            {translate('finance_pages.heading.link_view_all')}
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
                organizationName: item.user.client_data.entity,
                sentSection: item.state,
                employee:
                  item.proposal_logs &&
                  item.proposal_logs.length > 0 &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                // employee: item.user.employee_name,
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
