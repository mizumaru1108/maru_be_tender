import { Box, Grid, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { getDailySupervisorStatistics } from 'queries/project-supervisor/getDailyStatistics';
import { useQuery } from 'urql';
function DailyStatistics() {
  const base_date = new Date();
  const first_date = base_date.toISOString().slice(0, 10);
  const second_date = new Date(base_date.setDate(base_date.getDate() + 1))
    .toISOString()
    .slice(0, 10);
  const { user } = useAuth();
  const [result] = useQuery({
    query: getDailySupervisorStatistics,
    variables: { user_id: user?.id!, first_date, second_date },
  });
  const { data, fetching, error } = result;
  if (fetching) return <>... Loading</>;
  if (error) return <>{error.message}</>;
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h4">احصائيات يومية</Typography>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            عدد مشاريع الكلي
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>{`${
            data.general_projects.aggregate.count +
            data.particular_projects.aggregate.count +
            data.pending_projects.aggregate.count +
            data.accepted_projects.aggregate.count +
            data.rejected_projects.aggregate.count
          } مشاريع`}</Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            مشاريع عامة
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${data.general_projects.aggregate.count} مشاريع`}</Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            مشاريع خاصة
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${data.particular_projects.aggregate.count} مشاريع`}</Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            مشاريع معلقة
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${data.pending_projects.aggregate.count} مشاريع`}</Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            مشاريع مقبولة
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${data.accepted_projects.aggregate.count} مشاريع`}</Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            مشاريع مرفوضة
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${data.rejected_projects.aggregate.count} مشاريع`}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default DailyStatistics;
