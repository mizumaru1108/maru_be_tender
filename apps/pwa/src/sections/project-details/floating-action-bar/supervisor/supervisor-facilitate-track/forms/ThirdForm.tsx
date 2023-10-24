import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Button } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import useLocales from 'hooks/useLocales';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import * as Yup from 'yup';
import { SupervisorStep3 } from '../../../../../../@types/supervisor-accepting-form';
import BaseField from '../../../../../../components/hook-form/BaseField';
import RHFSelectNoGenerator from '../../../../../../components/hook-form/RHFSelectNoGen';
import useAuth from '../../../../../../hooks/useAuth';
import { ThirdFormData } from './form-data';

function ThirdForm({ children, onSubmit }: any) {
  const { activeRole } = useAuth();
  const { step3 } = useSelector((state) => state.supervisorAcceptingForm);
  const { beneficiaries_list, loadingProps } = useSelector((state) => state.proposal);
  // console.log({ step3 });

  const isSupevisor = activeRole === 'tender_project_supervisor' ? true : false;
  const [edit, setEdit] = useState<boolean>(isSupevisor ? false : true);
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
        {/* <FormGenerator data={ThirdFormData} /> */}
        <Grid item md={12} xs={12}>
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
            type="numberField"
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
            disabled={edit}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="reasons_to_accept"
            label="مسوغات دعم المشروع*"
            placeholder="الرجاء كتابة مسوغات دعم المشروع"
            disabled={edit}
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
        <Grid item md={4} xs={4}>
          <BaseField
            type="textField"
            name="target_group_num"
            label="عددهم*"
            placeholder="الرجاء كتابة عددهم"
            disabled={edit}
          />
        </Grid>

        <Grid item md={4} xs={4}>
          {/* <BaseField
            type="selectWithoutGenerator"
            name="target_group_type"
            label="نوعهم*"
            placeholder="الرجاء اختيار نوعهم"
            disabled={edit}
          >
            <>
              <option value="YOUTHS" style={{ backgroundColor: '#fff' }}>
                شباب
              </option>
              <option value="GIRLS" style={{ backgroundColor: '#fff' }}>
                فتيات
              </option>
              <option value="CHILDREN" style={{ backgroundColor: '#fff' }}>
                أطفال
              </option>
              <option value="FAMILY" style={{ backgroundColor: '#fff' }}>
                أسرة
              </option>
              <option value="PARENTS" style={{ backgroundColor: '#fff' }}>
                أباء
              </option>
              <option value="MOMS" style={{ backgroundColor: '#fff' }}>
                أمهات
              </option>
              <option value="EMPLOYEMENT" style={{ backgroundColor: '#fff' }}>
                عمالة
              </option>
              <option value="PUBLIC_BENEFIT" style={{ backgroundColor: '#fff' }}>
                نفع عام
              </option>
              <option value="CHARITABLE_ORGANIZATIONS" style={{ backgroundColor: '#fff' }}>
                جهات خيرية
              </option>
              <option value="CHARITABLE_WORKERS" style={{ backgroundColor: '#fff' }}>
                عاملين في الجهات الخيرية
              </option>
            </>
          </BaseField> */}
          <RHFSelectNoGenerator
            disabled={edit}
            name="target_group_type"
            label="نوعهم*"
            placeholder="الرجاء اختيار نوعهم"
          >
            {beneficiaries_list.length > 0 &&
              beneficiaries_list
                .filter((item) => item.is_deleted === false)
                .map((item, index) => (
                  <option
                    data-cy={`target_group_type${index}`}
                    key={index}
                    value={item?.name}
                    style={{ backgroundColor: '#fff' }}
                  >
                    {item?.name}
                  </option>
                ))}
          </RHFSelectNoGenerator>
        </Grid>

        <Grid item md={4} xs={4}>
          <BaseField
            type="selectWithoutGenerator"
            name="target_group_age"
            label="أعمارهم*"
            placeholder="الرجاء كتابة أعمارهم"
            disabled={edit}
          >
            <>
              <option value="AGE_1TH_TO_13TH" style={{ backgroundColor: '#fff' }}>
                من 1 سنة إلى 13
              </option>
              <option value="AGE_14TH_TO_30TH" style={{ backgroundColor: '#fff' }}>
                من 14 سنة إلى 30
              </option>
              <option value="AGE_31TH_TO_50TH" style={{ backgroundColor: '#fff' }}>
                من 31 إلى 50
              </option>
              <option value="AGE_51TH_TO_60TH" style={{ backgroundColor: '#fff' }}>
                من 51 إلى 60
              </option>
              <option value="AGE_OVER_60TH" style={{ backgroundColor: '#fff' }}>
                من 61 فأكثر
              </option>
              <option value="ALL_AGE" style={{ backgroundColor: '#fff' }}>
                جميع الفئات العمرية
              </option>
            </>
          </BaseField>
        </Grid>

        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="project_implement_date"
            label="تاريخ بداية المشروع*"
            placeholder="الرجاء تحديد تاريخ بداية المشروع"
            disabled
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="execution_time"
            label="مدة المشروع*"
            placeholder="الرجاء كتابة مدة المشروع"
            disabled
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="project_location"
            label="مكان إقامته المشروع؟*"
            placeholder="الرجاء كتابة مكان إقامته المشروع؟"
            disabled
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="radioGroup"
            name="been_made_before"
            label="هل تمت إقامة المشروع مسبقا؟*"
            disabled={edit}
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="radioGroup"
            name="remote_or_insite"
            label="عن بُعد أو حضوري؟*"
            disabled={edit}
            options={[
              { label: 'حضوري', value: 'insite' },
              { label: 'اونلاين', value: 'remote' },
              { label: 'كلاهما', value: 'both' },
            ]}
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

export default ThirdForm;
