import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Button } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import RHFComboBox, { ComboBoxOption } from 'components/hook-form/RHFComboBox';
import useLocales from 'hooks/useLocales';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import { removeEmptyKey } from 'utils/remove-empty-key';
import * as Yup from 'yup';
import { SupervisorStep2 } from '../../../../../../@types/supervisor-accepting-form';
import useAuth from '../../../../../../hooks/useAuth';

interface Area {
  regions_id: ComboBoxOption[];
  governorates_id: ComboBoxOption[];
}

function SecondForm({ children, onSubmit }: any) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const isSupevisor = activeRole === 'tender_project_supervisor' ? true : false;
  const [edit, setEdit] = useState<boolean>(isSupevisor ? false : true);

  const [area, setArea] = React.useState<Area>({
    governorates_id: [],
    regions_id: [],
  });

  const validationSchema = Yup.object().shape({
    organizationName: Yup.string().required(
      translate('errors.cre_proposal.organizationName.required')
    ),
    // region: Yup.string().required(translate('errors.cre_proposal.region.required')),
    // governorate: Yup.string().required(translate('errors.cre_proposal.governorate.required')),
    // regions_id: Yup.array()
    //   .min(1, translate('portal_report.errors.region_id.required'))
    //   .required(translate('portal_report.errors.region_id.required'))
    //   .nullable(),
    // governorates_id: Yup.array()
    //   .min(1, translate('portal_report.errors.governorate_id.required'))
    //   .required(translate('portal_report.errors.governorate_id.required'))
    //   .nullable(),
    date_of_esthablistmen: Yup.string().required(
      translate('errors.cre_proposal.date_of_esthablistmen.required')
    ),
    chairman_of_board_of_directors: Yup.string(),
    ceo: Yup.string().required(translate('errors.cre_proposal.ceo.required')),
    been_supported_before: Yup.boolean().required(
      translate('errors.cre_proposal.been_supported_before.required')
    ),
    most_clents_projects: Yup.string().required(
      translate('errors.cre_proposal.most_clents_projects.required')
    ),
    num_of_beneficiaries: Yup.number().required(
      translate('errors.cre_proposal.num_of_beneficiaries.required')
    ),
  });

  const { step2 } = useSelector((state) => state.supervisorAcceptingForm);
  // console.log({ step2 });
  // console.log('cek governorate ', step2.governorate_detail);
  const methods = useForm<SupervisorStep2>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step2, [step2]),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: SupervisorStep2) => {
    // let tmpValue: SupervisorStep2 = removeEmptyKey(data) as SupervisorStep2;
    // if (tmpValue.region_detail !== undefined || tmpValue.region_detail !== null) {
    //   delete tmpValue.region_detail;
    // }
    // if (tmpValue.governorate_detail !== undefined || tmpValue.governorate_detail !== null) {
    //   delete tmpValue.governorate_detail;
    // }
    // console.log({ tmpValue });
    onSubmit(data);
  };

  React.useEffect(() => {
    if (step2.proposal_governorates && Array.isArray(step2.proposal_governorates)) {
      const tmpGovOption: ComboBoxOption[] = step2.proposal_governorates.map((item) => ({
        label: item?.governorate?.name || 'TO_DO',
        value: item.governorate_id || '',
      }));

      setArea((prev) => ({
        ...prev,
        governorates_id: tmpGovOption,
      }));
    }
  }, [step2.proposal_governorates, setValue]);

  React.useEffect(() => {
    if (step2.proposal_regions && Array.isArray(step2.proposal_regions)) {
      const tmpRegionOption: ComboBoxOption[] = step2.proposal_regions.map((item) => ({
        label: item?.region?.name || 'TO_DO',
        value: item.region_id || '',
      }));
      setArea((prev: Area) => ({
        ...prev,
        regions_id: tmpRegionOption,
      }));
    }
  }, [step2.proposal_regions, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        {/* <FormGenerator data={SecondFormData} /> */}
        <Grid item md={12} xs={12}>
          <BaseField
            disabled
            type="textField"
            name="organizationName"
            label="اسم الجهة*"
            placeholder="اسم الجهة*"
          />
        </Grid>
        {/* <Grid item md={6} xs={12}>
          <BaseField
            disabled
            type="textField"
            name="region"
            label="المنطقة*"
            placeholder="المنطقة*"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled
            type="textField"
            name="governorate"
            label="المحافظة *"
            placeholder="الرجاء اختيار المحافظة"
          />
        </Grid> */}
        <Grid item md={6} xs={12}>
          <RHFComboBox
            disabled
            name="regions_id"
            label={translate('portal_report.region_id.label')}
            data-cy="portal_report.region_id"
            placeholder={translate('portal_report.region_id.placeholder')}
            dataOption={edit ? area.regions_id : []}
            value={area.regions_id || []}
            limitTags={99}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFComboBox
            disabled
            name="governorates_id"
            label={translate('portal_report.governorate_id.label')}
            data-cy="portal_report.governorate_id"
            placeholder={translate('portal_report.governorate_id.placeholder')}
            // dataOption={
            //   formField?.governorates && formField?.governorates.length > 0
            //     ? formField?.governorates.map((governorate: IGovernorate, index: number) => ({
            //         label: governorate.name,
            //         value: governorate.governorate_id,
            //       }))
            //     : []
            // }
            dataOption={edit ? area.governorates_id : []}
            value={area.governorates_id || []}
            limitTags={99}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled
            type="textField"
            name="date_of_esthablistmen"
            label="تأريخ تأسيس الجهة*"
            placeholder="الرجاء تحديد تأريخ تأسيس الجهة"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled
            type="textField"
            name="chairman_of_board_of_directors"
            label="رئيس مجلس الإدارة*"
            placeholder="الرجاء كتابة اسم رئيس مجلس الإدارة"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled
            type="textField"
            name="ceo"
            label="المدير التنفيذي*"
            placeholder="الرجاء كتابة اسم المدير التنفيذي"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            // disabled
            disabled={edit}
            type="radioGroup"
            name="been_supported_before"
            label="هل دعمت سابقًا؟"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled={edit}
            type="textField"
            name="most_clents_projects"
            label="أبرز أعمال الجهة*"
            placeholder="الرجاء كتابة أبرز أعمال الجهة"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled
            type="textField"
            name="num_of_beneficiaries"
            label="العدد المستفيد من الجهة*"
            placeholder="الرجاء كتابة العدد المستفيد من الجهة"
          />
        </Grid>
        {isSupevisor ? null : (
          <Grid
            item
            md={12}
            xs={12}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Button
              variant={edit ? 'outlined' : 'contained'}
              data-cy="acc_form_non_consulation_support_edit_button"
              onClick={() => {
                setEdit(!edit);
              }}
            >
              {edit ? translate('button.re_edit') : translate('button.save_edit')}
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default SecondForm;
