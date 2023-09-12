import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFDatePicker, RHFMultiCheckbox } from 'components/hook-form';
import RHFComboBox, { ComboBoxOption } from 'components/hook-form/RHFComboBox';
import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
// import { useListState, randomId } from '@mantine/hooks';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, dispatch } from 'redux/store';
import { IGovernorate } from 'sections/admin/governorate/list/types';
import { IRegions } from 'sections/admin/region/list/types';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import * as Yup from 'yup';
import { BeneficiaryDetail, tracks } from '../../../@types/proposal';

interface Props {
  children?: React.ReactNode;
  onSubmitForm: (data: FormValuesPortalReport1) => void;
  defaultValuesForm?: FormValuesPortalReport1;
}

export interface FormValuesPortalReport1 {
  partner_id: ComboBoxOption[];
  track_id: ComboBoxOption[];
  region_id: ComboBoxOption[];
  governorate_id: ComboBoxOption[];
  outter_status: ComboBoxOption[];
  beneficiary_id: ComboBoxOption[];
  start_date: string;
  end_date: string;
}

const OutterStatusOption = [
  { label: 'portal_report.outter_status.completed', value: 'COMPLETED' },
  { label: 'portal_report.outter_status.pending', value: 'PENDING' },
  { label: 'portal_report.outter_status.canceled', value: 'CANCELED' },
  { label: 'portal_report.outter_status.ongoing', value: 'ONGOING' },
  { label: 'portal_report.outter_status.on_revision', value: 'ON_REVISION' },
  { label: 'portal_report.outter_status.asked_for_amendment', value: 'ASKED_FOR_AMANDEMENT' },
  {
    label: 'portal_report.outter_status.asked_for_amendment_payment',
    value: 'ASKED_FOR_AMANDEMENT_PAYMENT',
  },
];

export default function PortalReportsForm1({ defaultValuesForm, children, onSubmitForm }: Props) {
  // const [values, handlers] = useListState(initialValues);
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  const { region_list, beneficiaries_list, track_list, client_list, loadingProps } = useSelector(
    (state) => state.proposal
  );

  const [formField, setFormField] = React.useState<{
    regions?: IRegions[];
    governorates?: IGovernorate[];
    track?: tracks;
    tracks?: tracks[];
    beneficiaries?: BeneficiaryDetail[];
  } | null>(null);
  // console.log({ area, governorates });

  const supportSchema = Yup.object().shape({
    partner_id: Yup.array().min(1, translate('portal_report.errors.partner_name.required')),
    outter_status: Yup.array().min(1, translate('portal_report.errors.outter_status.required')),
    // track_id: Yup.array().min(1, translate('portal_report.errors.track_id.required')),
    // region_id: Yup.array().min(1, translate('portal_report.errors.region_id.required')),
    // governorate_id: Yup.array().min(1, translate('portal_report.errors.governorate_id.required')),
    // beneficiary_id: Yup.array().min(1, translate('portal_report.errors.beneficiary_id.required')),
    start_date: Yup.string().required(translate('portal_report.errors.start_date.required')),
    end_date: Yup.string().required(translate('portal_report.errors.end_date.required')),
  });

  const defaultValues = {
    partner_id: [],
    track_id: [],
    region_id: [],
    governorate_id: [],
    outter_status: [],
    beneficiary_id: [],
    start_date: '',
    end_date: '',
  };
  const methods = useForm<FormValuesPortalReport1>({
    resolver: yupResolver(supportSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const watchRegion = watch('region_id');
  const watchTrack = watch('track_id');
  const watchBeneficary = watch('beneficiary_id');
  const watchStartDate = watch('start_date');
  // const watcg
  // console.log({ formField });

  const handleChangeRegion = React.useCallback(
    (options: ComboBoxOption[]) => {
      if (options && options.length > 0) {
        const regionsId = options.map((item) => item.value);
        const tmpRegions = region_list.filter((region) => regionsId.includes(region.region_id));
        const tmpGovernorates = tmpRegions
          .filter((item) => item.governorate && item.governorate.length > 0)
          .map((item) => item.governorate)
          .flat();
        setFormField((prevState: any) => ({
          ...prevState,
          regions: tmpRegions && tmpRegions.length > 0 ? tmpRegions : null,
          governorates: tmpGovernorates && tmpGovernorates.length > 0 ? tmpGovernorates : null,
        }));
      } else {
        setFormField((prevState: any) => ({
          ...prevState,
          regions: null,
          governorates: null,
        }));
      }
      setValue('governorate_id', []);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [region_list]
  );

  React.useEffect(() => {
    handleChangeRegion(watchRegion);
  }, [watchRegion, handleChangeRegion]);

  const handleChangeTrack = React.useCallback(
    (options: ComboBoxOption[]) => {
      if (options && options.length > 0) {
        const tracksId = options.map((item) => item.value);
        const tmpTracks = track_list.filter((track) => tracksId.includes(track.id));
        setFormField((prevState: any) => ({
          ...prevState,
          tracks: tmpTracks && tmpTracks.length > 0 ? tmpTracks : null,
        }));
      } else {
        setFormField((prevState: any) => ({
          ...prevState,
          tracks: null,
        }));
      }
    },
    [track_list]
  );
  React.useEffect(() => {
    handleChangeTrack(watchTrack);
  }, [watchTrack, handleChangeTrack]);

  const handleChangeBeneficiary = React.useCallback(
    (options: ComboBoxOption[]) => {
      if (options && options.length > 0) {
        const benesId = options.map((item) => item.value);
        const tmpBeneficairies = beneficiaries_list.filter((beneficiary: BeneficiaryDetail) =>
          benesId.includes(beneficiary.id)
        );
        setFormField((prevState: any) => ({
          ...prevState,
          beneficiaries: tmpBeneficairies && tmpBeneficairies.length > 0 ? tmpBeneficairies : null,
        }));
      } else {
        setFormField((prevState: any) => ({
          ...prevState,
          beneficiaries: null,
        }));
      }
    },
    [beneficiaries_list]
  );
  React.useEffect(() => {
    handleChangeBeneficiary(watchBeneficary);
  }, [watchBeneficary, handleChangeBeneficiary]);

  React.useEffect(() => {
    if (defaultValuesForm) {
      reset(defaultValuesForm);
      // setValue('partner_name', defaultValuesForm.partner_name);
    }
  }, [defaultValuesForm, reset]);
  // console.log({ defaultValuesForm, watchRegion });

  const onSubmit = async (data: FormValuesPortalReport1) => {
    // console.log('data', data);
    onSubmitForm(data);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={4} columnSpacing={7}>
          {/* <Grid md={12}>
            <Virtualize />
          </Grid> */}
          <Grid item md={6} xs={12}>
            <RHFComboBox
              disabled={loadingProps.laodingClient}
              name="partner_id"
              label={translate('portal_report.partner_name.label')}
              data-cy="portal_report.partner_name"
              placeholder={translate('portal_report.partner_name.placeholder')}
              dataOption={
                client_list.length > 0
                  ? client_list.map((client) => ({ label: client.employee_name, value: client.id }))
                  : []
              }
              // dataOption={[]}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFComboBox
              disabled={loadingProps.laodingTrack || track_list.length === 0}
              name="track_id"
              label={translate('portal_report.track_id.label')}
              data-cy="portal_report.track_id"
              placeholder={translate('portal_report.track_id.placeholder')}
              dataOption={
                track_list.length > 0
                  ? track_list.map((track: tracks, index: number) => ({
                      label: formatCapitalizeText(track.name),
                      value: track.id,
                    }))
                  : []
              }
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFComboBox
              disabled={loadingProps.loadingRegion || region_list.length === 0}
              name="region_id"
              label={translate('portal_report.region_id.label')}
              data-cy="portal_report.region_id"
              placeholder={translate('portal_report.region_id.placeholder')}
              dataOption={
                region_list.length > 0
                  ? region_list.map((region: IRegions, index: number) => ({
                      label: region.name,
                      value: region.region_id,
                    }))
                  : []
              }
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFComboBox
              disabled={
                loadingProps.loadingRegion ||
                !formField?.governorates ||
                (formField?.governorates && formField?.governorates.length === 0)
              }
              name="governorate_id"
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
          <Grid item md={6} xs={12}>
            <RHFComboBox
              disabled={loadingProps.loadingBeneficiary || beneficiaries_list.length === 0}
              name="beneficiary_id"
              label={translate('portal_report.beneficiary_id.label')}
              data-cy="portal_report.beneficiary_id"
              placeholder={translate('portal_report.beneficiary_id.placeholder')}
              dataOption={
                beneficiaries_list.length > 0
                  ? beneficiaries_list.map((beneficiary: BeneficiaryDetail, index: number) => ({
                      label: beneficiary.name,
                      value: beneficiary.id,
                    }))
                  : []
              }
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Grid container rowSpacing={4} columnSpacing={7}>
              <Grid item md={6}>
                <RHFDatePicker
                  name="start_date"
                  label={translate('portal_report.start_date.label')}
                  data-cy="portal_report.start_date"
                  placeholder={translate('portal_report.start_date.placeholder')}
                />
              </Grid>
              <Grid item md={6}>
                <RHFDatePicker
                  disabled={watchStartDate === '' || watchStartDate === null}
                  name="end_date"
                  label={translate('portal_report.end_date.label')}
                  data-cy="portal_report.end_date"
                  placeholder={translate('portal_report.end_date.placeholder')}
                  minDate={
                    watchStartDate
                      ? dayjs(watchStartDate).add(1, 'day').toISOString().split('T')[0]
                      : ''
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} xs={12}>
            <RHFMultiCheckbox
              name="outter_status"
              label={translate('portal_report.outter_status.label')}
              data-cy="portal_report.outter_status"
              placeholder={translate('portal_report.outter_status.placeholder')}
              gridCol={3}
              options={OutterStatusOption}
              onErrorCapture={(error) => {
                console.log('error', error);
              }}
            />
          </Grid>
        </Grid>
        {children}
      </FormProvider>
    </>
  );
}
