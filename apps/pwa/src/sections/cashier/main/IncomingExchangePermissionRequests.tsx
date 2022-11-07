import { Typography, Grid } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';
import useAuth from 'hooks/useAuth';
import { gettingIncomingProposals } from 'queries/Cashier/gettingIncomingProposals';
import { useQuery } from 'urql';

function IncomingExchangePermissionRequests() {
  const { user } = useAuth();
  const employee_path = user?.employee_path;
  const [result, reexecuteQuery] = useQuery({
    query: gettingIncomingProposals,
    variables: { project_track: employee_path.trim() },
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>...Loading</>;
  }
  const props = data?.proposal ?? [];
  if (props.length === 0) return <></>;
  return (
    <>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        طلبات إذن الصرف الواردة
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
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
                destination="incoming-exchange-permission-requests"
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default IncomingExchangePermissionRequests;
