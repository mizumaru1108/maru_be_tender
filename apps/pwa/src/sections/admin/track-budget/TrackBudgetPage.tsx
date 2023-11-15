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
import { getOneEmployee } from '../../../queries/admin/getAllTheEmployees';

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
  const { activeRole, user } = useAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [tracksTempValue, setTrackTempValues] = useState<FormTrackBudget[] | []>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);

  const getTrackDatas = async (track_id?: string) => {
    try {
      setLoadingPage(true);

      const path = !track_id ? '/tender/track' : `/tender/track/${track_id}`;

      const { status, data } = await axiosInstance.get(path, {
        params: {
          is_deleted: '0',
          include_general: '0',
          include_relations: 'track_sections',
          limit: 999,
        },
        headers: { 'x-hasura-role': activeRole! },
      });

      if (status === 200) {
        if (track_id) {
          setTrackTempValues([data.data]);
        } else {
          setTrackTempValues(data.data);
        }
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

  const [{ data: data_employee, fetching: fetching_employee, error: error_employee }] = useQuery({
    query: getOneEmployee,
    variables: { id: user?.id },
  });

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
    if (!fetching_employee) {
      if (activeRole !== 'tender_project_manager') {
        getTrackDatas();
      } else {
        if (data_employee && data_employee.data.track_id) {
          getTrackDatas(data_employee.data.track_id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching_employee, data_employee]);

  if (error || error_employee) return <>Opss. somthing went wrong</>;

  return (
    <React.Fragment>
      {!fetching_employee && !loadingPage && !fetching && data ? (
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
