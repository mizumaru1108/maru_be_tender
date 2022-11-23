// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import BaseField from 'components/hook-form/BaseField';
import { useEffect, useMemo } from 'react';

type FormDataProps = {
  clause: string;
  clasification_field: string;
  support_type: boolean;
  closing_report: boolean;
  need_picture: boolean;
  does_an_agreement: boolean;
  support_amount: number;
  number_of_payments: number;
  procedures: string;
  notes: string;
  type_of_support: string;
  support_goals: string;
  clasue_cons: string;
  accreditation_type: string;
};

function FirstForm({ children, onSubmit, defaultValues, data }: any) {
  const validationSchema = Yup.object().shape({
    clause: Yup.string().required('Procedures is required!'),
    clasification_field: Yup.string().required('Procedures is required!'),
    support_type: Yup.boolean().required('Procedures is required!'),
    closing_report: Yup.boolean().required('Procedures is required!'),
    need_picture: Yup.boolean().required('Procedures is required!'),
    does_an_agreement: Yup.boolean().required('Procedures is required!'),
    support_amount: Yup.number().required('Procedures is required!'),
    number_of_payments: Yup.number().required('Procedures is required!'),
    notes: Yup.string(),
    support_outputs: Yup.string().required('Procedures is required!'),
    vat: Yup.boolean().required('vat is required!'),
    vat_percentage: Yup.number(),
    inclu_or_exclu: Yup.boolean(),
    accreditation_type: Yup.string().required('Procedures is required!'),
    support_goals: Yup.string().required('Procedures is required!'),
    clasue_cons: Yup.string().required('Procedures is required!'),
  });

  const methods = useForm<FormDataProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    unregister,
    setValue,
  } = methods;

  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const onSubmitForm = async (data: any) => {
    onSubmit(data);
  };
  const vat = watch('vat');
  const support_type = watch('support_type');
  useEffect(() => {
    if (support_type === 'true') unregister('support_amount', { keepValue: false });
    if (support_type === 'false') setValue('support_amount', data.amount_required_fsupport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [support_type]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <Grid item md={12} xs={12}>
          <Typography variant="h4">معلومات الجهة </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="clause"
            label="البند حسب التصنيف*"
            placeholder="الرجاء اختيار البند"
            children={
              <>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المساجد
                </option>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المنح الميسر
                </option>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المبادرات
                </option>
                <option value="test" style={{ backgroundColor: '#fff' }}>
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
              name="support_amount"
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
            name="number_of_payments"
            label="عدد الدفعات*"
            placeholder="دفعة واحدة"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="accreditation_type"
            label="نوع الاعتماد*"
            placeholder="الرجاء اختيار نوع الاعتماد"
            children={
              <>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  خطة
                </option>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  لا وارد
                </option>
              </>
            }
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="support_goals"
            label="اهداف الدعم*"
            placeholder="الرجاء اختيار أهداف الدعم هنا"
            children={
              <>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  عام
                </option>
              </>
            }
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            type="select"
            name="clasue_cons"
            label="البند"
            placeholder="الرجاء اختيار البند"
            children={
              <>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  عام
                </option>
              </>
            }
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
        {/* <FormGenerator data={Appr oveProposalFormFieldsSupervisor} /> */}
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default FirstForm;
