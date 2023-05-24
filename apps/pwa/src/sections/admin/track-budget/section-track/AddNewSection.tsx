import { useState, useMemo, useEffect } from 'react';
// @mui
import { Grid, Stack, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import CheckBoxSection from 'sections/admin/track-budget/section-track/CheckBoxSection';
// utils
import axiosInstance from 'utils/axios';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
// config
import { IDataTracks } from 'sections/admin/track-budget/TrackBudgetPage';
//
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'components/hook-form';
import { useSnackbar } from 'notistack';

// ------------------------------------------------------------------------------------------

interface IPropsNewBudget {
  onClose: () => void;
  tracks: IDataTracks;
}

interface FormData {
  name: string;
  budget: number | undefined;
  track_ids: string[] | [];
}

// ------------------------------------------------------------------------------------------

export default function AddNewSection({ onClose, tracks }: IPropsNewBudget) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  console.log({ tracks });

  const SubmitFormSchema = Yup.object().shape({
    budget: Yup.number()
      .positive()
      .integer()
      .min(1, translate('Budget must be at least 1'))
      .required('Budget is required'),
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    name: '',
    budget: 0,
    track_ids: [],
  };

  const [formState, setFormState] = useState<FormData>(defaultValues);

  const methods = useForm<FormData>({
    resolver: yupResolver(SubmitFormSchema),
    defaultValues: useMemo(() => formState, [formState]),
  });

  const { handleSubmit, reset } = methods;

  const handleClose = () => {
    reset({
      name: '',
      budget: 0,
      track_ids: [],
    });

    onClose();
  };

  const onSubmitForm = async (formValue: FormData) => {
    if (!formState.track_ids.length) {
      enqueueSnackbar(translate('pages.admin.tracks_budget.notification.empty_selected_track'), {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } else {
      setLoading(true);

      try {
        const { status } = await axiosInstance.post(
          '/tender/proposal/payment/add-track-budget',
          { ...formValue, track_ids: formState.track_ids },
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
          setLoading(false);
          onClose();
          window.location.reload();
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
        setLoading(false);
        onClose();
      }
    }
  };
  useEffect(() => {
    if (tracks && tracks.id) {
      setFormState((data: any) => {
        const tmpValues = { ...data };
        return { ...data, track_ids: [tracks.id] };
      });
    }
  }, [tracks]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="name"
            type="text"
            size="small"
            label={translate('pages.admin.tracks_budget.form.name.label')}
            placeholder={translate('pages.admin.tracks_budget.form.name.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="budget"
            type="number"
            size="small"
            label={translate('pages.admin.tracks_budget.form.amount.label')}
            placeholder={translate('pages.admin.tracks_budget.form.amount.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography sx={{ color: 'rgba(147, 163, 176, 0.8)' }}>
            {translate('pages.admin.tracks_budget.heading.category')}
          </Typography>
        </Grid>

        <Grid item md={12} xs={12}>
          <CheckBoxSection item={tracks} state={formState} setState={setFormState} />
        </Grid>

        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ pt: 4, pb: 2 }}
          >
            <LoadingButton loading={loading} variant="contained" type="submit">
              {translate('pages.admin.tracks_budget.btn.construction')}
            </LoadingButton>
            <Button variant="outlined" onClick={handleClose}>
              {translate('pages.admin.tracks_budget.btn.back')}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
