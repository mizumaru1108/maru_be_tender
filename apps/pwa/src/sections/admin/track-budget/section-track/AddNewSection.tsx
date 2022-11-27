import { Grid, Stack, TextField, Typography, Button, Snackbar } from '@mui/material';
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import React from 'react';
import { useParams } from 'react-router';
import CheckBoxSection from './CheckBoxSection';
import uuidv4 from 'utils/uuidv4';
import { LoadingButton } from '@mui/lab';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axiosInstance from 'utils/axios';

type FormData = {
  name: string;
  budget: number;
  section_id: string;
  track_id: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AddNewSection({ sections, track, onClose, mutate }: any) {
  const [loading, setloading] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success';
  }>({
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
  const { id: track_id } = useParams();
  const defaultValues = {
    name: '',
    budget: 0,
    section_id: '',
    track_id: track_id as string,
  };
  const [formState, setFormState] = React.useState<FormData>(defaultValues);
  const onSubmit = async () => {
    try {
      setloading(true);
      await axiosInstance.post(`/track/track-section`, {
        name: formState.name,
        id: uuidv4(),
        budget: formState.budget,
        track_id: track_id,
        ...(formState.section_id !== '' && { section_id: formState.section_id }),
      });
      setOpenSnackBar({ open: true, message: 'لقد تم انشاء القسم بنجاح', severity: 'success' });
      setloading(false);
      await mutate();
      onClose();
    } catch (error) {
      console.log(error);
      setloading(false);
      setOpenSnackBar({ open: true, message: error.message, severity: 'error' });
    }
  };
  return (
    <Grid container spacing={2} sx={{ mt: '10px' }}>
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
          placeholder="الرجاء كتابة الاسم"
          label="الاسم"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormState((prevValue: FormData) => ({
              ...prevValue,
              name: e.target.value,
            }));
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          placeholder="الرجاء كتابة المبلغ المخصص"
          label="المبلغ المخصص"
          value={formState.budget}
          // disabled={formState.section_id === ''}
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
          // helperText={
          //   formState.section_id === '' && (
          //     <Typography sx={{ backgroundColor: '#fff', color: 'red', fontSize: '14px' }}>
          //       في حال إضافة بند جديد فيجب أن تكون الميزانية الخاصة به مساوية للصفر
          //     </Typography>
          //   )
          // }
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <Typography sx={{ color: 'rgba(147, 163, 176, 0.8)' }}>التصنيف</Typography>
      </Grid>
      <Grid item md={12} xs={12}>
        {[
          {
            id: '',
            name: track.name,
            budget: track.budget,
            section_id: '',
            children: sections,
          },
        ].map((item, index) => (
          <CheckBoxSection key={index} item={item} state={formState} setState={setFormState} />
        ))}
      </Grid>
      <Grid item md={4} xs={4}>
        {''}
      </Grid>
      <Grid item md={4} xs={4}>
        <Stack direction="row" justifyContent={'space-between'}>
          <Button
            sx={{ backgroundColor: '#fff', color: '#000', ':hover': { backgroundColor: '#fff' } }}
            onClick={onClose}
          >
            رجوع
          </Button>
          <LoadingButton
            loading={loading}
            sx={{
              backgroundColor: '#0E8478',
              color: '#fff',
              ':hover': { backgroundColor: '#13B2A2' },
            }}
            onClick={onSubmit}
          >
            إنشاء
          </LoadingButton>
        </Stack>
      </Grid>
      <Grid item md={4} xs={4}>
        {''}
      </Grid>
    </Grid>
  );
}

export default AddNewSection;
