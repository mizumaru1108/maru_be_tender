import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, Grid, Stack } from '@mui/material';
import { FormProvider, RHFDatePicker, RHFTextField } from 'components/hook-form';
import RHFComboBox, { ComboBoxOption } from 'components/hook-form/RHFComboBox';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import * as Yup from 'yup';
import { AmandementFields, AmandementProposal } from '../../../@types/proposal';
import ButtonDownloadFiles from '../../../components/button/ButtonDownloadFiles';
import RHFTextArea from '../../../components/hook-form/RHFTextArea';
import Space from '../../../components/space/space';
import { FEATURE_AMANDEMENT_FROM_FINANCE } from '../../../config';
import { useSelector } from '../../../redux/store';
import BankImageComp from '../../../sections/shared/BankImageComp';
import { LeftField, RightField } from './FormFieldData';
import BaseField from 'components/hook-form/BaseField';
import { FieldType } from 'components/FormGenerator';

interface Area {
  regions_id: ComboBoxOption[];
  governorates_id: ComboBoxOption[];
}

type Props = {
  // onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: AmandementProposal | null;
  selectedLength: (length: number) => void;
  openConfirm: () => void;
  onSubmit: (data: AmandementFields) => void;
  isPaymentamandement?: boolean;
};
const AmandementForms = ({
  children,
  defaultValues,
  isPaymentamandement = false,
  selectedLength,
  openConfirm,
  onSubmit,
}: Props) => {
  // console.log({ regions: defaultValues?.proposal_regions });
  const { translate } = useLocales();
  const params = useParams();
  const { proposal } = useSelector((state) => state.proposal);
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);
  const [area, setArea] = React.useState<Area>({
    governorates_id: [],
    regions_id: [],
  });

  const CreatingProposalForm2 = Yup.object().shape({
    num_ofproject_binicficiaries: Yup.string().required(
      translate('errors.cre_proposal.num_ofproject_binicficiaries.required')
    ),
    project_goals: Yup.string().required(translate('errors.cre_proposal.project_goals.required')),
    project_outputs: Yup.string().required(
      translate('errors.cre_proposal.project_outputs.required')
    ),
    project_strengths: Yup.string().required(
      translate('errors.cre_proposal.project_strengths.required')
    ),
    project_risks: Yup.string().required(translate('errors.cre_proposal.project_risks.required')),
    amount_required_fsupport: Yup.string().required(
      translate('errors.cre_proposal.amount_required_fsupport.required')
    ),
    project_idea: Yup.string().required(translate('errors.cre_proposal.project_idea.required')),
    project_location: Yup.string().required(
      translate('errors.cre_proposal.project_location.required')
    ),
    project_implement_date: Yup.string().required(
      translate('errors.cre_proposal.project_implement_date.required')
    ),
    project_beneficiaries: Yup.string().required(
      translate('errors.cre_proposal.project_beneficiaries.required')
    ),
    letter_ofsupport_req: Yup.string().required(
      translate('errors.cre_proposal.letter_ofsupport_req.required')
    ),
    project_attachments: Yup.string().required(
      translate('errors.cre_proposal.project_attachments.required')
    ),
    notes: Yup.string().required(translate('errors.cre_proposal.notes.required')),
    timelines: Yup.string().required(translate('errors.cre_proposal.project_timeline.required')),
    proposal_bank_id: Yup.string().required(
      translate('errors.cre_proposal.bank_information.required')
    ),
    region_id: Yup.string().required(translate('errors.cre_proposal.region.required')),
    governorate_id: Yup.string().required(translate('errors.cre_proposal.governorate.required')),
  });

  const methods = useForm<AmandementFields>({
    resolver: yupResolver(CreatingProposalForm2),
    // defaultValues: useMemo(() => defaultValues!, [defaultValues!]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;
  const resetForm = (field: any) => {
    const newValues = JSON.parse(JSON.stringify(defaultValues));
    // console.log('field value', { defaultValues });
    if (
      field !== 'letter_ofsupport_req' &&
      field !== 'project_attachments' &&
      field !== 'timelines' &&
      field !== 'proposal_bank_id' &&
      field !== 'region_id' &&
      field !== 'governorate_id'
    ) {
      setValue(field, newValues[field]);
    } else {
      if (field === 'region_id') {
        setValue('region_id', '-');
        setValue('governorate_id', '-');
      } else {
        setValue(field, '-');
      }
    }
  };

  useEffect(() => {
    if (!!defaultValues) {
      reset({
        amount_required_fsupport: String(defaultValues.amount_required_fsupport),
        letter_ofsupport_req: '-',
        num_ofproject_binicficiaries: String(defaultValues.num_ofproject_binicficiaries),
        project_attachments: '-',
        project_beneficiaries: defaultValues?.beneficiary_details?.name,
        project_goals: defaultValues.project_goals,
        project_idea: defaultValues.project_idea,
        project_implement_date: moment(defaultValues.project_implement_date).format('YYYY-MM-DD'),
        project_location: defaultValues.project_location,
        project_outputs: defaultValues.project_outputs,
        project_risks: defaultValues.project_risks,
        project_strengths: defaultValues.project_strengths,
        region: defaultValues.region,
        region_id: '-',
        governorate_id: '-',
        governorate: defaultValues.governorate,
        timelines: '-',
        notes: '',
        proposal_bank_id: '-',
      });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!!defaultValues) {
      if (
        defaultValues.proposal_governorates &&
        Array.isArray(defaultValues.proposal_governorates)
      ) {
        const tmpGovOption: ComboBoxOption[] = defaultValues.proposal_governorates.map((item) => ({
          label: item?.governorate?.name || 'TO_DO',
          value: item.governorate_id || '',
        }));

        setArea((prev) => ({
          ...prev,
          governorates_id: tmpGovOption,
        }));
      }
    }
  }, [defaultValues, setValue]);

  useEffect(() => {
    if (!!defaultValues) {
      if (defaultValues.proposal_regions && Array.isArray(defaultValues.proposal_regions)) {
        const tmpRegionOption: ComboBoxOption[] = defaultValues.proposal_regions.map((item) => ({
          label: item?.region?.name || 'TO_DO',
          value: item.region_id || '',
        }));
        setArea((prev: Area) => ({
          ...prev,
          regions_id: tmpRegionOption,
        }));
      }
    }
  }, [defaultValues, setValue]);

  const handleChange = (e: any) => {
    const newSelectedValues = [...selectedCheckbox];
    if (e.target.checked) {
      newSelectedValues.push(e.target.value);
      selectedLength(newSelectedValues.length);
      setSelectedCheckbox(newSelectedValues);
    } else {
      newSelectedValues.splice(newSelectedValues.indexOf(e.target.value), 1);
      resetForm(e.target.value as string);
      selectedLength(newSelectedValues.length);
      setSelectedCheckbox(newSelectedValues);
    }
  };
  const onSubmitForm = async (data: AmandementFields) => {
    let selectedData = Object.entries(data)
      // .filter(([key]) => selectedCheckbox.includes(key) || key === 'governorate_id')
      .filter(
        ([key]) =>
          selectedCheckbox.includes(key) ||
          (selectedCheckbox.includes('region_id') && key === 'governorate_id')
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    selectedData = {
      ...selectedData,
      proposal_id: params.proposal_id,
    };
    if (data.notes) {
      selectedData = {
        ...selectedData,
        notes: data.notes,
      };
    }
    // console.log({ selectedData, data });
    openConfirm();
    onSubmit(selectedData as AmandementFields);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container>
        <Grid item xs={12} md={6}>
          {LeftField.map((item, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={3} sx={{ my: 3 }}>
              <Grid item xs={1} md={1}>
                <Checkbox
                  checked={
                    selectedCheckbox.length > 0 ? selectedCheckbox.includes(item.name) : false
                  }
                  onChange={(e) => handleChange(e)}
                  value={item.name}
                  disabled={FEATURE_AMANDEMENT_FROM_FINANCE && isPaymentamandement}
                  data-cy={`${item.name}-checkbox-$${index}`}
                />
              </Grid>
              <Grid item xs={11} md={11}>
                <BaseField
                  type={item.type as FieldType}
                  name={item.name}
                  disabled={selectedCheckbox.includes(item.name) ? false : true}
                  label={translate(`${item.label}`)}
                  placeholder={translate(`${item.placeholder}`)}
                  data-cy={`${item.name}-textField-$${index}`}
                />
              </Grid>
            </Stack>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {RightField.map((item, index) => (
            <Stack key={index} direction="row" alignItems="center" sx={{ my: 3 }}>
              <Grid item xs={1} md={1}>
                <Checkbox
                  checked={
                    selectedCheckbox.length > 0 ? selectedCheckbox.includes(item.name) : false
                  }
                  onChange={(e) => handleChange(e)}
                  value={item.name}
                  disabled={FEATURE_AMANDEMENT_FROM_FINANCE && isPaymentamandement}
                  data-cy={`${item.name}-checkbox-$${index}`}
                />
              </Grid>
              <Grid item xs={11} md={11}>
                <BaseField
                  type={item.type as FieldType}
                  name={item.name}
                  disabled={selectedCheckbox.includes(item.name) ? false : true}
                  label={translate(`${item.label}`)}
                  placeholder={translate(`${item.placeholder}`)}
                  data-cy={`${item.name}-textField-$${index}`}
                />
              </Grid>
            </Stack>
          ))}
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={1} md={1}>
              <Checkbox
                checked={
                  selectedCheckbox.length > 0 ? selectedCheckbox.includes('region_id') : false
                }
                onChange={(e) => handleChange(e)}
                value={'region_id'}
                disabled={FEATURE_AMANDEMENT_FROM_FINANCE && isPaymentamandement}
                data-cy={`region_id-checkbox`}
              />
            </Grid>
            <Grid item xs={11} md={11}>
              {selectedCheckbox.includes('region_id') ? (
                <RHFTextField
                  name={'region_id'}
                  disabled={selectedCheckbox.includes('region_id') ? false : true}
                  label={translate('portal_report.region_id.label')}
                  data-cy="portal_report.region_id"
                  placeholder={translate('portal_report.region_id.placeholder')}
                />
              ) : (
                <RHFComboBox
                  disabled
                  name="regions"
                  label={translate('portal_report.region_id.label')}
                  data-cy="portal_report.region_id"
                  placeholder={translate('portal_report.region_id.placeholder')}
                  dataOption={[]}
                  value={area.regions_id || []}
                  limitTags={99}
                />
              )}
            </Grid>
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={1} md={1}>
              {/* <Checkbox
                checked={
                  selectedCheckbox.length > 0 ? selectedCheckbox.includes('governorate_id') : false
                }
                onChange={(e) => handleChange(e)}
                value={'governorate_id'}
                disabled={FEATURE_AMANDEMENT_FROM_FINANCE && isPaymentamandement}
                data-cy={`governorate_id-checkbox`}
              /> */}
              <Space direction="vertical" size="small" />
            </Grid>
            <Grid item xs={11} md={11}>
              {selectedCheckbox.includes('region_id') ? (
                <RHFTextField
                  name={'governorate_id'}
                  disabled={selectedCheckbox.includes('region_id') ? false : true}
                  label={translate('portal_report.governorate_id.label')}
                  data-cy="portal_report.governorate_id"
                  placeholder={translate('portal_report.governorate_id.placeholder')}
                />
              ) : (
                <RHFComboBox
                  // disabled={selectedCheckbox.includes('governorates_id') ? false : true}
                  disabled
                  name="governorates"
                  label={translate('portal_report.governorate_id.label')}
                  data-cy="portal_report.governorate_id"
                  placeholder={translate('portal_report.governorate_id.placeholder')}
                  dataOption={[]}
                  value={area.governorates_id || []}
                  limitTags={99}
                />
              )}
            </Grid>
          </Stack>
        </Grid>
        {defaultValues?.project_attachments && defaultValues.letter_ofsupport_req && (
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: '0px !important',
              mt: 1,
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} gap={3} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={1} md={1}>
                  <Checkbox
                    checked={
                      selectedCheckbox.length > 0
                        ? selectedCheckbox.includes('project_attachments')
                        : false
                    }
                    onChange={(e) => handleChange(e)}
                    value={'project_attachments'}
                    data-cy={`project_attachments-checkbox`}
                    disabled={FEATURE_AMANDEMENT_FROM_FINANCE && isPaymentamandement}
                  />
                </Grid>
                <Grid item xs={11} md={11}>
                  {selectedCheckbox.includes('project_attachments') ? (
                    <RHFTextField
                      name={'project_attachments'}
                      label={translate('funding_project_request_form1.project_attachments.label')}
                      placeholder={translate(
                        'funding_project_request_form1.project_attachments.placeholder'
                      )}
                    />
                  ) : (
                    <ButtonDownloadFiles files={defaultValues?.project_attachments} />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} gap={3} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={1} md={1}>
                  <Checkbox
                    checked={
                      selectedCheckbox.length > 0
                        ? selectedCheckbox.includes('letter_ofsupport_req')
                        : false
                    }
                    onChange={(e) => handleChange(e)}
                    disabled={FEATURE_AMANDEMENT_FROM_FINANCE && isPaymentamandement}
                    value={'letter_ofsupport_req'}
                  />
                </Grid>
                <Grid item xs={11} md={11}>
                  {selectedCheckbox.includes('letter_ofsupport_req') ? (
                    <RHFTextField
                      name={'letter_ofsupport_req'}
                      label={translate(
                        'funding_project_request_form1.letter_support_request.label'
                      )}
                      placeholder={translate(
                        'funding_project_request_form1.letter_support_request.placeholder'
                      )}
                    />
                  ) : (
                    <ButtonDownloadFiles files={defaultValues?.letter_ofsupport_req} />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'row', mt: 4 }}>
          {/* <Grid item xs={1} md={1}> */}
          <Stack>
            <Checkbox
              checked={selectedCheckbox.length > 0 ? selectedCheckbox.includes('timelines') : false}
              onChange={(e) => handleChange(e)}
              value={'timelines'}
              disabled={FEATURE_AMANDEMENT_FROM_FINANCE && isPaymentamandement}
            />
          </Stack>
          {/* </Grid> */}
          {!selectedCheckbox.includes('timelines') ? (
            <Grid
              item
              xs={12}
              md={12}
              sx={{ display: 'flex', flexDirection: 'row', paddingLeft: 2 }}
            >
              {defaultValues && defaultValues?.project_timeline?.length > 0 ? (
                defaultValues?.project_timeline.map((item, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12} md={6} sx={{ margin: '0 4px' }}>
                      <RHFTextField
                        disabled={selectedCheckbox.includes('timelines') ? false : true}
                        type={'textField'}
                        value={item.name}
                        name={'name'}
                        label={translate(`funding_project_request_project_timeline.activity.label`)}
                        placeholder={translate(
                          `funding_project_request_project_timeline.activity.placeholder`
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ margin: '0 4px' }}>
                      <RHFDatePicker
                        disabled={selectedCheckbox.includes('timelines') ? false : true}
                        value={moment(item.start_date).format('LLL')}
                        type={'datePicker'}
                        name={'start_date'}
                        label={translate(
                          `funding_project_request_project_timeline.start_date.label`
                        )}
                        placeholder={translate(
                          `funding_project_request_project_timeline.start_date.placeholder`
                        )}
                        minDate={
                          new Date(new Date().setDate(new Date().getDate() + 1))
                            .toISOString()
                            .split('T')[0]
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ margin: '0 4px' }}>
                      <RHFDatePicker
                        disabled={selectedCheckbox.includes('timelines') ? false : true}
                        type={'datePicker'}
                        value={moment(item.end_date).format('LLL')}
                        name={'end_date'}
                        label={translate(`funding_project_request_project_timeline.end_date.label`)}
                        placeholder={translate(
                          `funding_project_request_project_timeline.start_date.placeholder`
                        )}
                        minDate={
                          new Date(new Date().setDate(new Date().getDate() + 1))
                            .toISOString()
                            .split('T')[0]
                        }
                      />
                    </Grid>
                  </React.Fragment>
                ))
              ) : (
                <React.Fragment>
                  <Grid item xs={12} md={6} sx={{ margin: '0 4px' }}>
                    <RHFTextField
                      disabled={selectedCheckbox.includes('timelines') ? false : true}
                      type={'textField'}
                      name={'name'}
                      label={translate(`funding_project_request_project_timeline.activity.label`)}
                      placeholder={translate(
                        `funding_project_request_project_timeline.activity.placeholder`
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3} sx={{ margin: '0 4px' }}>
                    <RHFDatePicker
                      disabled={selectedCheckbox.includes('timelines') ? false : true}
                      type={'datePicker'}
                      name={'start_date'}
                      label={translate(`funding_project_request_project_timeline.start_date.label`)}
                      placeholder={translate(
                        `funding_project_request_project_timeline.start_date.placeholder`
                      )}
                      minDate={
                        new Date(new Date().setDate(new Date().getDate() + 1))
                          .toISOString()
                          .split('T')[0]
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={3} sx={{ margin: '0 4px' }}>
                    <RHFDatePicker
                      disabled={selectedCheckbox.includes('timelines') ? false : true}
                      type={'datePicker'}
                      name={'end_date'}
                      label={translate(`funding_project_request_project_timeline.end_date.label`)}
                      placeholder={translate(
                        `funding_project_request_project_timeline.start_date.placeholder`
                      )}
                      minDate={
                        new Date(new Date().setDate(new Date().getDate() + 1))
                          .toISOString()
                          .split('T')[0]
                      }
                    />
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          ) : (
            <React.Fragment>
              {' '}
              <Grid item xs={12} md={12} sx={{ paddingLeft: 3 }}>
                {/* <RHFTextArea
                  name={'timelines'}
                  label={translate(`funding_project_request_project_timeline.step`)}
                  placeholder={translate(`funding_project_request_project_timeline.step`)}
                /> */}
                <RHFTextField
                  data-cy="funding_project_request_project_timeline.step"
                  name={'timelines'}
                  label={translate(`funding_project_request_project_timeline.step`)}
                  placeholder={translate(`funding_project_request_project_timeline.step`)}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        {/* {defaultValues?.timelines && defaultValues?.timelines.length > 0 ? <>test</> : <>test</>} */}
        <Space direction="horizontal" size="small" />
        {FEATURE_AMANDEMENT_FROM_FINANCE && isPaymentamandement ? (
          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={1} md={1}>
              <Checkbox
                checked={
                  selectedCheckbox.length > 0
                    ? selectedCheckbox.includes('proposal_bank_id')
                    : false
                }
                onChange={(e) => handleChange(e)}
                value={'proposal_bank_id'}
              />
            </Grid>
            <Grid item xs={11} md={11}>
              {selectedCheckbox.includes('proposal_bank_id') ? (
                <RHFTextField
                  name={'proposal_bank_id'}
                  label={translate('funding_project_request_form1.bank_information.label')}
                  placeholder={translate(
                    'funding_project_request_form1.bank_information.placeholder'
                  )}
                />
              ) : (
                <BankImageComp
                  enableButton={true}
                  bankName={proposal.bank_information?.bank_name}
                  accountNumber={proposal.bank_information?.bank_account_number}
                  bankAccountName={proposal.bank_information?.bank_account_name}
                  imageUrl={proposal.bank_information?.card_image.url}
                  size={proposal.bank_information?.card_image.size}
                  type={proposal.bank_information?.card_image.type}
                  borderColor={proposal.bank_information?.card_image.border_color ?? 'transparent'}
                />
              )}
            </Grid>
          </Grid>
        ) : null}
        <Grid item xs={12} md={12} sx={{ mb: 4, mt: 2 }}>
          <RHFTextArea
            name={'notes'}
            label={translate(`funding_project_request_form1.notes.label`)}
            placeholder={translate(`funding_project_request_form1.notes.placeholder`)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AmandementForms;
