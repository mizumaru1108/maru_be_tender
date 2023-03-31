import React, { useState, useMemo } from 'react';
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

interface IPropsEditSection {
  onClose: () => void;
  tracks: {
    id: string | null;
    name: string | null;
    budget: number;
  };
}

interface FormData {
  name: string;
  budget: number | undefined;
}

// ------------------------------------------------------------------------------------------

export default function EditSection({ onClose, tracks }: IPropsEditSection) {
  const { translate } = useLocales();
  const [loading, setLoading] = useState(false);
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const SubmitFormSchema = Yup.object().shape({
    budget: Yup.number()
      .positive()
      .integer()
      .min(1, translate('Budget must be at least 1'))
      .required('Budget is required'),
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    name: tracks.name || '',
    budget: tracks.budget || 0,
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
    });

    onClose();
  };

  const onSubmitForm = async (formValue: FormData) => {
    setLoading(true);

    try {
      const { status } = await axiosInstance.patch(
        '/tender/proposal/payment/update-track-budget',
        { id: tracks.id, ...formValue },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 200) {
        enqueueSnackbar(
          translate('pages.admin.tracks_budget.notification.success_update_section'),
          {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
          }
        );

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
        {/* <Grid item md={12} xs={12}>
          <Typography sx={{ color: 'rgba(147, 163, 176, 0.8)' }}>
            {translate('pages.admin.tracks_budget.heading.category')}
          </Typography>
        </Grid> */}

        {/* <Grid item md={12} xs={12}>
          <CheckBoxSection item={tracks} state={formState} setState={setFormState} />
        </Grid> */}

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
