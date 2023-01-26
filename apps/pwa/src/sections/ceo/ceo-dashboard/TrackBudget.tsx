import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import Label from 'components/Label';
import useLocales from 'hooks/useLocales';
//
import { fCurrencyNumber } from 'utils/formatNumber';

type Props = {
  data: {
    subtitle: string;
    type?: {
      label?: string;
      value?: number;
    };
    compareValue?: string;
    color?: string;
  }[];
};
function TrackBudget({ data }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();
  return (
    <Grid container spacing={5}>
      {data.map((item, index) => (
        <Grid item md={2.4} xs={12} key={index}>
          <Stack
            component="div"
            spacing={1}
            sx={{
              textAlign: 'left',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '5px',
            }}
            key={index}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <img src="/assets/icons/currency-icon.svg" alt="currency-icon" />
            </Box>
            {item.subtitle && (
              <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500] }}>
                {item.subtitle}
                {/* {translate(item.subtitle)} */}
              </Typography>
            )}
            {item.type && (
              <Typography variant="h4" component="p" sx={{ color: theme.palette.primary.main }}>
                {fCurrencyNumber(item.type?.value!)}
              </Typography>
            )}
            {item.compareValue && (
              <Box>
                <Label
                  color={
                    (item.color === 'up' && 'primary') ||
                    (item.color === 'stable' && 'warning') ||
                    (item.color === 'down' && 'error') ||
                    'default'
                  }
                  sx={{ mr: 1 }}
                >
                  {item.compareValue} {translate(item.type?.label)}
                </Label>
                <Typography variant="caption" sx={{ color: theme.palette.grey[500] }}>
                  {translate('section_portal_reports.since_last_weeks')}
                </Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

export default TrackBudget;
