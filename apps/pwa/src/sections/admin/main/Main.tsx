import { Grid, Stack } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { getOneEmployee } from 'queries/admin/getAllTheEmployees';
import TrackBudget from 'sections/admin/main/TrackBudget';
import { useQuery } from 'urql';
import Settings from './Settings';
import React from 'react';
import { getTracks } from 'redux/slices/track';
import { dispatch } from 'redux/store';

function Main() {
  const { translate } = useLocales();
  const { user, activeRole } = useAuth();

  const [{ data, fetching, error }] = useQuery({
    query: getOneEmployee,
    variables: { id: user?.id },
  });

  React.useEffect(() => {
    dispatch(getTracks(activeRole!));
  }, [activeRole]);

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
