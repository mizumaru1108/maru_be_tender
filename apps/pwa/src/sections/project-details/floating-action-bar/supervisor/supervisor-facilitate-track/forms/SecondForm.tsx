import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useMemo } from 'react';
import { SecondFormData } from './form-data';
import { useSelector } from 'redux/store';
import { SupervisorStep2 } from '../../../../../../@types/supervisor-accepting-form';
import useLocales from 'hooks/useLocales';
import BaseField from 'components/hook-form/BaseField';
import { removeEmptyKey } from 'utils/remove-empty-key';

function SecondForm({ children, onSubmit }: any) {
  const { translate } = useLocales();

  const validationSchema = Yup.object().shape({
    organizationName: Yup.string().required(
      translate('errors.cre_proposal.organizationName.required')
    ),
    region: Yup.string().required(translate('errors.cre_proposal.region.required')),
    governorate: Yup.string().required(translate('errors.cre_proposal.governorate.required')),
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
  // console.log('cek region ', step2.region_detail);
  // console.log('cek governorate ', step2.governorate_detail);
  const methods = useForm<SupervisorStep2>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step2, [step2]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: SupervisorStep2) => {
    let tmpValue: SupervisorStep2 = removeEmptyKey(data) as SupervisorStep2;
    if (tmpValue.region_detail !== undefined || tmpValue.region_detail !== null) {
      delete tmpValue.region_detail;
    }
    if (tmpValue.governorate_detail !== undefined || tmpValue.governorate_detail !== null) {
      delete tmpValue.governorate_detail;
    }
    // console.log({ tmpValue });
    onSubmit(tmpValue);
  };

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
        <Grid item md={6} xs={12}>
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
            disabled
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
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default SecondForm;
