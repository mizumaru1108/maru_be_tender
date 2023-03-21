import React, { useState } from 'react';
import { useParams } from 'react-router';
// @mui
import { Grid, Stack, TextField, Typography, Button, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { LoadingButton } from '@mui/lab';
// components
import CheckBoxSection from './section-track/CheckBoxSection';
// utils
import useLocales from 'hooks/useLocales';
// config
import { IDataTracks } from './TrackBudgetPage';

// ------------------------------------------------------------------------------------------

interface IPropsNewBudget {
  onClose: () => void;
  tracks: IDataTracks[] | [];
}

interface FormData {
  name: string;
  budget: number | undefined;
  track_ids?: string[] | [];
}

interface CreateSectionSnackBar {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

// ------------------------------------------------------------------------------------------

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddNewBudget({ onClose, tracks }: IPropsNewBudget) {
  const { translate } = useLocales();
  const [loading, setloading] = useState(false);

  // Snackbar
  const [openSnackBar, setOpenSnackBar] = React.useState<CreateSectionSnackBar>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar({ open: false, message: '', severity: 'success' });
  };

  const defaultValues = {
    name: '',
    budget: 0,
  };

  const [formState, setFormState] = useState<FormData>(defaultValues);

  // const [valueSubmit, setValueSubmit] = useState<{
  //   name: '';
  //   budget: 0;
  //   track_ids: string[];
  // } | null>(null);

  const onSubmit = async () => {
    console.log(formState);

    // try {
    //   setloading(true);
    //   await axios.post(`${TMRA_RAISE_URL}/track/track-section`, {
    //     name: formState.name,
    //     id: uuidv4(),
    //     budget: formState.budget,
    //     track_id: track_id,
    //     ...(formState.section_id !== '' && { section_id: formState.section_id }),
    //   });
    //   setOpenSnackBar({ open: true, message: 'لقد تم انشاء القسم بنجاح', severity: 'success' });
    //   setloading(false);
    //   await mutate();
    //   onClose();
    // } catch (error) {
    //   setloading(false);
    //   setOpenSnackBar({ open: true, message: error.message, severity: 'error' });
    // }
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Snackbar
        open={openSnackBar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={openSnackBar.severity} sx={{ width: '100%' }}>
          {openSnackBar.message}
        </Alert>
      </Snackbar>

      <Grid item md={6} xs={12}>
        <TextField
          label={translate('pages.admin.tracks_budget.form.name.label')}
          placeholder={translate('pages.admin.tracks_budget.form.name.placeholder')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormState((prevValue: FormData) => ({
              ...prevValue,
              name: e.target.value,
            }));
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          label={translate('pages.admin.tracks_budget.form.amount.label')}
          placeholder={translate('pages.admin.tracks_budget.form.amount.placeholder')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const re = /^[0-9\b]+$/;
            if (e.target.value === '' || re.test(e.target.value)) {
              setFormState((prevValue: FormData) => ({
                ...prevValue,
                budget: +e.target.value as number,
              }));
            }
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
          size="small"
          type="number"
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
          <LoadingButton loading={loading} variant="contained" onClick={onSubmit}>
            {translate('pages.admin.tracks_budget.btn.construction')}
          </LoadingButton>
          <Button variant="outlined" onClick={onClose}>
            {translate('pages.admin.tracks_budget.btn.back')}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
