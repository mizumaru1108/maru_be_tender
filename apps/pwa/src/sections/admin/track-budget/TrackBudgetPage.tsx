import React, { useState, useEffect } from 'react';
// @mui
import { Button, Grid, Stack, Typography } from '@mui/material';
// components
import ModalDialog from 'components/modal-dialog';
import AddNewBudget from './AddNewBudget';
import Track from './Track';
// utils
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
import axiosInstance from 'utils/axios';
import { useSnackbar } from 'notistack';

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
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [tracksValue, setTrackValues] = useState<IDataTracks[] | []>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);

  const getTrackDatas = async () => {
    setLoadingPage(true);

    try {
      const { status, data } = await axiosInstance.get(
        '/tender/proposal/payment/find-track-budget',
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 200) {
        setTrackValues(data.data);
        setLoadingPage(false);
      }
    } catch (err) {
      if (typeof err.message === 'object') {
        err.message.forEach((el: any) => {
          enqueueSnackbar(el, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        });
      } else {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      }

      setLoadingPage(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getTrackDatas();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {!loadingPage ? (
        <Grid container spacing={3}>
          <ModalDialog
            styleContent={{ p: 4, backgroundColor: '#fff' }}
            isOpen={open}
            maxWidth="md"
            title={translate('pages.admin.tracks_budget.heading.add_new_budget')}
            content={<AddNewBudget onClose={handleOnClose} tracks={tracksValue} />}
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
          {tracksValue.length
            ? tracksValue.map((item: IDataTracks, index: number) => (
                <Grid item md={12} xs={12} key={index}>
                  <Track key={index} name={item.name} id={item.id} budget={item.budget} />
                </Grid>
              ))
            : null}
        </Grid>
      ) : (
        <>Loading ...</>
      )}
    </React.Fragment>
  );
}
