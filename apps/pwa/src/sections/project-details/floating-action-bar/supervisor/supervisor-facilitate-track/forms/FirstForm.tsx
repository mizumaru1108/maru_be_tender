// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, MenuItem, Typography } from '@mui/material';
import { FormProvider, RHFRadioGroup, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import BaseField from 'components/hook-form/BaseField';
import React, { useEffect, useMemo, useState } from 'react';
import { _supportGoals } from '_mock/_supportgoals';
import { useSelector } from 'redux/store';
import { SupervisorStep1 } from '../../../../../../@types/supervisor-accepting-form';
import useLocales from 'hooks/useLocales';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import { removeEmptyKey } from 'utils/remove-empty-key';
import useAuth from 'hooks/useAuth';

function FirstForm({ children, onSubmit, setPaymentNumber, isSubmited, setIsSubmited }: any) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { proposal } = useSelector((state) => state.proposal);
  const { step1 } = useSelector((state) => state.supervisorAcceptingForm);
  const [isVat, setIsVat] = useState<boolean>(step1.vat ?? false);

  const isStepBack =
    proposal.proposal_logs && proposal.proposal_logs.some((item) => item.action === 'step_back')
      ? true
      : false;
  console.log('isStepBack', isStepBack);

  const validationSchema = React.useMemo(() => {
    const tmpIsVat = isVat;
    return Yup.object().shape({
      // clause: Yup.string().required('Procedures is required!'),
      // clasification_field: Yup.string().required('Procedures is required!'),
      support_type: Yup.boolean().required(translate('errors.cre_proposal.support_type.required')),
      closing_report: Yup.boolean().required(
        translate('errors.cre_proposal.closing_report.required')
      ),
      need_picture: Yup.boolean().required(translate('errors.cre_proposal.need_picture.required')),
      does_an_agreement: Yup.boolean().required(
        translate('errors.cre_proposal.does_an_agreement.required')
      ),
      fsupport_by_supervisor: Yup.string().required(
        translate('errors.cre_proposal.fsupport_by_supervisor.required')
      ),
      // number_of_payments_by_supervisor: Yup.number(),
      notes: Yup.string(),
      support_outputs: Yup.string().required(
        translate('errors.cre_proposal.support_outputs.required')
      ),
      vat: Yup.boolean().required(translate('errors.cre_proposal.vat.required')),
      // vat_percentage: Yup.string()
      //   // .integer()
      //   .nullable()
      //   .test('len', translate('errors.cre_proposal.vat_percentage.greater_than_0'), (val) => {
      //     if (!val) return true;
      //     return Number(val) > 0;
      //   }),
      ...(tmpIsVat && {
        vat_percentage: Yup.string()
          // .integer()
          .required(translate('errors.cre_proposal.vat_percentage.greater_than_0'))
          // .nullable()
          .test('len', translate('errors.cre_proposal.vat_percentage.greater_than_0'), (val) => {
            if (!val) return true;
            return Number(val) > 0;
          }),
      }),
      inclu_or_exclu: Yup.boolean(),
      payment_number: Yup.string()
        .required(translate('errors.cre_proposal.payment_number.required'))
        .test('len', `${translate('errors.cre_proposal.payment_number.greater_than')} 1`, (val) => {
          const number_of_payment = Number(val) > 0;
          console.log('number_of_payment', number_of_payment);
          return number_of_payment;
        }),
      // accreditation_type_id: Yup.string().required('Procedures is required!'),
      // support_goal_id: Yup.string().required('Procedures is required!'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVat]);
  const tmpStep1 = useMemo(() => step1, [step1]);
  // const [isSupport, setIsSupport] = useState<boolean>(step1.support_type ?? false);
  const methods = useForm<SupervisorStep1>({
    resolver: yupResolver(validationSchema),
    defaultValues:
      (activeRole === 'tender_project_supervisor' && isSubmited && tmpStep1) ||
      ((isStepBack || activeRole !== 'tender_project_supervisor') && tmpStep1) ||
      null,
  });

  const { handleSubmit, watch, setValue, resetField, reset } = methods;

  const vat = watch('vat');
  const support_type = watch('support_type');
  const paymentNum = watch('payment_number');
  // console.log({ support_type });
  // const inclu_or_exclu = watch('inclu_or_exclu');

  const onSubmitForm = async (data: SupervisorStep1) => {
    // console.log('data', data);
    setIsSubmited(true);
    const { vat_percentage, ...rest } = data;
    const tmpValues = {
      vat_percentage: vat_percentage ? Number(vat_percentage) : undefined,
      // vat_percentage: Number(vat_percentage),
      ...rest,
    };
    onSubmit(removeEmptyKey(tmpValues));
    // onSubmit(tmpValues);
  };

  useEffect(() => {
    if (proposal) {
      setValue(
        'fsupport_by_supervisor',
        proposal?.fsupport_by_supervisor || proposal?.amount_required_fsupport
      );
      // if (proposal.fsupport_by_supervisor) {
      //   setValue('fsupport_by_supervisor', proposal.fsupport_by_supervisor);
      // } else {
      //   setValue('fsupport_by_supervisor', proposal.amount_required_fsupport);
      // }
      // console.log('proposal.amount_required_fsupport', proposal.amount_required_fsupport);
    }
  }, [proposal, setValue]);

  useEffect(() => {
    if (paymentNum) {
      setPaymentNumber(Number(paymentNum));
    }
  }, [paymentNum, setPaymentNumber]);
  // console.log({ proposal });

  useEffect(() => {
    if (
      proposal.proposal_item_budgets &&
      (activeRole! === 'tender_project_manager' || activeRole! === 'tender_ceo')
    ) {
      setValue('payment_number', proposal.proposal_item_budgets.length);
    }
  }, [proposal, setValue, activeRole]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <Grid item md={6} xs={12}>
          <BaseField
            data-cy="acc_form_consulation_support_type"
            type="radioGroup"
            name="support_type"
            label="نوع الدعم*"
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
            data-cy="acc_form_consulation_closing_report"
            type="radioGroup"
            name="closing_report"
            label="تقرير الإغلاق*"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <BaseField
            data-cy="acc_form_consulation_need_picture"
            type="radioGroup"
            name="need_picture"
            label="هل يحتاج إلى صور*"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            data-cy="acc_form_consulation_does_an_agreement"
            type="radioGroup"
            name="does_an_agreement"
            label="هل يحتاج اتفاقية*"
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
            data-cy="acc_form_consulation_vat"
            type="radioGroup"
            name="vat"
            onClick={(e) => {
              if (e && e.target.value) {
                if (e.target.value === 'true') {
                  setIsVat(true);
                  setValue('vat_percentage', '0');
                } else {
                  setIsVat(false);
                  setValue('vat_percentage', '');
                }
              }
              // console.log('e.target.value', e.target.value);
            }}
            // label="هل يشمل المشروع ضريبة القيمة المضافة"
            label="هل مبلغ السداد شامل لضريبة القيمة المضافة*"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            data-cy="acc_form_consulation_fsupport_by_supervisor"
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
              data-cy="acc_form_consulation_vat_percentage"
              type="numberField"
              name="vat_percentage"
              label="النسبة المئوية من الضريبة*"
              placeholder="النسبة المئوية من الضريبة"
            />
          </Grid>
        )}
        {isVat && (
          <Grid item md={6} xs={12}>
            <BaseField
              data-cy="acc_form_consulation_inclu_or_exclu"
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
            placeholder="عدد الدفعات"
            label="عدد الدفعات"
          /> */}
          <BaseField
            data-cy="acc_form_consulation_payment_number"
            type="numberField"
            name="payment_number"
            placeholder="عدد الدفعات"
            label="عدد الدفعات*"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            data-cy="acc_form_consulation_notes"
            type="textArea"
            name="notes"
            label="ملاحظات على المشروع"
            placeholder="اكتب ملاحظاتك هنا"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            data-cy="acc_form_consulation_support_outputs"
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
