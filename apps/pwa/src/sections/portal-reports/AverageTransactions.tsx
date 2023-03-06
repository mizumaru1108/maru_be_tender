import { useEffect, useState } from 'react';
import { Typography, Box, Grid, CircularProgress, Card, useTheme, Stack } from '@mui/material';
import useLocales from 'hooks/useLocales';
// component
import LineCharts from 'components/line-charts';
import EmptyChart from './EmptyChart';
import Label from 'components/Label';
// utils
import { convertMinutestoHours } from 'utils/formatTime';
// types
import { IPropsAvgTransactions } from './types';

//

interface IPropsAvgComponent {
  data: IPropsAvgTransactions[] | [];
  loading: boolean;
}

//

export default function AverageTransaction({ data, loading }: IPropsAvgComponent) {
  const { translate } = useLocales();
  const theme = useTheme();

  const [avgTransactionData, setAvgTransactionData] = useState<IPropsAvgTransactions[] | []>([]);

  useEffect(() => {
    if (data.length) {
      const newData = data.map((el) => {
        const colorIndicator =
          el.raw_total_response_time > el.raw_last_month_total_response_time
            ? el.raw_total_response_time < el.raw_last_month_total_response_time
              ? 'down'
              : 'up'
            : 'stable';
        const seriesData = [
          {
            name: 'Total',
            data: [
              convertMinutestoHours(el.raw_last_month_total_response_time).hours,
              convertMinutestoHours(el.raw_total_response_time).hours,
            ],
          },
        ];
        return {
          ...el,
          fe_average_response_time: convertMinutestoHours(el.raw_average_response_time),
          color: colorIndicator,
          series_data: seriesData,
        };
      });
      setAvgTransactionData(newData);
    }
  }, [data, loading]);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50vh',
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <>
          {avgTransactionData.length ? (
            <>
              <Typography variant="h4">
                {translate('section_portal_reports.heading.average_transaction')}
              </Typography>
              <Grid container spacing={3}>
                {avgTransactionData.map((item, i) => (
                  <Grid xs={6} md={4} item key={i}>
                    <Card sx={{ bgcolor: 'white', p: 2.5 }}>
                      <Grid
                        spacing={1}
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        component="div"
                      >
                        <Grid item xs={12}>
                          <Typography variant="h6">{translate(item.project_track)}</Typography>
                          <Typography
                            component="p"
                            sx={{ color: theme.palette.primary.main, mt: 0.5, mb: 1.5 }}
                          >
                            <Typography variant="h5" component="span">
                              {item.fe_average_response_time?.hours}{' '}
                              {translate('section_portal_reports.hours')}
                            </Typography>
                            &nbsp;&nbsp;&nbsp;
                            <Typography variant="h5" component="span">
                              {item.fe_average_response_time?.minutes}{' '}
                              {translate('section_portal_reports.minutes')}
                            </Typography>
                            &nbsp;&nbsp;&nbsp;
                            <Typography variant="h5" component="span">
                              {item.fe_average_response_time?.seconds}{' '}
                              {translate('section_portal_reports.seconds')}
                            </Typography>
                          </Typography>
                          <Stack component="div" direction="row" alignItems="center" spacing={1.5}>
                            <Label
                              color={
                                (item.raw_total_response_time >
                                  item.raw_last_month_total_response_time &&
                                  'primary') ||
                                (item.raw_total_response_time ===
                                  item.raw_last_month_total_response_time &&
                                  'warning') ||
                                (item.raw_total_response_time <
                                  item.raw_last_month_total_response_time &&
                                  'error') ||
                                'default'
                              }
                            >
                              {
                                convertMinutestoHours(
                                  item.raw_total_response_time -
                                    item.raw_last_month_total_response_time
                                ).hours
                              }{' '}
                              {translate('section_portal_reports.hours')}
                            </Label>
                            <Typography variant="caption" sx={{ color: theme.palette.grey[600] }}>
                              {translate('section_portal_reports.since_last_months')}
                            </Typography>
                          </Stack>
                        </Grid>
                        {/* <Grid item xs={12} md={6}>
                          <LineCharts key={i} color={item.color} series_data={item.series_data} />
                        </Grid> */}
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <EmptyChart
              type="bar"
              title={translate('section_portal_reports.heading.average_transaction')}
            />
          )}
        </>
      )}
    </>
  );
}
