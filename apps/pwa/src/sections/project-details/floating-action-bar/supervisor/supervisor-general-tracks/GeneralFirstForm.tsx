import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Grid, MenuItem } from '@mui/material';
import { FormProvider, RHFRadioGroup, RHFSelect, RHFTextField } from 'components/hook-form';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import * as Yup from 'yup';
//
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { SupervisorStep1 } from '../../../../../@types/supervisor-accepting-form';
import { removeEmptyKey } from 'utils/remove-empty-key';
import BaseField from 'components/hook-form/BaseField';
import { _supportGoalsArr } from '_mock/_supportGoalsArr';

export default function GeneralFirstForm({
  children,
  onSubmit,
  setPaymentNumber,
  isSubmited,
  setIsSubmited,
}: any) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  // const isSupevisor = activeRole === 'tender_project_supervisor' ? true : false;
  const { proposal } = useSelector((state) => state.proposal);
  const { track } = useSelector((state) => state.tracks);
  const { step1, step4 } = useSelector((state) => state.supervisorAcceptingForm);
  // console.log({ step1, step4 });

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
  const [isVat, setIsVat] = useState<boolean>(step1.vat ?? false);

  const isStepBack =
    proposal.proposal_logs && proposal.proposal_logs.some((item) => item.action === 'step_back')
      ? true
      : false;

  const validationSchema = useMemo(() => {
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
      vat: Yup.boolean().required(translate('errors.cre_proposal.vat.required')),
      ...(tmpIsVat && {
        vat_percentage: Yup.string()
          .required(translate('errors.cre_proposal.vat_percentage.greater_than_0'))
          .test('len', translate('errors.cre_proposal.vat_percentage.greater_than_0'), (val) => {
            if (!val) return true;
            return Number(val) > 0;
          }),
      }),
      inclu_or_exclu: Yup.boolean(),
      support_goal_id: Yup.string().required(
        translate('errors.cre_proposal.support_goal_id.required')
      ),
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
  const methods = useForm<SupervisorStep1>({
    resolver: yupResolver(validationSchema),
    defaultValues: (activeRole === 'tender_project_supervisor' && isSubmited && tmpStep1) ||
      ((isStepBack || activeRole !== 'tender_project_supervisor') && tmpStep1) || {
        support_type: false,
      },
  });

  const { handleSubmit, watch, setValue, resetField, reset } = methods;

  const support_type = watch('support_type');
  const paymentNumber = watch('payment_number');

  const onSubmitForm = async (data: SupervisorStep1) => {
    setIsSubmited(true);
    const { vat_percentage, ...rest } = data;
    const tmpValues = {
      vat_percentage: vat_percentage ? Number(vat_percentage) : undefined,
      ...rest,
    };

    // onSubmit(removeEmptyKey(tmpValues));
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
    if (paymentNumber) {
      setPaymentNumber(Number(paymentNumber));
    }
  }, [paymentNumber, setPaymentNumber]);

  useEffect(() => {
    if (proposal && !isSubmited) {
      setValue(
        'fsupport_by_supervisor',
        proposal?.fsupport_by_supervisor || proposal?.amount_required_fsupport
      );
    }
  }, [proposal, setValue, isSubmited]);

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
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: 0.5 }}>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled={requestedBudget > remainBudget}
            data-cy="acc_form_non_consulation_support_type"
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
            data-cy="acc_form_non_consulation_closing_report"
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
            data-cy="acc_form_non_consulation_need_picture"
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
            data-cy="acc_form_non_consulation_agreement"
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
          <RHFRadioGroup
            data-cy="acc_form_non_consulation_vat"
            name="vat"
            onClick={(e: any) => {
              if (e && e.target.value) {
                if (e.target.value === 'true') {
                  setIsVat(true);
                  setValue('vat_percentage', 0);
                } else {
                  setIsVat(false);
                  setValue('vat_percentage', undefined);
                }
              }
            }}
            label="هل مبلغ السداد شامل لضريبة القيمة المضافة*"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelect
            data-cy="acc_form_non_consulation_support_goal_id"
            type="select"
            size="small"
            name="support_goal_id"
            placeholder="الرجاء اختيار أهداف الدعم"
            label="اهداف الدعم*"
          >
            {_supportGoalsArr.map((item, index) => (
              <MenuItem
                data-cy={`acc_form_non_consulation_support_goal_id_${index}`}
                value={item.value}
                key={item.value}
              >
                {item.title}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            data-cy="acc_form_non_consulation_payment_number"
            type={'number'}
            size={'small'}
            name="payment_number"
            placeholder="عدد الدفعات"
            label="عدد الدفعات*"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            data-cy="acc_form_consulation_fsupport_by_supervisor"
            type="textField"
            name="fsupport_by_supervisor"
            label="مبلغ الدعم*"
            placeholder="مبلغ الدعم"
            disabled={
              support_type === 'false' || !support_type || support_type === undefined ? false : true
            }
          />
        </Grid>
        {isVat && (
          <Grid item md={6} xs={12}>
            <RHFTextField
              data-cy="acc_form_non_consulation_vat_percentage"
              type="number"
              size="small"
              name="vat_percentage"
              label="النسبة المئوية من الضريبة*"
              placeholder="النسبة المئوية من الضريبة"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
        )}
        {isVat && (
          <Grid item md={6} xs={12}>
            <BaseField
              data-cy="acc_form_non_consulation_vat"
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
