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
import { useQuery } from 'urql';
//
import { useSnackbar } from 'notistack';
import { FEATURE_NESTED_TRACK_BUDGET } from 'config';
import { FormTrackBudget } from '../../client/funding-project-request/forms/FormNestedTrackBudget';

// ------------------------------------------------------------------------------------------

export interface IDataTracks {
  id: string | null;
  name: string | null;
  budget: number;
  track_sections:
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
  const [tracksTempValue, setTrackTempValues] = useState<FormTrackBudget[] | []>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);

  const getTrackDatas = async () => {
    try {
      setLoadingPage(true);
      const { status, data } = await axiosInstance.get('/tender/track', {
        params: { is_deleted: '0', include_general: '0', include_relations: 'track_sections' },
        headers: { 'x-hasura-role': activeRole! },
      });

      if (status === 200) {
        setTrackTempValues(data.data);
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
        const statusCode = (err && err.statusCode) || 0;
        const message = (err && err.message) || null;
        enqueueSnackbar(
          `${
            statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
          }`,
          {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          }
        );
      }
    } finally {
      setLoadingPage(false);
    }
  };

  const [{ data, fetching, error }] = useQuery({
    query: `
      query getListTrack {
        track {
          id
          name
          track_sections{
            id
            name
            budget
          }
        }
      }
    `,
  });

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

  if (error) return <>Opss. somthing went wrong</>;

  return (
    <React.Fragment>
      {!loadingPage && !fetching && data ? (
        <Grid container spacing={3}>
          {FEATURE_NESTED_TRACK_BUDGET ? null : (
            <ModalDialog
              styleContent={{ p: 4, backgroundColor: '#fff' }}
              isOpen={open}
              maxWidth="md"
              title={translate('pages.admin.tracks_budget.heading.add_new_budget')}
              content={<AddNewBudget onClose={handleOnClose} tracks={data.track} />}
              onClose={handleOnClose}
            />
          )}
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
              {FEATURE_NESTED_TRACK_BUDGET ? null : (
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
              )}
            </Stack>
          </Grid>
          {tracksTempValue.length
            ? tracksTempValue
                .sort((orderA, orderB) => (orderB?.total_budget || 0) - (orderA?.total_budget || 0))
                .map((item: FormTrackBudget, index: number) => (
                  <Grid item md={12} xs={12} key={index}>
                    <Track key={index} name={item.name} id={item.id} budget={item.total_budget} />
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
