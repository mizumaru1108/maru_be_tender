import { Grid, Typography, Stack, useTheme } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';

// -------------------------------------------------------------------------------

interface IPropsEmptyChart {
  type: string;
  title: string;
}

// -------------------------------------------------------------------------------

export default function EmptyChart({ title, type }: IPropsEmptyChart) {
  const { translate } = useLocales();
  const theme = useTheme();

  return (
    <Grid item md={type === 'bar' ? 12 : 6} xs={12}>
      <Typography
        variant="h4"
        sx={{
          ...(type === 'bar' && {
            mt: 6,
          }),
        }}
      >
        {title}
      </Typography>
      {type !== 'bar' ? (
        <Stack
          direction="column"
          sx={{
            width: 200,
            height: 200,
            margin: 'auto',
            border: `10px solid ${theme.palette.grey[300]}`,
            borderRadius: '100%',
            mt: 6,
          }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}
          >
            {translate('section_portal_reports.heading.empty_data')}
          </Typography>
        </Stack>
      ) : (
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}
        >
          {translate('section_portal_reports.heading.empty_data')}
        </Typography>
      )}
    </Grid>
  );
}
