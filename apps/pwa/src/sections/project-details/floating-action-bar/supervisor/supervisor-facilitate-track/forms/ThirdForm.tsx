import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFRadioGroup } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useMemo } from 'react';
import { ThirdFormData } from './form-data';
import { useSelector } from 'redux/store';
import { SupervisorStep3 } from '../../../../../../@types/supervisor-accepting-form';
import BaseField from 'components/hook-form/BaseField';
import RHFSelectNoGenerator from 'components/hook-form/RHFSelectNoGen';
import useLocales from 'hooks/useLocales';

function ThirdForm({ children, onSubmit }: any) {
  const { beneficiaries_list } = useSelector((state) => state.proposal);
  const { step3 } = useSelector((state) => state.supervisorAcceptingForm);
  const { translate } = useLocales();
  const validationSchema = Yup.object().shape({
    project_name: Yup.string().required(translate('errors.cre_proposal.project_name.required')),
    project_idea: Yup.string().required(translate('errors.cre_proposal.project_idea.required')),
    project_goals: Yup.string().required(translate('errors.cre_proposal.project_goals.required')),
    amount_required_fsupport: Yup.number().required(
      translate('errors.cre_proposal.amount_required_fsupport.required')
    ),
    added_value: Yup.string().required(translate('errors.cre_proposal.added_value.required')),
    reasons_to_accept: Yup.string().required(
      translate('errors.cre_proposal.reasons_to_accept.required')
    ),
    project_beneficiaries: Yup.string().required(
      translate('errors.cre_proposal.project_beneficiaries.required')
    ),
    target_group_num: Yup.number().required(
      translate('errors.cre_proposal.target_group_num.required')
    ),
    target_group_type: Yup.string().required(
      translate('errors.cre_proposal.target_group_type.required')
    ),
    // target_group_age: Yup.number().required('Procedures is required!'),
    target_group_age: Yup.string().required(
      translate('errors.cre_proposal.target_group_age.required')
    ),
    project_implement_date: Yup.string().required(
      translate('errors.cre_proposal.project_implement_date.required')
    ),
    execution_time: Yup.number().required(translate('errors.cre_proposal.execution_time.required')),
    project_location: Yup.string().required(
      translate('errors.cre_proposal.project_location.required')
    ),
    been_made_before: Yup.boolean().required(
      translate('errors.cre_proposal.been_made_before.required')
    ),
    remote_or_insite: Yup.string().required(
      translate('errors.cre_proposal.remote_or_insite.required')
    ),
  });

  const methods = useForm<SupervisorStep3>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step3, [step3]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmitForm = async (data: SupervisorStep3) => {
    onSubmit(data);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={ThirdFormData} />
        {/* <Grid item md={12} xs={12}>
          <BaseField
            type="textField"
            name="project_name"
            label="اسم المشروع*"
            placeholder="الرجاء كتابة اسم المشروع"
            disabled
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            type="textField"
            name="project_idea"
            label="فكرة المشروع*"
            placeholder="الرجاء كتابة فكرة المشروع"
            disabled
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            type="textArea"
            name="project_goals"
            label="أهداف المشروع*"
            placeholder="الرجاء كتابة أهداف المشروع"
            disabled
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="amount_required_fsupport"
            label="التكلفة الإجمالية*"
            placeholder="الرجاء كتابة التكلفة الإجمالية"
            disabled
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="added_value"
            label="القيمة المضافة على المشروع*"
            placeholder="الرجاء كتابة القيمة المضافة على المشروع"
            disabled
          />
        </Grid> */}

        {/* <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="reasons_to_accept"
            label="مسوغات دعم المشروع*"
            placeholder="الرجاء كتابة مسوغات دعم المشروع"
            disabled
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="project_beneficiaries"
            label="الفئة المستهدفة*"
            placeholder="الرجاء اختيار الفئة المستهدفة"
            disabled
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="target_group_num"
            label="عددهم*"
            placeholder="الرجاء كتابة عددهم"
          />
        </Grid> */}
        {/* 
        <Grid item md={6} xs={12}>
          <RHFSelectNoGenerator
            name="project_beneficiaries"
            label={translate('funding_project_request_form1.target_group_type.label')}
            placeholder={translate('funding_project_request_form1.target_group_type.placeholder')}
          >
            {beneficiaries_list.length > 0 &&
              beneficiaries_list.map((item, index) => (
                <option
                  data-cy={`funding_project_request_form1.target_group_type${index}`}
                  key={index}
                  value={item?.id}
                  style={{ backgroundColor: '#fff' }}
                >
                  {item?.name}
                </option>
              ))}
          </RHFSelectNoGenerator>
        </Grid> */}
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ThirdForm;
