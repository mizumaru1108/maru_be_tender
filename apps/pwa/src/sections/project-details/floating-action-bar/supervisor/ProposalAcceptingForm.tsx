// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider, RHFSelect } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ApproveProposalFormFieldsSupervisor } from './form-data';
import { ProposalApprovePayloadSupervisor, ProposalFormProps } from '../types';
import BaseField from 'components/hook-form/BaseField';

function ProposalAcceptingForm({ children, onSubmit }: ProposalFormProps) {
  const validationSchema = Yup.object().shape({
    clause: Yup.string().required('Procedures is required!'),
    clasification_field: Yup.string().required('Procedures is required!'),
    support_type: Yup.boolean().required('Procedures is required!'),
    closing_report: Yup.boolean().required('Procedures is required!'),
    need_picture: Yup.boolean().required('Procedures is required!'),
    does_an_agreement: Yup.boolean().required('Procedures is required!'),
    support_amount: Yup.number().required('Procedures is required!'),
    number_of_payments: Yup.number().required('Procedures is required!'),
    procedures: Yup.string().required('Procedures is required!'),
    notes: Yup.string().required('Procedures is required!'),
    support_outputs: Yup.string().required('Procedures is required!'),
    vat: Yup.boolean(),
    vat_percentage: Yup.number(),
    inclu_or_exclu: Yup.boolean(),
  });

  const defaultValues = {
    clause: '',
    clasification_field: '',
    support_type: undefined,
    closing_report: undefined,
    need_picture: undefined,
    does_an_agreement: undefined,
    support_amount: undefined,
    number_of_payments: undefined,
    procedures: '',
    notes: '',
    support_outputs: '',
    vat: undefined,
    vat_percentage: undefined,
    inclu_or_exclu: undefined,
  };

  const methods = useForm<ProposalApprovePayloadSupervisor>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const onSubmitForm = async (data: ProposalApprovePayloadSupervisor) => {
    console.log(data);
    onSubmit(data);
  };
  const vat = watch('vat');
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
                  test
                </option>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  test
                </option>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  test
                </option>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  test
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
          <BaseField
            type="textField"
            name="support_amount"
            label="مبلغ الدعم*"
            placeholder="مبلغ الدعم"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="number_of_payments"
            label="عدد الدفعات*"
            placeholder="دفعة واحدة"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            type="textArea"
            name="procedures"
            label="الإجراءات*"
            placeholder="اكتب الاجراءات هنا"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            type="textArea"
            name="notes"
            label="ملاحظات على المشروع*"
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

export default ProposalAcceptingForm;
