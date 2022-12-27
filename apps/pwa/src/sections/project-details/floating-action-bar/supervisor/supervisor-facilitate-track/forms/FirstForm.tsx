import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import BaseField from 'components/hook-form/BaseField';
import { useEffect, useMemo } from 'react';
import { _supportGoals } from '_mock/_supportgoals';
import { useSelector } from 'redux/store';
import { SupervisorStep1 } from '../../../../../../@types/supervisor-accepting-form';

function FirstForm({ children, onSubmit }: any) {
  const validationSchema = Yup.object().shape({
    clause: Yup.string().required('Procedures is required!'),
    clasification_field: Yup.string().required('Procedures is required!'),
    support_type: Yup.boolean().required('Procedures is required!'),
    closing_report: Yup.boolean().required('Procedures is required!'),
    need_picture: Yup.boolean().required('Procedures is required!'),
    does_an_agreement: Yup.boolean().required('Procedures is required!'),
    fsupport_by_supervisor: Yup.number().required('Procedures is required!'),
    number_of_payments_by_supervisor: Yup.number().required('Procedures is required!'),
    notes: Yup.string(),
    support_outputs: Yup.string().required('Procedures is required!'),
    vat: Yup.boolean().required('vat is required!'),
    vat_percentage: Yup.number(),
    inclu_or_exclu: Yup.boolean(),
    accreditation_type_id: Yup.string().required('Procedures is required!'),
    support_goal_id: Yup.string().required('Procedures is required!'),
  });

  const { step1 } = useSelector((state) => state.supervisorAcceptingForm);

  const { proposal } = useSelector((state) => state.proposal);

  const methods = useForm<SupervisorStep1>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step1, [step1]),
  });

  const { handleSubmit, watch, setValue, resetField } = methods;

  const onSubmitForm = async (data: SupervisorStep1) => {
    onSubmit(data);
  };

  const vat = watch('vat');

  const support_type = watch('support_type');

  useEffect(() => {
    if (support_type === 'true') resetField('fsupport_by_supervisor');
    if (support_type === 'false')
      setValue('fsupport_by_supervisor', proposal.amount_required_fsupport);
  }, [proposal.amount_required_fsupport, resetField, setValue, support_type]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="clause"
            label="البند حسب التصنيف*"
            placeholder="الرجاء اختيار البند"
            children={
              <>
                <option value="مشروع يخص المساجد" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المساجد
                </option>
                <option value="مشروع يخص المنح الميسر" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المنح الميسر
                </option>
                <option value="مشروع يخص المبادرات" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المبادرات
                </option>
                <option value="مشروع يخص تعميدات" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص تعميدات
                </option>
              </>
            }
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="clasification_field"
            label="مجال التصنيف*"
            placeholder="الرجاء اختيار مجال التصنيف"
            children={
              <>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  عام
                </option>
              </>
            }
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="radioGroup"
            name="support_type"
            label="نوع الدعم"
            options={[
              { label: 'دعم جزئي', value: true },
              { label: 'دعم كلي', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="radioGroup"
            name="closing_report"
            label="تقرير الإغلاق"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="radioGroup"
            name="need_picture"
            label="هل يحتاج إلى صور"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="radioGroup"
            name="does_an_agreement"
            label="هل يحتاج اتفاقية"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="radioGroup"
            name="vat"
            label="هل يشمل المشروع ضريبة القيمة المضافة"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12} />
        {vat === 'true' && (
          <Grid item md={6} xs={12}>
            <BaseField
              type="textField"
              name="vat_percentage"
              label="النسبة المئوية من الضريبة"
              placeholder="النسبة المئوية من الضريبة"
            />
          </Grid>
        )}
        {vat === 'true' && (
          <Grid item md={6} xs={12}>
            <BaseField
              type="radioGroup"
              name="inclu_or_exclu"
              label="هل مبلغ السداد شامل أو غير شامل لضريبة القيمة المضافة"
              options={[
                { label: 'نعم', value: true },
                { label: 'لا', value: false },
              ]}
            />
          </Grid>
        )}
        <Grid item md={6} xs={12}>
          {support_type === 'true' ? (
            <BaseField
              type="textField"
              name="fsupport_by_supervisor"
              label="مبلغ الدعم*"
              placeholder="مبلغ الدعم"
            />
          ) : (
            <BaseField
              type="textField"
              name="support_amount"
              label="مبلغ الدعم*"
              placeholder="مبلغ الدعم"
              disabled
            />
          )}
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="number_of_payments_by_supervisor"
            label="عدد الدفعات*"
            placeholder="1"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="accreditation_type_id"
            label="نوع الاعتماد*"
            placeholder="الرجاء اختيار نوع الاعتماد"
            children={
              <>
                <option value="PLAN" style={{ backgroundColor: '#fff' }}>
                  خطة
                </option>
                <option value="Incoming" style={{ backgroundColor: '#fff' }}>
                  وارد
                </option>
              </>
            }
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="support_goal_id"
            placeholder="الرجاء اختيار أهداف الدعم"
            label="اهداف الدعم*"
            children={_supportGoals[`${proposal.project_track as keyof typeof _supportGoals}`].map(
              (item) => (
                <>
                  <option value={item.value} style={{ backgroundColor: '#fff' }}>
                    {item.title}
                  </option>
                </>
              )
            )}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            type="textArea"
            name="notes"
            label="ملاحظات على المشروع"
            placeholder="اكتب ملاحظاتك هنا"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            type="textArea"
            name="support_outputs"
            label="مخرجات الدعم (لصالح)*"
            placeholder="اكتب هنا"
          />
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default FirstForm;
