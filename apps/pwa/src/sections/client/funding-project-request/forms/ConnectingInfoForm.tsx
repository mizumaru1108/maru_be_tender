import { yupResolver } from '@hookform/resolvers/yup';
import ReplayIcon from '@mui/icons-material/Replay';
import { Button, Grid, MenuItem } from '@mui/material';
import axios from 'axios';
import { FormProvider, RHFSelect } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import {
  FEATURE_MENU_ADMIN_ENTITY_AREA,
  FEATURE_MENU_ADMIN_REGIONS,
  FEATURE_PROPOSAL_MULTIPLE_REGION_ENTITY_AREA,
  TMRA_RAISE_URL,
} from 'config';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { IGovernorate } from 'sections/admin/governorate/list/types';
import { IRegions } from 'sections/admin/region/list/types';
import { CatchError } from 'utils/catchError';
import { removeEmptyKey } from 'utils/remove-empty-key';
import { removeNewLineCharacters } from 'utils/removeNewLineCharacters';
import * as Yup from 'yup';
import { REGION } from '_mock/region';
import { AmandementFields } from '../../../../@types/proposal';
import { RegionNames } from '../../../../@types/region';
import RHFComboBox, { ComboBoxOption } from '../../../../components/hook-form/RHFComboBox';

type FormValuesProps = {
  pm_name: string;
  pm_mobile: string;
  pm_email: string;
  region: string;
  governorate: string;
  regions_id: ComboBoxOption[];
  governorates_id: ComboBoxOption[];
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
  revised?: AmandementFields;
};

const ConnectingInfoForm = ({ onSubmit, children, defaultValues, revised }: Props) => {
  const tmpDefaultValues = removeEmptyKey(defaultValues);
  // console.log({ revised });
  // console.log({ tmpDefaultValues, defaultValues });
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

  const [formField, setFormField] = React.useState<{
    regions?: IRegions[];
    governorates?: IGovernorate[];
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

  const CreatingProposalForm3 = React.useMemo(() => {
    const tmpRevised = revised || undefined;
    return Yup.object().shape({
      pm_name: Yup.string().required(translate('errors.cre_proposal.pm_name.required')),
      pm_mobile: Yup.string()
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
      // region: Yup.string().required(translate('errors.cre_proposal.region.required')),
      // governorate: Yup.string().required(translate('errors.cre_proposal.governorate.required')),
      // ...(FEATURE_PROPOSAL_MULTIPLE_REGION_ENTITY_AREA
      //   ? null
      //   : tmpRevised
      //   ? null
      //   : {
      //       region: Yup.string().required(translate('errors.cre_proposal.region.required')),
      //       governorate: Yup.string().required(
      //         translate('errors.cre_proposal.governorate.required')
      //       ),
      //     }),
      ...(tmpRevised
        ? null
        : FEATURE_PROPOSAL_MULTIPLE_REGION_ENTITY_AREA
        ? {
            regions_id: Yup.array()
              .min(1, translate('portal_report.errors.region_id.required'))
              .required(translate('portal_report.errors.region_id.required'))
              .nullable(),
            governorates_id: Yup.array()
              .min(1, translate('portal_report.errors.governorate_id.required'))
              .required(translate('portal_report.errors.governorate_id.required'))
              .nullable(),
          }
        : {
            region: Yup.string().required(translate('errors.cre_proposal.region.required')),
            governorate: Yup.string().required(
              translate('errors.cre_proposal.governorate.required')
            ),
          }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revised]);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreatingProposalForm3),
    defaultValues: {
      ...tmpDefaultValues,
      pm_email:
        tmpDefaultValues?.pm_email && tmpDefaultValues?.pm_email !== ''
          ? removeNewLineCharacters(tmpDefaultValues.pm_email)
          : '',
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    watch,
    reset,
    setValue,
  } = methods;
  const watchRegionsId = watch('regions_id');
  // const watchGovernoratesId = watch('governorates_id');
  // console.log({ watchRegionsId, watchGovernoratesId, tmpDefaultValues });

  const onSubmitForm = async (data: FormValuesProps) => {
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
    // console.log({ payload });
    onSubmit(removeEmptyKey(payload));
  };

  //  handle for single selected region
  const handleChangeRegion = (id: string) => {
    if (id && regions && regions.length > 0) {
      const tmpRegion: IRegions = [...regions].find((item) => item.region_id === id) as IRegions;
      if (tmpRegion) {
        const tmpGovernorates: IGovernorate[] | undefined =
          tmpRegion?.governorate &&
          tmpRegion?.governorate.filter((item) => item.is_deleted !== true);
        if (tmpGovernorates) setGovernorates(tmpGovernorates);
        setArea((prevState: any) => ({
          ...prevState,
          region: tmpRegion,
          governorate: null,
        }));
      }
      setValue('governorate', '');
    }
  };

  // handle for single selected governorate
  const handleChangeGovernorate = (id: string) => {
    if (id && governorates && governorates.length > 0) {
      const tmpGovernorate: IGovernorate = [...governorates].find(
        (item) => item.governorate_id === id
      ) as IGovernorate;
      setArea((prevState: any) => ({
        ...prevState,
        governorate: tmpGovernorate,
      }));
    }
  };

  const handleChangeRegions = React.useCallback(
    (options: ComboBoxOption[]) => {
      if (options && options.length > 0) {
        const regionsId = options.map((item) => item.value);
        const tmpRegions = regions.filter((region) => regionsId.includes(region.region_id));
        const tmpGovernorates = tmpRegions
          .filter((item) => item.governorate && item.governorate.length > 0)
          .map((item) => item.governorate)
          .flat();
        // console.log('masuk sini');
        setFormField((prevState: any) => ({
          ...prevState,
          regions: tmpRegions && tmpRegions.length > 0 ? tmpRegions : null,
          governorates:
            tmpGovernorates && tmpGovernorates.length > 0
              ? tmpGovernorates.filter((item) => item?.is_deleted === false)
              : null,
        }));
      } else {
        setFormField((prevState: any) => ({
          ...prevState,
          regions: null,
          governorates: null,
        }));
        setValue('governorates_id', []);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [regions]
  );

  React.useEffect(() => {
    handleChangeRegions(watchRegionsId);
  }, [watchRegionsId, handleChangeRegions]);

  React.useEffect(() => {
    if (!isLoadingRegions && tmpDefaultValues) {
      let newValues = { ...tmpDefaultValues };
      const newEntityMobile = tmpDefaultValues.pm_mobile?.replace('+966', '');
      newValues = { ...newValues, pm_mobile: newEntityMobile };
      if (tmpDefaultValues?.regions_id && tmpDefaultValues?.regions_id?.length > 0) {
        newValues = {
          ...newValues,

          regions_id: tmpDefaultValues?.regions_id,
        };
      } else {
        newValues = { ...newValues, regions_id: [] };
      }
      if (tmpDefaultValues?.governorates_id && tmpDefaultValues?.governorates_id?.length > 0) {
        newValues = {
          ...newValues,

          governorates_id: tmpDefaultValues?.governorates_id,
        };
      } else {
        newValues = { ...newValues, governorates_id: [] };
      }
      // set value for single selected region and governorate
      if (!FEATURE_PROPOSAL_MULTIPLE_REGION_ENTITY_AREA) {
        if (tmpDefaultValues.region_id && tmpDefaultValues.governorate_id && regions.length > 0) {
          // console.log('masuk if');
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
          if (tmpRegion && tmpRegion?.governorate && tmpRegion?.governorate?.length > 0) {
            tmpGovernorate = [...tmpRegion.governorate]
              .filter((item) => item.is_deleted !== true)
              .find((item) => item.governorate_id === defaultValues.governorate_id) as IGovernorate;
          }

          newValues = {
            ...newValues,
            region: tmpRegion ? tmpRegion.region_id : '',
            governorate: tmpGovernorate ? tmpGovernorate.governorate_id : '',
            regions_id: [{ label: tmpRegion?.name || '-', value: tmpRegion?.region_id || '-' }],
            governorates_id: [
              { label: tmpGovernorate?.name || '-', value: tmpGovernorate?.governorate_id || '-' },
            ],
          };
          setArea((prevState: any) => ({
            ...prevState,
            region: tmpRegion ? tmpRegion : null,
            governorate: tmpGovernorate ? tmpGovernorate : null,
          }));
        } else {
          // console.log('masuk else');
          const region = Object.keys(REGION).includes(newValues.region) ? newValues.region : '';
          newValues = {
            ...newValues,
            region: region,
            governorate:
              !FEATURE_MENU_ADMIN_ENTITY_AREA && !FEATURE_MENU_ADMIN_REGIONS
                ? region &&
                  tmpRegions &&
                  tmpRegions[`${removeNewLineCharacters(region) as RegionNames}`] &&
                  tmpDefaultValues.governorate
                : '',
          };
        }
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

  // for watch region and governorate form value
  const tmpRegion = watch('region') as RegionNames | '';
  const tmpGovernorate = (watch('governorate') as string) || '';
  // console.log({ tmpRegion, tmpGovernorate });
  if (isLoadingRegions) return <>{translate('pages.common.loading')}</>;

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
        {FEATURE_PROPOSAL_MULTIPLE_REGION_ENTITY_AREA ? null : (
          <>
            {/* single selected regions */}
            <Grid item md={6} xs={12}>
              <RHFSelect
                disabled={
                  isLoadingRegions ||
                  (!!revised && revised.hasOwnProperty('region')
                    ? false
                    : !!revised && !(tmpRegion === '' || !tmpRegion) && true)
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
                    if (
                      FEATURE_MENU_ADMIN_ENTITY_AREA &&
                      FEATURE_MENU_ADMIN_REGIONS &&
                      regions.length > 0
                    ) {
                      handleChangeRegion(e.target.value as string);
                    }
                    setValue('region', e.target.value);
                  }
                }}
              >
                {revised &&
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
                {(area === null || !area.region) &&
                !FEATURE_MENU_ADMIN_ENTITY_AREA &&
                !FEATURE_MENU_ADMIN_REGIONS &&
                !isLoadingRegions
                  ? Object.keys(REGION).map((item, index) => (
                      <MenuItem key={index} value={item} style={{ backgroundColor: '#fff' }}>
                        {item}
                      </MenuItem>
                    ))
                  : null}
              </RHFSelect>
              {FEATURE_MENU_ADMIN_ENTITY_AREA &&
                FEATURE_MENU_ADMIN_REGIONS &&
                regions.length === 0 && (
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
            {/* single selected governorate */}
            <Grid item md={6} xs={12}>
              <RHFSelect
                disabled={
                  isLoadingRegions ||
                  (!!revised && revised.hasOwnProperty('region')
                    ? false
                    : !!revised && !(tmpGovernorate === '' || !tmpGovernorate) && true)
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
                    if (
                      area &&
                      area.region &&
                      FEATURE_MENU_ADMIN_ENTITY_AREA &&
                      FEATURE_MENU_ADMIN_REGIONS
                    ) {
                      handleChangeGovernorate(e.target.value as string);
                    }
                    setValue('governorate', e.target.value);
                  }
                }}
              >
                {!revised &&
                area &&
                area.region &&
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
                !isLoadingRegions &&
                area &&
                area.region &&
                governorates &&
                governorates.length > 0
                  ? governorates.map((option, i) => (
                      <MenuItem key={i} value={option.governorate_id}>
                        {option.name}
                      </MenuItem>
                    ))
                  : null}
                {(area === null || !area.region) &&
                tmpRegion !== '' &&
                !isLoadingRegions &&
                tmpRegions &&
                tmpRegions[`${removeNewLineCharacters(tmpRegion) as RegionNames}`]
                  ? tmpRegions[`${removeNewLineCharacters(tmpRegion) as RegionNames}`].map(
                      (item: any, index: any) => (
                        <MenuItem key={index} value={item} style={{ backgroundColor: '#fff' }}>
                          {item}
                        </MenuItem>
                      )
                    )
                  : null}
                {(area === null || !area.region) && tmpRegion === '' ? (
                  <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                    {translate('funding_project_request_form3.city.placeholder')}
                  </option>
                ) : null}
              </RHFSelect>
            </Grid>
          </>
        )}

        {FEATURE_PROPOSAL_MULTIPLE_REGION_ENTITY_AREA && (
          <>
            <Grid item md={revised ? 12 : 6} xs={12}>
              <RHFComboBox
                disabled={
                  (!!revised && revised.hasOwnProperty('region_id') ? false : !!revised && true) ||
                  isLoadingRegions ||
                  regions.length === 0
                }
                name="regions_id"
                label={translate('portal_report.region_id.label')}
                data-cy="portal_report.region_id"
                placeholder={translate('portal_report.region_id.placeholder')}
                dataOption={
                  regions.length > 0
                    ? regions.map((region: IRegions, index: number) => ({
                        label: region.name,
                        value: region.region_id,
                      }))
                    : []
                }
              />
            </Grid>
            <Grid item md={revised ? 12 : 6} xs={12}>
              <RHFComboBox
                disabled={
                  (!!revised && revised.hasOwnProperty('governorate_id')
                    ? false
                    : !!revised && true) ||
                  isLoadingRegions ||
                  !formField?.governorates ||
                  (formField?.governorates && formField?.governorates.length === 0)
                }
                name="governorates_id"
                label={translate('portal_report.governorate_id.label')}
                data-cy="portal_report.governorate_id"
                placeholder={translate('portal_report.governorate_id.placeholder')}
                dataOption={
                  formField?.governorates && formField?.governorates.length > 0
                    ? formField?.governorates.map((governorate: IGovernorate, index: number) => ({
                        label: governorate.name,
                        value: governorate.governorate_id,
                      }))
                    : []
                }
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;
