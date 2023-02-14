import * as React from 'react';
import { Container, Typography, Box, Grid, Stack, Button, Tabs, Tab } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { useNavigate } from 'react-router';
import useLocales from 'hooks/useLocales';

function PreviousFundingInqueries({ completed_client_projects, pending_client_projects }: any) {
  const navigate = useNavigate();

  const { translate } = useLocales();

  const [tap, setTap] = React.useState('all_projects');

  const [previousInq, setPreviousInq] = React.useState([]);

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
        projectDetails: item.project_idea,
      },
      footer: {
        createdAt: new Date(item.created_at),
      },
    }));

  React.useEffect(() => {
    const filterdData = processData(
      tap === 'pending_projects'
        ? pending_client_projects
        : tap === 'completed_projects'
        ? completed_client_projects
        : pending_client_projects.concat(completed_client_projects)
    );
    setPreviousInq(filterdData);
  }, [completed_client_projects, pending_client_projects, tap]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">
          {translate('content.client.main_page.previous_support_request')}
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
            navigate('/client/dashboard/previous-funding-requests');
          }}
        >
          {translate('view_all')}
        </Button>
      </Stack>
      <Box sx={{ width: '50%', mb: '10px' }}>
        <Tabs
          onChange={handleChange}
          value={tap}
          aria-label="Tabs where selection follows focus"
          selectionFollowsFocus
        >
          <Tab label={translate('content.client.main_page.all_projects')} value="all_projects" />
          <Tab
            label={translate('content.client.main_page.completed_projects')}
            value="completed_projects"
          />
          <Tab
            label={translate('content.client.main_page.pending_projects')}
            value="pending_projects"
          />
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
          <Typography>{translate('content.client.main_page.no_projects')}</Typography>
        </Grid>
      )}
    </>
  );
}

export default PreviousFundingInqueries;
