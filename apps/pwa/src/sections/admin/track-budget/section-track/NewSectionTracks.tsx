// react
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
// @mui
import { Button, Container, Grid, Stack, styled, Typography } from '@mui/material';
// components
import Iconify from 'components/Iconify';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import { TrackSection } from '../../../../@types/commons';
import { getTracksById } from '../../../../redux/slices/track';
import { dispatch, useSelector } from '../../../../redux/store';
import FormNestedTrackBudget from '../../../client/funding-project-request/forms/FormNestedTrackBudget';
import { getManySupervisor } from '../../../../redux/slices/user';

// ------------------------------------------------------------------------------------------

export interface SectionInterface {
  id?: string;
  name?: string;
  budget?: number;
}

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

// ------------------------------------------------------------------------------------------

export default function NewSectionTracks() {
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const { id: track_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang, translate } = useLocales();

  const [submitting, setSubmitting] = useState(false);
  const { track, isLoading: load, error } = useSelector((state) => state.tracks);
  const { employee, isLoading: spvLoading } = useSelector((state) => state.user);

  const handleSubmitForm = async (data: TrackSection[]) => {
    try {
      setSubmitting(true);
      const { status } = await axiosInstance.post(
        `/tender/track-sections/save`,
        { sections: data },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 201) {
        enqueueSnackbar(translate('pages.admin.tracks_budget.notification.success_add_section'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        dispatch(getTracksById(activeRole!, track_id || ''));
      }
    } catch (error) {
      if (typeof error.message === 'object') {
        error.message.forEach((el: any) => {
          enqueueSnackbar(el, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        });
      } else {
        const statusCode = (error && error.statusCode) || 0;
        const message = (error && error.message) || null;
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
      setSubmitting(false);
    }
  };

  // fetching track by id
  useEffect(() => {
    dispatch(getTracksById(activeRole!, track_id || ''));
    dispatch(getManySupervisor(activeRole!, track_id));
  }, [activeRole, track_id]);

  // handle error
  useEffect(() => {
    if (!!error) {
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // console.log({ spvLoading });

  if (load || spvLoading) return <>{translate('pages.common.loading')}</>;

  return (
    <Container>
      <ContentStyle>
        <Grid container spacing={4}>
          <Grid item md={12} xs={12}>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ p: 1, minWidth: 25, minHeight: 25, mr: 3 }}
            >
              <Iconify
                icon={
                  currentLang.value === 'en'
                    ? 'eva:arrow-ios-back-outline'
                    : 'eva:arrow-ios-forward-outline'
                }
                width={25}
                height={25}
              />
            </Button>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography flex={1} variant="h4">
                {formatCapitalizeText(track?.name || '-')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <FormNestedTrackBudget
              defaultValuesTrackBudget={
                track && {
                  ...track,
                  track_id: track.id,
                }
              }
              supervisors={
                (employee?.tender_project_supervisor.length > 0 &&
                  employee?.tender_project_supervisor?.map((item) => ({
                    value: item.id || '',
                    label: item.employee_name || '-',
                  }))) ||
                []
              }
              isLoading={submitting}
              onSubmitForm={handleSubmitForm}
            />
          </Grid>
        </Grid>
      </ContentStyle>
    </Container>
  );
}
