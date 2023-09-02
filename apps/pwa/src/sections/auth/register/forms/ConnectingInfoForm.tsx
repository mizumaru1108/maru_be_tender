import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, MenuItem } from '@mui/material';
import axios from 'axios';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import RHFPassword from 'components/hook-form/RHFPassword';
import { FEATURE_MENU_ADMIN_ENTITY_AREA, FEATURE_MENU_ADMIN_REGIONS, TMRA_RAISE_URL } from 'config';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { IRegions } from 'sections/admin/region/list/types';
import { CatchError } from 'utils/catchError';
import * as Yup from 'yup';
import { REGION } from '_mock/region';
import { RegionNames } from '../../../../@types/region';
import { ConnectingValuesProps } from '../../../../@types/register';
import BaseField from '../../../../components/hook-form/BaseField';
import ReplayIcon from '@mui/icons-material/Replay';
import { IGovernorate } from 'sections/admin/governorate/list/types';
import { removeEmptyKey } from 'utils/remove-empty-key';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: ConnectingValuesProps;
  usedNumbers?: string[];
};

const ConnectingInfoForm = ({ children, onSubmit, defaultValues, usedNumbers }: FormProps) => {
  const tmpUsedNumbers: string[] = usedNumbers ?? [];
  // console.log('tmpUsedNumbers', usedNumbers);
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const tmpRegions: any = REGION;

  //
  const [isLoadingRegions, setIsLoadingRegions] = React.useState(false);
  const [regions, setRegions] = React.useState<IRegions[]>([]);
  const [governorates, setGovernorates] = React.useState<IGovernorate[]>([]);
  const [area, setArea] = React.useState<{
    region?: IRegions;
    governorate?: IGovernorate;
  } | null>(null);
  // const [regionId, setRegionId] = React.useState<string>('');

  const fetchRegions = React.useCallback(async () => {
    setIsLoadingRegions(true);
    try {
      const response = await axios.get(
        `${TMRA_RAISE_URL}/region-management/regions?include_relations=governorate&limit=0`
      );
      if (response) {
        const mappedRes = response.data.data
          .filter((item: IRegions) => item.is_deleted !== true)
          .sort((a: IRegions, b: IRegions) => a.name.localeCompare(b.name))
          .map((item: IRegions) => item);
        setRegions(mappedRes);
      }
    } catch (error) {
      setRegions([]);
      const tmpError = await CatchError(error);
      enqueueSnackbar(tmpError.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    } finally {
      setIsLoadingRegions(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phoneNumberValidation = Yup.string()
    // .required(translate('errors.register.phone.required'))
    .nullable()
    .notRequired()
    .test('len', translate('errors.register.phone.length'), (val) => {
      if (val === undefined) {
        return true;
      }
      return val?.length === 0 || val!.length === 9;
    });
  const entityMobileValidation = Yup.string()
    .required(translate('errors.register.entity_mobile.required'))
    .test('len', translate('errors.register.entity_mobile.length'), (val) => {
      const isLength = val?.length === 9;
      return isLength;
    })
    .test('used', translate('errors.register.phone.exist'), (val) => {
      const isUsed = tmpUsedNumbers.includes(`+966${val ?? ''}`);
      return !isUsed;
    });
  const RegisterSchema = Yup.object().shape(
    {
      region: Yup.string().required(translate('errors.register.region.required')),
      governorate: Yup.string().required(translate('errors.register.governorate.required')),
      center_administration: Yup.string(),
      entity_mobile: entityMobileValidation.notOneOf(
        [Yup.ref('phone'), null],
        translate('errors.register.entity_mobile.equal')
      ),
      phone: phoneNumberValidation,
      twitter_acount: Yup.string(),
      website: Yup.string(),
      email: Yup.string()
        .email(translate('errors.register.email.email'))
        .required(translate('errors.register.email.required')),
      password: Yup.string().required(translate('errors.register.password.required')),
    },
    [
      // Add Cyclic deps here because when require itself
      ['phone', 'phone'],
    ]
  );

  const methods = useForm<ConnectingValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
    setValue,
    getValues,
  } = methods;

  const onSubmitForm = async (data: ConnectingValuesProps) => {
    let newTmpNumbers: string[] = [];

    let newEntityMobile = getValues('entity_mobile');
    let newPhoneValues = getValues('phone');
    if (!!newEntityMobile) {
      newEntityMobile.substring(0, 4) !== '+966'
        ? (newEntityMobile = '+966'.concat(`${getValues('entity_mobile')}`))
        : (newEntityMobile = getValues('entity_mobile'));
      newTmpNumbers.push(newEntityMobile);
    }
    if (!!newPhoneValues) {
      newPhoneValues!.substring(0, 4) !== '+966'
        ? (newPhoneValues = '+966'.concat(`${getValues('phone')}`))
        : (newPhoneValues = getValues('phone'));
      newTmpNumbers.push(newPhoneValues!);
    }
    const payload: ConnectingValuesProps = {
      ...data,
      region: area?.region?.name || data.region,
      region_id: area?.region?.region_id,
      governorate: area?.governorate?.name || data.governorate,
      governorate_id: area?.governorate?.governorate_id,
      phone: newPhoneValues!,
      entity_mobile: newEntityMobile!,
      used_numbers: [...newTmpNumbers],
    };
    // console.log('payload', removeEmptyKey(payload));
    // reset({ ...payload });
    onSubmit(payload);
  };

  const handleChangeRegion = (id: string) => {
    if (id) {
      const tmpRegion: IRegions = [...regions].find((item) => item.region_id === id) as IRegions;
      const tmpGovernorates: IGovernorate[] = tmpRegion.governorate.filter(
        (item) => item.is_deleted !== true
      );
      setGovernorates(tmpGovernorates);
      setArea((prevState: any) => ({
        ...prevState,
        region: tmpRegion,
        governorate: null,
      }));
      setValue('governorate', '');
    }
  };

  const handleChangeGovernorate = (id: string) => {
    if (id) {
      const tmpGovernorate: IGovernorate = [...governorates].find(
        (item) => item.governorate_id === id
      ) as IGovernorate;
      setArea((prevState: any) => ({
        ...prevState,
        governorate: tmpGovernorate,
      }));
    }
  };
  // console.log({ area });

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoadingRegions && regions.length > 0 && defaultValues) {
      let newValues = { ...defaultValues };
      const newEntityMobile = defaultValues.entity_mobile?.replace('+966', '');
      const newPhone = defaultValues.phone?.replace('+966', '');
      newValues = { ...newValues, entity_mobile: newEntityMobile, phone: newPhone };
      if (defaultValues.region_id && defaultValues.governorate_id && regions.length > 0) {
        let tmpRegion: IRegions | undefined = undefined;
        if (regions.length > 0) {
          tmpRegion = [...regions].find(
            (item) => item.region_id === defaultValues.region_id
          ) as IRegions;
        }
        if (tmpRegion?.governorate && tmpRegion?.governorate?.length > 0) {
          const tmpGovernorates = [...tmpRegion.governorate].filter(
            (item) => item.is_deleted !== true
          );
          if (tmpGovernorates && tmpGovernorates.length > 0) {
            setGovernorates(tmpGovernorates);
          } else {
            setGovernorates([]);
          }
        } else {
          setGovernorates([]);
        }
        let tmpGovernorate: IGovernorate | undefined = undefined;
        if (tmpRegion && tmpRegion?.governorate?.length > 0) {
          tmpGovernorate = [...tmpRegion.governorate]
            .filter((item) => item.is_deleted !== true)
            .find((item) => item.governorate_id === defaultValues.governorate_id) as IGovernorate;
        }
        newValues = {
          ...newValues,
          region: tmpRegion ? tmpRegion.region_id : '',
          governorate: tmpGovernorate ? tmpGovernorate.governorate_id : '',
        };
        setArea((prevState: any) => ({
          ...prevState,
          region: tmpRegion ? tmpRegion : null,
          governorate: tmpGovernorate ? tmpGovernorate : null,
        }));
      }
      if (!!newValues.entity_mobile) {
        reset({
          center_administration: newValues.center_administration,
          website: newValues.website,
          twitter_acount: newValues.twitter_acount,
          email: newValues.email,
          entity_mobile: newValues.entity_mobile,
          governorate: newValues.governorate,
          password: newValues.password,
          phone: newValues.phone,
          region: newValues.region,
        });
        // setValue('region', newValues.region);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, regions, isLoadingRegions]);

  React.useEffect(() => {
    if (FEATURE_MENU_ADMIN_ENTITY_AREA && FEATURE_MENU_ADMIN_REGIONS) {
      fetchRegions();
    }
  }, [fetchRegions]);
  // console.log({ regions });

  const region = watch('region') as RegionNames | '';

  if (isLoadingRegions) return <>{translate('pages.common.loading')}</>;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={6} xs={12}>
          {/* <BaseField
            type="selectWithoutGenerator"
            name="region"
            label="funding_project_request_form3.region.label"
            placeholder="funding_project_request_form3.region.placeholder"
          >
            <>
              {Object.keys(REGION).map((item, index) => (
                <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                  {item}
                </option>
              ))}
            </>
          </BaseField> */}
          <RHFSelect
            disabled={isLoadingRegions}
            name="region"
            label={translate('funding_project_request_form3.region.label')}
            placeholder={translate('funding_project_request_form3.region.placeholder')}
            SelectProps={{
              MenuProps: {
                PaperProps: { style: { maxHeight: 500 } },
              },
            }}
            onChange={(e) => {
              if (e.target.value !== '') {
                if (FEATURE_MENU_ADMIN_ENTITY_AREA && FEATURE_MENU_ADMIN_REGIONS) {
                  handleChangeRegion(e.target.value as string);
                }
              }
              setValue('region', e.target.value);
            }}
          >
            {FEATURE_MENU_ADMIN_ENTITY_AREA &&
            FEATURE_MENU_ADMIN_REGIONS &&
            regions.length > 0 &&
            !isLoadingRegions
              ? regions.map((option, i) => (
                  <MenuItem key={i} value={option.region_id}>
                    {option.name}
                  </MenuItem>
                ))
              : null}
            {!FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS && !isLoadingRegions
              ? Object.keys(REGION).map((item, index) => (
                  <MenuItem key={index} value={item} style={{ backgroundColor: '#fff' }}>
                    {item}
                  </MenuItem>
                ))
              : null}
          </RHFSelect>
          {FEATURE_MENU_ADMIN_ENTITY_AREA && FEATURE_MENU_ADMIN_REGIONS && regions.length === 0 && (
            <Button
              disabled={isLoadingRegions}
              data-cy={`button-retry-fetching-bank`}
              variant="outlined"
              onClick={() => {
                fetchRegions();
              }}
              endIcon={<ReplayIcon />}
            >
              Re-try Fetching Region
            </Button>
          )}
        </Grid>
        <Grid item md={6} xs={12}>
          {/* <BaseField
            type="selectWithoutGenerator"
            name="governorate"
            label="funding_project_request_form3.city.label"
            placeholder="funding_project_request_form3.city.placeholder"
          >
            {region !== '' && (
              <>
                {REGION[`${region}`].map((item: any, index: any) => (
                  <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                    {item}
                  </option>
                ))}
              </>
            )}
            {region === '' && (
              <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                {translate('funding_project_request_form3.city.placeholder')}
              </option>
            )}
          </BaseField> */}
          <RHFSelect
            disabled={isLoadingRegions}
            name="governorate"
            label={translate('funding_project_request_form3.city.label')}
            placeholder={translate('funding_project_request_form3.city.placeholder')}
            SelectProps={{
              MenuProps: {
                PaperProps: { style: { maxHeight: 500 } },
              },
            }}
            onChange={(e) => {
              if (e.target.value !== '') {
                if (FEATURE_MENU_ADMIN_ENTITY_AREA && FEATURE_MENU_ADMIN_REGIONS) {
                  handleChangeGovernorate(e.target.value as string);
                }
              }
              // console.log('test:', e.target.value);
              setValue('governorate', e.target.value);
            }}
          >
            {FEATURE_MENU_ADMIN_ENTITY_AREA &&
            FEATURE_MENU_ADMIN_REGIONS &&
            governorates.length > 0 &&
            !isLoadingRegions
              ? governorates.map((option, i) => (
                  <MenuItem key={i} value={option.governorate_id}>
                    {option.name}
                  </MenuItem>
                ))
              : null}
            {!FEATURE_MENU_ADMIN_ENTITY_AREA &&
            !FEATURE_MENU_ADMIN_REGIONS &&
            region !== '' &&
            tmpRegions &&
            tmpRegions[`${region}`]
              ? tmpRegions[`${region}`].map((item: any, index: any) => (
                  <MenuItem key={index} value={item} style={{ backgroundColor: '#fff' }}>
                    {item}
                  </MenuItem>
                ))
              : null}
            {!FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS && region === '' ? (
              <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                {translate('funding_project_request_form3.city.placeholder')}
              </option>
            ) : null}
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="center_administration"
            label={translate('register_form2.center.label')}
            placeholder={translate('register_form2.center.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="entity_mobile"
            label={translate('register_form2.mobile_number.label')}
            // placeholder={translate('register_form2.mobile_number.placeholder')}
            placeholder="xxx xxx xxx"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="phone"
            label={translate('register_form2.phone.label')}
            // placeholder={translate('register_form2.phone.placeholder')}
            placeholder="xxx xxx xxx"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="twitter_acount"
            label={translate('register_form2.twitter.label')}
            placeholder={translate('register_form2.twitter.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="website"
            label={translate('register_form2.website.label')}
            placeholder={translate('register_form2.website.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="email"
            label="البريد الإلكتروني للجهة*"
            placeholder={translate('register_form2.email.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFPassword
            name="password"
            label={translate('register_form2.password.label')}
            placeholder={translate('register_form2.password.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;
