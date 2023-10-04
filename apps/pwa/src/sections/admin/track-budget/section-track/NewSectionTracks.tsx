// react
import { useCallback, useEffect, useState } from 'react';
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
import FormNestedTrackBudget, {
  FormTrackBudget,
  TrackSection,
} from '../../../client/funding-project-request/forms/FormNestedTrackBudget';

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

  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [trackValues, setTrackValues] = useState<FormTrackBudget>();

  const { currentLang, translate } = useLocales();

  const fetchingTrackBudget = useCallback(async () => {
    const params = {
      include_relations: `track_sections,proposal`,
    };
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/tender/track/${track_id}`, {
        params: {
          ...params,
        },
        headers: { 'x-hasura-role': activeRole! },
      });
      setTrackValues({
        ...res.data.data,
        track_id: track_id || '-',
      });
    } catch (error) {
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track_id]);

  const handleSubmitForm = async (data: TrackSection[]) => {
    try {
      setSubmitting(true);
      const res = await axiosInstance.post(
        `/tender/track-sections/save`,
        { sections: data },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      enqueueSnackbar(translate('pages.admin.tracks_budget.notification.success_add_section'), {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
      fetchingTrackBudget();
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

  useEffect(() => {
    fetchingTrackBudget();
  }, [fetchingTrackBudget]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;
  // if (error) return <>Opps, something went wrong ...</>;

  // console.log({ data });

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
                {formatCapitalizeText(trackValues?.name || '-')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <FormNestedTrackBudget
              defaultValuesTrackBudget={trackValues}
              isLoading={submitting}
              onSubmitForm={handleSubmitForm}
            />
          </Grid>
        </Grid>
      </ContentStyle>
    </Container>
  );
}
