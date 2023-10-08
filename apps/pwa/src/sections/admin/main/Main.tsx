import { Grid, Stack } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { getOneEmployee } from 'queries/admin/getAllTheEmployees';
import TrackBudget from 'sections/admin/main/TrackBudget';
import { useQuery } from 'urql';
import Settings from './Settings';

function Main() {
  const { translate } = useLocales();
  const { user } = useAuth();

  const [{ data, fetching, error }] = useQuery({
    query: getOneEmployee,
    variables: { id: user?.id },
  });

  if (fetching) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;
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
