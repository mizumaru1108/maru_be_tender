// component
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import Image from 'components/Image';
// hooks
import useLocales from 'hooks/useLocales';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import { ITrackList } from './TrackBudget';

// ------------------------------------------------------------------------------------------

interface IPropsTrackCard {
  data: ITrackList;
}

// ------------------------------------------------------------------------------------------

export default function TrackCardBudget({ data }: IPropsTrackCard) {
  const theme = useTheme();
  const { translate } = useLocales();

  return (
    <Grid item md={6} xs={12}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {translate(`${data.name}`)}
      </Typography>
      <Stack component="div" direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: '#fff',
            p: 2,
            width: '30%',
          }}
        >
          <Image
            src={`/icons/rial-currency.svg`}
            alt="icon_riyals"
            sx={{ display: 'inline-flex' }}
          />
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
            {translate('content.administrative.statistic.heading.totalReservedBudget')}
          </Typography>
          <Typography
            sx={{
              color: data.total_reserved_budget < 0 ? theme.palette.error.main : 'text.tertiary',
              fontWeight: 700,
            }}
          >
            {fCurrencyNumber(data.total_reserved_budget)}
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: '#fff',
            p: 2,
            width: '30%',
          }}
        >
          <Image
            src={`/icons/rial-currency.svg`}
            alt="icon_riyals"
            sx={{ display: 'inline-flex' }}
          />
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
            {translate('content.administrative.statistic.heading.totalSpendBudget')}
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
            {fCurrencyNumber(data.total_spend_budget)}
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: '#fff',
            p: 2,
            width: '30%',
          }}
        >
          <Image
            src={`/icons/rial-currency.svg`}
            alt="icon_riyals"
            sx={{ display: 'inline-flex' }}
          />
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
            {translate('content.administrative.statistic.heading.totalBudget')}
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
            {fCurrencyNumber(data.total_budget)}
          </Typography>
        </Box>
      </Stack>
    </Grid>
  );
}
