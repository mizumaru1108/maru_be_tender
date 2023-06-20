// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, MenuItem, Typography } from '@mui/material';
import { FormProvider, RHFRadioGroup, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import BaseField from 'components/hook-form/BaseField';
import { useEffect, useMemo, useState } from 'react';
import { _supportGoals } from '_mock/_supportgoals';
import { useSelector } from 'redux/store';
import { SupervisorStep1 } from '../../../../../../@types/supervisor-accepting-form';
import useLocales from 'hooks/useLocales';
//
import { fCurrencyNumber } from 'utils/formatNumber';

function FirstForm({ children, onSubmit, setPaymentNumber }: any) {
  const { translate } = useLocales();

  const { proposal } = useSelector((state) => state.proposal);

  const validationSchema = Yup.object().shape({
    // clause: Yup.string().required('Procedures is required!'),
    // clasification_field: Yup.string().required('Procedures is required!'),
    support_type: Yup.boolean().required('Procedures is required!'),
    closing_report: Yup.boolean().required('Procedures is required!'),
    need_picture: Yup.boolean().required('Procedures is required!'),
    does_an_agreement: Yup.boolean().required('Procedures is required!'),
    fsupport_by_supervisor: Yup.number(),
    // number_of_payments_by_supervisor: Yup.number(),
    notes: Yup.string(),
    support_outputs: Yup.string().required('Procedures is required!'),
    vat: Yup.boolean().required('Procedures is required!'),
    vat_percentage: Yup.number()
      .integer()
      // .min(1, translate('errors.cre_proposal.vat_percentage.greater_than_0')),
      .nullable()
      .test('len', translate('errors.cre_proposal.vat_percentage.greater_than_0'), (val) => {
        if (!val) return true;
        return Number(val) > 0;
      }),
    inclu_or_exclu: Yup.boolean(),
    payment_number: Yup.string()
      .required(translate('errors.cre_proposal.payment_number.required'))
      .test(
        'len',
        `${translate('errors.cre_proposal.payment_number.greater_than')} ${
          proposal.proposal_item_budgets.length
        }`,
        (val) => {
          const number_of_payment = Number(val);
          return !(number_of_payment < proposal.proposal_item_budgets.length);
        }
      ),
    // accreditation_type_id: Yup.string().required('Procedures is required!'),
    // support_goal_id: Yup.string().required('Procedures is required!'),
  });

  const { step1 } = useSelector((state) => state.supervisorAcceptingForm);

  const [isVat, setIsVat] = useState<boolean>(step1.vat ?? false);
  // const [isSupport, setIsSupport] = useState<boolean>(step1.support_type ?? false);
  const methods = useForm<SupervisorStep1>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step1, [step1]),
  });

  const { handleSubmit, watch, setValue, resetField, reset } = methods;

  const vat = watch('vat');
  const support_type = watch('support_type');
  const paymentNum = watch('payment_number');
  // console.log({ support_type });
  // const inclu_or_exclu = watch('inclu_or_exclu');

  const onSubmitForm = async (data: SupervisorStep1) => {
    onSubmit(data);
  };

  useEffect(() => {
    setValue('fsupport_by_supervisor', proposal.amount_required_fsupport);
    if (proposal) {
      if (proposal.fsupport_by_supervisor) {
        setValue('fsupport_by_supervisor', proposal.fsupport_by_supervisor);
      } else {
        setValue('fsupport_by_supervisor', proposal.amount_required_fsupport);
      }
      // console.log('proposal.amount_required_fsupport', proposal.amount_required_fsupport);
    }
  }, [proposal, setValue, reset]);

  useEffect(() => {
    if (paymentNum) {
      setPaymentNumber(Number(paymentNum));
    }
  }, [paymentNum, setPaymentNumber]);
  // console.log({ proposal });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        {/* <Grid item md={6} xs={12}>
          <RHFSelect
            name="clause"
            size="small"
            label="البند حسب التصنيف*"
            placeholder="الرجاء اختيار البند"
          >
            <MenuItem value="مشروع يخص المساجد">مشروع يخص المساجد</MenuItem>
            <MenuItem value="مشروع يخص المنح الميسر">مشروع يخص المنح الميسر</MenuItem>
            <MenuItem value="مشروع يخص المبادرات">مشروع يخص المبادرات</MenuItem>
            <MenuItem value="مشروع يخص تعميدات">مشروع يخص تعميدات</MenuItem>
          </RHFSelect>
        </Grid> */}
        {/* <Grid item md={6} xs={12}>
          <RHFSelect
            name="clasification_field"
            label="مجال التصنيف*"
            placeholder="الرجاء اختيار مجال التصنيف"
            size="small"
          >
            <MenuItem value="عام">عام</MenuItem>
          </RHFSelect>
        </Grid> */}

        <Grid item md={6} xs={12}>
          <BaseField
            type="radioGroup"
            name="support_type"
            label="نوع الدعم"
            onClick={(e) => {
              if (e && e.target.value) {
                if (e.target.value === 'true') {
                  setIsSupport(false);
                } else {
                  setIsSupport(true);
                }
              }
            }}
            options={[
              { label: 'دعم جزئي', value: false },
              { label: 'دعم كلي', value: true },
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
          {/* <BaseField
            type="radioGroup"
            name="vat"
            label="هل يشمل المشروع ضريبة القيمة المضافة"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          /> */}
          <RHFRadioGroup
            type="radioGroup"
            name="vat"
            onClick={(e) => {
              if (e && e.target.value) {
                if (e.target.value === 'true') {
                  setIsVat(true);
                } else {
                  setIsVat(false);
                }
              }
              // console.log('e.target.value', e.target.value);
            }}
            // label="هل يشمل المشروع ضريبة القيمة المضافة"
            label="هل مبلغ السداد شامل لضريبة القيمة المضافة"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="fsupport_by_supervisor"
            label="مبلغ الدعم*"
            placeholder="مبلغ الدعم"
            // disabled={isSupport ? false : true}
            disabled={
              support_type === 'false' || !support_type || support_type === undefined ? false : true
            }
          />
        </Grid>

        {isVat && (
          <Grid item md={6} xs={12}>
            <BaseField
              type="numberField"
              name="vat_percentage"
              label="النسبة المئوية من الضريبة"
              placeholder="النسبة المئوية من الضريبة"
            />
          </Grid>
        )}
        {isVat && (
          <Grid item md={6} xs={12}>
            <BaseField
              type="radioGroup"
              name="inclu_or_exclu"
              label={translate('review.support_amount_inclu')}
              options={[
                { label: 'نعم', value: true },
                { label: 'لا', value: false },
              ]}
            />
          </Grid>
        )}
        <Grid item md={6} xs={12}>
          {/* <RHFTextField
            type={'number'}
            size={'small'}
            name="payment_number"
            placeholder="عدد المدفوعات"
            label="عدد المدفوعات"
          /> */}
          <BaseField
            type="numberField"
            name="payment_number"
            placeholder="عدد المدفوعات"
            label="عدد المدفوعات*"
          />
        </Grid>
        {/* <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="fsupport_by_supervisor"
            label="مبلغ الدعم*"
            placeholder="مبلغ الدعم"
            disabled={support_type === 'true' ? false : true}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="number_of_payments_by_supervisor"
            label="عدد الدفعات*"
            placeholder="1"
          />
        </Grid> */}
        {/* <Grid item md={6} xs={12}>
          <RHFSelect
            name="accreditation_type_id"
            label="نوع الاعتماد*"
            placeholder="الرجاء اختيار نوع الاعتماد"
            size="small"
          >
            <MenuItem value="PLAN">خطة</MenuItem>
            <MenuItem value="INCOMING">وارد</MenuItem>
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelect
            type="select"
            size="small"
            name="support_goal_id"
            placeholder="الرجاء اختيار أهداف الدعم"
            label="اهداف الدعم*"
          >
            {_supportGoals[`${proposal.project_track as keyof typeof _supportGoals}`].map(
              (item) => (
                <MenuItem value={item.value} key={item.value}>
                  {item.title}
                </MenuItem>
              )
            )}
          </RHFSelect>
        </Grid> */}
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
