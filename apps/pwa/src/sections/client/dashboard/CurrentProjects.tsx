import { Box, Button, Grid, Stack, Typography, Container } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import SvgIconStyle from 'components/SvgIconStyle';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';

function CurrentProjects({ current_projects }: any) {
  const navigate = useNavigate();
  if (current_projects.length === 0)
    return (
      <Container>
        <Typography variant="h4">المشاريع الحالية</Typography>
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
              <Typography sx={{ textAlign: 'center' }}>لا يوجد اي مشاريع حالية</Typography>
              <Button
                sx={{ textAlign: 'center', margin: '0 auto', textDecorationLine: 'underline' }}
                onClick={() => {
                  navigate('/client/dashboard/funding-project-request');
                }}
              >
                تقديم طلب دعم جديد
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
          <Typography variant="h4">المشاريع الحالية</Typography>
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
                  <Typography variant="h4">الميزانية الحالية</Typography>
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
                          الميزانية المطلوبة
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
                          الميزانية المصروفة
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
