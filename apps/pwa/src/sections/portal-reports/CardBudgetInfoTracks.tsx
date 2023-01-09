import { Typography, Box, Grid, Card, Stack, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
// component
import LineCharts from 'components/line-charts';
// _mock
import { MOSQUE_TRACK } from '_mock/portal_reports';
// types
import { IPropsBudgetInfo } from './types';
import Image from 'components/Image';
import Label from 'components/Label';

export default function CardBudgetInfoTracks({
  project_track,
  spended_budget,
  spended_budget_last_week,
  reserved_budget,
  reserved_budget_last_week,
  total_budget,
}: IPropsBudgetInfo) {
  const { translate, i18n } = useLocales();
  const theme = useTheme();
  const currencyFormat = new Intl.NumberFormat(i18n.language);

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
      <Typography variant="h4">{translate(project_track)}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={6} md={4}>
          <Card sx={{ bgcolor: 'white', p: 3 }}>
            <Stack component="div" spacing={1} sx={{ textAlign: 'left' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Image src="/assets/icons/currency-icon.svg" alt="currency-icon" />
              </Box>
              <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500] }}>
                {translate('section_portal_reports.total_budget_for_the_course')}
              </Typography>
              <Typography variant="h4" component="p" sx={{ color: theme.palette.primary.main }}>
                {currencyFormat.format(total_budget)} {translate('section_portal_reports.riyals')}
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card sx={{ bgcolor: 'white', p: 3, display: 'flex', flexDirection: 'row' }}>
            <Stack component="div" direction="column" spacing={1} sx={{ textAlign: 'left' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Image src="/assets/icons/currency-icon.svg" alt="currency-icon" />
              </Box>
              <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500] }}>
                {translate('section_portal_reports.spent_budget')}
              </Typography>
              <Typography variant="h4" component="p" sx={{ color: theme.palette.primary.main }}>
                {currencyFormat.format(spended_budget)} {translate('section_portal_reports.riyals')}
              </Typography>

              <Box>
                <Label color="primary" sx={{ mr: 1 }}>
                  {currencyFormat.format(spended_budget_last_week)}{' '}
                  {translate('section_portal_reports.riyals')}
                </Label>
                <Typography variant="caption" sx={{ color: theme.palette.grey[500] }}>
                  {translate('section_portal_reports.since_last_weeks')}
                </Typography>
              </Box>
            </Stack>
            {/* <Box>Harusnya chart</Box> */}
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card sx={{ bgcolor: 'white', p: 3, display: 'flex', flexDirection: 'row' }}>
            <Stack component="div" direction="column" spacing={1} sx={{ textAlign: 'left' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Image src="/assets/icons/currency-icon.svg" alt="currency-icon" />
              </Box>
              <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500] }}>
                {translate('section_portal_reports.reserved_budget')}
              </Typography>
              <Typography variant="h4" component="p" sx={{ color: theme.palette.primary.main }}>
                {currencyFormat.format(reserved_budget)}{' '}
                {translate('section_portal_reports.riyals')}
              </Typography>

              <Box>
                <Label color="warning" sx={{ mr: 1 }}>
                  {currencyFormat.format(reserved_budget_last_week)}{' '}
                  {translate('section_portal_reports.riyals')}
                </Label>
                <Typography variant="caption" sx={{ color: theme.palette.grey[500] }}>
                  {translate('section_portal_reports.since_last_weeks')}
                </Typography>
              </Box>
            </Stack>
            {/* <Box>Harusnya chart</Box> */}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
