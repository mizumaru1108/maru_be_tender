import { Container, Typography, Box, Grid } from '@mui/material';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ProjectCard } from 'components/card-table';
import { useQuery } from 'urql';
import { getClientProjects } from 'queries/client/getClientProjects';
import useAuth from 'hooks/useAuth';

function PreviousFundingInqueries() {
  const [tap, setTap] = React.useState('all_projects');
  const [previousInq, setPreviousInq] = React.useState([]);
  const { user } = useAuth();
  const id = user?.id;
  const [result, _] = useQuery({
    query: getClientProjects,
    variables: { id },
  });
  const { data, fetching, error } = result;
  const handleChange = (event: React.SyntheticEvent, newTap: string) => {
    setTap(newTap);
  };

  const processData = (data: any) =>
    data.map((item: any) => ({
      title: {
        id: item.id,
      },
      content: {
        projectName: item.project_name,
        createdAt: new Date(item.created_at),
        projectStatus: item.outter_status,
        projectDetails: item.project_idea,
      },
      footer: {
        createdAt: new Date(item.created_at),
      },
    }));

  React.useEffect(() => {
    if (data) {
      const { pending_client_projects, completed_client_projects } = data;
      const filterdData = processData(
        tap === 'pending_projects'
          ? pending_client_projects
          : tap === 'completed_projects'
          ? completed_client_projects
          : pending_client_projects.concat(completed_client_projects)
      );
      setPreviousInq(filterdData);
    }
  }, [data, tap]);

  if (fetching) {
    return <>...Loading</>;
  }
  if (error) return <>{error.graphQLErrors}</>;
  return (
    <Container>
      <Typography variant="h4">طلبات دعم سابقة</Typography>
      <Box sx={{ width: '50%', mb: '10px' }}>
        <Tabs
          onChange={handleChange}
          value={tap}
          aria-label="Tabs where selection follows focus"
          selectionFollowsFocus
        >
          <Tab label="كل المشاريع" value="all_projects" />
          <Tab label="مشاريع منتهية" value="completed_projects" />
          <Tab label="مشاريع معلقة" value="pending_projects" />
        </Tabs>
      </Box>
      {previousInq.length > 0 ? (
        <Grid container rowSpacing={3} columnSpacing={3}>
          {previousInq.map((item: any, index: any) => (
            <Grid item md={6} key={index}>
              <ProjectCard
                {...item}
                cardFooterButtonAction="show-details"
                destination="previous-funding-requests"
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '40vh' }}
        >
          <Typography>{`لا يوجد مشاريع ${tap}`}</Typography>
        </Grid>
      )}
    </Container>
  );
}

export default PreviousFundingInqueries;
