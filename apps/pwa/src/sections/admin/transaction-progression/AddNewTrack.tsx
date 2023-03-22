import { LoadingButton } from '@mui/lab';
import { TextField, Grid, Typography, Button, Stack } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';

// interface ActionProps {
//   backgroundColor: string;
//   hoverColor: string;
//   actionLabel: string;
//   actionType?: string;
// }
interface Props {
  // title: string;
  // onSubmit: (data: any) => void;
  onClose: () => void;
  // action: ActionProps;
  loading?: boolean;
}

interface FormInput {
  track_name: string;
}

const AddNewTrack = ({ onClose, loading }: Props) => {
  const navigate = useNavigate();
  const { translate, currentLang } = useLocales();
  const [open, setOpen] = React.useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    track_name: Yup.string().required(),
  });

  const defaultValues = {
    track_name: '',
  };

  const methods = useForm<FormInput>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: any) => {
    // onSubmit(data);
    navigate('/admin/dashboard/transaction-progression/add');
    console.log({ data });
  };

  return (
    <FormProvider methods={methods}>
      <Grid sx={{ p: 3 }}>
        <Button
          color="inherit"
          variant="contained"
          onClick={onClose}
          sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
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
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', mb: 7, mt: 3 }}
        >
          Add a new track
        </Typography>
        <Grid item md={6} xs={12} sx={{ mb: 6 }}>
          {/* <TextField
          placeholder="Please type the track name"
          label="Track name"
          InputLabelProps={{ shrink: true }}
          fullWidth
        /> */}
          <RHFTextField
            name="track_name"
            label="Track name"
            placeholder="Please type the track name"
          />
        </Grid>
        <Stack justifyContent="center" direction="row" gap={2}>
          <LoadingButton
            loading={loading}
            onClick={handleSubmit(onSubmitForm)}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              width: { xs: '100%', sm: '170px' },
              height: { xs: '100%', sm: '40px' },
              '&:hover': { backgroundColor: '#13B2A2' },
            }}
          >
            Next Step
          </LoadingButton>
          <Button
            onClick={onClose}
            sx={{
              color: '#000',
              size: 'large',
              width: { xs: '100%', sm: '170px' },
              hieght: { xs: '100%', sm: '40px' },
              ':hover': { backgroundColor: '#efefef' },
            }}
          >
            {/* إغلاق */}
            Back
          </Button>
        </Stack>
      </Grid>
    </FormProvider>
  );
};

export default AddNewTrack;
