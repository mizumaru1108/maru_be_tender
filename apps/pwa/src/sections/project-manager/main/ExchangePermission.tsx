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
      sentSection: 'مسار المساجد',
      employee: 'اسم الموظف - مدير المشروع',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
      payments: [
        { name: 'الدفعة الأولى', status: true },
        { name: 'الدفعة الثانية', status: true },
        { name: 'الدفعة الثالثة', status: true },
        { name: 'الدفعة الرابعة', status: false },
        { name: 'الدفعة الخامسة', status: false },
        { name: 'الدفعة السادسة', status: false },
        { name: 'الدفعة السابعة', status: false },
      ],
    },
  },
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'مسار المساجد',
      employee: 'اسم الموظف - مدير المشروع',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
      payments: [
        { name: 'الدفعة الأولى', status: true },
        { name: 'الدفعة الثانية', status: true },
        { name: 'الدفعة الثالثة', status: true },
        { name: 'الدفعة الرابعة', status: false },
        { name: 'الدفعة الخامسة', status: false },
        { name: 'الدفعة السادسة', status: false },
        { name: 'الدفعة السابعة', status: false },
      ],
    },
  },
] as ProjectCardProps[];

function ExchangePermission() {
  return (
    <Box sx={{ mt: '20px' }}>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        إذن الصرف
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

export default ExchangePermission;
