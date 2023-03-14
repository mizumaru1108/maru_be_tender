// @mui
import { Typography, Grid, Stack, Button } from '@mui/material';
import { ProjectCard } from 'components/card-table';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// query
import { useQuery } from 'urql';
import { useNavigate } from 'react-router';
import { getProposals } from 'queries/commons/getProposal';

// ------------------------------------------------------------------------------------------

export default function IncomingCloseReport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { translate } = useLocales();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      limit: 4,
      order_by: { updated_at: 'desc' },
      where: {
        supervisor_id: { _eq: user?.id },
        _and: {
          inner_status: { _eq: 'DONE_BY_CASHIER' },
          state: { _eq: 'PROJECT_SUPERVISOR' },
        },
      },
    },
  });

  const { data, fetching, error } = result;

  if (fetching)
    return (
      <Grid item md={12}>
        {translate('pages.common.loading')}
      </Grid>
    );

  const props = data?.data ?? [];

  if (!props || props.length === 0) return null;

  return (
    <Grid item md={12}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" sx={{ mb: '20px' }}>
          {translate('pages.common.close_report.text.project_report')}
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
            navigate('/project-supervisor/dashboard/project-report');
          }}
        >
          {translate('view_all')}
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {props?.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{ id: item.id }}
              content={{
                projectName: item.project_name,
                organizationName: item.user.client_data.entity,
                sentSection: item.state,
                // employee: item.user.employee_name,
                employee:
                  item.proposal_logs &&
                  item.proposal_logs.length > 0 &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                createdAtClient: new Date(item.created_at),
              }}
              footer={{
                createdAt: new Date(item.updated_at),
              }}
              cardFooterButtonAction="show-details"
              destination="project-report"
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
