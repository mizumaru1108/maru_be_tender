import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router';
// @mui
import { Grid, Stack, TextField, Typography, Button } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { LoadingButton } from '@mui/lab';
// components
import CheckBoxSection from './section-track/CheckBoxSection';
// utils
import useLocales from 'hooks/useLocales';
// config
import { IDataTracks } from './TrackBudgetPage';
//
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'components/hook-form';
import { useSnackbar } from 'notistack';

// ------------------------------------------------------------------------------------------

interface IPropsNewBudget {
  onClose: () => void;
  tracks: IDataTracks[] | [];
}

interface FormData {
  name: string;
  budget: number | undefined;
  track_ids: string[] | [];
}

// ------------------------------------------------------------------------------------------

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddNewBudget({ onClose, tracks }: IPropsNewBudget) {
  const { translate } = useLocales();
  const [loading, setloading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const SubmitFormSchema = Yup.object().shape({
    budget: Yup.number()
      .positive()
      .integer()
      .min(1, translate('Budget must be at least 1'))
      .required('Budget is required'),
    name: Yup.string().required('Name is required'),
    // track_ids: Yup.array().min(1, translate('Track is required')),
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

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
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
      console.log({ ...formValue, track_ids: formState.track_ids });
    }
  };

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
          {tracks.map((item, index) => (
            <CheckBoxSection key={index} item={item} state={formState} setState={setFormState} />
          ))}
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
