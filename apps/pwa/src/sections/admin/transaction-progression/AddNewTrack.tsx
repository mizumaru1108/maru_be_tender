import { LoadingButton } from '@mui/lab';
import { TextField, Grid, Typography, Button, Stack, Select, MenuItem } from '@mui/material';
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
import { formatCapitalizeText } from 'utils/formatCapitalizeText';

interface Props {
  trackId?: string;
  trackName?: string;
  withConsultation?: boolean;
  isGrants?: boolean;
  isEdit?: boolean;
  isDelete?: boolean;
  onClose: () => void;
}

interface FormInput {
  track_name: string;
  consultant: string;
  is_grant: string;
}

const AddNewTrack = ({
  isEdit = false,
  isDelete = false,
  trackId,
  trackName,
  withConsultation,
  isGrants = false,
  onClose,
}: Props) => {
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
    track_name: trackName ? formatCapitalizeText(trackName) : '',
    consultant:
      withConsultation === undefined
        ? ''
        : withConsultation === true
        ? 'with_consultant'
        : 'without_consultant',
    is_grant: isGrants ? 'grants' : 'non_grants',
  };

  const methods = useForm<FormInput>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: FormInput) => {
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
          is_grant: data?.is_grant === 'grants' ? true : false,
        };

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
        setLoading(false);
        onClose();
      }
    } else {
      try {
        await dispatch(
          updateTrack(
            {
              id: trackId,
              name: TEMP_TRACKNAME,
              with_consultation: consultantValue,
              is_grant: data?.is_grant === 'grants' ? true : false,
              is_deleted: isDelete,
            },
            activeRole!
          )
        );
        await dispatch(getTracks(activeRole!));
      } catch (error) {
        console.log({ error });
      } finally {
        onClose();
      }
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
          {isEdit
            ? `${translate('modal.headline.add_new_track')}`
            : isDelete
            ? translate('modal.headline.delete_track')
            : translate('modal.headline.track')}
        </Typography>
        <Grid item md={12} xs={12} sx={{ mb: 6 }}>
          <RHFTextField
            name="track_name"
            label={translate('modal.label.track_name')}
            placeholder={translate('modal.placeholder.please_type_track_name')}
            disabled={!isEdit}
          />

          <RHFSelectNoGenerator
            name={`consultant`}
            size="medium"
            label={translate('modal.label.consultant')}
            placeholder={translate('modal.placeholder.choose_one')}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 3 }}
            disabled={!isEdit}
          >
            <option value="with_consultant" style={{ backgroundColor: '#fff' }}>
              {/* With Consultant */}
              {translate('modal.value.select.with_consultant')}
            </option>
            <option value="without_consultant" style={{ backgroundColor: '#fff' }}>
              {/* No Consultant */}
              {translate('modal.value.select.no_consultant')}
            </option>
          </RHFSelectNoGenerator>

          <RHFSelectNoGenerator
            name={`is_grant`}
            size="medium"
            label={translate('modal.label.grants')}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 3 }}
            disabled={!isEdit}
          >
            <option value="grants" style={{ backgroundColor: '#fff' }}>
              {/* With Consultant */}
              {translate('modal.value.select.grants')}
            </option>
            <option value="non_grants" style={{ backgroundColor: '#fff' }}>
              {/* No Consultant */}
              {translate('modal.value.select.non_grants')}
            </option>
          </RHFSelectNoGenerator>
        </Grid>

        <Stack justifyContent="center" direction="row" gap={2}>
          {isEdit && !isDelete && (
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
              {translate('button.save')}
            </LoadingButton>
          )}
          {isDelete && (
            <LoadingButton
              loading={loading}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#FF4842',
                color: '#fff',
                width: { xs: '100%', sm: '170px' },
                height: { xs: '100%', sm: '40px' },
                '&:hover': { backgroundColor: '#ff6e66' },
              }}
            >
              {translate('button.delete')}
            </LoadingButton>
          )}
          <Button
            onClick={onClose}
            sx={{
              color: '#000',
              size: 'large',
              width: { xs: '100%', sm: '170px' },
              hieght: { xs: '100%', sm: '40px' },
              ':hover': { backgroundColor: '#DFE3E8' },
            }}
          >
            {translate('button.back')}
          </Button>
        </Stack>
      </Grid>
    </FormProvider>
  );
};

export default AddNewTrack;
