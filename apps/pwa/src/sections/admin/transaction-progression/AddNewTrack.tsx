import { LoadingButton } from '@mui/lab';
import { TextField, Grid, Typography, Button, Stack } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import useAuth from 'hooks/useAuth';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import RHFSelectNoGenerator from 'components/hook-form/RHFSelectNoGen';
import axiosInstance from 'utils/axios';
import { useSnackbar } from 'notistack';
import { dispatch } from 'redux/store';
import { getTracks, updateTrack } from 'redux/slices/track';

// interface ActionProps {
//   backgroundColor: string;
//   hoverColor: string;
//   actionLabel: string;
//   actionType?: string;
// }
interface Props {
  trackId?: string;
  trackName?: string;
  withConsultation?: boolean;
  isEdit?: boolean;
  // title: string;
  // onSubmit: (data: any) => void;
  onClose: () => void;
  // action: ActionProps;
  // loading?: boolean;
}

interface FormInput {
  track_name: string;
  consultant: string;
}

const AddNewTrack = ({ isEdit = false, onClose, trackId, trackName, withConsultation }: Props) => {
  const navigate = useNavigate();
  const { translate, currentLang } = useLocales();
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  const validationSchema = Yup.object().shape({
    track_name: Yup.string().required(),
    consultant: Yup.string().required(),
  });

  const defaultValues = {
    track_name: trackName ? trackName : '',
    consultant:
      withConsultation === undefined
        ? ''
        : withConsultation === true
        ? 'with_consultant'
        : 'without_consultant',
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
    // navigate('/admin/dashboard/transaction-progression/add');
    let consultantValue: boolean = true;

    if (data.consultant === 'with_consultant') {
      consultantValue = true;
    } else {
      consultantValue = false;
    }

    const TEMP_TRACKNAME = data.track_name.replace(/ /g, '_').toUpperCase();

    if (trackId === undefined) {
      try {
        setLoading(true);
        const payload = {
          name: TEMP_TRACKNAME,
          with_consultation: consultantValue,
        };
        // console.log({ payload });

        await axiosInstance
          .post(`tender/track/create`, payload, {
            headers: { 'x-hasura-role': activeRole! },
          })
          .then((res) => {
            if (res.data.statusCode === 200) {
              enqueueSnackbar('Track was saved', {
                variant: 'success',
                preventDuplicate: true,
                autoHideDuration: 3000,
              });
            }
          });

        setLoading(false);
        dispatch(getTracks(activeRole!));
        onClose();
      } catch (err) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        setLoading(false);
        onClose();
      }
    } else {
      dispatch(
        updateTrack(
          { id: trackId, name: TEMP_TRACKNAME, with_consultation: consultantValue },
          activeRole!
        )
      );

      onClose();
    }
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
          {isEdit ? 'Add a new track' : 'track'}
        </Typography>
        <Grid item md={12} xs={12} sx={{ mb: 6 }}>
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
            disabled={!isEdit}
          />

          <RHFSelectNoGenerator
            name={`consultant`}
            size="medium"
            label="Consultant*"
            placeholder="Chosen one"
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 3 }}
            disabled={!isEdit}
          >
            <option value="with_consultant" style={{ backgroundColor: '#fff' }}>
              With Consultant
            </option>
            <option value="without_consultant" style={{ backgroundColor: '#fff' }}>
              No Consultant
            </option>
          </RHFSelectNoGenerator>
        </Grid>
        {isEdit && (
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
              Save
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
        )}
      </Grid>
    </FormProvider>
  );
};

export default AddNewTrack;
