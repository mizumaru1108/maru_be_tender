import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';

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

function IncomingFundingRequests() {
  return (
    <Box sx={{ mt: '20px' }}>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        طلبات الدعم الواردة
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {data.map((item, index) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              {...item}
              cardFooterButtonAction="show-details"
              destination="incoming-funding-requests"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default IncomingFundingRequests;
