import * as Yup from 'yup';
import { Button, Grid, MenuItem, Typography } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ConnectingValuesProps } from '../../../../@types/register';
import useLocales from 'hooks/useLocales';
import { RegionNames } from '../../../../@types/region';
import RHFPassword from 'components/hook-form/RHFPassword';
import React, { useEffect, useMemo, useState } from 'react';
import RHFSelectNoGenerator from '../../../../components/hook-form/RHFSelectNoGen';
import { useSnackbar } from 'notistack';
import { IRegions } from 'sections/admin/region/list/types';
import { IGovernorate } from 'sections/admin/governorate/list/types';
import axios from 'axios';
import { FEATURE_MENU_ADMIN_ENTITY_AREA, FEATURE_MENU_ADMIN_REGIONS, TMRA_RAISE_URL } from 'config';
import { CatchError } from 'utils/catchError';
import ReplayIcon from '@mui/icons-material/Replay';
import { REGION } from '_mock/region';
import { removeEmptyKey } from 'utils/remove-empty-key';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: ConnectingValuesProps;
  isEdit?: boolean;
};

const ConnectingInfoForm = ({ children, onSubmit, defaultValues, isEdit }: FormProps) => {
  // console.log('defaultValues', defaultValues);
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const tmpRegions: any = REGION;

  const [isLoadingRegions, setIsLoadingRegions] = React.useState(false);
  const [regions, setRegions] = React.useState<IRegions[]>([]);
  const [governorates, setGovernorates] = React.useState<IGovernorate[]>([]);
  const [area, setArea] = React.useState<{
    region?: IRegions;
    governorate?: IGovernorate;
  } | null>(null);

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

  const RegisterSchema = Yup.object().shape({
    region: Yup.string().required('Region name required'),
    governorate: Yup.string().required('City name required'),
    // center_administration: Yup.string().required('Center is required'),
    phone: Yup.string()
      .required(translate('errors.register.phone.required'))
      .test('len', translate('errors.register.phone.length'), (val) => {
        if (val === undefined) {
          return true;
        }

        return val.length === 0 || val!.length === 9;
      }),
    twitter_acount: Yup.string(),
    website: Yup.string(),
  });

  const methods = useForm<ConnectingValuesProps>({
    resolver: yupResolver(RegisterSchema),
    // defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
    setValue,
  } = methods;

  const onSubmitForm = async (data: ConnectingValuesProps) => {
    let newData = { ...data };
    const newPhone =
      data && data.phone && data.phone.split('')[4] === '+966' ? data.phone : `+966${data.phone}`;
    const newEntityMobile =
      data && data.entity_mobile && data.entity_mobile.split('')[4] === '+966'
        ? data.entity_mobile
        : `+966${data.entity_mobile}`;
    newData.phone = newPhone;
    newData.entity_mobile = newEntityMobile;
    newData = {
      ...newData,
      region: area?.region?.name || data.region,
      region_id: area?.region?.region_id,
      governorate: area?.governorate?.name || data.governorate,
      governorate_id: area?.governorate?.governorate_id,
    };
    // console.log('payload:', removeEmptyKey(newData));
    onSubmit(removeEmptyKey(newData));
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

  useEffect(() => {
    // window.scrollTo(0, 0);
    // let newValues = { ...defaultValues };
    // const newPhone = defaultValues.phone?.replace('+966', '');
    // const newEntityMobile = defaultValues.entity_mobile?.replace('+966', '');
    // // console.log('type of region : ', Object.keys(REGION).includes(newValues.region));
    // const region = Object.keys(REGION).includes(newValues.region) ? newValues.region : '';
    // newValues = { ...newValues, phone: newPhone, entity_mobile: newEntityMobile, region };
    // // console.log({ newValues });
    // reset(newValues);
    if (!isLoadingRegions && defaultValues) {
      let newValues = { ...defaultValues };
      const newPhone = defaultValues.phone?.replace('+966', '');
      const newEntityMobile = defaultValues.entity_mobile?.replace('+966', '');
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
            setGovernorates(tmpRegion?.governorate);
          } else {
            setGovernorates([]);
          }
        } else {
          setGovernorates([]);
        }
        let tmpGovernorate: IGovernorate | undefined = undefined;
        if (tmpRegion && tmpRegion?.governorate?.length > 0) {
          tmpGovernorate = [...tmpRegion.governorate].find(
            (item) => item.governorate_id === defaultValues.governorate_id
          ) as IGovernorate;
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
      } else {
        const region = Object.keys(REGION).includes(newValues.region) ? newValues.region : '';
        newValues = {
          ...newValues,
          region: !FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS ? region : '',
          governorate:
            !FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS
              ? defaultValues.governorate
              : '',
        };
      }
      // console.log({ region });
      reset(newValues);
      // if (!!newValues.entity_mobile) {
      //   reset({
      //     center_administration: newValues.center_administration,
      //     website: newValues.website,
      //     twitter_acount: newValues.twitter_acount,
      //     email: newValues.email,
      //     entity_mobile: newValues.entity_mobile,
      //     governorate: newValues.governorate,
      //     password: newValues.password,
      //     phone: newValues.phone,
      //     region: region,
      //   });
      // setValue('region', newValues.region);
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, reset, isLoadingRegions]);

  React.useEffect(() => {
    if (FEATURE_MENU_ADMIN_ENTITY_AREA && FEATURE_MENU_ADMIN_REGIONS) {
      fetchRegions();
    }
  }, [fetchRegions]);
  // console.log({ area });
  const region = watch('region') as RegionNames | '';
  const tmpGovernorate = (watch('governorate') as string) || null;

  if (isLoadingRegions) return <>{translate('pages.common.loading')}</>;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={6} xs={12}>
          {/* <RHFSelectNoGenerator
            name="region"
            disabled={isEdit}
            label={translate('register_form2.region.label')}
            placeholder={translate('register_form2.region.placeholder')}
          >
            <>
              {Object.keys(REGION).map((item, index) => (
                <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                  {item}
                </option>
              ))}
            </>
          </RHFSelectNoGenerator> */}
          <RHFSelect
            disabled={isLoadingRegions || isEdit}
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
              disabled={isLoadingRegions || isEdit}
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
          <RHFSelect
            disabled={isLoadingRegions || isEdit}
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
            governorates &&
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
            tmpRegions.length > 0
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
            disabled={isEdit}
            name="center_administration"
            label={translate('register_form2.center.label')}
            placeholder={translate('register_form2.region.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="phone"
            label={translate('register_form2.phone.label')}
            placeholder={'xxx xxx xxx'}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="twitter_acount"
            label={translate('register_form2.twitter.label')}
            placeholder={translate('register_form2.twitter.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="entity_mobile"
            label={translate('register_form2.entity_mobile.label')}
            placeholder={'xxx xxx xxx'}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="website"
            disabled={isEdit}
            label={translate('register_form2.website.label')}
            placeholder={translate('register_form2.website.placeholder')}
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
