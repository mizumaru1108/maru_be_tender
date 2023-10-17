// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Grid } from '@mui/material';
import { FormProvider, RHFRadioGroup, RHFTextField } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import useLocales from 'hooks/useLocales';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import * as Yup from 'yup';
import { SupervisorStep1 } from '../../../../../../@types/supervisor-accepting-form';
//
import useAuth from 'hooks/useAuth';
import { removeEmptyKey } from 'utils/remove-empty-key';

function FirstForm({ children, onSubmit, setPaymentNumber, isSubmited, setIsSubmited }: any) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const isSupevisor = activeRole === 'tender_project_supervisor' ? true : false;
  const { proposal } = useSelector((state) => state.proposal);
  const { track } = useSelector((state) => state.tracks);
  const { step1 } = useSelector((state) => state.supervisorAcceptingForm);

  const [budgetError, setBudgetError] = useState({
    open: false,
    message: '',
  });

  const requestedBudget: number = useMemo(() => {
    const reqBudget = proposal?.amount_required_fsupport || proposal?.fsupport_by_supervisor || 0;
    return Number(reqBudget);
  }, [proposal]);

  const remainBudget: number = useMemo(() => {
    const remainBudget = track
      ? (track?.total_budget || 0) - (track?.total_spending_budget || 0)
      : 0;
    return Number(remainBudget);
  }, [track]);

  const [save, setSave] = useState<boolean>(isSupevisor ? false : true);

  const [isVat, setIsVat] = useState<boolean>(step1.vat ?? false);

  const isStepBack =
    proposal.proposal_logs && proposal.proposal_logs.some((item) => item.action === 'step_back')
      ? true
      : false;

  const validationSchema = React.useMemo(() => {
    const tmpIsVat = isVat;
    return Yup.object().shape({
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
          return number_of_payment;
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVat]);
  const tmpStep1 = useMemo(() => step1, [step1]);
  // console.log({ tmpStep1 });
  const methods = useForm<SupervisorStep1>({
    resolver: yupResolver(validationSchema),
    defaultValues: (activeRole === 'tender_project_supervisor' && isSubmited && tmpStep1) ||
      ((isStepBack || activeRole !== 'tender_project_supervisor') && tmpStep1) || {
        support_type: false,
      },
  });

  const { handleSubmit, watch, setValue, resetField, reset } = methods;

  // const vat = watch('vat');
  const support_type = watch('support_type');
  // console.log({ support_type });
  const paymentNum = watch('payment_number');

  const onSubmitForm = async (data: SupervisorStep1) => {
    setIsSubmited(true);
    const { vat_percentage, ...rest } = data;
    const tmpValues = {
      vat_percentage: vat_percentage ? Number(vat_percentage) : undefined,
      ...rest,
    };
    if (Number(data.fsupport_by_supervisor) > remainBudget) {
      setBudgetError({
        open: true,
        message: 'notification.error_exceeds_amount',
      });
    } else {
      setBudgetError({
        open: false,
        message: '',
      });
      onSubmit(removeEmptyKey(tmpValues));
    }
  };

  useEffect(() => {
    if (paymentNum) {
      setPaymentNumber(Number(paymentNum));
    }
  }, [paymentNum, setPaymentNumber]);

  useEffect(() => {
    if (proposal && !isSubmited) {
      setValue(
        'fsupport_by_supervisor',
        proposal?.fsupport_by_supervisor || proposal?.amount_required_fsupport
      );
    }
  }, [proposal, setValue, isSubmited]);

  // useEffect(() => {
  //   if (requestedBudget > remainBudget) {
  //     // setValue('support_type', false);

  //     resetField('support_type', 'false');
  //   }
  // }, [remainBudget, requestedBudget, setValue]);

  // useEffect(() => {
  //   if (
  //     (proposal.proposal_item_budgets &&
  //       (activeRole! === 'tender_project_manager' || activeRole! === 'tender_ceo')) ||
  //     (activeRole === 'tender_project_supervisor' && isSubmited && tmpStep1) ||
  //     ((isStepBack || activeRole !== 'tender_project_supervisor') && tmpStep1)
  //   ) {
  //     setValue('payment_number', proposal.proposal_item_budgets.length);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [proposal, setValue, activeRole]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled={save || requestedBudget > remainBudget}
            data-cy="acc_form_consulation_support_type"
            type="radioGroup"
            name="support_type"
            label="نوع الدعم*"
            options={[
              { label: 'دعم جزئي', value: false },
              { label: 'دعم كلي', value: true },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled={save}
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
            disabled={save}
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
            disabled={save}
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
            disabled={save}
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
          <RHFTextField
            data-cy="acc_form_consulation_fsupport_by_supervisor"
            type="textField"
            name="fsupport_by_supervisor"
            label="مبلغ الدعم*"
            placeholder="مبلغ الدعم"
            disabled={
              save ||
              (support_type === 'false' || !support_type || support_type === undefined
                ? false
                : true)
            }
          />
        </Grid>

        {isVat && (
          <Grid item md={6} xs={12}>
            <BaseField
              disabled={save}
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
              disabled={save}
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
            disabled={save}
            data-cy="acc_form_consulation_payment_number"
            type="numberField"
            name="payment_number"
            placeholder="عدد الدفعات"
            label="عدد الدفعات*"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            disabled={save}
            data-cy="acc_form_consulation_notes"
            type="textArea"
            name="notes"
            label="ملاحظات على المشروع"
            placeholder="اكتب ملاحظاتك هنا"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            disabled={save}
            data-cy="acc_form_consulation_support_outputs"
            type="textArea"
            name="support_outputs"
            label="مخرجات الدعم (لصالح)*"
            placeholder="اكتب هنا"
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
              variant={save ? 'outlined' : 'contained'}
              data-cy="acc_form_non_consulation_support_edit_button"
              onClick={() => {
                setSave(!save);
              }}
            >
              {save ? translate('button.re_edit') : translate('button.save_edit')}
            </Button>
          </Grid>
        )}
        {budgetError.open && (
          <Grid item md={12} sx={{ my: 2 }}>
            <Alert severity="error">{`${translate(budgetError.message)} (${remainBudget})`}</Alert>
          </Grid>
        )}
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default FirstForm;
