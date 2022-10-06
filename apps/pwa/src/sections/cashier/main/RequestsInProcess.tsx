import { Typography, Grid } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';
import useAuth from 'hooks/useAuth';
import { gettingAllMyProposels } from 'queries/Cashier/gettingAllMyProposels';
import { useQuery } from 'urql';

function RequestsInProcess() {
  const { user } = useAuth();
  const [result, reexecuteQuery] = useQuery({
    query: gettingAllMyProposels,
    variables: { cashier_id: user?.id },
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
        طلبات قيد الإجراء
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
                destination="requests-in-process"
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default RequestsInProcess;
