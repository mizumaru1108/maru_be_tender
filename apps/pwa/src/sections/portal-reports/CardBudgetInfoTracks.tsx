import { useEffect, useState } from 'react';
import { Typography, Box, Grid, Card, Stack, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
// component
// types
import { IPropsBudgetInfo, IPropsLineChart } from './types';
import Image from 'components/Image';
import Label from 'components/Label';
import LineCharts from 'components/line-charts';

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

  const [lineSpended, setLineSpended] = useState<IPropsLineChart | null>(null);
  const [lineReserved, setLineReserved] = useState<IPropsLineChart | null>(null);

  useEffect(() => {
    const lineForSpended = {
      color:
        spended_budget > spended_budget_last_week
          ? spended_budget < spended_budget_last_week
            ? 'down'
            : 'up'
          : 'stable',
      series_data: [
        {
          name: 'Total',
          data: [spended_budget_last_week, spended_budget],
        },
      ],
    };

    const lineForReserved = {
      color:
        reserved_budget > reserved_budget_last_week
          ? reserved_budget < reserved_budget_last_week
            ? 'down'
            : 'up'
          : 'stable',
      series_data: [
        {
          name: 'Total',
          data: [reserved_budget_last_week, reserved_budget],
        },
      ],
    };

    setLineSpended(lineForSpended);
    setLineReserved(lineForReserved);
  }, [spended_budget, spended_budget_last_week, reserved_budget, reserved_budget_last_week]);

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
            <Grid
              spacing={1}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              component="div"
            >
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Image src="/assets/icons/currency-icon.svg" alt="currency-icon" />
                </Box>
                <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500] }}>
                  {translate('section_portal_reports.spent_budget')}
                </Typography>
                <Typography variant="h4" component="p" sx={{ color: theme.palette.primary.main }}>
                  {currencyFormat.format(spended_budget)}{' '}
                  {translate('section_portal_reports.riyals')}
                </Typography>

                <Label
                  color={
                    (spended_budget > spended_budget_last_week && 'primary') ||
                    (spended_budget === spended_budget_last_week && 'warning') ||
                    (spended_budget < spended_budget_last_week && 'error') ||
                    'default'
                  }
                  sx={{ mr: 1, mt: 1.5 }}
                >
                  {currencyFormat.format(spended_budget_last_week)}{' '}
                  {translate('section_portal_reports.riyals')}
                </Label>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.grey[500], display: 'flex', mt: 1 }}
                >
                  {translate('section_portal_reports.since_last_weeks')}
                </Typography>
              </Grid>
              {lineSpended && (
                <Grid item xs={12} sm={6}>
                  <LineCharts color={lineSpended.color} series_data={lineSpended.series_data} />
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card sx={{ bgcolor: 'white', p: 3, display: 'flex', flexDirection: 'row' }}>
            <Grid
              spacing={1}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              component="div"
            >
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 1,
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

                <Label
                  color={
                    (reserved_budget > reserved_budget_last_week && 'primary') ||
                    (reserved_budget === reserved_budget_last_week && 'warning') ||
                    (reserved_budget < reserved_budget_last_week && 'error') ||
                    'default'
                  }
                  sx={{ mr: 1, mt: 1.5 }}
                >
                  {currencyFormat.format(reserved_budget_last_week)}{' '}
                  {translate('section_portal_reports.riyals')}
                </Label>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.grey[500], display: 'flex', mt: 1 }}
                >
                  {translate('section_portal_reports.since_last_weeks')}
                </Typography>
              </Grid>
              {lineReserved && (
                <Grid item xs={12} sm={6}>
                  <LineCharts color={lineReserved.color} series_data={lineReserved.series_data} />
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
