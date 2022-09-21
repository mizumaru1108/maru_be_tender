// types
import { CardInsightProps } from './types';
// material
import { Box, Grid, Typography, Card } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
import { useTheme } from '@mui/material/styles';

// -------------------------------------------------------------------------------

export default function CardInsight({ headline, data }: CardInsightProps) {
  const { translate } = useLocales();
  const theme = useTheme();

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ padding: '10px' }}>
            {translate(headline)}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={{ xs: 2, md: 4 }} direction="row" alignItems="center">
        {data?.length &&
          data.map((item, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Card sx={{ p: { xs: 2, md: 4 }, bgcolor: theme.palette.background.default }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: theme.typography.fontWeightMedium,
                    color: theme.palette.grey[500],
                    mb: 2,
                  }}
                >
                  {translate(item?.title)}
                </Typography>
                <Typography
                  variant="h5"
                  component="p"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    color: theme.palette.primary.main,
                  }}
                >
                  {item?.value}
                </Typography>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
