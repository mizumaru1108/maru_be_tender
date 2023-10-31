// material
import { Box, Grid, Typography, Card, Stack } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
import { useTheme } from '@mui/material/styles';
import { CardInsightProps } from './types';
// config
import { FEATURE_DAILY_STATUS } from 'config';
import { useNavigate } from 'react-router';

// -------------------------------------------------------------------------------

export default function CardInsights({
  headline,
  data,
  cardContainerSpacing,
  cardContainerColumns,
  cardItemXsBreakpoints,
  cardItemMdBreakpoints,
  cardStyle,
  icon,
  iconPosition,
}: CardInsightProps) {
  const { translate } = useLocales();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = (link: string) => {
    navigate(link);
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Grid container>
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Typography variant="h4">{translate(headline)}</Typography>
          {!FEATURE_DAILY_STATUS && (
            <Typography variant="inherit" sx={{ fontStyle: 'italic' }}>
              {translate('commons.maintenance_feature_flag')} ...
            </Typography>
          )}
        </Grid>
      </Grid>

      {!FEATURE_DAILY_STATUS ? null : (
        <Grid
          container
          spacing={cardContainerSpacing ?? { xs: 2, md: 4 }}
          direction="row"
          alignItems="center"
          columns={cardContainerColumns ?? 12}
        >
          {data?.length &&
            data.map((item, i) => (
              <Grid
                item
                xs={cardItemXsBreakpoints ?? 6}
                md={cardItemMdBreakpoints ?? 3}
                key={i}
                sx={{ cursor: item?.redirect_link ? 'pointer' : undefined }}
                onClick={() => {
                  if (item?.redirect_link) {
                    handleClick(item.redirect_link);
                  }
                }}
              >
                <Card
                  sx={
                    cardStyle ?? { p: { xs: 2, md: 4 }, bgcolor: theme.palette.background.default }
                  }
                >
                  <Stack display="flex" justifyContent="center" spacing={2}>
                    {icon && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: iconPosition === 'left' ? 'flex-start' : 'flex-end',
                        }}
                      >
                        <img src={icon} alt="" />
                      </Box>
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        color: theme.palette.grey[500],
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
                  </Stack>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
}
