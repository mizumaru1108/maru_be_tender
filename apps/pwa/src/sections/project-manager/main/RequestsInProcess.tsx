import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import { gettingMyRequestedProcess } from 'queries/project-manager/gettingMyRequestedProcess';
import { useQuery } from 'urql';

function RequestsInProcess() {
  const { user } = useAuth();
  const employee_path = user?.employee_path;
  const [result, reexecuteQuery] = useQuery({
    query: gettingMyRequestedProcess,
    variables: { project_manager_id: user?.id, project_track: employee_path.trim() },
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>...Loading</>;
  }
  const props = data?.proposal ?? [];
  if (!props || props.length === 0) return <></>;
  return (
    <Box sx={{ mt: '20px' }}>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        طلبات قيد الإجراء
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {props?.map((item: any, index: any) => (
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
              destination="requests-in-process"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RequestsInProcess;
