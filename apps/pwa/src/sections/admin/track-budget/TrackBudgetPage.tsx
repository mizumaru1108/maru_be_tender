import React from 'react';
// @mui
import { Button, Grid, Stack, Typography } from '@mui/material';
// components
import ModalDialog from 'components/modal-dialog';
import AddNewBudget from './AddNewBudget';
import Track from './Track';
// utils
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';

// ------------------------------------------------------------------------------------------

export interface IDataTracks {
  id: string | null;
  name: string | null;
  budget: number;
  sections:
    | {
        id: string | null;
        name: string | null;
        budget: number;
      }[]
    | [];
}

// ------------------------------------------------------------------------------------------

export default function TrackBudgetPage() {
  const { translate } = useLocales();

  const [open, setOpen] = React.useState<boolean>(false);

  const [result] = useQuery({
    query: `
      query getListTrack {
        track {
          id
          name
          budget
          sections{
            id
            name
            budget
          }
        }
      }
    `,
  });

  const { data, fetching, error } = result;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  if (fetching) return <>... Loading</>;
  if (error) return <>Opss. somthing went wrong</>;

  return (
    <Grid container spacing={3}>
      <ModalDialog
        styleContent={{ p: 4, backgroundColor: '#fff' }}
        isOpen={open}
        maxWidth="md"
        title={translate('pages.admin.tracks_budget.heading.add_new_budget')}
        content={<AddNewBudget onClose={handleOnClose} tracks={data.track} />}
        onClose={handleOnClose}
      />
      <Grid item xs={12}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          component="div"
          sx={{ my: 2 }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
            {translate('pages.admin.tracks_budget.heading.main')}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#0E8478',
              color: '#fff',
              ':hover': { backgroundColor: '#13B2A2' },
            }}
            size="large"
            onClick={handleOpen}
          >
            {translate('pages.admin.tracks_budget.btn.add_budget')}
          </Button>
        </Stack>
      </Grid>

      {/* Comment first after add budget is done */}
      {data.track.map((item: IDataTracks, index: number) => (
        <Grid item md={12} xs={12} key={index}>
          <Track key={index} name={item.name} id={item.id} budget={item.budget} />
        </Grid>
      ))}
    </Grid>
  );
}
