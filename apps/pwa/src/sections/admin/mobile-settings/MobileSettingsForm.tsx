import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import { role_url_map } from '../../../@types/commons';
import { FormProvider, RHFSwitch, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import Space from '../../../components/space/space';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
import {
  createMobileSetting,
  getMobileSettingById,
  getOneMobileSetting,
  MobileSettingEntity,
  updateMobileSetting,
} from '../../../redux/slices/mobile-settings';
import { dispatch, useSelector } from '../../../redux/store';

type Props = {
  id?: string;
};

export default function MobileSettingsForm(props: Props) {
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // get id from url params
  const params = useParams();
  const id = params?.id;

  // redux
  const { mobile_setting, loadingProps, error, errorChangeState } = useSelector(
    (state) => state.mobileSetting
  );

  const MobileSettingsSchema = Yup.object().shape({
    api_key: Yup.string().required(translate('_mobile_settings.api_key.error.required')),
    user_sender: Yup.string().required(translate('_mobile_settings.user_sender.error.required')),
    username: Yup.string().required(translate('_mobile_settings.username.error.required')),
  });

  const intialValues = useMemo(() => {
    let tmpValues: MobileSettingEntity = {
      api_key: '',
      user_sender: '',
      username: '',
      is_active: false,
    };
    if (mobile_setting && !loadingProps.isLoading && !error) {
      tmpValues = {
        api_key: mobile_setting?.api_key || '',
        user_sender: mobile_setting?.user_sender || '',
        username: mobile_setting?.username || '',
        is_active: mobile_setting?.is_active || false,
      };
    }
    return tmpValues;
  }, [mobile_setting, loadingProps.isLoading, error]);

  const methods = useForm<MobileSettingEntity>({
    resolver: yupResolver(MobileSettingsSchema),
    defaultValues: {
      api_key: intialValues.api_key,
      user_sender: intialValues.user_sender,
      username: intialValues.username,
      is_active: intialValues.is_active,
    },
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const watchVar = watch();

  const onSubmit = async (data: MobileSettingEntity) => {
    if (activeRole) {
      if (id && id !== 'add') {
        await dispatch(
          updateMobileSetting(activeRole, {
            id: id,
            api_key: data.api_key,
            user_sender: data.user_sender,
            username: data.username,
          })
        ).then(() => {
          handleBack();
        });
      } else {
        await dispatch(
          createMobileSetting(activeRole, {
            api_key: data.api_key,
            user_sender: data.user_sender,
            username: data.username,
          })
        ).then(() => {
          handleBack();
        });
      }
    }
  };

  const handleBack = () => {
    navigate(`/${role_url_map[activeRole!]}/dashboard/mobile-settings`);
  };

  useEffect(() => {
    if (errorChangeState) {
      const statusCode = (errorChangeState && errorChangeState.statusCode) || 0;
      const message = (errorChangeState && errorChangeState.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(errorChangeState.message, {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorChangeState]);

  // useEffect(() => {
  //   if (activeRole && id && id !== 'add') {
  //     dispatch(getMobileSettingById(activeRole, id));
  //   }
  // }, [id, activeRole]);

  useEffect(() => {
    if (activeRole) {
      dispatch(getOneMobileSetting(activeRole));
    }
  }, [activeRole]);

  useEffect(() => {
    if (intialValues) {
      reset(intialValues);
    }
  }, [intialValues, reset]);

  if (loadingProps.isLoading) return <div>{translate('pages.common.loading')}</div>;
  if (error) return <div>{translate('pages.common.error')}</div>;

  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Space direction="horizontal" size="small" />
        <Grid container spacing={2}>
          <Grid item md={1} xs={12}>
            <Button
              data-cy="arrow-ios back button"
              disabled={loadingProps.stateLoading}
              color="inherit"
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ p: 1, minWidth: 35, minHeight: 35, mr: 3, mb: 2 }}
            >
              <Iconify
                icon={
                  currentLang.value === 'en'
                    ? 'eva:arrow-ios-back-outline'
                    : 'eva:arrow-ios-forward-outline'
                }
                width={35}
                height={35}
              />
            </Button>
          </Grid>
          <Grid item md={11} xs={12}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              {`${translate('pages.common.mobile_settings')} : MSEGATE`}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mb: '30px' }}>
          <Chip
            label={
              <Typography sx={{ color: '#93A3B0', fontSize: '13px' }}>
                {translate('application_and_admission_settings_form.divider.public_data')}
              </Typography>
            }
          />
        </Divider>
        <Grid container rowSpacing={5} columnSpacing={7}>
          {/* <FormGenerator data={MobileSettingsData} /> */}
          <Grid item md={12} xs={12}>
            <RHFSwitch
              data-cy="_mobile_settings.is_active"
              disabled={loadingProps.stateLoading}
              name="is_active"
              label={translate('_mobile_settings.is_active.label')}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFTextField
              data-cy="_mobile_settings.api_key"
              disabled={loadingProps.stateLoading}
              name={'api_key'}
              label={translate('_mobile_settings.api_key.label')}
              placeholder={translate('_mobile_settings.api_key.placeholder')}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFTextField
              data-cy="_mobile_settings.user_sender"
              disabled={loadingProps.stateLoading}
              name={'user_sender'}
              label={translate('_mobile_settings.user_sender.label')}
              placeholder={translate('_mobile_settings.user_sender.placeholder')}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFTextField
              data-cy="_mobile_settings.username"
              disabled={loadingProps.stateLoading}
              name={'username'}
              label={translate('_mobile_settings.username.label')}
              placeholder={translate('_mobile_settings.username.placeholder')}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              <Stack justifyContent="center" direction="row" gap={3}>
                {/* <Button
                  data-cy="button.back"
                  disabled={loadingProps.stateLoading}
                  sx={{
                    color: 'text.primary',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                  }}
                  onClick={handleBack}
                >
                  {translate('button.back')}
                </Button> */}
                <Button
                  data-cy="button.save"
                  disabled={loadingProps.stateLoading}
                  type="submit"
                  variant="outlined"
                  sx={{
                    backgroundColor: 'background.paper',
                    color: '#fff',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                  }}
                >
                  {translate('button.save')}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </div>
  );
}
