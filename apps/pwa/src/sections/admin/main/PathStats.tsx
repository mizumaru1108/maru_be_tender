import { Box, Grid, Stack, Typography } from '@mui/material';
export type PathStatsProps = {
  title: string;
  totalBudget: string;
  spentBudget: string;
  reservedBudget: string;
};

function PathStats({ title, totalBudget, spentBudget, reservedBudget }: PathStatsProps) {
  return (
    <Stack direction="column">
      <Typography variant="h4">{title}</Typography>
      <Grid container spacing={3} sx={{ mt: '1px' }}>
        <Grid item md={4} xs={12}>
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
              الميزانية الكلية للمسار
            </Typography>
            <Typography
              sx={{ color: 'text.tertiary', fontWeight: 700 }}
            >{`${totalBudget} ريال`}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
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
            <Typography
              sx={{ color: 'text.tertiary', fontWeight: 700 }}
            >{`${spentBudget} ريال`}</Typography>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
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
              الميزانية المحجوزة
            </Typography>
            <Typography
              sx={{ color: 'text.tertiary', fontWeight: 700 }}
            >{`${reservedBudget} ريال`}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default PathStats;
