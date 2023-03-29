import { Grid, Stack } from '@mui/material';
import TrackBudget from 'sections/ceo/ceo-dashboard/TrackBudget';
import Settings from './Settings';

function Main() {
  return (
    <Stack direction="column" gap={5}>
      <Grid container spacing={5}>
        <Grid item md={12}>
          <TrackBudget />
        </Grid>
      </Grid>
      <Settings />
    </Stack>
  );
}

export default Main;
