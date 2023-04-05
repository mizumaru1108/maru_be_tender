import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import { getProposals } from 'queries/commons/getProposal';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import { generateHeader } from '../../../utils/generateProposalNumber';

function ProposalOnAmandement() {
  const { translate } = useLocales();
  const { user } = useAuth();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      order_by: { updated_at: 'desc' },
      limit: 4,
      offset: 0,
      where: {
        project_manager_id: { _eq: user?.id },
        _and: {
          outter_status: {
            _eq: 'ASKED_FOR_AMANDEMENT',
          },
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
      <Typography variant="h4" sx={{ mb: '20px' }}>
        {translate('amandement_requests_project_supervisor')}
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {props?.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{
                id: item.id,
                project_number: generateHeader(
                  item && item.project_number && item.project_number ? item.project_number : item.id
                ),
              }}
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
              cardFooterButtonAction="show-project"
              destination="requests-in-process"
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default ProposalOnAmandement;
