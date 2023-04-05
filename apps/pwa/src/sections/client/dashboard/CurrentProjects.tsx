import { Box, Button, Grid, Stack, Typography, Container } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import SvgIconStyle from 'components/SvgIconStyle';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import { generateHeader } from '../../../utils/generateProposalNumber';

function CurrentProjects({ current_projects }: any) {
  const navigate = useNavigate();

  const { translate } = useLocales();

  if (current_projects.length === 0)
    return (
      <>
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
                  navigate('/client/dashboard/funding-project-request');
                }}
              >
                {translate('content.client.main_page.apply_new_support_request')}
              </Button>
            </Stack>
          </Box>
        </Grid>
      </>
    );
  return (
    <>
      <Grid container spacing={5}>
        <Grid item md={12} xs={12}>
          <Typography variant="h4">
            {translate('content.client.main_page.current_projects')}
          </Typography>
        </Grid>
        {current_projects.map((item: any, index: any) => (
          <Grid item xs={12} md={6} key={index}>
            <ProjectCard
              destination="current-project"
              // title={{ id: `${item.id}` }}
              title={{
                id: item.id,
                project_number: generateHeader(
                  item && item.project_number && item.project_number ? item.project_number : item.id
                ),
              }}
              content={{
                projectName: item.project_name,
                projectStatus: item.outter_status,
                projectDetails: item.project_idea,
              }}
              footer={{ createdAt: new Date(item.created_at) }}
              cardFooterButtonAction="show-details"
            />
            {/* <Grid container columnSpacing={7} rowSpacing={5}>
              <Grid item md={7} xs={12}>
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
              <Grid item md={5} xs={12} rowSpacing={7}>
                <Stack gap={3}>
                  <Typography variant="h4">
                    {translate('content.client.main_page.current_budget')}
                  </Typography>
                  <Stack direction="column" gap={3}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                          {fCurrencyNumber(item.amount_required_fsupport)}
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
                          {translate('content.client.main_page.approved_budget')}
                        </Typography>
                        <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                          {item.fsupport_by_supervisor
                            ? fCurrencyNumber(item.amount_required_fsupport)
                            : translate('content.client.main_page.not_determined')}
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
                          {fCurrencyNumber(item.amount_required_fsupport)}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>
            </Grid> */}
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default CurrentProjects;
