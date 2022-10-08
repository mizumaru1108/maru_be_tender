import { Typography, Box, Grid } from '@mui/material';
import useLocales from 'hooks/useLocales';
// sections
import TableEmployee from './TableEmployee';
//
import { MockTableEmployee } from '_mock/portal_reports';

export default function AchievementEffectiveness() {
  const { translate } = useLocales();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
        rowGap: 4,
        mt: 1,
      }}
    >
      <Typography variant="h4" sx={{ mt: 1 }}>
        {translate('section_portal_reports.heading.achievement_effectiveness')}
      </Typography>
      <TableEmployee data={MockTableEmployee} />
    </Box>
  );
}
