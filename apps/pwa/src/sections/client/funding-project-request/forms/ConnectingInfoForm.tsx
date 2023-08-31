import * as Yup from 'yup';
import React, { useEffect } from 'react';
import { Button, Grid, MenuItem } from '@mui/material';
import { FormProvider, RHFSelect } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseField from 'components/hook-form/BaseField';
import { REGION } from '_mock/region';
import { RegionNames } from '../../../../@types/region';
import useLocales from 'hooks/useLocales';
import { AmandementFields } from '../../../../@types/proposal';
import { useSnackbar } from 'notistack';
import { IRegions } from 'sections/admin/region/list/types';
import { IGovernorate } from 'sections/admin/governorate/list/types';
import axios from 'axios';
import { FEATURE_MENU_ADMIN_ENTITY_AREA, FEATURE_MENU_ADMIN_REGIONS, TMRA_RAISE_URL } from 'config';
import { CatchError } from 'utils/catchError';
import { removeNewLineCharacters } from 'utils/removeNewLineCharacters';
import ReplayIcon from '@mui/icons-material/Replay';
import { removeEmptyKey } from 'utils/remove-empty-key';

type FormValuesProps = {
  pm_name: string;
  pm_mobile: string;
  pm_email: string;
  region: string;
  governorate: string;
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
  revised?: AmandementFields;
};

const ConnectingInfoForm = ({ onSubmit, children, defaultValues, revised }: Props) => {
  const tmpDefaultValues = removeEmptyKey(defaultValues);
  console.log({ revised });
  // console.log({ tmpDefaultValues });
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

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

  const CreatingProposalForm3 = Yup.object().shape({
    pm_name: Yup.string().required(translate('errors.cre_proposal.pm_name.required')),
    pm_mobile: Yup.string()
      // .matches(/^\+9665[0-9]{8}$/, translate('errors.cre_proposal.pm_mobile.message'))
      // .required(translate('errors.cre_proposal.pm_mobile.required')),
      .required(translate('errors.register.phone.length'))
      .test('len', translate('errors.register.phone.length'), (val) => {
        if (val === undefined) {
          return true;
        }
        return val?.length === 0 || val!.length === 9;
      }),
    pm_email: Yup.string()
      .email('Email must be a valid email address')
      .required(translate('errors.cre_proposal.pm_email.required')),
    region: Yup.string().required(translate('errors.cre_proposal.region.required')),
    governorate: Yup.string().required(translate('errors.cre_proposal.governorate.required')),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreatingProposalForm3),
    defaultValues: tmpDefaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    watch,
    reset,
    setValue,
  } = methods;

  const onSubmitForm = async (data: any) => {
    let newEntityMobile = getValues('pm_mobile');

    newEntityMobile.substring(0, 4) !== '+966'
      ? (newEntityMobile = '+966'.concat(`${getValues('pm_mobile')}`))
      : (newEntityMobile = getValues('pm_mobile'));

    const payload = {
      ...data,
      region: area?.region?.name || data.region,
      region_id: area?.region?.region_id || '',
      governorate: area?.governorate?.name || data.governorate,
      governorate_id: area?.governorate?.governorate_id || '',
      pm_mobile: newEntityMobile!,
    };

    // reset({ ...payload });
    onSubmit(removeEmptyKey(payload));
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

  React.useEffect(() => {
    // window.scrollTo(0, 0);
    // let newValues = { ...tmpDefaultValues };
    // const newEntityMobile = tmpDefaultValues.pm_mobile?.replace('+966', '');
    // newValues = { ...newValues, pm_mobile: newEntityMobile };
    // if (!!newValues.pm_name) {
    //   reset(newValues);
    // }
    if (!isLoadingRegions && tmpDefaultValues) {
      let newValues = { ...tmpDefaultValues };
      // const newPhone = tmpDefaultValues.phone?.replace('+966', '');
      const newEntityMobile = tmpDefaultValues.pm_mobile?.replace('+966', '');
      newValues = { ...newValues, pm_mobile: newEntityMobile };
      if (tmpDefaultValues.region_id && tmpDefaultValues.governorate_id && regions.length > 0) {
        const tmpRegion: IRegions = [...regions].find(
          (item) => item.region_id === tmpDefaultValues.region_id
        ) as IRegions;
        setGovernorates(tmpRegion.governorate);
        const tmpGovernorate: IGovernorate = [...tmpRegion.governorate].find(
          (item) => item.governorate_id === tmpDefaultValues.governorate_id
        ) as IGovernorate;
        newValues = {
          ...newValues,
          region: tmpRegion.region_id,
          governorate: tmpGovernorate.governorate_id,
        };
        setArea((prevState: any) => ({
          ...prevState,
          region: tmpRegion,
          governorate: tmpGovernorate,
        }));
      } else {
        const region = Object.keys(REGION).includes(newValues.region) ? newValues.region : '';
        newValues = {
          ...newValues,
          // region: !FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS ? region : '',
          // governorate:
          //   !FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS
          //     ? tmpDefaultValues.governorate
          //     : '',
          region: region,
          governorate: tmpDefaultValues.governorate,
        };
      }
      // console.log({ newValues });
      reset(newValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmpDefaultValues, reset, isLoadingRegions]);

  React.useEffect(() => {
    if (FEATURE_MENU_ADMIN_ENTITY_AREA && FEATURE_MENU_ADMIN_REGIONS) {
      fetchRegions();
    }
  }, [fetchRegions]);

  const region = watch('region') as RegionNames | '';
  const tmpGovernorate = (watch('governorate') as string) || '';

  // console.log({ region, tmpGovernorate });
  if (isLoadingRegions || region === undefined || tmpGovernorate === undefined || !tmpGovernorate)
    return <>{translate('pages.common.loading')}</>;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <BaseField
            disabled={!!revised && revised.hasOwnProperty('pm_name') ? false : !!revised && true}
            type="textField"
            name="pm_name"
            label="funding_project_request_form3.project_manager_name.label"
            placeholder="funding_project_request_form3.project_manager_name.placeholder"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled={!!revised && revised.hasOwnProperty('pm_mobile') ? false : !!revised && true}
            type="textField"
            name="pm_mobile"
            label="funding_project_request_form3.mobile_number.label"
            placeholder="funding_project_request_form3.mobile_number.placeholder"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled={!!revised && revised.hasOwnProperty('pm_email') ? false : !!revised && true}
            type="textField"
            name="pm_email"
            label="funding_project_request_form3.email.label"
            placeholder="funding_project_request_form3.email.placeholder"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          {/* <BaseField
            disabled={!!revised && revised.hasOwnProperty('region') ? false : !!revised && true}
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
            disabled={
              isLoadingRegions ||
              (!!revised && revised.hasOwnProperty('region')
                ? false
                : !!revised && !(region === '' || !region) && true)
            }
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
            {revised &&
            tmpDefaultValues.region_id &&
            tmpDefaultValues.governorate_id &&
            FEATURE_MENU_ADMIN_ENTITY_AREA &&
            FEATURE_MENU_ADMIN_REGIONS &&
            regions.length > 0 &&
            !isLoadingRegions
              ? regions.map((option, i) => (
                  <MenuItem key={i} value={option.region_id}>
                    {option.name}
                  </MenuItem>
                ))
              : null}
            {!revised &&
            FEATURE_MENU_ADMIN_ENTITY_AREA &&
            FEATURE_MENU_ADMIN_REGIONS &&
            regions.length > 0 &&
            !isLoadingRegions
              ? regions.map((option, i) => (
                  <MenuItem key={i} value={option.region_id}>
                    {option.name}
                  </MenuItem>
                ))
              : null}
            {((!FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS) || revised) &&
            !isLoadingRegions
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
            disabled={
              !!revised && revised.hasOwnProperty('governorate') ? false : !!revised && true
            }
            type="selectWithoutGenerator"
            name="governorate"
            label="funding_project_request_form3.city.label"
            placeholder="funding_project_request_form3.city.placeholder"
          >
            {region !== '' && (
              <>
                {REGION[`${removeNewLineCharacters(region) as RegionNames}`].map(
                  (item: any, index: any) => (
                    <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                      {item}
                    </option>
                  )
                )}
              </>
            )}
          </BaseField> */}
          <RHFSelect
            disabled={
              isLoadingRegions ||
              (!!revised && revised.hasOwnProperty('governorate')
                ? false
                : !!revised &&
                  !(tmpGovernorate === '' || !tmpGovernorate) &&
                  !(region === '' || !region) &&
                  true)
            }
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
              setValue('governorate', e.target.value);
            }}
          >
            {!revised &&
            FEATURE_MENU_ADMIN_ENTITY_AREA &&
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
            {revised &&
            tmpDefaultValues.region_id &&
            tmpDefaultValues.governorate_id &&
            FEATURE_MENU_ADMIN_ENTITY_AREA &&
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
            {!((!FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS) || revised) &&
            region !== '' &&
            region !== undefined &&
            !isLoadingRegions &&
            REGION
              ? REGION[`${removeNewLineCharacters(region) as RegionNames}`].map(
                  (item: any, index: any) => (
                    <MenuItem key={index} value={item} style={{ backgroundColor: '#fff' }}>
                      {item}
                    </MenuItem>
                  )
                )
              : null}
            {((!FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS) || revised) &&
            region === '' ? (
              <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                {translate('funding_project_request_form3.city.placeholder')}
              </option>
            ) : null}
          </RHFSelect>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;
