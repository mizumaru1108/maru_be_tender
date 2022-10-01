import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';
import { gettingRequestedProcess } from 'queries/project-manager/gettingRequestedProcess';
import { useQuery } from 'urql';

const data = [
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'لا يوجد',
      employee: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'لا يوجد',
      employee: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
] as ProjectCardProps[];

function RequestsInProcess() {
  const [result, reexecuteQuery] = useQuery({
    query: gettingRequestedProcess,
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>...Loading</>;
  }
  const props = data?.proposal ?? [];
  if (props.length === 0) return <></>;
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
              footer={{ createdAt: new Date(item.createdAt) }}
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
