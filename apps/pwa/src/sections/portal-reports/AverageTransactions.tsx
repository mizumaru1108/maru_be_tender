import { useEffect, useState } from 'react';
import { Typography, Box, Grid, CircularProgress, Card, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
// component
import LineCharts from 'components/line-charts';
import EmptyChart from './EmptyChart';
import Label from 'components/Label';
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
          el.total_execution_time_data_count > el.total_execution_last_week_data_count
            ? el.total_execution_time_data_count < el.total_execution_last_week_data_count
              ? 'down'
              : 'up'
            : 'stable';

        const seriesData = [
          {
            name: 'Total',
            data: [el.total_execution_last_week_data_count, el.total_execution_time_data_count],
          },
        ];

        return {
          ...el,
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
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{translate(item.project_track)}</Typography>
                          <Typography
                            variant="h4"
                            component="p"
                            sx={{ color: theme.palette.primary.main }}
                          >
                            {(item.average + item.average_last_week).toFixed(0)}&nbsp;
                            {translate('section_portal_reports.hours')}
                          </Typography>
                          <Label
                            color={
                              (item.total_execution_time_data_count >
                                item.total_execution_last_week_data_count &&
                                'primary') ||
                              (item.total_execution_time_data_count ===
                                item.total_execution_last_week_data_count &&
                                'warning') ||
                              (item.total_execution_time_data_count <
                                item.total_execution_last_week_data_count &&
                                'error') ||
                              'default'
                            }
                            sx={{ mr: 1, mt: 1.5 }}
                          >
                            {item.total_execution_time - item.total_execution_last_week}{' '}
                            {translate('section_portal_reports.hours')}
                          </Label>
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.grey[500], display: 'flex', mt: 1 }}
                          >
                            {translate('section_portal_reports.since_last_weeks')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <LineCharts key={i} color={item.color} series_data={item.series_data} />
                        </Grid>
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
