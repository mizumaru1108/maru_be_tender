import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { getProposals } from 'queries/commons/getProposal';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import { generateHeader } from '../../../utils/generateProposalNumber';

function IncomingFundingRequests() {
  const { translate } = useLocales();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      order_by: { updated_at: 'desc' },
      limit: 4,
      offset: 0,
      where: {
        project_manager_id: { _is_null: true },
        _and: {
          inner_status: { _in: ['ACCEPTED_BY_SUPERVISOR'] },
          outter_status: { _nin: ['ON_REVISION', 'ASKED_FOR_AMANDEMENT'] },
        },
      },
    },
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return (
      <Grid item md={12}>
        {translate('pages.common.loading')}
      </Grid>
    );
  }
  const props = data?.data ?? [];
  if (!props || props.length === 0) return null;
  return (
    <Grid item md={12}>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        {translate('incoming_funding_requests_project_supervisor')}
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
              cardFooterButtonAction="show-details"
              destination="incoming-funding-requests"
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default IncomingFundingRequests;
