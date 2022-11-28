import { Box, Button, Grid, Stack, Typography, Container } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import SvgIconStyle from 'components/SvgIconStyle';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';

function CurrentProjects({ current_projects }: any) {
  const navigate = useNavigate();

  const { translate } = useLocales();
  if (current_projects.length === 0)
    return (
      <Container>
        <Typography variant="h4">
          {translate('content.client.main_page.current_projects')}
        </Typography>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          p="20px"
        >
          <Box sx={{ width: '100%' }}>
            <Stack justifyItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <SvgIconStyle src={`/icons/empty-project.svg`} />
              </Box>
              <Typography sx={{ textAlign: 'center' }}>
                {translate('content.client.main_page.no_current_projects')}
              </Typography>
              <Button
                sx={{ textAlign: 'center', margin: '0 auto', textDecorationLine: 'underline' }}
                onClick={() => {
                  navigate('/client.main_page/dashboard/funding-project-request');
                }}
              >
                {translate('content.client.main_page.apply_new_support_request')}
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Container>
    );
  return (
    <Container>
      <Grid container columnSpacing={7} rowSpacing={5}>
        <Grid item md={12} xs={12}>
          <Typography variant="h4">
            {translate('content.client.main_page.current_projects')}
          </Typography>
        </Grid>
        {current_projects.map((item: any, index: any) => (
          <Grid item md={12} xs={12} key={index}>
            <Grid container columnSpacing={7} rowSpacing={5}>
              <Grid item md={8} xs={12}>
                <ProjectCard
                  destination="current-project"
                  title={{ id: `${item.id}` }}
                  content={{
                    projectName: item.project_name,
                    projectStatus: item.outter_status,
                    projectDetails: item.project_idea,
                  }}
                  footer={{ createdAt: new Date(item.created_at) }}
                  cardFooterButtonAction="show-details"
                />
              </Grid>
              <Grid item md={4} xs={12} rowSpacing={7}>
                <Stack gap={3}>
                  <Typography variant="h4">
                    {translate('content.client.main_page.current_budget')}
                  </Typography>
                  <Stack direction="column" gap={3}>
                    <Stack direction="row" gap={1}>
                      <Box
                        sx={{
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                          py: '30px',
                          paddingRight: '40px',
                          paddingLeft: '5px',
                        }}
                      >
                        <img src={`/icons/rial-currency.svg`} alt="" />
                        <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                          {translate('content.client.main_page.required_budget')}
                        </Typography>
                        <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                          {`${item.amount_required_fsupport} ريال`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                          py: '30px',
                          paddingRight: '40px',
                          paddingLeft: '5px',
                        }}
                      >
                        <img src={`/icons/rial-currency.svg`} alt="" />
                        <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                          {translate('content.client.main_page.spent_budget')}
                        </Typography>
                        <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                          {`${item.amount_required_fsupport} ريال`}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CurrentProjects;
